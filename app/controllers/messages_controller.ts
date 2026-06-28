import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Message from '#models/message'
import User from '#models/user'
import TransferNotificationService from '#services/transfer_notification_service'
import {
  sendMessageValidator,
  sendGlobalCommunicationValidator,
  sendSchoolCommunicationValidator,
} from '#validators/message'
import { DateTime } from 'luxon'

export default class MessageController {
  private transferNotifications = new TransferNotificationService()
  private governanceTargets = new Set([
    'promoter',
    'preschool_director',
    'primary_director',
    'prefect',
    'studies_director',
    'pedagogical_advisor',
    'discipline_director',
    'deputy_discipline_director',
    'finance_director',
    'secretary',
    'teacher',
  ])

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

  private getFallbackSchool(user: User) {
    return {
      id: user.schoolId,
      name: 'Gestion Éducative RDC',
    }
  }

  private async getGovernanceTargetUserIds(targetRole: string, schoolId?: string, province?: string) {
    const query = db
      .from('school_staff_assignments')
      .join('users', 'school_staff_assignments.user_id', 'users.id')
      .join('schools', 'school_staff_assignments.school_id', 'schools.id')
      .where('school_staff_assignments.position', targetRole)
      .where('school_staff_assignments.is_active', true)
      .where('users.status', 'active')
      .select('users.id')

    if (schoolId) {
      query.where('school_staff_assignments.school_id', schoolId)
    }

    if (province) {
      query.where('schools.province', province)
    }

    const rows = await query
    return [...new Set(rows.map((row) => String(row.id)))]
  }

  private getRoleLabel(role?: string) {
    const labels: Record<string, string> = {
      inspection: 'Inspection',
      director: "Direction d'école",
      finance_director: 'Direction financière',
      teacher: 'Enseignant',
      parent: 'Parent',
      student: 'Élève',
      discipline_director: 'Direction de discipline',
      secretary: 'Secrétariat',
    }

    return role ? labels[role] || role : 'Destinataire'
  }

  private formatMessageNotification(message: Message) {
    const senderName = message.sender?.fullName || 'Expéditeur supprimé'
    const preview =
      message.content.length > 120 ? `${message.content.slice(0, 120)}...` : message.content
    const isIncomingTransfer = message.subject === 'Demande de transfert entrante'
    const isTransferNotification = [
      'Transfert accepté',
      'Transfert approuvé',
      'Transfert rejeté',
      'Demande de transfert annulée',
      'Motif de transfert modifié',
    ].includes(message.subject)

    return {
      id: message.id,
      type: isIncomingTransfer || isTransferNotification ? 'transfer' : 'message',
      title: message.subject,
      message: `${senderName}: ${preview}`,
      link: isIncomingTransfer
        ? '/schools/transfers/pending'
        : isTransferNotification
          ? '/schools/transfers/requests'
        : `/communication/messages/read/${message.id}`,
      read: message.isRead,
      isRead: message.isRead,
      time: message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
      createdAt: message.createdAt.toISO(),
    }
  }

  public async inboxPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const page = Number(request.input('page', 1))
    const type = request.input('type')
    const readStatus = request.input('read_status')
      || request.input('status')
    const search = String(request.input('search', '')).trim()

    const query = Message.query()
      .where('receiver_id', user.id)
      .preload('sender')
      .if(type, (inboxQuery) => inboxQuery.where('type', type))
      .if(readStatus === 'read', (inboxQuery) => inboxQuery.where('is_read', true))
      .if(readStatus === 'unread', (inboxQuery) => inboxQuery.where('is_read', false))
      .if(search, (inboxQuery) => {
        inboxQuery.where((searchQuery) => {
          searchQuery.whereILike('subject', `%${search}%`).orWhereILike('content', `%${search}%`)
        })
      })
      .orderBy('created_at', 'desc')

    const paginator = await query.paginate(page, 20)
    const stats = await db
      .from('messages')
      .where('receiver_id', user.id)
      .select(
        db.raw('count(*) as total'),
        db.raw('count(*) filter (where is_read = true) as read'),
        db.raw('count(*) filter (where is_read = false) as unread'),
        db.raw("count(*) filter (where created_at >= date_trunc('month', current_date)) as this_month"),
        db.raw('count(distinct sender_id) as senders')
      )
      .first()

