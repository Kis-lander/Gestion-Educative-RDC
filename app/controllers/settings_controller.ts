import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { edgePageContext } from '#start/view_context'
import { canUseAppLanguage, resolveAppLanguage } from '#services/language_service'

type SettingsMap = Record<string, any>

const roleLabels: Record<string, string> = {
  inspection: 'Inspection pédagogique',
  director: "Direction d'école",
  finance_director: 'Direction financière',
  discipline_director: 'Direction de discipline',
  teacher: 'Enseignant',
  parent: 'Parent',
  student: 'Élève',
}

export default class SettingsController {
  private defaultsFor(role?: string, email?: string): SettingsMap {
    const isFinancial = ['director', 'finance_director', 'parent'].includes(role || '')
    const isAcademic = ['director', 'teacher', 'parent', 'student'].includes(role || '')
    const isDiscipline = ['director', 'discipline_director', 'parent', 'student'].includes(role || '')

    return {
      displayName: '',
      bio: '',
      website: '',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      itemsPerPage: 25,
      defaultExportFormat: 'pdf',
      compressExports: false,
      emailEnabled: true,
      pushEnabled: true,
      dailyDigest: false,
      weeklyDigest: true,
      notificationEmail: email || '',
      notifyMessages: true,
      notifyGrades: isAcademic,
      notifyEvents: true,
      notifyPayments: isFinancial,
      notifyDiscipline: isDiscipline,
      notifySystem: ['director', 'finance_director', 'discipline_director'].includes(role || ''),
      notifyReminders: true,
      quietStart: '22:00',
      quietEnd: '07:00',
      quietEnabled: false,
      profileVisibility: role === 'student' ? 'teachers' : 'school',
      emailVisibility: 'school',
      phoneVisibility: 'school',
      dataCollection: true,
      activityTracking: true,
      timezone: 'Africa/Kinshasa',
      currency: 'CDF',
      firstDayOfWeek: 'monday',
    }
  }

  private deserialize(value: string | null) {
    if (value === null) return null

    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  private async getSettings(userId: string, defaults: SettingsMap) {
    const rows = await db.from('user_settings').where('user_id', userId).select('key', 'value')

    return rows.reduce(
      (settings, row) => {
        settings[row.key] = this.deserialize(row.value)
        return settings
      },
      { ...defaults }
    )
  }

  private async saveSettings(userId: string, group: string, values: SettingsMap) {
    const now = new Date()

    for (const [key, value] of Object.entries(values)) {
      const payload = {
        group,
        value: JSON.stringify(value),
        updated_at: now,
      }
      const existing = await db
        .from('user_settings')
        .where('user_id', userId)
        .where('key', key)
        .first()

      if (existing) {
        await db.from('user_settings').where('id', existing.id).update(payload)
      } else {
        await db.table('user_settings').insert({
          id: randomUUID(),
          user_id: userId,
          key,
          created_at: now,
          ...payload,
        })
      }
    }
  }

  private splitDisplayName(displayName: string) {
    const parts = displayName.trim().split(/\s+/).filter(Boolean)

    return {
      firstName: parts[0] || '',
      lastName: parts[1] || '',
      postnom: parts.length > 2 ? parts.slice(2).join(' ') : '',
    }
  }

  private async pageContext(ctx: HttpContext, overrides: Record<string, any> = {}) {
    const base = await edgePageContext(ctx, overrides)
    const user = ctx.auth.getUserOrFail()

    return {
      ...base,
      school: {
        ...base.school,
        name: base.school?.name || 'Gestion Éducative RDC',
      },
      auth: {
        user: {
          ...user.toJSON(),
          fullName: user.fullName,
          roleLabel: roleLabels[user.role] || user.role,
        },
      },
    }
  }

  public async generalPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const defaults = this.defaultsFor(user.role, user.email)
    const settings = await this.getSettings(user.id, {
      ...defaults,
      displayName: user.fullName,
    })
    settings.displayName = user.fullName
    const now = DateTime.now().setZone(String(settings.timezone || 'Africa/Kinshasa'))

    return ctx.view.render(
      'settings/general',
      await this.pageContext(ctx, {
        settings,
        currentDate: now.toFormat('dd/MM/yyyy'),
        currentTime: now.toFormat(settings.timeFormat === '12h' ? 'hh:mm a' : 'HH:mm'),
      })
    )
  }

