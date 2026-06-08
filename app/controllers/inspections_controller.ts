import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import School from '#models/school'
import User from '#models/user'
import Message from '#models/message'
import Teacher from '#models/teacher'
import Student from '#models/student'
import TransferAuthorization from '#models/transfer_authorization'
import OtpMailService from '#services/otp_mail_service'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import { basename, join } from 'node:path'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import {
  getSchoolsValidator,
  inspectSchoolValidator,
  sendGlobalCommunicationValidator,
  generateSchoolReportValidator,
} from '#validators/inspection'
import { canUseAppLanguage } from '#services/language_service'

export default class InspectionController {
  private mailService = new OtpMailService()
  private backupDirectory = join(process.cwd(), 'tmp', 'inspection-backups')
  private defaultInspectionSettings = {
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
  }

  private async getInspectionSettings() {
    try {
      const rows = await db.from('inspection_settings').select('key', 'value')

      return rows.reduce(
        (settings, row) => {
          const key = row.key as keyof typeof this.defaultInspectionSettings

          if (key in settings) {
            try {
              settings[key] = JSON.parse(row.value)
            } catch {
              settings[key] = row.value
            }
          }

          return settings
        },
        { ...this.defaultInspectionSettings } as Record<string, any>
      )
    } catch {
      return { ...this.defaultInspectionSettings }
    }
  }

  private async saveInspectionSettings(group: string, values: Record<string, unknown>) {
    const now = new Date()

    for (const [key, value] of Object.entries(values)) {
      const existing = await db.from('inspection_settings').where('key', key).first()
      const payload = {
        group,
        value: JSON.stringify(value),
        updated_at: now,
      }

      if (existing) {
        await db.from('inspection_settings').where('key', key).update(payload)
      } else {
        await db.table('inspection_settings').insert({
          key,
          ...payload,
          created_at: now,
        })
      }
    }
  }

  private async listInspectionBackups() {
    try {
      await mkdir(this.backupDirectory, { recursive: true })
      const files = await readdir(this.backupDirectory)
      const backups = await Promise.all(
        files
          .filter((file) => file.endsWith('.json'))
          .map(async (filename) => {
            const info = await stat(join(this.backupDirectory, filename))

            return {
              filename,
              date: DateTime.fromJSDate(info.mtime).toFormat('dd/MM/yyyy HH:mm'),
              size: `${Math.max(1, Math.round(info.size / 1024))} Ko`,
              timestamp: info.mtime.getTime(),
            }
          })
      )

      return backups.sort((a, b) => b.timestamp - a.timestamp)
    } catch {
      return []
    }
  }

