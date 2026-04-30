import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import { randomBytes } from 'node:crypto'
import { DateTime } from 'luxon'
import School from '#models/school'
import User from '#models/user'
import { changePasswordValidator, loginValidator, updateProfileValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Connexion utilisateur via la session `web`.
   */
  public async login({ auth, request, response }: HttpContext) {
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

  /**
   * Mot de passe oublie.
   */
  public async forgotPassword({ request, response }: HttpContext) {
    const email = request.input('email')
    const user = email ? await User.findBy('email', email) : null

    if (user) {
      const resetToken = randomBytes(32).toString('hex')

      return response.ok({
        success: true,
        message:
          'Si votre email existe dans notre systeme, vous recevrez un lien de reinitialisation',
        data: {
          resetToken,
        },
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
    const token = request.input('token')
    const newPassword = request.input('newPassword')
    const newPasswordConfirmation = request.input('newPasswordConfirmation')

    if (!token || !newPassword || !newPasswordConfirmation) {
      return response.badRequest({
        success: false,
        message: 'Token et nouveau mot de passe requis',
      })
    }

    if (newPassword !== newPasswordConfirmation) {
      return response.badRequest({
        success: false,
        message: 'La confirmation du mot de passe ne correspond pas',
      })
    }

    return response.notImplemented({
      success: false,
      message: 'La reinitialisation de mot de passe n est pas encore implementee',
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