  public async saveGeneral({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()
    const displayName = String(request.input('display_name', user.fullName)).trim()
    const website = String(request.input('website', '') || '').trim()
    const displayNameParts = displayName.split(/\s+/).filter(Boolean)

    if (displayName && displayNameParts.length < 3) {
      session.flash('error', 'Le nom doit contenir trois parties : prénom, nom et postnom.')
      return response.redirect('/settings/general')
    }

    if (displayName) {
      const nameParts = this.splitDisplayName(displayName)
      user.firstName = nameParts.firstName
      user.postnom = nameParts.postnom
      user.lastName = nameParts.lastName
      await user.save()
      await auth.use('web').login(user)
    }

    await this.saveSettings(user.id, 'general', {
      displayName: displayName || user.fullName,
      bio: request.input('bio', ''),
      website,
      dateFormat: request.input('date_format', 'DD/MM/YYYY'),
      timeFormat: request.input('time_format', '24h'),
      itemsPerPage: Number(request.input('items_per_page', 25)),
      defaultExportFormat: request.input('default_export_format', 'pdf'),
      compressExports: Boolean(request.input('compress_exports')),
    })

    session.flash('success', 'Paramètres enregistrés.')
    return response.redirect('/settings/general')
  }

  public async resetGeneral({ auth, response }: HttpContext) {
    await db.from('user_settings').where('user_id', auth.getUserOrFail().id).where('group', 'general').delete()
    return response.ok({ success: true })
  }

  public async accountPage(ctx: HttpContext) {
    return ctx.view.render(
      'settings/account',
      await this.pageContext(ctx, {
        lastPasswordChange: 'Non disponible',
        activeSessions: [
          {
            id: 'current',
            device: 'desktop',
            deviceName: 'Session actuelle',
            lastActivity: 'Maintenant',
            isCurrent: true,
          },
        ],
      })
    )
  }

  public async languagePage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const settings = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))
    const now = DateTime.now().setZone(String(settings.timezone || 'Africa/Kinshasa'))

    return ctx.view.render(
      'settings/language',
      await this.pageContext(ctx, {
        regional: {
          timezone: settings.timezone || 'Africa/Kinshasa',
          currency: settings.currency || 'CDF',
          firstDayOfWeek: settings.firstDayOfWeek || 'monday',
        },
        previewDate: now.toFormat('dd/MM/yyyy'),
        previewTime: now.toFormat('HH:mm'),
      })
    )
  }

  public async notificationsPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const settings = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))

    return ctx.view.render('settings/notifications', await this.pageContext(ctx, { settings }))
  }

  public async saveNotifications({ auth, request, response, session }: HttpContext) {
    const user = auth.getUserOrFail()

    await this.saveSettings(user.id, 'notifications', {
      emailEnabled: Boolean(request.input('email_enabled')),
      pushEnabled: Boolean(request.input('push_enabled')),
      dailyDigest: Boolean(request.input('daily_digest')),
      weeklyDigest: Boolean(request.input('weekly_digest')),
      notificationEmail: request.input('notification_email', user.email),
    })

    session.flash('success', 'Préférences de notification enregistrées.')
    return response.redirect('/settings/notifications')
  }

  public async saveNotificationTypes({ auth, request, response }: HttpContext) {
    await this.saveSettings(auth.getUserOrFail().id, 'notifications', {
      notifyMessages: Boolean(request.input('messages')),
      notifyGrades: Boolean(request.input('grades')),
      notifyEvents: Boolean(request.input('events')),
      notifyPayments: Boolean(request.input('payments')),
      notifyDiscipline: Boolean(request.input('discipline')),
      notifySystem: Boolean(request.input('system')),
      notifyReminders: Boolean(request.input('reminders')),
    })

    return response.ok({ success: true })
  }

  public async saveQuietHours({ auth, request, response }: HttpContext) {
    await this.saveSettings(auth.getUserOrFail().id, 'notifications', {
      quietStart: request.input('start', '22:00'),
      quietEnd: request.input('end', '07:00'),
      quietEnabled: Boolean(request.input('enabled')),
    })

    return response.ok({ success: true })
  }

  public async privacyPage(ctx: HttpContext) {
    const user = ctx.auth.getUserOrFail()
    const privacy = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))
    const blockedRows = await db
      .from('user_settings')
      .where('user_id', user.id)
      .where('key', 'blockedUsers')
      .first()
    const blockedUsers = (this.deserialize(blockedRows?.value || '[]') || []) as any[]

    return ctx.view.render(
      'settings/privacy',
      await this.pageContext(ctx, {
        privacy,
        blockedUsers,
      })
    )
  }

  public async saveVisibility({ auth, request, response }: HttpContext) {
    await this.saveSettings(auth.getUserOrFail().id, 'privacy', {
      profileVisibility: request.input('profile', 'school'),
      emailVisibility: request.input('email', 'school'),
      phoneVisibility: request.input('phone', 'school'),
      dataCollection: Boolean(request.input('dataCollection')),
      activityTracking: Boolean(request.input('activityTracking')),
    })

    return response.ok({ success: true })
  }

  public async exportData({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const settings = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))

    response.header('Content-Type', 'application/json')
    response.header('Content-Disposition', `attachment; filename="mes-donnees-${user.id}.json"`)
    return response.send({ user: user.toJSON(), settings })
  }

  public async deleteData({ auth, response }: HttpContext) {
    await db.from('user_settings').where('user_id', auth.getUserOrFail().id).delete()
    return response.ok({ success: true })
  }

  public async blockUser({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const identifier = String(request.input('identifier', '')).trim()
    if (!identifier) return response.badRequest({ success: false, message: 'Utilisateur requis' })

    const blockedUser = await db
      .from('users')
      .whereILike('email', identifier)
      .orWhereILike('first_name', identifier)
      .orWhereILike('last_name', identifier)
      .first()

    if (!blockedUser || blockedUser.id === user.id) {
      return response.badRequest({ success: false, message: 'Utilisateur introuvable' })
    }

    const current = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))
    const blockedUsers = Array.isArray(current.blockedUsers) ? current.blockedUsers : []
    const next = [
      ...blockedUsers.filter((blocked: any) => blocked.id !== blockedUser.id),
      {
        id: blockedUser.id,
        name: [blockedUser.first_name, blockedUser.last_name].filter(Boolean).join(' '),
        email: blockedUser.email,
      },
    ]

    await this.saveSettings(user.id, 'privacy', { blockedUsers: next })
    return response.ok({ success: true })
  }

  public async unblockUser({ auth, params, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const current = await this.getSettings(user.id, this.defaultsFor(user.role, user.email))
    const blockedUsers = Array.isArray(current.blockedUsers) ? current.blockedUsers : []

    await this.saveSettings(user.id, 'privacy', {
      blockedUsers: blockedUsers.filter((blocked: any) => blocked.id !== params.id),
    })

    return response.ok({ success: true })
  }

  public async updateEmail({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const email = String(request.input('email', '')).trim().toLowerCase()

    if (!email || !email.includes('@')) {
      return response.badRequest({ success: false, message: 'Adresse email invalide' })
    }

    const existing = await db.from('users').where('email', email).whereNot('id', user.id).first()
    if (existing) return response.conflict({ success: false, message: 'Cette adresse est déjà utilisée' })

    user.email = email
    await user.save()
    return response.ok({ success: true })
  }

  public async revokeSession({ response }: HttpContext) {
    return response.ok({ success: true })
  }

  public async revokeAllSessions({ response }: HttpContext) {
    return response.ok({ success: true })
  }

  public async deactivateAccount({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    user.status = 'inactive'
    await user.save()
    await auth.use('web').logout()

    return response.ok({ success: true })
  }

  public async deleteAccount({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await auth.use('web').logout()
    await db.from('users').where('id', user.id).delete()

    return response.ok({ success: true })
  }

  public async saveLanguage({ auth, request, session, response }: HttpContext) {
    const language = String(request.input('language', 'fr'))

    if (!canUseAppLanguage(language)) {
      return response.badRequest({ success: false, message: 'Langue non prise en charge' })
    }

    const user = auth.user
    if (user) {
      user.preferredLanguage = language
      await user.save()
    }

    session.put('locale', language)
    return response.ok({ success: true, language })
  }

  public async getLanguage({ auth, session, response }: HttpContext) {
    const language = auth.user
      ? await resolveAppLanguage({ auth, session })
      : session.get('locale') || 'fr'

    return response.ok({ success: true, language })
  }

  public async saveRegional({ auth, request, session, response }: HttpContext) {
    const regional = {
      timezone: request.input('timezone', 'Africa/Kinshasa'),
      currency: request.input('currency', 'CDF'),
      firstDayOfWeek: request.input('firstDayOfWeek', 'monday'),
    }

    if (auth.user) {
      await this.saveSettings(auth.user.id, 'regional', regional)
    }

    session.put('regionalSettings', regional)
    return response.ok({ success: true })
  }
}