  private splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean)

    return {
      firstName: parts[0] || 'Directeur',
      postnom: parts.length > 2 ? parts.slice(1, -1).join(' ') : 'A completer',
      lastName: parts.length > 1 ? parts[parts.length - 1] : 'Directeur',
    }
  }

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
    const pendingSchools = paginator.all()
    const schoolIds = pendingSchools.map((school) => school.id)
    const directors = schoolIds.length
      ? await db
          .from('users')
          .select('school_id', 'first_name', 'last_name', 'phone', 'email')
          .whereIn('school_id', schoolIds)
          .where('role', 'director')
      : []
    const directorsBySchoolId = new Map(directors.map((director) => [director.school_id, director]))

    return view.render('inspection/schools/pending', {
      pendingSchools: pendingSchools.map((school) => {
        const director = directorsBySchoolId.get(school.id)

        return {
          ...school.serialize(),
          directorName: director ? `${director.first_name} ${director.last_name}`.trim() : null,
          directorPhone: director?.phone ?? null,
          directorEmail: director?.email ?? null,
        }
      }),
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
      db
        .from('students')
        .where('school_id', school.id)
        .where('academic_status', 'active')
        .count('* as total')
        .first(),
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
    const classIds = classes.map((classObj) => classObj.id)
    const studentRows = classIds.length
      ? await db
          .from('students')
          .select('class_id')
          .count('* as total')
          .whereIn('class_id', classIds)
          .where('academic_status', 'active')
          .groupBy('class_id')
      : []
    const studentsByClass = new Map(
      studentRows.map((row) => [String(row.class_id), Number(row.total || 0)])
    )
    const classesWithCounts = classes.map((classObj) => ({
      ...classObj,
      studentsCount: studentsByClass.get(String(classObj.id)) || 0,
    }))

    return view.render('inspection/schools/show', {
      school,
      director,
      stats: {
        students: Number(students?.total || 0),
        teachers: Number(teachers?.$extras.total || 0),
        classes: Number(classesCount?.total || 0),
        averageGrade: Number(averageGrade?.average || 0).toFixed(1),
      },
      classes: classesWithCounts,
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
      .leftJoin('students', 'students.class_id', 'classes.id')
      .where('classes.school_id', school.id)
      .select(
        'classes.id',
        'classes.name',
        'classes.level',
        'classes.grade_level as gradeLevel',
        'classes.max_capacity as maxCapacity',
        'classes.academic_year as academicYear',
        'classes.shift',
        db.raw("concat(users.first_name, ' ', users.last_name) as teacher_name"),
        db.raw(
          'count(distinct students.id) filter (where students.academic_status = ?) as "currentEnrollment"',
          ['active']
        )
      )
      .groupBy(
        'classes.id',
        'classes.name',
        'classes.level',
        'classes.grade_level',
        'classes.max_capacity',
        'classes.academic_year',
        'classes.shift',
        'users.first_name',
        'users.last_name'
      )
      .orderBy('classes.grade_level', 'asc')
      .orderBy('classes.name', 'asc')
      .paginate(page, 20)

    const stats = await db
      .from('classes')
      .where('school_id', school.id)
      .select(
        db.raw('count(*) as total'),
        db.raw('coalesce(sum(max_capacity), 0) as capacity')
      )
      .first()
    const studentsStats = await db
      .from('students')
      .where('school_id', school.id)
      .where('academic_status', 'active')
      .count('* as total')
      .first()

    return view.render('inspection/schools/classes', {
      school,
      classes: paginator.all(),
      pagination: this.getPaginationMeta(paginator),
      url: `/inspection/schools/${school.id}/classes`,
      stats: {
        total: Number(stats?.total || 0),
        students: Number(studentsStats?.total || 0),
        capacity: Number(stats?.capacity || 0),
      },
    })
  }

  public async inspectSchoolPage({ params, auth, view }: HttpContext) {
    const school = await School.findOrFail(params.id)
    const inspector = auth.user?.fullName || ''

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

    return view.render('inspection/schools/approve', {
      school,
      director,
      directorFullName: director?.fullName || `Directeur A completer ${school.name}`,
    })
  }

  public async approveAndGenerateCredentials({
    auth,
    params,
    request,
    response,
    session,
    view,
  }: HttpContext) {
    let school = await School.findOrFail(params.id)
    const email = String(request.input('directorEmail', school.email)).trim().toLowerCase()
    const directorFullName = String(request.input('directorName', `Directeur ${school.name}`)).trim()
    const directorPhone = String(request.input('directorPhone', school.phone)).trim()
    const tempPassword = randomBytes(8).toString('hex')
    let director = await User.query()
      .where('school_id', school.id)
      .where('role', 'director')
      .first()

    if (!email) {
      session.flash('error', 'Veuillez renseigner le nom, le téléphone et l’email du directeur.')
      return response.redirect().back()
    }

    const directorName = this.splitFullName(directorFullName)

    const existingUser = await User.query().where('email', email).first()

    if (existingUser && existingUser.id !== director?.id && existingUser.schoolId !== school.id) {
      session.flash('error', 'Cet email appartient déjà à un autre compte utilisateur.')
      return response.redirect().back()
    }

    if (!director && existingUser?.schoolId === school.id) {
      director = existingUser
    }

    if (director?.id === auth.user?.id) {
      session.flash(
        'error',
        'Le compte inspection ne peut pas être utilisé comme compte directeur.'
      )
      return response.redirect().back()
    }

    const approvedAt = DateTime.now()

    await db.transaction(async (trx) => {
      await db
        .from('schools')
        .useTransaction(trx)
        .where('id', school.id)
        .update({
          status: 'active',
          approved_at: approvedAt.toSQL(),
          updated_at: new Date(),
        })

      if (!director) {
        director = new User()
        director.schoolId = school.id
      }

      director.useTransaction(trx)
      director.email = email
      director.firstName = directorName.firstName
      director.postnom = directorName.postnom
      director.lastName = directorName.lastName
      director.phone = directorPhone
      director.role = 'director'
      director.password = tempPassword
      director.status = 'active'
      await director.save()
    })

    school = await School.findOrFail(params.id)

    const credentials = {
      email,
      password: tempPassword,
      schoolCode: school.code,
      schoolName: school.name,
      directorName: director?.fullName || [directorName.firstName, directorName.postnom, directorName.lastName].join(' '),
      approvedAt:
        school.approvedAt?.toFormat('dd/MM/yyyy HH:mm') ??
        DateTime.now().toFormat('dd/MM/yyyy HH:mm'),
    }
    let emailDelivery = {
      sent: true,
      message: `Les identifiants ont été envoyés à ${email}.`,
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
            : "L'email n'a pas pu être envoyé automatiquement.",
      }
    }

    session.flash(
      emailDelivery.sent ? 'success' : 'error',
      emailDelivery.sent
        ? 'École approuvée, identifiants générés et email envoyé.'
        : 'École approuvée et identifiants générés, mais email non envoyé.'
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
    const messages = await Message.query()
      .where('is_global', true)
      .orderBy('created_at', 'desc')
      .limit(5)
      .preload('receiver', (receiverQuery) => receiverQuery.preload('school'))

    const recentCommunications = messages.map((message) => ({
      ...message.serialize(),
      recipientCount: message.receiverId ? 1 : 0,
      receiverName: message.receiver?.fullName,
      schoolName: message.receiver?.school?.name,
    }))

    return view.render('inspection/communications/global', { recentCommunications })
  }

  public async communicationsHistoryPage({ request, view }: HttpContext) {
    const page = Number(request.input('page', 1))
    const paginator = await Message.query()
      .preload('sender')
      .preload('receiver', (receiverQuery) => receiverQuery.preload('school'))
      .preload('school')
      .orderBy('created_at', 'desc')
      .paginate(page, 20)
    const total = await Message.query().count('* as total').first()
    const global = await Message.query().where('is_global', true).count('* as total').first()

    return view.render('inspection/communications/history', {
      communications: paginator.all().map((message) => {
        const recipientCount = message.receiverId ? 1 : 0
        const readCount = message.isRead ? 1 : 0
        const readRate = recipientCount ? Math.round((readCount / recipientCount) * 100) : 0

        return {
          ...message.serialize(),
          type: message.isGlobal ? 'global' : 'school',
          senderName: message.sender?.fullName || 'Inspection',
          schoolName: message.school?.name || message.receiver?.school?.name,
          recipientCount,
          acknowledgedCount: readCount,
          acknowledgedRate: readRate,
          readRate,
          urgent: false,
        }
      }),
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

  public async schoolCommunicationInfo({ params, response }: HttpContext) {
    const school = await School.query()
      .where('id', params.id)
      .preload('users', (userQuery) => userQuery.where('role', 'director'))
      .firstOrFail()
    const director = school.users[0]

    return response.ok({
      id: school.id,
      name: school.name,
      province: school.province,
      territory: school.territory,
      address: school.address,
      email: school.email,
      phone: school.phone,
      status: school.status,
      directorName: director?.fullName || '-',
      directorEmail: director?.email || '-',
    })
  }

  public async schoolCommunicationsHistory({ params, response }: HttpContext) {
    const messages = await Message.query()
      .where((query) => {
        query.where('school_id', params.id).orWhereHas('receiver', (receiverQuery) => {
          receiverQuery.where('school_id', params.id)
        })
      })
      .preload('sender')
      .preload('receiver')
      .orderBy('created_at', 'desc')
      .limit(30)

    return response.ok({
      success: true,
      communications: messages.map((message) => {
        const recipientCount = message.receiverId ? 1 : 0
        const readCount = message.isRead ? 1 : 0

        return {
          ...message.serialize(),
          senderName: message.sender?.fullName || 'Inspection',
          receiverName: message.receiver?.fullName,
          recipientType: message.receiver?.role || 'all',
          recipientCount,
          acknowledged: message.isRead,
          acknowledgedCount: readCount,
          readRate: recipientCount ? Math.round((readCount / recipientCount) * 100) : 0,
        }
      }),
    })
  }

  public async communicationDetails({ params, view }: HttpContext) {
    const message = await Message.query()
      .where('id', params.id)
      .preload('sender')
      .preload('receiver', (receiverQuery) => receiverQuery.preload('school'))
      .preload('school')
      .firstOrFail()
    const recipientCount = message.receiverId ? 1 : 0
    const readCount = message.isRead ? 1 : 0
    const readRate = recipientCount ? Math.round((readCount / recipientCount) * 100) : 0

    return view.render('inspection/communications/show', {
      communication: {
        ...message.serialize(),
        senderName: message.sender?.fullName || 'Inspection',
        senderEmail: message.sender?.email,
        receiverName: message.receiver?.fullName || 'Tous les destinataires',
        receiverEmail: message.receiver?.email,
        schoolName: message.school?.name || message.receiver?.school?.name,
        recipientCount,
        acknowledgedCount: readCount,
        acknowledgedRate: readRate,
        readRate,
      },
    })
  }

  public async communicationDetailsJson({ params, response }: HttpContext) {
    const message = await Message.query()
      .where('id', params.id)
      .preload('sender')
      .preload('receiver', (receiverQuery) => receiverQuery.preload('school'))
      .preload('school')
      .firstOrFail()
    const recipientCount = message.receiverId ? 1 : 0
    const readCount = message.isRead ? 1 : 0
    const readRate = recipientCount ? Math.round((readCount / recipientCount) * 100) : 0

    return response.ok({
      success: true,
      communication: {
        ...message.serialize(),
        senderName: message.sender?.fullName || 'Inspection',
        receiverName: message.receiver?.fullName,
        schoolName: message.school?.name || message.receiver?.school?.name,
        recipientCount,
        acknowledgedCount: readCount,
        acknowledgedRate: readRate,
        readRate,
      },
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
    const settings = await this.getInspectionSettings()
    const backups = await this.listInspectionBackups()

    return view.render('inspection/settings/index', {
      settings,
      backups,
    })
  }

  public async saveSettings({ request, response, session }: HttpContext) {
    const url = request.url()
    let group = 'general'
    let payload: Record<string, unknown> = {}

    if (url.includes('/inspection/settings/inspection')) {
      group = 'inspection'
      payload = {
        autoApproveSchools: Boolean(request.input('auto_approve_schools')),
        requireInspectionReport: Boolean(request.input('require_inspection_report')),
        inspectionFrequency: Number(request.input('inspection_frequency', 12)),
        responseDeadline: Number(request.input('response_deadline', 15)),
        defaultEvaluationGrid: request.input('default_evaluation_grid', 'standard'),
      }
    } else if (url.includes('/inspection/settings/notifications')) {
      group = 'notifications'
      payload = {
        notifyOnNewSchool: Boolean(request.input('notify_on_new_school')),
        notifyOnTransferRequest: Boolean(request.input('notify_on_transfer_request')),
        notifyOnApproval: Boolean(request.input('notify_on_approval')),
        notificationEmail: request.input('notification_email', ''),
        emergencyEmail: request.input('emergency_email', ''),
      }
    } else if (url.includes('/inspection/settings/backup')) {
      group = 'backup'
      payload = {
        backupFrequency: request.input('backup_frequency', 'weekly'),
        backupRetention: Number(request.input('backup_retention', 30)),
        backupLogs: Boolean(request.input('backup_logs')),
      }
    } else if (url.includes('/inspection/settings/security')) {
      group = 'security'
      payload = {
        minPasswordLength: Number(request.input('min_password_length', 8)),
        requireStrongPassword: Boolean(request.input('require_strong_password')),
        passwordExpiryDays: Number(request.input('password_expiry_days', 90)),
        maxLoginAttempts: Number(request.input('max_login_attempts', 5)),
        lockoutDuration: Number(request.input('lockout_duration', 30)),
        twoFactorAuth: Boolean(request.input('two_factor_auth')),
      }
    } else {
      payload = {
        systemName: request.input('system_name', 'Gestion Éducative RDC'),
        currentAcademicYear: request.input('current_academic_year', '2024-2025'),
        currentTerm: request.input('current_term', 'T1'),
        defaultLanguage: canUseAppLanguage(request.input('default_language', 'fr'))
          ? request.input('default_language', 'fr')
          : 'fr',
        timezone: request.input('timezone', 'Africa/Kinshasa'),
      }
    }

    try {
      await this.saveInspectionSettings(group, payload)
      if (typeof payload.defaultLanguage === 'string') {
        session.put('locale', payload.defaultLanguage)
      }
      session.flash('success', 'Paramètres enregistrés')
    } catch {
      session.flash('error', "Impossible d'enregistrer les paramètres")
    }

    return response.redirect(`/inspection/settings#${group}`)
  }

  public async triggerBackup({ response }: HttpContext) {
    try {
      await mkdir(this.backupDirectory, { recursive: true })

      const settings = await this.getInspectionSettings()
      const [schools, students, teachers, messages] = await Promise.all([
        db.from('schools').count('* as total').first(),
        db.from('students').count('* as total').first(),
        db.from('teachers').count('* as total').first(),
        db.from('messages').count('* as total').first(),
      ])
      const generatedAt = DateTime.now()
      const filename = `inspection-backup-${generatedAt.toFormat('yyyyLLdd-HHmmss')}.json`
      const backup = {
        generatedAt: generatedAt.toISO(),
        settings,
        summary: {
          schools: Number(schools?.total || 0),
          students: Number(students?.total || 0),
          teachers: Number(teachers?.total || 0),
          messages: Number(messages?.total || 0),
        },
      }

      await writeFile(join(this.backupDirectory, filename), JSON.stringify(backup, null, 2), 'utf8')
      await this.saveInspectionSettings('backup', {
        lastBackup: generatedAt.toFormat('dd/MM/yyyy HH:mm'),
      })

      return response.ok({
        success: true,
        filename,
        message: 'Sauvegarde créée',
      })
    } catch (error) {
      return response.internalServerError({
        success: false,
        message: error instanceof Error ? error.message : 'Sauvegarde impossible',
      })
    }
  }

  public async downloadBackup({ params, response }: HttpContext) {
    const filename = basename(params.filename)
    const filePath = join(this.backupDirectory, filename)

    try {
      const content = await readFile(filePath)

      response.header('Content-Type', 'application/json; charset=utf-8')
      response.header('Content-Disposition', `attachment; filename="${filename}"`)

      return response.send(content)
    } catch {
      return response.notFound('Sauvegarde introuvable')
    }
  }

  public async exportSchools({ response }: HttpContext) {
    return response.ok('Export des Ã©coles non configurÃ©')
  }

  public disabledSettingsPage(view: any) {
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

  public async disabledSaveSettings({ response, session }: HttpContext) {
    session.flash('success', 'Paramètres enregistrés')
    return response.redirect('/inspection/settings')
  }

  public async oldExportSchools({ response }: HttpContext) {
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
    const director = await User.query()
      .where('school_id', school.id)
      .where('role', 'director')
      .first()

    return view.render('inspection/schools/inspection-report', {
      school,
      schoolName: school.name,
      documentTitle: "Rapport d'inspection pédagogique",
      directorName: director?.fullName || 'Non renseigné',
      inspectionDate: DateTime.now().toFormat('dd/MM/yyyy'),
      leadInspector: 'Inspection',
      deputyInspector: null,
      visitDate: DateTime.now().toFormat('dd/MM/yyyy'),
      visitDuration: '-',
      scores: {},
      observations: {},
      overallScore: '-',
      appreciation: 'À compléter',
      summary: 'Rapport en attente de saisie.',
      strengths: [],
      improvements: [],
      recommendations: [],
      actionPlan: [],
      nextInspectionDate: null,
      reportDeadline: 'À déterminer',
      followUpDate: null,
      report: {},
      stats: {},
    })
  }

  public async schoolsReportData({ request, response }: HttpContext) {
    const province = request.input('province')
    const status = request.input('status')
    const year = request.input('year')
    const stats = await School.query()
      .select(
        db.raw('count(*) as total'),
        db.raw("count(*) filter (where status = 'active') as active"),
        db.raw("count(*) filter (where status = 'pending') as pending"),
        db.raw("count(*) filter (where status = 'suspended') as suspended")
      )
      .first()
    const schools = await School.query()
      .if(province, (query) => query.where('province', province))
      .if(status, (query) => query.where('status', status))
      .orderBy('name', 'asc')

    const schoolIds = schools.map((school) => school.id)
    const [studentRows, teacherRows, studentTrendRows] = await Promise.all([
      schoolIds.length
        ? db
            .from('students')
            .select('school_id')
            .count('* as total')
            .whereIn('school_id', schoolIds)
            .where('academic_status', 'active')
            .groupBy('school_id')
        : [],
      schoolIds.length
        ? db
            .from('users')
            .select('school_id')
            .count('* as total')
            .whereIn('school_id', schoolIds)
            .where('role', 'teacher')
            .where('status', 'active')
            .groupBy('school_id')
        : [],
      schoolIds.length
        ? db
            .from('students')
            .select('created_at')
            .whereIn('school_id', schoolIds)
            .where('academic_status', 'active')
            .if(year, (query) => {
              query
                .where('created_at', '>=', `${year}-01-01 00:00:00`)
                .where('created_at', '<=', `${year}-12-31 23:59:59`)
            })
        : [],
    ])
    const studentsBySchool = new Map(
      studentRows.map((row) => [String(row.school_id), Number(row.total || 0)])
    )
    const teachersBySchool = new Map(
      teacherRows.map((row) => [String(row.school_id), Number(row.total || 0)])
    )
    const totalStudents = Array.from(studentsBySchool.values()).reduce((sum, count) => sum + count, 0)
    const activeSchools = schools.filter((school) => school.status === 'active').length
    const pendingSchools = schools.filter((school) => school.status === 'pending').length
    const suspendedSchools = schools.filter((school) => school.status === 'suspended').length
    const trendCounts = studentTrendRows.reduce<Record<string, number>>((acc, row) => {
      const date = DateTime.fromJSDate(new Date(row.created_at))
      if (!date.isValid) return acc
      const key = date.toFormat('LL/yyyy')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const trendLabels = Object.keys(trendCounts).sort((a, b) => {
      const left = DateTime.fromFormat(a, 'LL/yyyy')
      const right = DateTime.fromFormat(b, 'LL/yyyy')
      return left.toMillis() - right.toMillis()
    })
    const byProvince = await db.from('schools').select('province').count('* as total').groupBy('province')

    return response.ok({
      success: true,
      summary: {
        totalSchools: schools.length,
        activeSchools,
        pendingSchools,
        suspendedSchools,
        totalStudents,
        total: Number(stats?.$extras.total || 0),
        active: Number(stats?.$extras.active || 0),
        pending: Number(stats?.$extras.pending || 0),
        suspended: Number(stats?.$extras.suspended || 0),
      },
      byProvince,
      provinceData: {
        labels: byProvince.map((row) => row.province || 'Non renseignée'),
        values: byProvince.map((row) => Number(row.total || 0)),
      },
      trendData: {
        labels: trendLabels,
        values: trendLabels.map((label) => trendCounts[label] || 0),
      },
      schools: schools.map((school) => ({
        id: school.id,
        code: school.code,
        name: school.name,
        province: school.province,
        status: school.status,
        studentsCount: studentsBySchool.get(school.id) || 0,
        teachersCount: teachersBySchool.get(school.id) || 0,
        averageGrade: 0,
      })),
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
    const [
      schoolRows,
      studentRows,
      teacherRows,
      qualifiedTeacherRows,
      classRows,
      gradeRows,
      attendanceRows,
      incidentRows,
      suspensionRows,
      infrastructureRows,
      geoRows,
      studentTrendRows,
      teacherTrendRows,
    ] = await Promise.all([
      db
        .from('schools')
        .select(
          db.raw('count(*) as total'),
          db.raw("count(*) filter (where status = 'active') as active"),
          db.raw("count(*) filter (where status = 'pending') as pending")
        )
        .first(),
      db
        .from('students')
        .select(
          db.raw('count(*) as total'),
          db.raw("count(*) filter (where gender in ('male', 'M', 'masculin', 'Masculin')) as boys"),
          db.raw("count(*) filter (where gender in ('female', 'F', 'feminin', 'Féminin')) as girls")
        )
        .where('academic_status', 'active')
        .first(),
      db.from('users').where('role', 'teacher').where('status', 'active').count('* as total').first(),
      db
        .from('teachers')
        .whereNotNull('qualification')
        .whereNot('qualification', '')
        .count('* as total')
        .first(),
      db
        .from('classes')
        .count('* as total')
        .sum('max_capacity as capacity')
        .sum('current_enrollment as enrollment')
        .first(),
      db
        .from('grades')
        .select(db.raw('avg((score / nullif(max_score, 0)) * 20) as average'))
        .select(db.raw("avg(case when ((score / nullif(max_score, 0)) * 20) >= 10 then 1 else 0 end) * 100 as success_rate"))
        .first(),
      db
        .from('attendances')
        .select(db.raw("avg(case when status = 'present' then 1 else 0 end) * 100 as attendance_rate"))
        .first(),
      db.from('disciplines').count('* as total').first(),
      db
        .from('disciplines')
        .whereILike('sanction', '%suspension%')
        .count('* as total')
        .first(),
      db
        .from('schools')
        .select(
          db.raw('count(*) as total'),
          db.raw('count(*) filter (where has_electricity = true) as electricity'),
          db.raw('count(*) filter (where has_internet = true) as internet'),
          db.raw('count(*) filter (where has_library = true) as library')
        )
        .first(),
      db.from('schools').select('province').count('* as total').groupBy('province'),
      db
        .from('students')
        .select('created_at')
        .where('academic_status', 'active')
        .orderBy('created_at', 'asc'),
      db
        .from('users')
        .select('created_at')
        .where('role', 'teacher')
        .where('status', 'active')
        .orderBy('created_at', 'asc'),
    ])

    const totalSchools = Number(schoolRows?.total || 0)
    const activeSchools = Number(schoolRows?.active || 0)
    const pendingSchools = Number(schoolRows?.pending || 0)
    const totalStudents = Number(studentRows?.total || 0)
    const boysCount = Number(studentRows?.boys || 0)
    const girlsCount = Number(studentRows?.girls || 0)
    const totalTeachers = Number(teacherRows?.total || 0)
    const totalClasses = Number(classRows?.total || 0)
    const totalCapacity = Number(classRows?.capacity || 0)
    const totalEnrollment = Number(classRows?.enrollment || 0) || totalStudents
    const nationalAverage = Number(gradeRows?.average || 0)
    const successRate = Math.round(Number(gradeRows?.success_rate || 0))
    const attendanceRate = Math.round(Number(attendanceRows?.attendance_rate || 0))
    const incidentsCount = Number(incidentRows?.total || 0)
    const suspensionsCount = Number(suspensionRows?.total || 0)
    const infrastructureTotal = Number(infrastructureRows?.total || 0)
    const electricityRate = infrastructureTotal
      ? Math.round((Number(infrastructureRows?.electricity || 0) / infrastructureTotal) * 100)
      : 0
    const internetRate = infrastructureTotal
      ? Math.round((Number(infrastructureRows?.internet || 0) / infrastructureTotal) * 100)
      : 0
    const libraryRate = infrastructureTotal
      ? Math.round((Number(infrastructureRows?.library || 0) / infrastructureTotal) * 100)
      : 0

    const monthlyStudents = studentTrendRows.reduce<Record<string, number>>((acc, row) => {
      const date = DateTime.fromJSDate(new Date(row.created_at))
      if (!date.isValid) return acc
      const key = date.toFormat('LL/yyyy')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const monthlyTeachers = teacherTrendRows.reduce<Record<string, number>>((acc, row) => {
      const date = DateTime.fromJSDate(new Date(row.created_at))
      if (!date.isValid) return acc
      const key = date.toFormat('LL/yyyy')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const demographicLabels = Array.from(
      new Set([...Object.keys(monthlyStudents), ...Object.keys(monthlyTeachers)])
    ).sort((a, b) => {
      const left = DateTime.fromFormat(a, 'LL/yyyy')
      const right = DateTime.fromFormat(b, 'LL/yyyy')
      return left.toMillis() - right.toMillis()
    })

    return response.ok({
      success: true,
      overview: {
        totalSchools,
        activeSchools,
        pendingSchools,
        totalStudents,
        boysCount,
        girlsCount,
        totalTeachers,
        qualifiedTeachers: Number(qualifiedTeacherRows?.total || 0),
        studentTeacherRatio: totalTeachers ? Math.round(totalStudents / totalTeachers) : 0,
        totalClasses,
        avgClassSize: totalClasses ? Math.round(totalStudents / totalClasses) : 0,
        occupancyRate: totalCapacity ? Math.round((totalEnrollment / totalCapacity) * 100) : 0,
      },
      performance: {
        nationalAverage: Number(nationalAverage.toFixed(1)),
        successRate,
        repetitionRate: 0,
      },
      discipline: {
        attendanceRate,
        incidentsCount,
        suspensionsCount,
      },
      infrastructure: {
        electricityRate,
        internetRate,
        libraryRate,
      },
      geoData: {
        labels: geoRows.map((row) => row.province || 'Non renseignée'),
        values: geoRows.map((row) => Number(row.total || 0)),
      },
      demographics: {
        labels: demographicLabels,
        students: demographicLabels.map((label) => monthlyStudents[label] || 0),
        teachers: demographicLabels.map((label) => monthlyTeachers[label] || 0),
      },
      topProvinces: [],
      bottomProvinces: [],
    })
  }

  public async transfersReportData({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')
    const province = request.input('province')
    const requestedStatus = request.input('status')
    const status = requestedStatus === 'completed' ? 'used' : requestedStatus

    const transfers = await TransferAuthorization.query()
      .if(startDate, (query) => query.where('created_at', '>=', `${startDate} 00:00:00`))
      .if(endDate, (query) => query.where('created_at', '<=', `${endDate} 23:59:59`))
      .if(status, (query) => query.where('status', status))
      .if(province, (query) => {
        query.whereHas('fromSchool', (schoolQuery) => schoolQuery.where('province', province))
      })
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('fromSchool')
      .preload('toSchool')
      .orderBy('created_at', 'desc')

    const completedTransfers = transfers.filter((transfer) => transfer.status === 'used')
    const pendingTransfers = transfers.filter((transfer) => transfer.status === 'pending')
    const processedTransfers = transfers.filter((transfer) => transfer.status !== 'pending')
    const processingDays = processedTransfers
      .map((transfer) => {
        if (!transfer.createdAt || !transfer.updatedAt) return 0
        return Math.max(0, Math.round(transfer.updatedAt.diff(transfer.createdAt, 'days').days))
      })
      .filter((days) => Number.isFinite(days))
    const avgDays = processingDays.length
      ? Math.round(processingDays.reduce((sum, days) => sum + days, 0) / processingDays.length)
      : 0

    const trendCounts = transfers.reduce<Record<string, number>>((acc, transfer) => {
      const key = transfer.createdAt.toFormat('dd/LL')
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const trendLabels = Object.keys(trendCounts).sort((a, b) => {
      const left = DateTime.fromFormat(a, 'dd/LL').set({ year: DateTime.now().year })
      const right = DateTime.fromFormat(b, 'dd/LL').set({ year: DateTime.now().year })
      return left.toMillis() - right.toMillis()
    })

    const originCounts = transfers.reduce<Record<string, number>>((acc, transfer) => {
      const key = transfer.fromSchool?.province || 'Non renseignée'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    const flowMatrix = transfers.reduce<Record<string, Record<string, number>>>((acc, transfer) => {
      const from = transfer.fromSchool?.province || 'Non renseignée'
      const to = transfer.toSchool?.province || 'Non renseignée'
      acc[from] = acc[from] || {}
      acc[from][to] = (acc[from][to] || 0) + 1
      return acc
    }, {})

    return response.ok({
      success: true,
      summary: {
        total: transfers.length,
        completed: completedTransfers.length,
        pending: pendingTransfers.length,
        avgDays,
      },
      trend: {
        labels: trendLabels,
        values: trendLabels.map((label) => trendCounts[label] || 0),
      },
      topOrigins: Object.entries(originCounts)
        .map(([originProvince, count]) => ({ province: originProvince, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      flowMatrix,
      transfers: transfers.map((transfer) => {
        const normalizedStatus = transfer.status === 'used' ? 'completed' : transfer.status
        const days =
          transfer.status === 'pending' || !transfer.createdAt || !transfer.updatedAt
            ? null
            : Math.max(0, Math.round(transfer.updatedAt.diff(transfer.createdAt, 'days').days))

        return {
          id: transfer.id,
          date: transfer.createdAt,
          studentName: transfer.student?.user?.fullName || '-',
          fromSchool: transfer.fromSchool?.name || '-',
          toSchool: transfer.toSchool?.name || '-',
          status: normalizedStatus,
          processingDays: days,
        }
      }),
    })
  }

  /**
   * Obtenir la liste des écoles (avec filtres et pagination)
   */
  public async exportTransfersReport({ request, response }: HttpContext) {
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')
    const province = request.input('province')
    const requestedStatus = request.input('status')
    const status = requestedStatus === 'completed' ? 'used' : requestedStatus

    const transfers = await TransferAuthorization.query()
      .if(startDate, (query) => query.where('created_at', '>=', `${startDate} 00:00:00`))
      .if(endDate, (query) => query.where('created_at', '<=', `${endDate} 23:59:59`))
      .if(status, (query) => query.where('status', status))
      .if(province, (query) => {
        query.whereHas('fromSchool', (schoolQuery) => schoolQuery.where('province', province))
      })
      .preload('student', (studentQuery) => studentQuery.preload('user'))
      .preload('fromSchool')
      .preload('toSchool')
      .orderBy('created_at', 'desc')

    const statusLabels: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuve',
      used: 'Complete',
      rejected: 'Rejete',
    }
    const headers = [
      'Date',
      'Eleve',
      'Ecole origine',
      'Province origine',
      'Ecole destination',
      'Province destination',
      'Statut',
      'Delai (jours)',
    ]
    const rows = transfers.map((transfer) => {
      const processingDays =
        transfer.status === 'pending' || !transfer.createdAt || !transfer.updatedAt
          ? ''
          : Math.max(0, Math.round(transfer.updatedAt.diff(transfer.createdAt, 'days').days))

      return [
        transfer.createdAt.toFormat('dd/LL/yyyy'),
        transfer.student?.user?.fullName || '-',
        transfer.fromSchool?.name || '-',
        transfer.fromSchool?.province || '-',
        transfer.toSchool?.name || '-',
        transfer.toSchool?.province || '-',
        statusLabels[transfer.status] || transfer.status,
        processingDays,
      ]
    })
    const format = request.input('format') === 'pdf' ? 'pdf' : 'excel'

    if (format === 'pdf') {
      const escapeHtml = (value: unknown) =>
        String(value ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      const tableRows = rows
        .map(
          (row) =>
            `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`
        )
        .join('')
      const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Rapport des transferts</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    p { margin-top: 0; color: #4b5563; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
    th { background: #f3f4f6; }
    @media print { button { display: none; } body { margin: 16px; } }
  </style>
</head>
<body>
  <button onclick="window.print()">Imprimer / Enregistrer en PDF</button>
  <h1>Rapport des transferts d'eleves</h1>
  <p>Genere le ${DateTime.now().toFormat('dd/LL/yyyy HH:mm')}</p>
  <table>
    <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
    <tbody>${tableRows || `<tr><td colspan="${headers.length}">Aucun transfert trouve</td></tr>`}</tbody>
  </table>
</body>
</html>`

      response.header('Content-Type', 'text/html; charset=utf-8')
      return response.send(html)
    }

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n')
    const filename = `rapport-transferts-${DateTime.now().toFormat('yyyyLLdd-HHmm')}.csv`

    response.header('Content-Type', 'text/csv; charset=utf-8')
    response.header('Content-Disposition', `attachment; filename="${filename}"`)

    return response.send(`\uFEFF${csv}`)
  }

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
      .preload('classes')
      .firstOrFail()

    // Statistiques complémentaires optimisées
    const [teacherCount, studentCount] = await Promise.all([
      User.query().where('school_id', params.id).where('role', 'teacher').count('* as total').first(),
      Student.query()
        .where('school_id', params.id)
        .where('academic_status', 'active')
        .count('* as total')
        .first(),
    ])

    return response.ok({
      success: true,
      school,
      stats: {
        teachers: Number(teacherCount?.$extras.total || 0),
        totalStudents: Number(studentCount?.$extras.total || 0),
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
            schoolId: school.id,
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
