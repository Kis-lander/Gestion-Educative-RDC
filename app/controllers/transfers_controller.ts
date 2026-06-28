import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import TransferAuthorization from '#models/transfer_authorization'
import Student from '#models/student'
import School from '#models/school'
import Class from '#models/class'
import User from '#models/user'
import Message from '#models/message'
import StudentSchoolHistory from '#models/student_school_history'
import TransferNotificationService from '#services/transfer_notification_service'
import StudentSchoolHistoryService from '#services/student_school_history_service'
import {
  getCatalogClassForClass,
  getClassSchoolOption,
  resolveEnrollmentClass,
} from '#services/school_class_service'
import {
  requestTransferValidator,
  approveTransferValidator,
  rejectTransferValidator,
  verifyAuthorizationValidator,
} from '#validators/transfer'
import { DateTime } from 'luxon'

export default class TransferController {
  private transferNotifications = new TransferNotificationService()
  private studentHistory = new StudentSchoolHistoryService()

  private getPaginationMeta(paginator: { toJSON: () => any }) {
    const meta = paginator.toJSON().meta

    return {
      total: meta.total,
      perPage: meta.perPage,
      currentPage: meta.currentPage,
      lastPage: meta.lastPage,
      from: meta.total ? (meta.currentPage - 1) * meta.perPage + 1 : 0,
      to: Math.min(meta.currentPage * meta.perPage, meta.total),
    }
  }

  /**
   * Demander un transfert
   */
  public async requestTransfer({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(requestTransferValidator)
    const user = auth.user!

    const student = await Student.findOrFail(payload.studentId)

    if (user.role !== 'director' || user.schoolId !== student.schoolId) {
      return response.forbidden({
        success: false,
        message: "Vous n'êtes pas autorisé à demander le transfert de cet élève",
      })
    }

    const targetSchool = await School.query()
      .whereRaw('upper(code) = ?', [payload.targetSchoolCode.toUpperCase()])
      .first()

    if (!targetSchool) {
      return response.notFound({
        success: false,
        message: "Aucun établissement ne correspond à ce code.",
      })
    }

    if (targetSchool.status !== 'active') {
      return response.badRequest({
        success: false,
        message: "L'école cible n'est pas active",
      })
    }

    if (targetSchool.id === student.schoolId) {
      return response.badRequest({
        success: false,
        message: "L'élève appartient déjà à cet établissement.",
      })
    }

    // Vérifier s'il n'y a pas déjà une demande en attente
    const existingRequest = await TransferAuthorization.query()
      .where('student_id', student.id)
      .where('status', 'pending')
      .first()

    if (existingRequest) {
      return response.badRequest({
        success: false,
        message: 'Une demande de transfert est déjà en cours pour cet élève',
      })
    }

    // Création de l'autorisation
    const authorization = await TransferAuthorization.create({
      studentId: student.id,
      fromSchoolId: student.schoolId,
      toSchoolId: targetSchool.id,
      status: 'pending',
      reason: payload.reason || 'Demande de transfert',
      validUntil: DateTime.now().plus({ days: 30 }),
      issuedAt: DateTime.now(),
    })

    const targetDirectors = await User.query()
      .where('schoolId', targetSchool.id)
      .where('role', 'director')
      .where('status', 'active')

    await student.load('user')
    await authorization.load('student', (studentQuery) => studentQuery.preload('user'))
    await authorization.load('fromSchool')

    await Promise.all(
      targetDirectors.map((director) =>
        this.transferNotifications.notifyDirector(authorization, director, user.id)
      )
    )

    return response.created({
      success: true,
      message: targetDirectors.length
        ? 'Demande de transfert envoyée à l’école destinataire'
        : "Demande enregistrée, mais aucun directeur actif n'est rattaché à l'école destinataire",
      authorization,
      authorizationCode: authorization.authorizationCode,
      recipientNotified: targetDirectors.length > 0,
    })
  }

  public async pendingTransfersPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await this.transferNotifications.syncPendingForDirector(user)
    const page = Number(request.input('page', 1))
    const paginator = await TransferAuthorization.query()
      .where('toSchoolId', user.schoolId)
      .where('status', 'pending')
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .preload('fromSchool')
      .orderBy('createdAt', 'desc')
      .paginate(page, 20)

    return view.render('schools/transfers/pending', {
      school: {
        id: user.schoolId,
        name: 'Gestion Éducative RDC',
      },
      pendingRequests: paginator.all().map((transfer) => ({
        id: transfer.id,
        studentName: transfer.student.user.fullName,
        studentRegistrationNumber: transfer.student.registrationNumber,
        originalClassName: transfer.student.class?.name || 'Non affecté',
        fromSchoolName: transfer.fromSchool.name,
        createdAt: transfer.createdAt,
        authorizationCode: transfer.authorizationCode,
        reason: transfer.reason,
      })),
      pendingCount: paginator.total,
      pagination: this.getPaginationMeta(paginator),
      url: '/schools/transfers/pending',
    })
  }

