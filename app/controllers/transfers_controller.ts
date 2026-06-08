import { type HttpContext } from '@adonisjs/core/http'
import TransferAuthorization from '#models/transfer_authorization'
import Student from '#models/student'
import School from '#models/school'
import User from '#models/user'
import Message from '#models/message'
import {
  requestTransferValidator,
  approveTransferValidator,
  rejectTransferValidator,
  verifyAuthorizationValidator,
} from '#validators/transfer'
import { DateTime } from 'luxon'

export default class TransferController {
  /**
   * Demander un transfert
   */
  public async requestTransfer({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(requestTransferValidator)
    const user = auth.user!

    const student = await Student.findOrFail(payload.studentId)

    // Vérifier les permissions (Director ou école d'origine)
    if (user.role !== 'director' && user.schoolId !== student.schoolId) {
      return response.forbidden({
        success: false,
        message: "Vous n'êtes pas autorisé à demander le transfert de cet élève",
      })
    }

    const targetSchool = await School.findByOrFail('code', payload.targetSchoolCode)

    if (targetSchool.status !== 'active') {
      return response.badRequest({
        success: false,
        message: "L'école cible n'est pas active",
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

    return response.created({
      success: true,
      message: 'Demande de transfert soumise avec succès',
      authorization,
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
