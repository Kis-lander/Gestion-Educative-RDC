import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
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
        documentsCount: 0,
        messagesSent: 0,
        documentsShared: 0,
        activeDays: 0,
      },
      profileCompletion: Math.round((filledFields / 7) * 100),
      recentActivities: [],
    })
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

    return view.render('profile/activity', {
      title: `Mon activité - ${user.firstName} ${user.lastName}`,
      user: this.getProfileViewUser(user),
      activities: [],
      url: '/profile/activity',
      pagination: {
        total: 0,
        perPage: 20,
        currentPage: page,
        lastPage: 1,
        from: 0,
        to: 0,
      },
      stats: {
        total: 0,
        thisMonth: 0,
        activeDays: 0,
        currentStreak: 0,
        byType: {},
        byDay: {},
        byHour: {},
      },
    })
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