    return view.render('communication/messages/inbox', {
      school: this.getFallbackSchool(user),
      messages: paginator.all().map((message) => ({
        id: message.id,
        senderName: message.sender?.fullName || 'Expéditeur supprimé',
        senderRole: this.getRoleLabel(message.sender?.role),
        type: message.type,
        isRead: message.isRead,
        subject: message.subject,
        preview: message.content.length > 120 ? `${message.content.slice(0, 120)}...` : message.content,
        time: message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
        hasAttachment: message.hasAttachment,
      })),
      stats: {
        total: Number(stats?.total || 0),
        read: Number(stats?.read || 0),
        unread: Number(stats?.unread || 0),
        thisMonth: Number(stats?.this_month || 0),
        senders: Number(stats?.senders || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/communication/messages/inbox',
    })
  }

  public async readPage({ auth, params, view }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .preload('sender')
      .preload('receiver')
      .firstOrFail()

    if (message.receiverId === user.id && !message.isRead) {
      message.isRead = true
      message.readAt = DateTime.now()
      await message.save()
    }

    return view.render('communication/messages/read', {
      school: this.getFallbackSchool(user),
      message: {
        id: message.id,
        receiverId: message.receiverId,
        subject: message.subject,
        content: message.content,
        type: message.type,
        canEdit: message.senderId === user.id,
        urgent: false,
        senderName: message.sender?.fullName || 'Expéditeur supprimé',
        senderRole: this.getRoleLabel(message.sender?.role),
        receiverName: message.receiver?.fullName,
        receiverRole: this.getRoleLabel(message.receiver?.role),
        date: message.createdAt.toFormat('dd/MM/yyyy'),
        time: message.createdAt.toFormat('HH:mm'),
        readAt: message.readAt?.toFormat('dd/MM/yyyy HH:mm') || '-',
        attachments: [],
        ccList: null,
        parentMessageId: null,
      },
    })
  }

  public async editPage({ auth, params, view }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where('sender_id', user.id)
      .preload('receiver')
      .firstOrFail()

    return view.render('communication/messages/edit', {
      school: this.getFallbackSchool(user),
      message: {
        id: message.id,
        receiverId: message.receiverId,
        subject: message.subject,
        content: message.content,
        type: message.type,
        receiverName: message.receiver?.fullName || 'Destinataire supprimé',
        receiverRole: this.getRoleLabel(message.receiver?.role),
        time: message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
        isRead: message.isRead,
      },
    })
  }

  public async updateWebMessage({ auth, params, request, response, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(sendMessageValidator)
    const message = await Message.query()
      .where('id', params.id)
      .where('sender_id', user.id)
      .firstOrFail()

    message.subject = payload.subject
    message.content = payload.content
    message.type = payload.type || message.type
    await message.save()

    session.flash('success', 'Message modifié avec succès. La mise à jour est visible chez le destinataire.')
    return response.redirect(`/communication/messages/read/${message.id}`)
  }

  public async deleteWebMessage({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .firstOrFail()

    await message.delete()

    return response.ok({ success: true, message: 'Message supprimé' })
  }

  public async markAllReadWeb({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query().where('receiver_id', user.id).where('is_read', false).update({
      is_read: true,
      read_at: DateTime.now().toSQL(),
    })

    return response.ok({ success: true })
  }

  public async notificationsPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const type = request.input('type')
    const status = request.input('status')
    const startDate = request.input('start_date')
    const endDate = request.input('end_date')

    const query = Message.query()
      .where('receiver_id', user.id)
      .preload('sender')
      .if(type && type !== 'message', (notificationQuery) => {
        notificationQuery.whereRaw('1 = 0')
      })
      .if(status === 'read', (notificationQuery) => notificationQuery.where('is_read', true))
      .if(status === 'unread', (notificationQuery) => notificationQuery.where('is_read', false))
      .if(startDate, (notificationQuery) => notificationQuery.where('created_at', '>=', startDate))
      .if(endDate, (notificationQuery) => notificationQuery.where('created_at', '<=', `${endDate} 23:59:59`))
      .orderBy('created_at', 'desc')

    const messages = await query.limit(100)
    const stats = await db
      .from('messages')
      .where('receiver_id', user.id)
      .select(
        db.raw('count(*) as total'),
        db.raw('count(*) filter (where is_read = false) as unread'),
        db.raw("count(*) filter (where created_at >= date_trunc('month', current_date)) as this_month"),
        db.raw("count(*) filter (where created_at >= date_trunc('week', current_date)) as this_week")
      )
      .first()

    return view.render('communication/notifications/index', {
      school: this.getFallbackSchool(user),
      notifications: messages.map((message) => this.formatMessageNotification(message)),
      stats: {
        total: Number(stats?.total || 0),
        unread: Number(stats?.unread || 0),
        thisMonth: Number(stats?.this_month || 0),
        thisWeek: Number(stats?.this_week || 0),
      },
      pagination: { total: messages.length, perPage: 100, currentPage: 1, lastPage: 1, from: 1, to: messages.length },
      url: '/communication/notifications',
    })
  }

  public async notificationsApi({ auth, response }: HttpContext) {
    const user = auth.user!
    await this.transferNotifications.syncPendingForDirector(user)

    const messages = await Message.query()
      .where('receiver_id', user.id)
      .preload('sender')
      .orderBy('created_at', 'desc')
      .limit(10)

    const unreadCountResult = await db
      .from('messages')
      .where('receiver_id', user.id)
      .where('is_read', false)
      .count('* as total')
      .first()

    return response.ok({
      success: true,
      notifications: messages.map((message) => this.formatMessageNotification(message)),
      unreadCount: Number(unreadCountResult?.total || 0),
    })
  }

  public async markNotificationRead({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where('receiver_id', user.id)
      .firstOrFail()

    if (!message.isRead) {
      message.isRead = true
      message.readAt = DateTime.now()
      await message.save()
    }

    return response.ok({ success: true })
  }

  public async markAllNotificationsRead({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query().where('receiver_id', user.id).where('is_read', false).update({
      is_read: true,
      read_at: DateTime.now().toSQL(),
    })

    return response.ok({ success: true })
  }

  public async deleteAllNotifications({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query().where('receiver_id', user.id).where('is_read', false).update({
      is_read: true,
      read_at: DateTime.now().toSQL(),
    })

    return response.ok({ success: true })
  }

  public async sentPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const page = Number(request.input('page', 1))
    const type = request.input('type')
    const readStatus = request.input('read_status')
    const search = String(request.input('search', '')).trim()

    const query = Message.query()
      .where('sender_id', user.id)
      .preload('receiver')
      .if(type, (sentQuery) => sentQuery.where('type', type))
      .if(readStatus === 'read', (sentQuery) => sentQuery.where('is_read', true))
      .if(readStatus === 'unread', (sentQuery) => sentQuery.where('is_read', false))
      .if(search, (sentQuery) => {
        sentQuery.where((searchQuery) => {
          searchQuery
            .whereILike('subject', `%${search}%`)
            .orWhereILike('content', `%${search}%`)
        })
      })
      .orderBy('created_at', 'desc')

    const paginator = await query.paginate(page, 20)
    const stats = await db
      .from('messages')
      .where('sender_id', user.id)
      .select(
        db.raw('count(*) as total'),
        db.raw('count(*) filter (where is_read = true) as read'),
        db.raw('count(*) filter (where is_read = false) as unread'),
        db.raw('count(distinct receiver_id) as recipients')
      )
      .first()

    return view.render('communication/messages/sent', {
      school: this.getFallbackSchool(user),
      messages: paginator.all().map((message) => ({
        id: message.id,
        receiverName: message.receiver?.fullName || 'Destinataire supprimé',
        receiverRole: this.getRoleLabel(message.receiver?.role),
        type: message.type,
        isRead: message.isRead,
        subject: message.subject,
        preview: message.content.length > 120 ? `${message.content.slice(0, 120)}...` : message.content,
        time: message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
        readAt: message.readAt?.toFormat('dd/MM/yyyy HH:mm'),
        hasAttachment: message.hasAttachment,
      })),
      stats: {
        total: Number(stats?.total || 0),
        read: Number(stats?.read || 0),
        unread: Number(stats?.unread || 0),
        recipients: Number(stats?.recipients || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/communication/messages/sent',
    })
  }

  public async composePage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const replyTo = request.input('reply_to')
    let replyMessage: Message | null = null

    if (replyTo) {
      replyMessage = await Message.query()
        .where('id', replyTo)
        .where((messageQuery) => {
          messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
        })
        .preload('sender')
        .preload('receiver')
        .first()
    }

    const recipientsQuery = User.query()
      .where('status', 'active')
      .whereNot('id', user.id)
      .orderBy('first_name', 'asc')
      .orderBy('last_name', 'asc')

    if (user.role !== 'inspection' && user.schoolId) {
      recipientsQuery.where((recipientQuery) => {
        recipientQuery.where('school_id', user.schoolId!).orWhere('role', 'inspection')
      })
    }

    const recipients = await recipientsQuery
    const toRecipient = (recipient: User) => ({
      id: recipient.id,
      name: recipient.fullName,
      subject: this.getRoleLabel(recipient.role),
    })
    const replyReceiverId = replyMessage
      ? replyMessage.senderId === user.id
        ? replyMessage.receiverId
        : replyMessage.senderId
      : ''
    const replySubject = replyMessage
      ? replyMessage.subject.startsWith('Re: ')
        ? replyMessage.subject
        : `Re: ${replyMessage.subject}`
      : ''

    return view.render('communication/messages/compose', {
      school: this.getFallbackSchool(user),
      inspectors: recipients.filter((recipient) => recipient.role === 'inspection').map(toRecipient),
      directors: recipients.filter((recipient) => recipient.role === 'director').map(toRecipient),
      teachers: recipients.filter((recipient) => recipient.role === 'teacher').map(toRecipient),
      parents: recipients.filter((recipient) => recipient.role === 'parent').map(toRecipient),
      selectedReceiverId: request.input('receiver_id') || request.input('parent_id') || replyReceiverId || '',
      subject: request.input('subject', replySubject),
      content: replyMessage
        ? `\n\n--- Message original de ${replyMessage.sender?.fullName || 'l expediteur'} ---\n${replyMessage.content}`
        : '',
    })
  }

  public async redirectSendToCompose({ request, response }: HttpContext) {
    const params = new URLSearchParams()
    const receiverId = request.input('receiver_id') || request.input('parent_id')
    const subject = request.input('subject')

    if (receiverId) params.set('receiver_id', receiverId)
    if (subject) params.set('subject', subject)

    const queryString = params.toString()
    return response.redirect(`/communication/messages/compose${queryString ? `?${queryString}` : ''}`)
  }

  public async sendWebMessage({ request, auth, response, session }: HttpContext) {
    const payload = await request.validateUsing(sendMessageValidator)
    const user = auth.user!
    const receiver = await User.findOrFail(payload.receiverId)

    await Message.create({
      senderId: user.id,
      receiverId: payload.receiverId,
      schoolId: user.schoolId || receiver.schoolId,
      subject: payload.subject,
      content: payload.content,
      type: payload.type || 'general',
      isRead: false,
      hasAttachment: false,
    })

    session.flash('success', 'Message envoyé avec succès.')
    return response.redirect('/communication/messages/sent')
  }

  /**
   * Envoyer un message direct
   */
  public async sendMessage({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(sendMessageValidator)
    const user = auth.user!

    const message = await Message.create({
      senderId: user.id,
      receiverId: payload.receiverId,
      subject: payload.subject,
      content: payload.content,
      type: payload.type || 'general',
      isRead: false,
    })

    return response.created({
      success: true,
      message: 'Message envoyé avec succès',
      sentMessage: message,
    })
  }

  /**
   * Obtenir mes messages (Boîte de réception)
   */
  public async getMessages({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const type = request.input('type')

    const query = Message.query()
      .where('receiver_id', user.id)
      .preload('sender')
      .orderBy('created_at', 'desc')

    if (type) {
      query.where('type', type)
    }

    const messages = await query.paginate(page, limit)

    return response.ok({
      success: true,
      messages,
    })
  }

  /**
   * Obtenir les conversations (Groupées par utilisateur)
   * Optimisé pour Adonis v6
   */
  public async getConversations({ auth, response }: HttpContext) {
    const user = auth.user!

    // Utilisation de db.rawQuery pour la performance sur les agrégats
    const result = await db.rawQuery(
      `
        SELECT 
          CASE 
            WHEN m.sender_id = ? THEN m.receiver_id
            ELSE m.sender_id
          END as user_id,
          MAX(m.created_at) as last_message_date,
          COUNT(CASE WHEN m.receiver_id = ? AND m.is_read = false THEN 1 END) as unread_count
        FROM messages m
        WHERE m.sender_id = ? OR m.receiver_id = ?
        GROUP BY user_id
        ORDER BY last_message_date DESC
      `,
      [user.id, user.id, user.id, user.id]
    )

    const conversations = await Promise.all(
      result.rows.map(async (conv: any) => {
        const otherUser = await User.find(conv.user_id)
        const lastMessage = await Message.query()
          .where((q) => q.where('sender_id', user.id).where('receiver_id', conv.user_id))
          .orWhere((q) => q.where('sender_id', conv.user_id).where('receiver_id', user.id))
          .orderBy('created_at', 'desc')
          .first()

        return {
          user: {
            id: otherUser?.id,
            name: otherUser?.fullName || 'Inconnu',
            role: otherUser?.role,
          },
          lastMessage,
          lastMessageDate: conv.last_message_date,
          unreadCount: Number.parseInt(conv.unread_count),
        }
      })
    )

    return response.ok({
      success: true,
      conversations,
    })
  }

  /**
   * Obtenir une conversation spécifique et marquer comme lu
   */
  public async getConversation({ params, auth, request, response }: HttpContext) {
    const user = auth.user!
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const messages = await Message.query()
      .where((q) => q.where('sender_id', user.id).where('receiver_id', params.userId))
      .orWhere((q) => q.where('sender_id', params.userId).where('receiver_id', user.id))
      .orderBy('created_at', 'asc')
      .paginate(page, limit)

    // Marquer comme lu
    await Message.query()
      .where('sender_id', params.userId)
      .where('receiver_id', user.id)
      .where('is_read', false)
      .update({
        is_read: true,
        read_at: DateTime.now().toSQL(),
      })

    return response.ok({
      success: true,
      messages,
    })
  }

  /**
   * Communication globale (Niveau Inspection / National)
   */
  public async sendGlobalCommunication({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(sendGlobalCommunicationValidator)
    const user = auth.user!

    if (user.role !== 'inspection') {
      return response.forbidden({
        success: false,
        message: "Seule l'inspection peut envoyer des communications globales",
      })
    }

    const query = User.query().where('status', 'active').whereNotNull('schoolId')

    if (payload.targetRole && this.governanceTargets.has(payload.targetRole)) {
      const targetUserIds = await this.getGovernanceTargetUserIds(
        payload.targetRole,
        undefined,
        payload.targetProvince
      )
      query.whereIn('id', targetUserIds)
    } else if (payload.targetRole && payload.targetRole !== 'all') {
      query.where('role', payload.targetRole)
    }

    if (payload.targetProvince) {
      query.whereHas('school', (s) => s.where('province', payload.targetProvince!))
    }

    const targetUsers = await query

    // Création massive via Lucid
    const messagesData = targetUsers.map((target) => ({
      senderId: user.id,
      receiverId: target.id,
      subject: payload.subject,
      content: payload.content,
      type: 'official' as const,
      isGlobal: true,
    }))

    await Message.createMany(messagesData)

    return response.created({
      success: true,
      message: `Communication envoyée à ${messagesData.length} destinataires`,
    })
  }

  /**
   * Communication ciblée sur une école
   */
  public async sendSchoolCommunication({ request, auth, response, session }: HttpContext) {
    const payload = await request.validateUsing(sendSchoolCommunicationValidator)
    const user = auth.user!

    if (user.role !== 'inspection' && user.schoolId !== payload.schoolId) {
      return response.forbidden({
        success: false,
        message: 'Non autorisé à envoyer une communication à cette école',
      })
    }

    const targetUsersQuery = User.query()
      .where('school_id', payload.schoolId)
      .where('status', 'active')

    if (payload.targetRole && this.governanceTargets.has(payload.targetRole)) {
      const targetUserIds = await this.getGovernanceTargetUserIds(payload.targetRole, payload.schoolId)
      targetUsersQuery.whereIn('id', targetUserIds)
    } else if (payload.targetRole && payload.targetRole !== 'all') {
      targetUsersQuery.where('role', payload.targetRole)
    }

    const targetUsers = await targetUsersQuery

    const messagesData = targetUsers.map((target) => ({
      senderId: user.id,
      receiverId: target.id,
      subject: payload.subject,
      content: payload.content,
      type: 'official' as const,
      schoolId: payload.schoolId,
    }))

    await Message.createMany(messagesData)

    if (request.header('accept')?.includes('text/html')) {
      session.flash('success', `Communication envoyée à ${messagesData.length} membre(s) de l'école.`)
      return response.redirect('/inspection/communications/history')
    }

    return response.created({
      success: true,
      message: `Communication envoyée à ${messagesData.length} membres de l'école`,
    })
  }

  /**
   * Marquer des messages comme lus (Bulk)
   */
  public async markAsRead({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const { messageIds } = request.only(['messageIds']) // Supposant un tableau d'IDs

    await Message.query().whereIn('id', messageIds).where('receiver_id', user.id).update({
      is_read: true,
      read_at: DateTime.now().toSQL(),
    })

    return response.ok({ success: true })
  }
}