  public async authorizeTransferPage({ auth, request, response, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const authorizationCode = String(request.input('code', '')).trim()

    if (!authorizationCode) {
      return response.redirect('/schools/transfers/pending')
    }

    const authorization = await TransferAuthorization.query()
      .where('authorizationCode', authorizationCode)
      .where('toSchoolId', user.schoolId)
      .where('status', 'pending')
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .preload('fromSchool')
      .first()

    if (!authorization) {
      return response.notFound({
        success: false,
        message: 'Cette demande de transfert est introuvable, expirée ou déjà traitée.',
      })
    }

    const classes = await Class.query()
      .where('schoolId', user.schoolId)
      .whereNull('archivedAt')
      .orderBy('gradeLevel', 'asc')
      .orderBy('name', 'asc')
    const sourceClass = authorization.student.class
    const catalogClass = getCatalogClassForClass(sourceClass)
    const transferOption =
      authorization.student.schoolOption || getClassSchoolOption(sourceClass)

    return view.render('schools/transfers/authorize', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      authorizationCode: authorization.authorizationCode,
      transfer: {
        id: authorization.id,
        studentName: authorization.student.user.fullName,
        studentRegistrationNumber: authorization.student.registrationNumber,
        studentPhone: authorization.student.user.phone,
        originalClassName: authorization.student.class?.name || 'Non affecté',
        fromSchoolName: authorization.fromSchool.name,
        createdAt: authorization.createdAt,
        validUntil: authorization.validUntil,
        reason: authorization.reason,
      },
      automaticClass: catalogClass
        ? {
            name: transferOption
              ? `${catalogClass.name} - ${transferOption}`
              : catalogClass.name,
            option: transferOption,
          }
        : null,
      classes,
      today: DateTime.now().toISODate(),
    })
  }

