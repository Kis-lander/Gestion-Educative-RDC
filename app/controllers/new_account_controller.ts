import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import vine from '@vinejs/vine'
import User from '#models/user'
import Student from '#models/student'
import Teacher from '#models/teacher'
import Parent from '#models/parent'
import { getDefaultAppLanguage } from '#services/language_service'
import {
  createUserAccountValidator,
  createBulkAccountsValidator,
  suspendAccountValidator,
} from '#validators/new_account'
import { DateTime } from 'luxon'

const webSignupValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().regex(/^\S+\s+\S+\s+.+$/),
    email: vine.string().trim().email().unique({ table: 'users', column: 'email' }),
    role: vine.enum(['inspection']),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'passwordConfirmation' }),
  })
)

export default class NewAccountController {
  private splitFullName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean)

    return {
      firstName: parts[0] || 'A completer',
      lastName: parts[1] || 'A completer',
      postnom: parts.length > 2 ? parts.slice(2).join(' ') : 'A completer',
    }
  }

  public async create({ view, session }: HttpContext) {
    if (!session.get('locale')) {
      session.put('locale', await getDefaultAppLanguage())
    }

    return view.render('auth/signup', {
      appLanguage: session.get('locale'),
    })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(webSignupValidator)
    const name = this.splitFullName(payload.fullName)

    await User.create({
      email: payload.email,
      password: payload.password,
      firstName: name.firstName,
      postnom: name.postnom,
      lastName: name.lastName,
      role: payload.role,
      status: 'active',
      schoolId: null as unknown as string,
    })

    session.flash('success', 'Compte cree avec succes')

    return response.redirect('/login')
  }

  /**
   * Créer un compte utilisateur individuel
   */
  public async createUserAccount({ request, response }: HttpContext) {
    // Le payload contient directement les champs (email, firstName, etc.)
    const payload = await request.validateUsing(createUserAccountValidator)

    const tempPassword = this.generateTemporaryPassword()

    const result = await db.transaction(async (trx) => {
      const user = new User()
      user.useTransaction(trx)

      user.email = payload.email
      user.password = tempPassword
      user.firstName = payload.firstName
      user.postnom = payload.postnom
      user.lastName = payload.lastName
      user.phone = payload.phone || null
      user.role = payload.role
      user.schoolId = payload.schoolId
      user.status = 'active'
      user.mustChangePassword = true

      await user.save()

      let profile = null
      // Logique de création de profil selon le rôle défini dans le validateur
      if (payload.role === 'student') {
        profile = await this.createStudentProfile(user.id, payload.schoolId, undefined, trx)
      } else if (payload.role === 'teacher') {
        profile = await this.createTeacherProfile(user.id, payload.schoolId, trx)
      } else if (payload.role === 'parent') {
        profile = await this.createParentProfile(user.id, trx)
      }

      return { user, profile }
    })

    if (payload.sendEmail) {
      await this.sendWelcomeEmail(result.user.email, tempPassword, result.user.role)
    }

    return response.created({
      success: true,
      message: 'Compte créé avec succès',
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        temporaryPassword: tempPassword,
      },
      profile: result.profile,
    })
  }

  /**
   * Créer des comptes en masse
   */
  public async createBulkAccounts({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createBulkAccountsValidator)

    const results = { created: 0, failed: 0, errors: [] as any[] }

    for (const account of payload.accounts) {
      try {
        await db.transaction(async (trx) => {
          const tempPassword = payload.autoGeneratePassword
            ? this.generateTemporaryPassword()
            : 'password123'

          const user = await User.create(
            {
              email: account.email,
              password: tempPassword,
              firstName: account.firstName,
              postnom: account.postnom,
              lastName: account.lastName,
              role: account.role,
              schoolId: payload.schoolId,
              status: 'active',
              mustChangePassword: true,
            },
            { client: trx }
          )

          if (account.role === 'student' && account.classId) {
            await this.createStudentProfile(user.id, payload.schoolId, account.classId, trx)
          } else if (account.role === 'teacher') {
            await this.createTeacherProfile(user.id, payload.schoolId, trx)
          }
        })
        results.created++
      } catch (error: any) {
        results.failed++
        results.errors.push({ email: account.email, error: error.message })
      }
    }

    return response.created({
      success: true,
      message: `${results.created} comptes créés, ${results.failed} échecs`,
      results,
    })
  }

  /**
   * Suspendre un compte
   */
  public async suspendAccount({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(suspendAccountValidator)

    const user = await User.findOrFail(payload.userId)

    await db.transaction(async (trx) => {
      user.status = 'suspended'
      await user.save()

      await trx.table('account_suspensions').insert({
        user_id: user.id,
        reason: payload.reason,
        duration: payload.duration || null,
        suspended_at: DateTime.now().toSQL(),
        suspended_by: auth.user?.id,
      })
    })

    if (payload.sendNotification) {
      await this.sendAccountSuspensionEmail(user.email, payload.reason)
    }

    return response.ok({ success: true, message: 'Compte suspendu' })
  }

  // ... (Garder les méthodes privées inchangées)
  private generateTemporaryPassword(): string {
    return Math.random().toString(36).slice(-10) + '!'
  }

  private async createStudentProfile(
    userId: string,
    schoolId: string,
    classId?: string,
    trx?: any
  ) {
    const student = new Student()
    if (trx) student.useTransaction(trx)
    student.userId = userId
    student.schoolId = schoolId
    student.classId = classId || null
    student.registrationNumber = `STU-${Date.now()}`
    student.academicStatus = 'active'
    await student.save()
    return student
  }

  private async createTeacherProfile(userId: string, schoolId: string, trx?: any) {
    const teacher = new Teacher()
    if (trx) teacher.useTransaction(trx)
    teacher.userId = userId
    teacher.schoolId = schoolId
    teacher.employeeNumber = `TCH-${Date.now()}`
    await teacher.save()
    return teacher
  }

  private async createParentProfile(userId: string, trx?: any) {
    const parent = new Parent()
    if (trx) parent.useTransaction(trx)
    parent.userId = userId
    await parent.save()
    return parent
  }

  private async sendWelcomeEmail(email: string, _pass: string, _role: string) {
    console.log(`Email de bienvenue envoyé à ${email}`)
  }

  private async sendAccountSuspensionEmail(email: string, _reason: string) {
    console.log(`Email de suspension envoyé à ${email}`)
  }
}
