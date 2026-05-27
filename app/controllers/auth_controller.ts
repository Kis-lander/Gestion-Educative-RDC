import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import School from '#models/school'
import User from '#models/user'
import OtpService from '#services/otp_service'
import {
  changePasswordValidator,
  loginValidator,
  updateProfileValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  requestOtpValidator,
  verifyOtpValidator,
} from '#validators/auth'

export default class AuthController {
  private otpService = new OtpService()

  /**
   * Afficher la page profil.
   */
  public async profile({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')
    const profileStats = await this.getProfileStats(user)
    const recentActivities = (await this.getUserActivities(user)).slice(0, 5).map((activity) => ({
      type: activity.action,
      description: activity.description,
      time: this.formatRelativeTime(activity.createdAt),
    }))

    const roleLabels: Record<string, string> = {
      inspection: 'Inspection pédagogique',
      director: "Direction d'école",
      finance_director: 'Direction financière',
      discipline_director: 'Direction de discipline',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
    }

    const filledFields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.role,
      user.schoolId,
      user.avatarUrl,
    ].filter(Boolean).length

    return view.render('profile/index', {
      title: `Mon profil - ${user.firstName} ${user.lastName}`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        roleLabel: roleLabels[user.role] ?? user.role,
        avatarUrl: user.avatarUrl,
        schoolName: user.school?.name,
        className: null,
        qualification: null,
      },
      stats: {
        memberSince: user.createdAt?.toFormat('dd/LL/yyyy') ?? '-',
        lastLogin: user.lastLogin?.toFormat('dd/LL/yyyy') ?? '-',
        loginCount: 0,
        documentsCount: profileStats.documentsShared,
        messagesSent: profileStats.messagesSent,
        documentsShared: profileStats.documentsShared,
        activeDays: profileStats.activeDays,
      },
      profileCompletion: Math.round((filledFields / 7) * 100),
      recentActivities,
    })
  }

  private formatRelativeTime(value: Date | string) {
    const date = DateTime.fromJSDate(new Date(value))
    const now = DateTime.now()
    const minutes = Math.max(0, Math.floor(now.diff(date, 'minutes').minutes))

    if (minutes < 1) return "À l'instant"
    if (minutes < 60) return `Il y a ${minutes} min`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `Il y a ${hours} h`

    const days = Math.floor(hours / 24)
    if (days < 7) return `Il y a ${days} j`

    return date.toFormat('dd/LL/yyyy HH:mm')
  }

  private async getProfileStats(user: User) {
    const countRows = async (query: any) => {
      try {
        const row = await query.count('* as total').first()
        return Number(row?.total || 0)
      } catch {
        return 0
      }
    }

    const messagesSent = await countRows(db.from('messages').where('sender_id', user.id))
    const messageDocuments = await countRows(
      db.from('messages').where('sender_id', user.id).where('has_attachment', true)
    )

    const teacherDocuments = await countRows(
      db
        .from('assignments')
        .join('teachers', 'assignments.teacher_id', 'teachers.id')
        .where('teachers.user_id', user.id)
        .whereNotNull('assignments.attachment_url')
        .whereNot('assignments.attachment_url', '')
    )

    const studentDocuments = await countRows(
      db
        .from('assignment_submissions')
        .join('students', 'assignment_submissions.student_id', 'students.id')
        .where('students.user_id', user.id)
        .whereNotNull('assignment_submissions.attachment_url')
        .whereNot('assignment_submissions.attachment_url', '')
    )

    const justifiedDocuments = await countRows(
      db
        .from('attendances')
        .where('justified_by', user.id)
        .whereNotNull('justification_document')
        .whereNot('justification_document', '')
    )

    const activeDays = new Set<string>()
    const collectDays = async (query: any, column: string) => {
      try {
        const rows = await query.select(column)
        for (const row of rows) {
          const value = row[column]
          if (!value) continue
          activeDays.add(DateTime.fromJSDate(new Date(value)).toISODate()!)
        }
      } catch {}
    }

    await Promise.all([
      collectDays(db.from('messages').where('sender_id', user.id), 'created_at'),
      collectDays(
        db
          .from('assignments')
          .join('teachers', 'assignments.teacher_id', 'teachers.id')
          .where('teachers.user_id', user.id),
        'created_at'
      ),
      collectDays(
        db
          .from('assignment_submissions')
          .join('students', 'assignment_submissions.student_id', 'students.id')
          .where('students.user_id', user.id),
        'created_at'
      ),
      collectDays(db.from('attendances').where('recorded_by', user.id), 'created_at'),
    ])

    const createdAtDay = user.createdAt?.toISODate()
    const lastLoginDay = user.lastLogin?.toISODate()
    if (createdAtDay) activeDays.add(createdAtDay)
    if (lastLoginDay) activeDays.add(lastLoginDay)

    return {
      messagesSent,
      documentsShared: messageDocuments + teacherDocuments + studentDocuments + justifiedDocuments,
      activeDays: activeDays.size,
    }
  }

  public async editProfilePage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')

    return view.render('profile/edit', {
      title: `Modifier mon profil - ${user.firstName} ${user.lastName}`,
      user: this.getProfileViewUser(user),
    })
  }

  public async securityPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')

    return view.render('profile/security', {
      title: `Sécurité - ${user.firstName} ${user.lastName}`,
      user: this.getProfileViewUser(user),
      stats: {
        passwordStrength: 'Bon',
        lastPasswordChange: '-',
        activeSessions: 1,
        twoFactorEnabled: false,
      },
      sessions: [],
    })
  }

  public async preferencesPage({ auth, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')

    return view.render('profile/preferences', {
      title: `Préférences - ${user.firstName} ${user.lastName}`,
      user: this.getProfileViewUser(user),
      preferences: {
        theme: 'dark',
        language: 'fr',
        timezone: 'Africa/Kinshasa',
        dateFormat: 'dd/mm/yyyy',
        notifyMessages: true,
        notifyReports: true,
        notifySecurity: true,
      },
    })
  }

  public async activityPage({ auth, request, view }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')
    const page = Number(request.input('page', 1))
    const perPage = 20
    const selectedType = String(request.input('type', ''))
    const startDate = String(request.input('start_date', ''))
    const endDate = String(request.input('end_date', ''))
    const rawSearch = String(request.input('search', '')).trim()
    const search = rawSearch.toLowerCase()
    const allActivities = await this.getUserActivities(user)
    const filteredActivities = allActivities.filter((activity) => {
      const activityDate = DateTime.fromJSDate(new Date(activity.createdAt)).toISODate()
      if (selectedType && activity.action !== selectedType) return false
      if (startDate && activityDate && activityDate < startDate) return false
      if (endDate && activityDate && activityDate > endDate) return false
      if (search) {
        const haystack = `${activity.actionLabel} ${activity.description}`.toLowerCase()
        if (!haystack.includes(search)) return false
      }
      return true
    })
    const total = filteredActivities.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const currentPage = Math.min(Math.max(page, 1), lastPage)
    const activities = filteredActivities.slice((currentPage - 1) * perPage, currentPage * perPage)
    const now = DateTime.now()
    const thisMonth = filteredActivities.filter((activity) => {
      const date = DateTime.fromJSDate(new Date(activity.createdAt))
      return date.hasSame(now, 'month') && date.hasSame(now, 'year')
    }).length
    const activeDaysSet = new Set(
      filteredActivities
        .map((activity) => DateTime.fromJSDate(new Date(activity.createdAt)).toISODate())
        .filter(Boolean)
    )
    const byType = filteredActivities.reduce<Record<string, number>>((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {})
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const byDay = filteredActivities.reduce<Record<string, number>>((acc, activity) => {
      const key = dayKeys[DateTime.fromJSDate(new Date(activity.createdAt)).weekday - 1]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const byHour = filteredActivities.reduce<Record<string, number>>((acc, activity) => {
      const hour = DateTime.fromJSDate(new Date(activity.createdAt)).hour
      const key = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
    const chartLabels = Array.from({ length: 30 }, (_, index) =>
      now.minus({ days: 29 - index }).toFormat('dd/LL')
    )
    const chartValues = Array.from({ length: 30 }, (_, index) => {
      const day = now.minus({ days: 29 - index }).toISODate()
      return allActivities.filter(
        (activity) => DateTime.fromJSDate(new Date(activity.createdAt)).toISODate() === day
      ).length
    })
    const maxChartValue = Math.max(...chartValues, 1)
    const chartItems = chartLabels.map((label, index) => {
      const value = chartValues[index]
      return {
        label,
        value,
        height: value ? Math.max(Math.round((value / maxChartValue) * 100), 10) : 3,
        showLabel: index % 5 === 0,
      }
    })
    const today = now.toISODate()
    const last30DaysStart = now.minus({ days: 29 }).startOf('day')
    const todayActivities = allActivities.filter(
      (activity) => DateTime.fromJSDate(new Date(activity.createdAt)).toISODate() === today
    )
    const last30DaysCount = allActivities.filter((activity) => {
      const activityDate = DateTime.fromJSDate(new Date(activity.createdAt))
      return activityDate >= last30DaysStart && activityDate <= now
    }).length

    return view.render('profile/activity', {
      title: `Mon activité - ${user.firstName} ${user.lastName}`,
      user: this.getProfileViewUser(user),
      activities,
      url: '/profile/activity',
      pagination: {
        total,
        perPage,
        currentPage,
        lastPage,
        from: total ? (currentPage - 1) * perPage + 1 : 0,
        to: Math.min(currentPage * perPage, total),
      },
      stats: {
        total,
        thisMonth,
        today: todayActivities.length,
        last30Days: last30DaysCount,
        activeDays: activeDaysSet.size,
        currentStreak: 0,
        byType,
        byDay,
        byHour,
      },
      chartLabels,
      chartValues,
      chartItems,
      todayActivityCount: todayActivities.length,
      todayActivities: todayActivities.slice(0, 5),
      filters: { type: selectedType, startDate, endDate, search: rawSearch },
    })
  }

  private async getUserActivities(user: User) {
    const activities: Array<{
      action: string
      actionLabel: string
      description: string
      createdAt: Date | string
      ip: string | null
    }> = []
    const addActivity = (
      action: string,
      actionLabel: string,
      description: string,
      createdAt?: Date | string | null,
      ip: string | null = null
    ) => {
      if (!createdAt) return
      activities.push({ action, actionLabel, description, createdAt, ip })
    }

    addActivity('login', 'Connexion', 'Dernière connexion au compte', user.lastLogin?.toJSDate())
    addActivity('create', 'Création', 'Création du compte utilisateur', user.createdAt?.toJSDate())

    try {
      const messages = await db
        .from('messages')
        .select('subject', 'has_attachment', 'created_at')
        .where('sender_id', user.id)
        .orderBy('created_at', 'desc')
        .limit(300)

      for (const message of messages) {
        addActivity('message', 'Message', `Message envoyé : ${message.subject}`, message.created_at)
        if (message.has_attachment) {
          addActivity('document', 'Document', `Document joint au message : ${message.subject}`, message.created_at)
        }
      }
    } catch {}

    try {
      const assignments = await db
        .from('assignments')
        .join('teachers', 'assignments.teacher_id', 'teachers.id')
        .select('assignments.title', 'assignments.attachment_url', 'assignments.created_at')
        .where('teachers.user_id', user.id)
        .orderBy('assignments.created_at', 'desc')
        .limit(300)

      for (const assignment of assignments) {
        addActivity('create', 'Création', `Devoir créé : ${assignment.title}`, assignment.created_at)
        if (assignment.attachment_url) {
          addActivity('document', 'Document', `Document partagé dans le devoir : ${assignment.title}`, assignment.created_at)
        }
      }
    } catch {}

    try {
      const submissions = await db
        .from('assignment_submissions')
        .join('students', 'assignment_submissions.student_id', 'students.id')
        .join('assignments', 'assignment_submissions.assignment_id', 'assignments.id')
        .select(
          'assignments.title',
          'assignment_submissions.attachment_url',
          'assignment_submissions.created_at'
        )
        .where('students.user_id', user.id)
        .orderBy('assignment_submissions.created_at', 'desc')
        .limit(300)

      for (const submission of submissions) {
        addActivity('create', 'Création', `Travail rendu : ${submission.title}`, submission.created_at)
        if (submission.attachment_url) {
          addActivity('document', 'Document', `Document remis : ${submission.title}`, submission.created_at)
        }
      }
    } catch {}

    try {
      const attendances = await db
        .from('attendances')
        .join('classes', 'attendances.class_id', 'classes.id')
        .select('classes.name', 'attendances.period', 'attendances.created_at')
        .where('attendances.recorded_by', user.id)
        .orderBy('attendances.created_at', 'desc')
        .limit(300)

      for (const attendance of attendances) {
        addActivity(
          'attendance',
          'Présence',
          `Présences pointées pour ${attendance.name} (${attendance.period})`,
          attendance.created_at
        )
      }
    } catch {}

    try {
      const grades = await db
        .from('grades')
        .join('students', 'grades.student_id', 'students.id')
        .join('subjects', 'grades.subject_id', 'subjects.id')
        .select('subjects.name', 'grades.score', 'grades.max_score', 'grades.created_at')
        .where('students.user_id', user.id)
        .orderBy('grades.created_at', 'desc')
        .limit(300)

      for (const grade of grades) {
        addActivity(
          'grade',
          'Note',
          `Note reçue en ${grade.name} : ${grade.score}/${grade.max_score}`,
          grade.created_at
        )
      }
    } catch {}

    try {
      const payments = await db
        .from('fee_payments')
        .select('receipt_number', 'amount_paid', 'currency', 'created_at')
        .where('recorded_by', user.id)
        .orderBy('created_at', 'desc')
        .limit(300)

      for (const payment of payments) {
        addActivity(
          'payment',
          'Paiement',
          `Paiement enregistré : ${payment.amount_paid} ${payment.currency} (${payment.receipt_number})`,
          payment.created_at
        )
      }
    } catch {}

    return activities.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  private getProfileViewUser(user: User) {
    const roleLabels: Record<string, string> = {
      inspection: 'Inspection pédagogique',
      director: "Direction d'école",
      finance_director: 'Direction financière',
      discipline_director: 'Direction de discipline',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      roleLabel: roleLabels[user.role] ?? user.role,
      avatarUrl: user.avatarUrl,
      schoolName: user.school?.name,
      className: null,
      qualification: null,
    }
  }

  /**
   * Connexion utilisateur via la session `web`.
   */
  public async login({ auth, request, response }: HttpContext) {
    // Utilisation des données validées (email et password)
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.query().where('email', email).where('status', 'active').firstOrFail()

      const isPasswordValid = await hash.verify(user.password, password)
      if (!isPasswordValid) {
        throw new Error('Invalid credentials')
      }

      await auth.use('web').login(user)

      user.lastLogin = DateTime.now()
      await user.save()
      await user.load('school')

      return response.ok({
        success: true,
        message: 'Connexion reussie',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          schoolId: user.schoolId,
          schoolName: user.school?.name,
          avatarUrl: user.avatarUrl,
        },
      })
    } catch {
      return response.unauthorized({
        success: false,
        message: 'Email ou mot de passe incorrect ou compte inactif',
      })
    }
  }

  /**
   * Deconnexion.
   */
  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.ok({
      success: true,
      message: 'Deconnexion reussie',
    })
  }

  public async requestOtp({ request, response }: HttpContext) {
    const payload = await request.validateUsing(requestOtpValidator)
    const result = await this.otpService.issue(payload.email, payload.purpose)

    if (result.waitSeconds) {
      return response.tooManyRequests({
        success: false,
        message: `Veuillez patienter ${result.waitSeconds} secondes avant de demander un nouveau code.`,
        waitSeconds: result.waitSeconds,
      })
    }

    return response.ok({
      success: true,
      message: 'Si ce compte est actif, un code de verification a ete envoye.',
    })
  }

  public async verifyOtp({ auth, request, response }: HttpContext) {
    const payload = await request.validateUsing(verifyOtpValidator)
    const result = await this.otpService.verify(payload.email, payload.code, payload.purpose)

    if (!result.valid || !result.user) {
      const messages = {
        expired: 'Code expire. Veuillez demander un nouveau code.',
        locked: 'Trop de tentatives. Veuillez demander un nouveau code.',
        invalid: 'Code invalide.',
      }

      return response.unauthorized({
        success: false,
        message: messages[result.reason ?? 'invalid'],
      })
    }

    if ((payload.purpose ?? 'login') === 'login') {
      await auth.use('web').login(result.user)
      result.user.lastLogin = DateTime.now()
      await result.user.save()
      await result.user.load('school')
    }

    return response.ok({
      success: true,
      message: 'Code verifie avec succes',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        fullName: result.user.fullName,
        role: result.user.role,
        schoolId: result.user.schoolId,
        schoolName: result.user.school?.name,
        avatarUrl: result.user.avatarUrl,
      },
    })
  }

  /**
   * Changer le mot de passe.
   */
  public async changePassword({ request, auth, response }: HttpContext) {
    const { currentPassword, newPassword } = await request.validateUsing(changePasswordValidator)
    const user = auth.getUserOrFail()

    const isValidPassword = await hash.verify(user.password, currentPassword)
    if (!isValidPassword) {
      return response.badRequest({
        success: false,
        message: 'Mot de passe actuel incorrect',
      })
    }

    user.password = newPassword
    await user.save()

    return response.ok({
      success: true,
      message: 'Mot de passe change avec succes',
    })
  }

  /**
   * Recuperer le profil connecte.
   */
  public async getProfile({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await user.load('school')

    return response.ok({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        schoolId: user.schoolId,
        schoolName: user.school?.name,
        avatarUrl: user.avatarUrl,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  }

  /**
   * Mettre a jour le profil.
   */
  public async updateProfile({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(updateProfileValidator)
    const user = auth.getUserOrFail()

    user.merge(data)
    await user.save()

    return response.ok({
      success: true,
      message: 'Profil mis a jour avec succes',
      user,
    })
  }

  public async updateAvatar({ request, auth, response }: HttpContext) {
    const avatar = request.file('avatar', {
      size: '2mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    })

    if (!avatar) {
      return response.badRequest({
        success: false,
        message: 'Aucune image sélectionnée',
      })
    }

    if (!avatar.isValid) {
      return response.badRequest({
        success: false,
        message: avatar.errors[0]?.message ?? 'Image invalide',
      })
    }

    const user = auth.getUserOrFail()
    const fileName = `${user.id}-${Date.now()}.${avatar.extname}`

    await avatar.move(app.publicPath('uploads/avatars'), {
      name: fileName,
      overwrite: true,
    })

    if (!avatar.state || avatar.state !== 'moved') {
      return response.badRequest({
        success: false,
        message: "L'image n'a pas pu être enregistrée",
      })
    }

    user.avatarUrl = `/uploads/avatars/${fileName}`
    await user.save()

    return response.ok({
      success: true,
      message: 'Photo de profil mise à jour',
      avatarUrl: user.avatarUrl,
    })
  }

  /**
   * Mot de passe oublie.
   */
  public async forgotPassword({ request, response }: HttpContext) {
    // Utilisation du validateur pour s'assurer que l'email est correct
    const { email } = await request.validateUsing(forgotPasswordValidator)
    const user = await User.findBy('email', email)

    if (user) {
      const resetToken = randomBytes(32).toString('hex')
      // Logique d'envoi d'email à implémenter ici

      return response.ok({
        success: true,
        message:
          'Si votre email existe dans notre systeme, vous recevrez un lien de reinitialisation',
        data: { resetToken },
      })
    }

    return response.ok({
      success: true,
      message:
        'Si votre email existe dans notre systeme, vous recevrez un lien de reinitialisation',
    })
  }

  /**
   * Reinitialiser le mot de passe.
   */
  public async resetPassword({ request, response }: HttpContext) {
    // Utilisation du validateur (vérifie la correspondance des mots de passe)
    const { token, newPassword } = await request.validateUsing(resetPasswordValidator)

    // Logique de recherche du token en base de données à implémenter ici

    return response.notImplemented({
      success: false,
      message: 'La reinitialisation de mot de passe n est pas encore implementee',
      debug: { token, newPassword },
    })
  }

  /**
   * Generer les identifiants pour une ecole (inspection uniquement).
   */
  public async generateSchoolCredentials({ request, response, auth }: HttpContext) {
    if (auth.user?.role !== 'inspection') {
      return response.forbidden({ message: "Acces reserve a l'inspection" })
    }

    const schoolId = request.param('id') ?? request.input('schoolId')
    const school = await School.findOrFail(schoolId)

    const login = `${school.code}_directeur`
    const tempPassword = randomBytes(6).toString('hex')

    let director = await User.query().where('schoolId', schoolId).where('role', 'director').first()

    if (!director) {
      director = new User()
      director.schoolId = schoolId
      director.role = 'director'
      director.firstName = 'Directeur'
      director.lastName = school.name
      director.status = 'active'
    }

    director.email = `${login}@gestion-educative.cd`.toLowerCase()
    director.password = tempPassword
    director.status = 'active'
    await director.save()

    return response.created({
      success: true,
      message: 'Identifiants generes avec succes',
      credentials: {
        email: director.email,
        password: tempPassword,
        schoolCode: school.code,
      },
    })
  }
}