  public async authorizeTransfer({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const newClassId = String(request.input('newClassId', '')).trim()
    const studentPhone = String(request.input('studentPhone', '')).trim()
    const requestedEnrollmentDate = DateTime.fromISO(
      String(request.input('enrollmentDate', DateTime.now().toISODate()))
    )
    const acceptedAt = requestedEnrollmentDate.isValid
      ? requestedEnrollmentDate.startOf('day')
      : DateTime.now()

    const authorization = await TransferAuthorization.query()
      .where('id', params.id)
      .where('toSchoolId', user.schoolId)
      .where('status', 'pending')
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .first()

    if (!authorization) {
      return response.notFound({
        success: false,
        message: 'Cette demande est introuvable ou a déjà été traitée.',
      })
    }

    if (authorization.validUntil < DateTime.now()) {
      return response.badRequest({
        success: false,
        message: 'Cette demande de transfert a expiré.',
      })
    }

    const student = authorization.student
    const sourceClass = student.class || null
    const catalogClass = getCatalogClassForClass(sourceClass)
    const transferOption = student.schoolOption || getClassSchoolOption(sourceClass)
    let destinationClass: Class | null = null

    if (!catalogClass && !newClassId) {
      return response.badRequest({
        success: false,
        message:
          "La classe d'origine n'a pas pu être reconnue. Veuillez sélectionner une classe d'affectation.",
      })
    }

    await db.transaction(async (trx) => {
      destinationClass = await resolveEnrollmentClass({
        schoolId: user.schoolId!,
        classId: newClassId || undefined,
        className: newClassId ? undefined : catalogClass!.name,
        schoolOption: transferOption || undefined,
        trx,
      })

      await this.studentHistory.archiveTransfer({
        authorization,
        student,
        sourceClass,
        destinationClass: destinationClass!,
        acceptedAt,
        trx,
      })

      student.useTransaction(trx)
      student.user.useTransaction(trx)
      if (studentPhone) {
        student.user.phone = studentPhone
        await student.user.save()
      }
      student.schoolId = user.schoolId
      student.classId = destinationClass!.id
      student.schoolOption = transferOption
      student.academicStatus = 'active'
      student.enrollmentDate = acceptedAt
      await student.save()

      authorization.useTransaction(trx)
      authorization.status = 'used'
      authorization.approvedBy = user.id
      await authorization.save()

      const destinationCount = await trx
        .from('students')
        .where('class_id', destinationClass!.id)
        .where('academic_status', 'active')
        .count('* as total')
        .first()
      await trx
        .from('classes')
        .where('id', destinationClass!.id)
        .update({ current_enrollment: Number(destinationCount?.total || 0) })

      if (sourceClass) {
        const previousCount = await trx
          .from('students')
          .where('class_id', sourceClass.id)
          .where('academic_status', 'active')
          .count('* as total')
          .first()
        await trx
          .from('classes')
          .where('id', sourceClass.id)
          .update({ current_enrollment: Number(previousCount?.total || 0) })
      }
    })

    if (!destinationClass) {
      return response.internalServerError({
        success: false,
        message: "La classe d'affectation n'a pas pu être déterminée.",
      })
    }

    const sourceDirectors = await User.query()
        .where('schoolId', authorization.fromSchoolId)
        .where('role', 'director')
        .where('status', 'active')

    await Promise.all(
      sourceDirectors.map((director) =>
        Message.create({
          senderId: user.id,
          receiverId: director.id,
          schoolId: authorization.fromSchoolId,
          subject: 'Transfert accepté',
          content:
            `Le transfert de ${student.user.fullName} a été accepté. ` +
            `L'élève est désormais inscrit dans la classe ${destinationClass!.name}.`,
          type: 'official',
          isGlobal: false,
          isRead: false,
          hasAttachment: false,
        })
      )
    )

    return response.redirect('/schools/transfers/pending')
  }

  public async transferHistoryPage({ auth, params, response, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const history = await StudentSchoolHistory.query()
      .where('transferAuthorizationId', params.id)
      .where('schoolId', user.schoolId)
      .preload('school')
      .preload('destinationSchool')
      .preload('destinationClass')
      .first()

    if (!history) {
      return response.notFound({
        success: false,
        message: "Aucun dossier historique n'est disponible pour ce transfert.",
      })
    }

    const academicSnapshot = history.academicSnapshot || {}

    return view.render('schools/transfers/history_show', {
      school: { id: user.schoolId, name: history.school.name },
      history,
      personal: history.personalSnapshot || {},
      academic: academicSnapshot,
      academicGrades: Array.isArray(academicSnapshot.grades) ? academicSnapshot.grades : [],
      academicDisciplines: Array.isArray(academicSnapshot.disciplines) ? academicSnapshot.disciplines : [],
      academicPayments: Array.isArray(academicSnapshot.payments) ? academicSnapshot.payments : [],
    })
  }

  public async rejectIncomingTransfer({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const rejectionReason = String(request.input('rejectionReason', '')).trim()

    if (!rejectionReason) {
      return response.badRequest({
        success: false,
        message: 'La raison du rejet est obligatoire.',
      })
    }

    const authorization = await TransferAuthorization.query()
      .where('id', params.id)
      .where('toSchoolId', user.schoolId)
      .where('status', 'pending')
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .first()

    if (!authorization) {
      return response.notFound({
        success: false,
        message: 'Cette demande est introuvable ou a déjà été traitée.',
      })
    }

    authorization.status = 'rejected'
    authorization.rejectionReason = rejectionReason
    authorization.approvedBy = user.id
    await authorization.save()

    const sourceDirectors = await User.query()
      .where('schoolId', authorization.fromSchoolId)
      .where('role', 'director')
      .where('status', 'active')

    await Promise.all(
      sourceDirectors.map((director) =>
        Message.create({
          senderId: user.id,
          receiverId: director.id,
          schoolId: authorization.fromSchoolId,
          subject: 'Transfert rejeté',
          content:
            `Le transfert de ${authorization.student.user.fullName} a été rejeté. ` +
            `Raison : ${rejectionReason}`,
          type: 'official',
          isGlobal: false,
          isRead: false,
          hasAttachment: false,
        })
      )
    )

    return response.ok({
      success: true,
      message: 'La demande de transfert a été rejetée.',
    })
  }

  public async requestsPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    const page = Number(request.input('page', 1))
    const outgoingPaginator = await TransferAuthorization.query()
      .where('fromSchoolId', user.schoolId)
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .preload('toSchool')
      .orderBy('createdAt', 'desc')
      .paginate(page, 20)
    const incomingTransfers = await TransferAuthorization.query()
      .where('toSchoolId', user.schoolId)
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .preload('fromSchool')
      .orderBy('createdAt', 'desc')
      .limit(50)
    const students = await Student.query()
      .where('schoolId', user.schoolId)
      .where('academicStatus', 'active')
      .preload('user')
      .preload('class')
      .orderBy('createdAt', 'desc')

    const outgoingRequests = outgoingPaginator.all().map((transfer) => ({
      id: transfer.id,
      studentName: transfer.student.user.fullName,
      className: transfer.student.class?.name || 'Non affecté',
      targetSchoolName: transfer.toSchool.name,
      status: transfer.status,
      authorizationCode: transfer.authorizationCode,
      reason: transfer.reason,
      rejectionReason: transfer.rejectionReason,
      createdAt: transfer.createdAt,
    }))
    const incomingRequests = incomingTransfers.map((transfer) => ({
      id: transfer.id,
      studentName: transfer.student.user.fullName,
      originalClassName: transfer.student.class?.name || 'Non affecté',
      fromSchoolName: transfer.fromSchool.name,
      status: transfer.status,
      authorizationCode: transfer.authorizationCode,
      reason: transfer.reason,
      rejectionReason: transfer.rejectionReason,
      createdAt: transfer.createdAt,
    }))
    const allTransfers = [...outgoingRequests, ...incomingRequests]

    return view.render('schools/transfers/requests', {
      school: { id: user.schoolId, name: 'Gestion Éducative RDC' },
      students: students.map((student) => ({
        id: student.id,
        user: student.user,
        className: student.class?.name || 'Non affecté',
      })),
      outgoingRequests,
      incomingRequests,
      stats: {
        outgoing: outgoingPaginator.total,
        incoming: incomingTransfers.length,
        pending: allTransfers.filter((transfer) => transfer.status === 'pending').length,
        completed: allTransfers.filter((transfer) => transfer.status === 'used').length,
      },
      pagination: this.getPaginationMeta(outgoingPaginator),
      url: '/schools/transfers/requests',
    })
  }

  public async transferDetails({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const transfer = await TransferAuthorization.query()
      .where('id', params.id)
      .where((query) => {
        query.where('fromSchoolId', user.schoolId).orWhere('toSchoolId', user.schoolId)
      })
      .preload('student', (studentQuery) => {
        studentQuery.preload('user').preload('class')
      })
      .preload('fromSchool')
      .preload('toSchool')
      .firstOrFail()

    return response.ok({
      success: true,
      id: transfer.id,
      studentName: transfer.student.user.fullName,
      className: transfer.student.class?.name || 'Non affecté',
      fromSchoolName: transfer.fromSchool.name,
      targetSchoolName: transfer.toSchool.name,
      createdAt: transfer.createdAt.toFormat('dd/MM/yyyy HH:mm'),
      status: transfer.status,
      authorizationCode: transfer.authorizationCode,
      reason: transfer.reason,
      rejectionReason: transfer.rejectionReason,
      canEdit: transfer.fromSchoolId === user.schoolId && transfer.status === 'pending',
    })
  }

  public async updateReason({ auth, params, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const reason = String(request.input('reason', '')).trim()

    if (!reason || reason.length > 2000) {
      return response.badRequest({
        success: false,
        message: 'La raison est obligatoire et ne peut pas dépasser 2000 caractères.',
      })
    }

    const transfer = await TransferAuthorization.query()
      .where('id', params.id)
      .where('fromSchoolId', user.schoolId)
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('fromSchool')
      .firstOrFail()

    if (transfer.status !== 'pending') {
      return response.badRequest({
        success: false,
        message: 'Seule une demande en attente peut être modifiée.',
      })
    }

    transfer.reason = reason
    await transfer.save()

    const targetDirectors = await User.query()
      .where('schoolId', transfer.toSchoolId)
      .where('role', 'director')
      .where('status', 'active')

    await Promise.all(
      targetDirectors.map((director) =>
        Message.create({
          senderId: user.id,
          receiverId: director.id,
          schoolId: transfer.toSchoolId,
          subject: 'Motif de transfert modifié',
          content:
            `${transfer.fromSchool.name} a modifié le motif du transfert de ` +
            `${transfer.student.user.fullName}. Nouveau motif : ${transfer.reason}`,
          type: 'official',
          isGlobal: false,
          isRead: false,
          hasAttachment: false,
        })
      )
    )

    return response.ok({
      success: true,
      message: 'La raison du transfert a été modifiée.',
      reason: transfer.reason,
    })
  }

  public async cancelTransfer({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const transfer = await TransferAuthorization.query()
      .where('id', params.id)
      .where('fromSchoolId', user.schoolId)
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('fromSchool')
      .firstOrFail()

    if (transfer.status !== 'pending') {
      return response.badRequest({
        success: false,
        message: 'Seule une demande en attente peut être annulée.',
      })
    }

    transfer.status = 'cancelled'
    transfer.rejectionReason = "Annulée par l'école d'origine"
    await transfer.save()

    const targetDirectors = await User.query()
      .where('schoolId', transfer.toSchoolId)
      .where('role', 'director')
      .where('status', 'active')

    await Message.query()
      .whereIn(
        'receiverId',
        targetDirectors.map((director) => director.id)
      )
      .where('subject', 'Demande de transfert entrante')
      .whereILike('content', `%${transfer.authorizationCode}%`)
      .delete()

    await Promise.all(
      targetDirectors.map((director) =>
        Message.create({
          senderId: user.id,
          receiverId: director.id,
          schoolId: transfer.toSchoolId,
          subject: 'Demande de transfert annulée',
          content:
            `${transfer.fromSchool.name} a annulé la demande de transfert de ` +
            `${transfer.student.user.fullName}. Code : ${transfer.authorizationCode}.`,
          type: 'official',
          isGlobal: false,
          isRead: false,
          hasAttachment: false,
        })
      )
    )

    return response.ok({
      success: true,
      message: 'La demande de transfert a été annulée.',
    })
  }

  /**
   * Approuver un transfert
   */
  public async approveTransfer({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(approveTransferValidator)
    const user = auth.user!

    const authorization = await TransferAuthorization.findOrFail(payload.transferId)

    authorization.status = 'approved'
    if (payload.notes) {
      authorization.reason = `${authorization.reason}\nApprobation: ${payload.notes}`
    }
    await authorization.save()

    // Notification à l'école d'origine
    const fromSchoolAdmin = await User.query()
      .where('school_id', authorization.fromSchoolId)
      .where('role', 'director')
      .first()

    if (fromSchoolAdmin) {
      await Message.create({
        senderId: user.id,
        receiverId: fromSchoolAdmin.id,
        subject: 'Transfert approuvé',
        content: `Le transfert de l'élève a été approuvé. Code: ${authorization.authorizationCode}`,
        type: 'official',
      })
    }

    return response.ok({
      success: true,
      message: 'Transfert approuvé avec succès',
      authorization,
    })
  }

  /**
   * Rejeter un transfert
   */
  public async rejectTransfer({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(rejectTransferValidator)
    const user = auth.user!

    const authorization = await TransferAuthorization.findOrFail(payload.transferId)

    authorization.status = 'rejected'
    authorization.rejectionReason = payload.rejectionReason
    await authorization.save()

    const fromSchoolAdmin = await User.query()
      .where('school_id', authorization.fromSchoolId)
      .where('role', 'director')
      .first()

    if (fromSchoolAdmin) {
      await Message.create({
        senderId: user.id,
        receiverId: fromSchoolAdmin.id,
        subject: 'Transfert rejeté',
        content: `Le transfert a été rejeté. Raison: ${payload.rejectionReason}`,
        type: 'official',
      })
    }

    return response.ok({
      success: true,
      message: 'Transfert rejeté',
      authorization,
    })
  }

  /**
   * Vérifier une autorisation de transfert (via le code)
   */
  public async verifyAuthorization({ request, response }: HttpContext) {
    const payload = await request.validateUsing(verifyAuthorizationValidator)

    const authorization = await TransferAuthorization.query()
      .where('authorization_code', payload.authorizationCode)
      .where('status', 'approved')
      .where('valid_until', '>=', DateTime.now().toSQL())
      .preload('student', (s) => s.preload('user').preload('class'))
      .preload('fromSchool')
      .first()

    if (!authorization) {
      return response.notFound({
        success: false,
        message: "Code d'autorisation invalide ou expiré",
      })
    }

    return response.ok({
      success: true,
      authorization: {
        code: authorization.authorizationCode,
        student: {
          name: authorization.student.user.fullName,
          registrationNumber: authorization.student.registrationNumber,
          class: authorization.student.class?.name,
        },
        fromSchool: authorization.fromSchool.name,
        validUntil: authorization.validUntil,
      },
    })
  }

  /**
   * Compléter un transfert (Nouvelle école)
   */
  public async completeTransfer({ request, params, response }: HttpContext) {
    // Note: transferId passé en params ou payload selon tes routes
    const transferId = params.id
    const newClassId = request.input('newClassId')

    const authorization = await TransferAuthorization.query()
      .where('id', transferId)
      .where('status', 'approved')
      .where('valid_until', '>=', DateTime.now().toSQL())
      .firstOrFail()

    const student = await Student.findOrFail(authorization.studentId)

    // Mise à jour de l'élève
    student.schoolId = authorization.toSchoolId
    student.classId = newClassId
    student.academicStatus = 'active'
    await student.save()

    // Marquer l'autorisation comme utilisée
    authorization.status = 'used'
    await authorization.save()

    return response.ok({
      success: true,
      message: 'Transfert complété avec succès',
      student,
    })
  }

  /**
   * Liste des transferts en attente pour l'école de l'utilisateur
   */
  public async getPendingTransfers({ auth, response }: HttpContext) {
    const schoolId = auth.user?.schoolId

    const transfers = await TransferAuthorization.query()
      .where('from_school_id', schoolId!)
      .where('status', 'pending')
      .preload('student', (s) => s.preload('user').preload('class'))
      .preload('toSchool')
      .orderBy('created_at', 'desc')

    return response.ok({
      success: true,
      transfers,
    })
  }
}
