import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import User from '#models/user'
import Message from '#models/message'
import Teacher from '#models/teacher'
import OtpMailService from '#services/otp_mail_service'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import {
  getSchoolsValidator,
  inspectSchoolValidator,
  sendGlobalCommunicationValidator,
  generateSchoolReportValidator,
} from '#validators/inspection'

export default class InspectionController {
  private mailService = new OtpMailService()

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

  private formatLogDate(value: unknown) {
    if (!value) return '-'

    const date = DateTime.fromJSDate(value instanceof Date ? value : new Date(value as string | number))
    return date.isValid ? date.toFormat('dd/MM/yyyy HH:mm') : '-'
  }

  public async schoolsPage({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const status = request.input('status')
    const province = request.input('province')

    const paginator = await School.query()
      .if(status, (query) => query.where('status', status))
      .if(province, (query) => query.where('province', province))
      .orderBy('created_at', 'desc')
      .paginate(page, 20)

    const stats = await School.query()
      .select(
        db.raw('count(*) as total'),
        db.raw("count(*) filter (where status = 'active') as active"),
        db.raw("count(*) filter (where status = 'pending') as pending"),
        db.raw("count(*) filter (where status = 'suspended') as suspended")
      )
      .first()

    return view.render('inspection/schools/index', {
      schools: paginator.all(),
      pagination: this.getPaginationMeta(paginator),
      url: '/inspection/schools',
      stats: {
        total: Number(stats?.$extras.total || 0),
        active: Number(stats?.$extras.active || 0),
        pending: Number(stats?.$extras.pending || 0),
        suspended: Number(stats?.$extras.suspended || 0),
      },
    })
  }

  public async pendingSchoolsPage({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const paginator = await School.query()
      .where('status', 'pending')
      .orderBy('created_at', 'desc')
      .paginate(page, 20)

    return view.render('inspection/schools/pending', {
      pendingSchools: paginator.all(),
      pagination: this.getPaginationMeta(paginator),
      url: '/inspection/schools/pending',
    })
  }

  public async schoolDetailsPage({ params, view }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const director = await User.query()
      .where('school_id', school.id)
      .where('role', 'director')
      .first()

    const [students, teachers, classesCount, averageGrade, classes] = await Promise.all([
      db.from('students').where('school_id', school.id).count('* as total').first(),
      User.query().where('school_id', school.id).where('role', 'teacher').count('* as total').first(),
      db.from('classes').where('school_id', school.id).count('* as total').first(),
      db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .where('students.school_id', school.id)
        .avg('grades.score as average')
        .first(),
      db.from('classes').where('school_id', school.id).limit(10),
    ])

    return view.render('inspection/schools/show', {
      school,
      director,
      stats: {
        students: Number(students?.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: Number(classesCount?.total || 0),
        averageGrade: Number(averageGrade?.average || 0).toFixed(1),
      },
      classes,
      inspections: [],
    })
  }

  public async schoolClassesPage({ params, request, view }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const page = Number(request.input('page', 1))

    const paginator = await db
      .from('classes')
      .leftJoin('teachers', 'classes.teacher_id', 'teachers.id')
      .leftJoin('users', 'teachers.user_id', 'users.id')
      .where('classes.school_id', school.id)
      .select(
        'classes.id',
        'classes.name',
        'classes.level',
        'classes.grade_level as gradeLevel',
        'classes.max_capacity as maxCapacity',
        'classes.current_enrollment as currentEnrollment',
        'classes.academic_year as academicYear',
        'classes.shift',
        db.raw("concat(users.first_name, ' ', users.last_name) as teacher_name")
      )
      .orderBy('classes.grade_level', 'asc')
      .orderBy('classes.name', 'asc')
      .paginate(page, 20)

    const stats = await db
      .from('classes')
      .where('school_id', school.id)
      .select(
        db.raw('count(*) as total'),
        db.raw('coalesce(sum(current_enrollment), 0) as students'),
        db.raw('coalesce(sum(max_capacity), 0) as capacity')
      )
      .first()

    return view.render('inspection/schools/classes', {
      school,
      classes: paginator.all(),
      pagination: this.getPaginationMeta(paginator),
      url: `/inspection/schools/${school.id}/classes`,
      stats: {
        total: Number(stats?.total || 0),
        students: Number(stats?.students || 0),
        capacity: Number(stats?.capacity || 0),
      },
    })
  }

  public async inspectSchoolPage({ params, auth, view }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const inspector = auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : ''

    return view.render('inspection/schools/inspect', {
      school,
      inspector,
      today: DateTime.now().toISODate(),
    })
  }

  public async storeSchoolInspection({ params, request, response, session }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const payload = await request.validateUsing(inspectSchoolValidator)

    await db.table('school_inspections').insert({
      school_id: school.id,
      inspection_date: payload.inspectionDate.toJSDate(),
      inspector: payload.inspector,
      report: payload.report,
      rating: payload.rating,
      recommendations: payload.recommendations,
      follow_up_date: payload.followUpDate?.toJSDate(),
      created_at: new Date(),
      updated_at: new Date(),
    })

    session.flash('success', "Rapport d'inspection enregistré")
    return response.redirect(`/inspection/schools/${school.id}`)
  }

  public async approveSchoolPage({ params, view }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const director = await User.query()
      .where('school_id', school.id)
      .where('role', 'director')
      .first()

    return view.render('inspection/schools/approve', { school, director })
  }

  public async approveAndGenerateCredentials({
    auth,
    params,
    request,
    response,
    session,
    view,
  }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const email = String(request.input('directorEmail', school.email)).trim().toLowerCase()
    const tempPassword = randomBytes(8).toString('hex')
    let director = await User.query()
      .where('school_id', school.id)
      .where('role', 'director')
      .first()

    const existingUser = await User.query().where('email', email).first()

    if (existingUser && existingUser.id !== director?.id) {
      session.flash('error', 'Cet email appartient deja a un autre compte utilisateur.')
      return response.redirect().back()
    }

    if (director?.id === auth.user?.id) {
      session.flash(
        'error',
        'Le compte inspection ne peut pas etre utilise comme compte directeur.'
      )
      return response.redirect().back()
    }

    await db.transaction(async (trx) => {
      school.useTransaction(trx)
      school.status = 'active'
      school.approvedAt = DateTime.now()
      await school.save()

      if (!director) {
        director = new User()
        director.useTransaction(trx)
        director.schoolId = school.id
        director.firstName = 'Directeur'
        director.lastName = school.name
        director.role = 'director'
        director.status = 'active'
      } else {
        director.useTransaction(trx)
      }

      director.email = email
      director.password = tempPassword
      director.status = 'active'
      await director.save()
    })

    const credentials = {
      email,
      password: tempPassword,
      schoolCode: school.code,
      schoolName: school.name,
      directorName: `${director?.firstName ?? 'Directeur'} ${director?.lastName ?? school.name}`,
      approvedAt:
        school.approvedAt?.toFormat('dd/MM/yyyy HH:mm') ??
        DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont ete envoyes a ${email}.`,
    }

    try {
      await this.mailService.sendDirectorCredentials({
        to: email,
        schoolName: credentials.schoolName,
        schoolCode: credentials.schoolCode,
        directorName: credentials.directorName,
        email: credentials.email,
        password: credentials.password,
      })
    } catch (error) {
      emailDelivery = {
        sent: false,
        message:
          error instanceof Error
            ? error.message
            : "L'email n'a pas pu etre envoye automatiquement.",
      }
    }

    session.flash(
      emailDelivery.sent ? 'success' : 'error',
      emailDelivery.sent
        ? 'Ecole approuvee, identifiants generes et email envoye.'
        : 'Ecole approuvee et identifiants generes, mais email non envoye.'
    )

    return view.render('inspection/schools/approved_credentials', {
      school,
      director,
      credentials,
      emailDelivery,
    })
  }

  public async rejectSchool({ request, params, response }: HttpContext) {
    const school = await School.findOrFail(params.id)
    school.status = 'suspended'
    await school.save()

    return response.ok({
      success: true,
      message: request.input('reason') ? 'Demande rejetée' : 'École suspendue',
    })
  }

  public async toggleSuspendSchool({ params, response }: HttpContext) {
    const school = await School.findOrFail(params.id)
    school.status = school.status === 'suspended' ? 'active' : 'suspended'
    await school.save()

    return response.ok({ success: true, status: school.status })
  }

  public async communicationsGlobalPage({ view }: HttpContext) {
    const recentCommunications = await Message.query()
      .where('is_global', true)
      .orderBy('created_at', 'desc')
      .limit(5)

    return view.render('inspection/communications/global', { recentCommunications })
  }

  public async communicationsHistoryPage({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const paginator = await Message.query().orderBy('created_at', 'desc').paginate(page, 20)
    const total = await Message.query().count('* as total').first()
    const global = await Message.query().where('is_global', true).count('* as total').first()

    return view.render('inspection/communications/history', {
      communications: paginator.all().map((message) => ({
        ...message.serialize(),
        senderName: 'Inspection',
        recipientCount: 0,
        acknowledgedCount: 0,
        acknowledgedRate: 0,
        readRate: 0,
        urgent: false,
      })),
      pagination: this.getPaginationMeta(paginator),
      url: '/inspection/communications/history',
      stats: {
        total: Number(total?.$extras.total || 0),
        global: Number(global?.$extras.total || 0),
        urgent: 0,
        acknowledged: 0,
      },
    })
  }

  public async communicationsSchoolPage({ view }: HttpContext) {
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('inspection/communications/school', { schools })
  }

  public async communicationDetails({ params, response }: HttpContext) {
    const message = await Message.find(params.id)

    return response.ok({
      success: true,
      communication: message,
    })
  }

  public async reportsSchoolsPage({ view }: HttpContext) {
    return view.render('inspection/reports/schools')
  }

  public async reportsPerformancePage({ view }: HttpContext) {
    return view.render('inspection/reports/performance')
  }

  public async reportsStatisticsPage({ view }: HttpContext) {
    return view.render('inspection/reports/statistics')
  }

  public async reportsTransfersPage({ view }: HttpContext) {
    return view.render('inspection/reports/transfers')
  }

  public async settingsPage({ view }: HttpContext) {
    return view.render('inspection/settings/index', {
      settings: {
        systemName: 'Gestion Éducative RDC',
        currentAcademicYear: '2024-2025',
        currentTerm: 'T1',
        defaultLanguage: 'fr',
        timezone: 'Africa/Kinshasa',
        autoApproveSchools: false,
        requireInspectionReport: true,
        inspectionFrequency: 12,
        responseDeadline: 15,
        defaultEvaluationGrid: 'standard',
        notifyOnNewSchool: true,
        notifyOnTransferRequest: true,
        notifyOnApproval: true,
        notificationEmail: '',
        emergencyEmail: '',
        lastBackup: 'Jamais',
        backupFrequency: 'weekly',
        backupRetention: 30,
        backupLogs: true,
        minPasswordLength: 8,
        requireStrongPassword: true,
        passwordExpiryDays: 90,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        twoFactorAuth: false,
      },
      backups: [],
    })
  }

  public async saveSettings({ response, session }: HttpContext) {
    session.flash('success', 'Paramètres enregistrés')
    return response.redirect('/inspection/settings')
  }

  public async exportSchools({ response }: HttpContext) {
    return response.ok('Export des écoles non configuré')
  }

  public async logs({ request, response }: HttpContext) {
    const page = Number(request.input('page', 1))
    const type = request.input('type', 'all')
    const date = request.input('date')
    const perPage = 20

    try {
      const query = db.from('system_logs')

      if (type && type !== 'all') query.where('action', type)
      if (date) {
        query.where('created_at', '>=', `${date} 00:00:00`).where('created_at', '<=', `${date} 23:59:59`)
      }

      const paginator = await query.orderBy('created_at', 'desc').paginate(page, perPage)
      const result = paginator.toJSON()

      return response.ok({
        logs: result.data.map((log: any) => ({
          datetime: this.formatLogDate(log.created_at),
          user: log.user_name || log.user || null,
          action: log.action || '-',
          details: log.details || log.description || '-',
          ip: log.ip_address || log.ip || '-',
        })),
        totalPages: result.meta.lastPage || 1,
      })
    } catch {
      return response.ok({
        logs: [],
        totalPages: 1,
      })
    }
  }

  public async exportLogs({ request, response }: HttpContext) {
    const type = request.input('type', 'all')
    const date = request.input('date')

    try {
      const query = db.from('system_logs')

      if (type && type !== 'all') query.where('action', type)
      if (date) {
        query.where('created_at', '>=', `${date} 00:00:00`).where('created_at', '<=', `${date} 23:59:59`)
      }

      const logs = await query.orderBy('created_at', 'desc').limit(1000)
      const rows = [
        ['Date', 'Utilisateur', 'Action', 'Détails', 'IP'],
        ...logs.map((log: any) => [
          this.formatLogDate(log.created_at),
          log.user_name || log.user || '',
          log.action || '',
          log.details || log.description || '',
          log.ip_address || log.ip || '',
        ]),
      ]

      const csv = rows
        .map((row) =>
          row
            .map((value) => `"${String(value).replaceAll('"', '""')}"`)
            .join(',')
        )
        .join('\n')

      response.header('Content-Type', 'text/csv; charset=utf-8')
      response.header('Content-Disposition', 'attachment; filename="journaux-inspection.csv"')
      return response.send(csv)
    } catch {
      response.header('Content-Type', 'text/csv; charset=utf-8')
      response.header('Content-Disposition', 'attachment; filename="journaux-inspection.csv"')
      return response.send('"Date","Utilisateur","Action","Détails","IP"\n')
    }
  }

  public async teachersPage({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const paginator = await Teacher.query().preload('user').orderBy('created_at', 'desc').paginate(page, 20)
    const total = await Teacher.query().count('* as total').first()
    const active = await Teacher.query().where('status', 'active').count('* as total').first()

    return view.render('schools/teachers/index', {
      school: { name: 'Inspection pédagogique' },
      teachers: paginator.all(),
      pagination: this.getPaginationMeta(paginator),
      url: '/teachers',
      stats: {
        total: Number(total?.$extras.total || 0),
        active: Number(active?.$extras.total || 0),
        qualified: 0,
        subjectsCount: 0,
        totalHours: 0,
      },
    })
  }

  public async usersStats({ response }: HttpContext) {
    const [total, directors, teachers, parents] = await Promise.all([
      User.query().where('status', 'active').count('* as total').first(),
      User.query().where('status', 'active').where('role', 'director').count('* as total').first(),
      User.query().where('status', 'active').where('role', 'teacher').count('* as total').first(),
      User.query().where('status', 'active').where('role', 'parent').count('* as total').first(),
    ])

    return response.ok({
      total: Number(total?.$extras.total || 0),
      directors: Number(directors?.$extras.total || 0),
      teachers: Number(teachers?.$extras.total || 0),
      parents: Number(parents?.$extras.total || 0),
    })
  }

  public async schoolReportPage({ params, view }: HttpContext) {
    const school = await School.findOrFail(params.id)

    return view.render('inspection/schools/inspection-report', {
      school,
      report: {},
      stats: {},
    })
  }

  public async schoolsReportData({ response }: HttpContext) {
    const stats = await School.query()
      .select(
        db.raw('count(*) as total'),
        db.raw("count(*) filter (where status = 'active') as active"),
        db.raw("count(*) filter (where status = 'pending') as pending"),
        db.raw("count(*) filter (where status = 'suspended') as suspended")
      )
      .first()

    return response.ok({
      success: true,
      summary: {
        total: Number(stats?.$extras.total || 0),
        active: Number(stats?.$extras.active || 0),
        pending: Number(stats?.$extras.pending || 0),
        suspended: Number(stats?.$extras.suspended || 0),
      },
      byProvince: await db.from('schools').select('province').count('* as total').groupBy('province'),
    })
  }

  public async performanceReportData({ response }: HttpContext) {
    return response.ok({
      success: true,
      summary: {
        average: 0,
        bestProvince: '-',
        worstProvince: '-',
        topSubject: '-',
      },
      byProvince: [],
      byLevel: [],
    })
  }

  public async statisticsReportData({ response }: HttpContext) {
    return response.ok({ success: true, stats: {} })
  }

  public async transfersReportData({ response }: HttpContext) {
    return response.ok({ success: true, transfers: [], stats: {} })
  }

  /**
   * Obtenir la liste des écoles (avec filtres et pagination)
   */
  public async getAllSchools({ request, response }: HttpContext) {
    const payload = await request.validateUsing(getSchoolsValidator)

    const schools = await School.query()
      .if(payload.status, (query) => query.where('status', payload.status!))
      .if(payload.province, (query) => query.where('province', payload.province!))
      .if(payload.territory, (query) => query.where('territory', payload.territory!))
      .if(payload.startDate, (query) =>
        query.where('created_at', '>=', payload.startDate!.toJSDate())
      )
      .if(payload.endDate, (query) => query.where('created_at', '<=', payload.endDate!.toJSDate()))
      .preload('users', (userQuery) => {
        userQuery.where('role', 'director')
      })
      .orderBy('createdAt', 'desc')
      .paginate(payload.page || 1, payload.limit || 20)

    return response.ok({
      success: true,
      schools,
    })
  }

  /**
   * Obtenir les détails d'une école
   */
  public async getSchoolById({ params, response }: HttpContext) {
    const school = await School.query()
      .where('id', params.id)
      .preload('users')
      .preload('students')
      .preload('classes')
      .firstOrFail()

    // Statistiques complémentaires optimisées
    const teacherCount = await User.query()
      .where('school_id', params.id)
      .where('role', 'teacher')
      .count('* as total')
      .first()

    return response.ok({
      success: true,
      school,
      stats: {
        teachers: Number(teacherCount?.$extras.total || 0),
        totalStudents: school.students.length,
        activeClasses: school.classes.length,
      },
    })
  }

  /**
   * Approuver une école
   */
  public async approveSchool({ params, response, auth }: HttpContext) {
    const school = await School.findOrFail(params.id)

    school.status = 'active'
    school.approvedAt = DateTime.now()

    await db.transaction(async (trx) => {
      school.useTransaction(trx)
      await school.save()

      const director = await User.query()
        .useTransaction(trx)
        .where('school_id', school.id)
        .where('role', 'director')
        .first()

      if (director) {
        await Message.create(
          {
            senderId: auth.user!.id,
            receiverId: director.id,
            subject: 'Approbation de votre établissement',
            content: `Félicitations ! Votre établissement "${school.name}" a été approuvé.`,
            type: 'official',
          },
          { client: trx }
        )
      }
    })

    return response.ok({
      success: true,
      message: 'École approuvée avec succès',
      school,
    })
  }

  /**
   * Suspendre une école
   */
  public async suspendSchool({ params, request, response }: HttpContext) {
    const { reason } = request.only(['reason'])
    const school = await School.findOrFail(params.id)

    school.status = 'suspended'

    await db.transaction(async (trx) => {
      school.useTransaction(trx)
      await school.save()

      await trx.table('school_suspensions').insert({
        school_id: school.id,
        reason: reason || 'Non spécifiée',
        suspended_at: new Date(),
      })
    })

    return response.ok({
      success: true,
      message: 'École suspendue avec succès',
    })
  }

  /**
   * Inspecter une école
   */
  public async inspectSchool({ request, response }: HttpContext) {
    const payload = await request.validateUsing(inspectSchoolValidator)
    const school = await School.findOrFail(payload.schoolId)

    const [inspectionId] = await db.table('school_inspections').returning('id').insert({
      school_id: school.id,
      inspection_date: payload.inspectionDate.toJSDate(),
      inspector: payload.inspector,
      report: payload.report,
      rating: payload.rating,
      recommendations: payload.recommendations,
      follow_up_date: payload.followUpDate?.toJSDate(),
      created_at: new Date(),
    })

    return response.created({
      success: true,
      message: "Rapport d'inspection enregistré",
      inspectionId,
    })
  }

  /**
   * Envoyer communication globale (Optimisé avec insertion en masse)
   */
  public async sendGlobalCommunication({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(sendGlobalCommunicationValidator)

    const targetUsersQuery = User.query().where('status', 'active')

    if (payload.targetRole && payload.targetRole !== 'all') {
      targetUsersQuery.where('role', payload.targetRole)
    }

    if (payload.targetProvince) {
      targetUsersQuery.whereHas('school', (q) => q.where('province', payload.targetProvince!))
    }

    const users = await targetUsersQuery.select('id')

    // Utilisation de CreateMany pour éviter des centaines de requêtes individuelles
    const messagesData = users.map((user) => ({
      senderId: auth.user!.id,
      receiverId: user.id,
      subject: payload.subject,
      content: payload.content,
      type: 'official' as const,
      isGlobal: true,
    }))

    await Message.createMany(messagesData)

    return response.created({
      success: true,
      message: `Communication envoyée à ${users.length} destinataires`,
    })
  }

  /**
   * Générer rapport d'école
   */
  public async generateSchoolReport({ request, response }: HttpContext) {
    const payload = await request.validateUsing(generateSchoolReportValidator)
    const school = await School.findOrFail(payload.schoolId)

    const reportData: any = {
      school,
      period: { start: payload.startDate, end: payload.endDate },
    }

    // Exécution parallèle des sous-rapports
    const tasks: Promise<any>[] = []

    if (['academic', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getAcademicReport(school.id, payload).then((res) => (reportData.academic = res))
      )
    }
    if (['financial', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getFinancialReport(school.id, payload).then((res) => (reportData.financial = res))
      )
    }
    if (['disciplinary', 'complete'].includes(payload.reportType)) {
      tasks.push(
        this.getDisciplinaryReport(school.id, payload).then(
          (res) => (reportData.disciplinary = res)
        )
      )
    }

    await Promise.all(tasks)

    return response.ok({ success: true, report: reportData })
  }

  private async getAcademicReport(schoolId: string, params: any) {
    const [avgGrade, topStudents] = await Promise.all([
      db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId)
        .whereBetween('grades.exam_date', [params.startDate.toJSDate(), params.endDate.toJSDate()])
        .avg('grades.score as average')
        .first(),
      db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .where('students.school_id', schoolId)
        .select('students.*')
        .avg('grades.score as average')
        .groupBy('students.id')
        .orderBy('average', 'desc')
        .limit(10),
    ])

    return { averageGrade: Number(avgGrade?.average || 0), topStudents }
  }

  private async getFinancialReport(schoolId: string, params: any) {
    const payments = await db
      .from('fee_payments')
      .join('school_fees', 'fee_payments.fee_id', 'school_fees.id')
      .where('school_fees.school_id', schoolId)
      .whereBetween('fee_payments.payment_date', [
        params.startDate.toJSDate(),
        params.endDate.toJSDate(),
      ])
      .sum('fee_payments.amount_paid as total')
      .first()

    return { totalCollected: Number(payments?.total || 0) }
  }

  private async getDisciplinaryReport(schoolId: string, params: any) {
    const incidents = await db
      .from('disciplines')
      .join('students', 'disciplines.student_id', 'students.id')
      .where('students.school_id', schoolId)
      .whereBetween('disciplines.incident_date', [
        params.startDate.toJSDate(),
        params.endDate.toJSDate(),
      ])
      .count('* as total')
      .first()

    return { totalIncidents: Number(incidents?.total || 0) }
  }

  /**
   * Statistiques globales (v6 optimized)
   */
  public async getGlobalStats({ response }: HttpContext) {
    const [schools, students, teachers, users] = await Promise.all([
      School.query()
        .select(
          db.raw('count(*) as total'),
          db.raw("count(*) filter (where status = 'active') as active")
        )
        .first(),
      db.from('students').count('* as total').first(),
      User.query().where('role', 'teacher').count('* as total').first(),
      User.query().count('* as total').first(),
    ])

    return response.ok({
      success: true,
      stats: {
        schools: {
          total: Number(schools?.$extras.total || 0),
          active: Number(schools?.$extras.active || 0),
        },
        students: Number(students?.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        users: Number(users?.$extras.total || 0),
      },
    })
  }
}
