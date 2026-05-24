import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import env from '#start/env'
import User from '#models/user'
import OtpMailService from '#services/otp_mail_service'
import { DateTime } from 'luxon'
import { randomInt } from 'node:crypto'

type IssueOtpResult = {
  sent: boolean
  waitSeconds?: number
}

export default class OtpService {
  private mailService = new OtpMailService()

  public async issue(email: string, purpose = env.get('OTP_PURPOSE')): Promise<IssueOtpResult> {
    const normalizedEmail = email.trim().toLowerCase()
    const user = await User.query()
      .where('email', normalizedEmail)
      .where('status', 'active')
      .first()

    if (!user) {
      return { sent: false }
    }

    const cooldownSeconds = env.get('OTP_RESEND_COOLDOWN_SECONDS')
    const recentOtp = await db
      .from('otp_codes')
      .where('user_id', user.id)
      .where('purpose', purpose)
      .whereNull('used_at')
      .orderBy('created_at', 'desc')
      .first()

    if (recentOtp?.created_at) {
      const createdAt = DateTime.fromJSDate(new Date(recentOtp.created_at))
      const availableAt = createdAt.plus({ seconds: cooldownSeconds })
      const waitSeconds = Math.ceil(availableAt.diffNow('seconds').seconds)

      if (waitSeconds > 0) {
        return { sent: false, waitSeconds }
      }
    }

    const code = this.generateCode(env.get('OTP_CODE_LENGTH'))
    const expiresInMinutes = env.get('OTP_EXPIRES_IN_MINUTES')

    await db.table('otp_codes').insert({
      user_id: user.id,
      email: normalizedEmail,
      purpose,
      code_hash: await hash.use('scrypt').make(code),
      attempts: 0,
      expires_at: DateTime.now().plus({ minutes: expiresInMinutes }).toSQL(),
      created_at: new Date(),
      updated_at: new Date(),
    })

    await this.mailService.sendOtp({
      to: normalizedEmail,
      code,
      purpose,
      expiresInMinutes,
    })

    return { sent: true }
  }

  public async verify(email: string, code: string, purpose = env.get('OTP_PURPOSE')) {
    const normalizedEmail = email.trim().toLowerCase()
    const maxAttempts = env.get('OTP_MAX_ATTEMPTS')
    const otp = await db
      .from('otp_codes')
      .where('email', normalizedEmail)
      .where('purpose', purpose)
      .whereNull('used_at')
      .orderBy('created_at', 'desc')
      .first()

    if (!otp) {
      return { valid: false, reason: 'invalid' as const }
    }

    if (DateTime.fromJSDate(new Date(otp.expires_at)) <= DateTime.now()) {
      return { valid: false, reason: 'expired' as const }
    }

    if (Number(otp.attempts) >= maxAttempts) {
      return { valid: false, reason: 'locked' as const }
    }

    const isValid = await hash.use('scrypt').verify(otp.code_hash, code.trim())

    if (!isValid) {
      await db
        .from('otp_codes')
        .where('id', otp.id)
        .update({
          attempts: Number(otp.attempts) + 1,
          updated_at: new Date(),
        })

      return { valid: false, reason: 'invalid' as const }
    }

    await db.from('otp_codes').where('id', otp.id).update({
      used_at: new Date(),
      updated_at: new Date(),
    })

    const user = await User.query().where('id', otp.user_id).where('status', 'active').first()

    return { valid: true, user }
  }

  private generateCode(length: number) {
    const min = 10 ** (length - 1)
    const max = 10 ** length - 1

    return String(randomInt(min, max + 1))
  }
}
