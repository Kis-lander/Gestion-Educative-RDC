import { type HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import Message from '#models/message'
import User from '#models/user'
import TransferNotificationService from '#services/transfer_notification_service'
import { isSchoolWidePosition, positionLabel } from '#services/school_governance_service'
import {
  sendMessageValidator,
  sendGlobalCommunicationValidator,
  sendSchoolCommunicationValidator,
} from '#validators/message'
import { DateTime } from 'luxon'
import { randomBytes } from 'node:crypto'
import { basename, extname, join, parse } from 'node:path'

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

  private getMessagePreview(content: string, length = 120) {
    return content.length > length ? `${content.slice(0, length)}...` : content
  }

  private async getAssignedRoleLabel(user?: User | null) {
    if (!user) return 'Compte supprimé'

    if (user.schoolId) {
      const assignment = await db
        .from('school_staff_assignments')
        .where('user_id', user.id)
        .where('school_id', user.schoolId)
        .where('is_active', true)
        .select('position')
        .orderBy('is_primary', 'desc')
        .first()

      if (assignment?.position) {
        return positionLabel(assignment.position)
      }
    }

    return this.getRoleLabel(user.role)
  }

  private normalizeSupportText(value: string, senderRoleLabel?: string | null) {
    return value
      .replace(/\bScolarite\b/g, 'Scolarité')
      .replace(/\bpresences\b/g, 'présences')
      .replace(/\bAcces\b/g, 'Accès')
      .replace(/\brole\b/g, 'rôle')
      .replace(/\bProbleme\b/g, 'Problème')
      .replace(/\bamelioration\b/g, 'amélioration')
      .replace(/\beleve\b/g, 'élève')
      .replace(/Demande envoyee depuis le centre d'aide\./g, "Demande envoyée depuis le centre d'aide.")
      .replace(/^Role: director$/gm, `Rôle: ${senderRoleLabel || "Direction d'école"}`)
      .replace(/^Role: inspection$/gm, 'Rôle: Inspection')
      .replace(/^Role: finance_director$/gm, 'Rôle: Direction financière')
      .replace(/^Role: teacher$/gm, 'Rôle: Enseignant')
      .replace(/^Role: parent$/gm, 'Rôle: Parent')
      .replace(/^Role: student$/gm, 'Rôle: Élève')
      .replace(/^Role: discipline_director$/gm, 'Rôle: Direction de discipline')
      .replace(/^Role: secretary$/gm, 'Rôle: Secrétariat')
      .replace(/^Module concerne:/gm, 'Module concerné:')
      .replace(/\bgestion de présence\b/g, 'gestion des présences')
      .replace(/\bPourriez-vous nous éclaircir dans ce sens\s?\?/g, 'Pourriez-vous nous éclairer à ce sujet ?')
  }

  private formatMessageSubject(subject: string) {
    return subject.startsWith('Support: ') ? this.normalizeSupportText(subject) : subject
  }

  private formatMessageContent(content: string, subject?: string, senderRoleLabel?: string | null) {
    return subject?.startsWith('Support: ')
      ? this.normalizeSupportText(content, senderRoleLabel)
      : content
  }

  private isValidUuid(value?: string | null) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      String(value || '')
    )
  }

  private formatConversationMessage(message: Message, user: User) {
    const parent = message.parentMessage

    return {
      id: message.id,
      content: this.formatMessageContent(message.content, message.subject),
      senderName: message.sender?.fullName || (message.senderId === user.id ? user.fullName : 'Auteur supprimé'),
      isMine: message.senderId === user.id,
      canEdit: message.senderId === user.id,
      canDelete: message.senderId === user.id,
      read: message.isRead,
      time: message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
      edited: Boolean(message.editedAt),
      editedAt: message.editedAt?.toFormat('dd/MM/yyyy HH:mm') || null,
      parentMessageId: message.parentMessageId,
      parentMessage: parent
        ? {
            id: parent.id,
            authorName: parent.sender?.fullName || 'Auteur supprimé',
            content: parent.content,
            attachmentName: parent.attachmentName,
          }
        : null,
      attachmentUrl: message.attachmentUrl,
      attachmentDownloadUrl: message.attachmentUrl ? `/api/messages/${message.id}/attachment` : null,
      attachmentName: message.attachmentName,
      attachmentSize: message.attachmentSize,
      attachmentMime: message.attachmentMime,
      attachmentIsImage: Boolean(message.attachmentMime?.startsWith('image/')),
    }
  }

  private async getDownloadFilename(message: Message) {
    const originalName = message.attachmentName || 'fichier-joint'
    const duplicateRows = await db
      .from('messages')
      .where('attachment_name', originalName)
      .whereNotNull('attachment_url')
      .orderBy('created_at', 'asc')
      .select('id')

    const duplicateIndex = duplicateRows.findIndex((row) => String(row.id) === String(message.id))
    if (duplicateRows.length <= 1 || duplicateIndex <= 0) return originalName

    const parsed = parse(originalName)
    return `${parsed.name} (${duplicateIndex + 1})${parsed.ext}`
  }

  private contentDispositionFilename(filename: string) {
    const asciiFallback = filename
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\x20-\x7E]/g, '_')
      .replace(/["\\]/g, '')
      || 'fichier-joint'

    return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`
  }

  private formatFileSize(size?: number | null) {
    if (!size) return '-'
    if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} Ko`
    return `${(size / 1024 / 1024).toFixed(1)} Mo`
  }

  private async storeMessageAttachment(request: HttpContext['request']) {
    const attachment = request.file('attachment', {
      size: '10mb',
      extnames: ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'],
    })

    if (!attachment) return null
    if (!attachment.isValid) {
      throw new Error(attachment.errors[0]?.message || 'Fichier joint invalide')
    }

    const extension = extname(attachment.clientName) || `.${attachment.extname || 'bin'}`
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}${extension}`
    await attachment.move(app.publicPath('uploads/messages'), { name: fileName })

    return {
      url: `/uploads/messages/${fileName}`,
      name: attachment.clientName,
      size: attachment.size,
      mime: attachment.type ? `${attachment.type}/${attachment.subtype}` : null,
    }
  }

  private formatTrashMessage(message: Message, user: User) {
    const deletedAt = message.deletedAt || message.updatedAt
    const expiresAt = deletedAt.plus({ days: 30 })
    const daysUntilExpiry = Math.max(0, Math.ceil(expiresAt.diffNow('days').days))
    const isIncoming = message.receiverId === user.id
    const contact = isIncoming ? message.sender : message.receiver

    return {
      id: message.id,
      senderName: contact?.fullName || 'Compte supprimé',
      receiverName: contact?.fullName || 'Compte supprimé',
      senderRole: this.getRoleLabel(contact?.role),
      receiverRole: this.getRoleLabel(contact?.role),
      isIncoming,
      type: message.type,
      subject: this.formatMessageSubject(message.subject),
      preview: this.getMessagePreview(this.formatMessageContent(message.content, message.subject)),
      deletedAt: deletedAt.toFormat('dd/MM/yyyy HH:mm'),
      daysUntilExpiry,
    }
  }

  private formatMessageNotification(message: Message) {
    const senderName = message.sender?.fullName || 'Expéditeur supprimé'
    const forumLinkMatch = message.content.match(/\[forum-link:([^\]]+)\]/)
    const notificationLinkMatch = message.content.match(/\[notification-link:([^\]]+)\]/)
    const cleanContent = message.content
      .replace(/\s*\[forum-link:[^\]]+\]\s*/g, '')
      .replace(/\s*\[notification-link:[^\]]+\]\s*/g, '')
      .trim()
    const preview =
      cleanContent.length > 120 ? `${cleanContent.slice(0, 120)}...` : cleanContent
    const isForumNotification = Boolean(forumLinkMatch)
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
      type: isIncomingTransfer || isTransferNotification ? 'transfer' : isForumNotification ? 'forum' : 'message',
      title: this.formatMessageSubject(message.subject),
      message: `${senderName}: ${this.formatMessageContent(preview, message.subject)}`,
      link: isIncomingTransfer
        ? '/schools/transfers/pending'
        : isTransferNotification
          ? '/schools/transfers/requests'
          : notificationLinkMatch?.[1] || forumLinkMatch?.[1] || `/communication/messages/read/${message.id}`,
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
      .whereNull('deleted_at')
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
      .whereNull('deleted_at')
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
        senderId: message.senderId,
        canOpenConversation: this.isValidUuid(message.senderId),
        senderName: message.sender?.fullName || 'Expéditeur supprimé',
        senderRole: this.getRoleLabel(message.sender?.role),
        type: message.type,
        isRead: message.isRead,
        subject: this.formatMessageSubject(message.subject),
        preview: this.getMessagePreview(this.formatMessageContent(message.content, message.subject)),
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
      .whereNull('deleted_at')
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

    const senderRole = await this.getAssignedRoleLabel(message.sender)
    const receiverRole = message.receiver ? await this.getAssignedRoleLabel(message.receiver) : null

    return view.render('communication/messages/read', {
      school: this.getFallbackSchool(user),
      message: {
        id: message.id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        conversationUserId: message.senderId === user.id ? message.receiverId : message.senderId,
        canOpenConversation: this.isValidUuid(
          message.senderId === user.id ? message.receiverId : message.senderId
        ),
        subject: this.formatMessageSubject(message.subject),
        content: this.formatMessageContent(message.content, message.subject, senderRole),
        type: message.type,
        canEdit: message.senderId === user.id,
        urgent: false,
        senderName: message.sender?.fullName || 'Expéditeur supprimé',
        senderRole,
        receiverName: message.receiver?.fullName,
        receiverRole: receiverRole || this.getRoleLabel(message.receiver?.role),
        date: message.createdAt.toFormat('dd/MM/yyyy'),
        time: message.createdAt.toFormat('HH:mm'),
        readAt: message.readAt?.toFormat('dd/MM/yyyy HH:mm') || '-',
        attachments: message.attachmentUrl
          ? [
              {
                url: message.attachmentUrl,
                downloadUrl: `/api/messages/${message.id}/attachment`,
                filename: message.attachmentName || 'Fichier joint',
                size: this.formatFileSize(message.attachmentSize),
                isImage: Boolean(message.attachmentMime?.startsWith('image/')),
              },
            ]
          : [],
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
      .whereNull('deleted_at')
      .preload('receiver')
      .firstOrFail()

    return view.render('communication/messages/edit', {
      school: this.getFallbackSchool(user),
      message: {
        id: message.id,
        receiverId: message.receiverId,
        subject: this.formatMessageSubject(message.subject),
        content: this.formatMessageContent(message.content, message.subject),
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
      .whereNull('deleted_at')
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

    message.deletedAt = DateTime.now()
    await message.save()

    return response.ok({ success: true, message: 'Message supprimé' })
  }

  public async conversationPage({ auth, params, response, session, view }: HttpContext) {
    const user = auth.user!
    if (!this.isValidUuid(params.id)) {
      session.flash('error', 'Cette conversation ne peut pas être ouverte.')
      return response.redirect('/communication/messages/inbox')
    }

    const contact = await User.find(params.id)
    if (!contact) {
      session.flash('error', 'Ce contact est introuvable.')
      return response.redirect('/communication/messages/inbox')
    }

    await Message.query()
      .where('sender_id', contact.id)
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
      .where('is_read', false)
      .update({
        is_read: true,
        read_at: DateTime.now().toSQL(),
      })

    return view.render('communication/messages/conversation', {
      school: this.getFallbackSchool(user),
      conversationId: contact.id,
      contact: {
        id: contact.id,
        name: contact.fullName,
        role: this.getRoleLabel(contact.role),
        status: contact.status === 'active' ? 'Actif' : 'Inactif',
      },
    })
  }

  public async trashPage({ auth, request, view }: HttpContext) {
    const user = auth.user!
    const page = Number(request.input('page', 1))

    const query = Message.query()
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')
      .preload('sender')
      .preload('receiver')
      .orderBy('deleted_at', 'desc')

    const paginator = await query.paginate(page, 20)
    const stats = await db
      .from('messages')
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')
      .count('* as total')
      .first()

    return view.render('communication/messages/trash', {
      school: this.getFallbackSchool(user),
      messages: paginator.all().map((message) => this.formatTrashMessage(message, user)),
      stats: {
        total: Number(stats?.total || 0),
      },
      pagination: this.getPaginationMeta(paginator),
      url: '/communication/messages/trash',
    })
  }

  public async restoreWebMessage({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')
      .firstOrFail()

    message.deletedAt = null
    await message.save()

    return response.ok({ success: true, message: 'Message restauré' })
  }

  public async deleteWebMessagePermanently({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')
      .firstOrFail()

    await message.delete()

    return response.ok({ success: true, message: 'Message supprimé définitivement' })
  }

  public async emptyTrashWeb({ auth, response }: HttpContext) {
    const user = auth.user!
    const messages = await Message.query()
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')

    await Promise.all(messages.map((message) => message.delete()))

    return response.ok({ success: true, message: 'Corbeille vidée' })
  }

  public async restoreAllWeb({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query()
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNotNull('deleted_at')
      .update({ deleted_at: null })

    return response.ok({ success: true, message: 'Messages restaurés' })
  }

  public async downloadAttachment({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where((messageQuery) => {
        messageQuery.where('receiver_id', user.id).orWhere('sender_id', user.id)
      })
      .whereNull('deleted_at')
      .whereNotNull('attachment_url')
      .firstOrFail()

    const storedFileName = basename(message.attachmentUrl || '')
    const filePath = join(app.publicPath('uploads/messages'), storedFileName)
    const downloadName = await this.getDownloadFilename(message)

    response.header('Content-Disposition', this.contentDispositionFilename(downloadName))
    if (message.attachmentMime) {
      response.header('Content-Type', message.attachmentMime)
    }

    return response.download(filePath)
  }

  public async markAllReadWeb({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query()
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
      .where('is_read', false)
      .update({
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
      .whereNull('deleted_at')
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
      .whereNull('deleted_at')
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
      .whereNull('deleted_at')
      .preload('sender')
      .orderBy('created_at', 'desc')
      .limit(10)

    const unreadCountResult = await db
      .from('messages')
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
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
      .whereNull('deleted_at')
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

    await Message.query()
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
      .where('is_read', false)
      .update({
        is_read: true,
        read_at: DateTime.now().toSQL(),
      })

    return response.ok({ success: true })
  }

  public async deleteAllNotifications({ auth, response }: HttpContext) {
    const user = auth.user!

    await Message.query()
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
      .where('is_read', false)
      .update({
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
      .whereNull('deleted_at')
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
      .whereNull('deleted_at')
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
        receiverId: message.receiverId,
        canOpenConversation: this.isValidUuid(message.receiverId),
        receiverName: message.receiver?.fullName || 'Destinataire supprimé',
        receiverRole: this.getRoleLabel(message.receiver?.role),
        type: message.type,
        isRead: message.isRead,
        subject: this.formatMessageSubject(message.subject),
        preview: this.getMessagePreview(this.formatMessageContent(message.content, message.subject)),
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
        .whereNull('deleted_at')
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
    const recipientIds = recipients.map((recipient) => recipient.id)
    const staffAssignments = recipientIds.length
      ? await db
          .from('school_staff_assignments')
          .leftJoin('school_sections', 'school_staff_assignments.school_section_id', 'school_sections.id')
          .whereIn('school_staff_assignments.user_id', recipientIds)
          .where('school_staff_assignments.is_active', true)
          .select(
            'school_staff_assignments.user_id',
            'school_staff_assignments.position',
            'school_staff_assignments.school_section_id',
            'school_sections.name as section_name'
          )
          .orderBy('school_staff_assignments.is_primary', 'desc')
      : []
    const assignmentByUserId = new Map(
      staffAssignments.map((assignment) => [String(assignment.user_id), assignment])
    )
    const staffRoleLabel = (recipient: User) => {
      const assignment = assignmentByUserId.get(String(recipient.id))

      if (!assignment) {
        return recipient.role === 'director'
          ? 'Direction d’école — section non précisée'
          : this.getRoleLabel(recipient.role)
      }

      const scope = isSchoolWidePosition(assignment.position)
        ? "Toute l'école"
        : assignment.section_name || 'Section non précisée'

      return `${positionLabel(assignment.position)} — ${scope}`
    }
    const toRecipient = (recipient: User) => ({
      id: recipient.id,
      name: recipient.fullName,
      subject: staffRoleLabel(recipient),
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
    let attachmentData: Awaited<ReturnType<typeof this.storeMessageAttachment>> = null

    try {
      attachmentData = await this.storeMessageAttachment(request)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Fichier joint invalide.')
      return response.redirect().back()
    }

    await Message.create({
      senderId: user.id,
      receiverId: payload.receiverId,
      schoolId: user.schoolId || receiver.schoolId,
      subject: payload.subject,
      content: payload.content,
      type: payload.type || 'general',
      isRead: false,
      hasAttachment: Boolean(attachmentData),
      attachmentUrl: attachmentData?.url || null,
      attachmentName: attachmentData?.name || null,
      attachmentSize: attachmentData?.size || null,
      attachmentMime: attachmentData?.mime || null,
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
      schoolId: user.schoolId,
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
      .whereNull('deleted_at')
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
        WHERE (m.sender_id = ? OR m.receiver_id = ?) AND m.deleted_at IS NULL
        GROUP BY user_id
        ORDER BY last_message_date DESC
      `,
      [user.id, user.id, user.id, user.id]
    )

    const conversations = await Promise.all(
      result.rows.map(async (conv: any) => {
        const otherUser = await User.find(conv.user_id)
        const lastMessage = await Message.query()
          .where((messageQuery) => {
            messageQuery
              .where((q) => q.where('sender_id', user.id).where('receiver_id', conv.user_id))
              .orWhere((q) => q.where('sender_id', conv.user_id).where('receiver_id', user.id))
          })
          .whereNull('deleted_at')
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
      .where((messageQuery) => {
        messageQuery
          .where((q) => q.where('sender_id', user.id).where('receiver_id', params.userId))
          .orWhere((q) => q.where('sender_id', params.userId).where('receiver_id', user.id))
      })
      .whereNull('deleted_at')
      .preload('sender')
      .preload('parentMessage', (parentQuery) => parentQuery.preload('sender'))
      .orderBy('created_at', 'asc')
      .paginate(page, limit)

    // Marquer comme lu
    await Message.query()
      .where('sender_id', params.userId)
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
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

  public async getConversationWeb({ params, auth, response }: HttpContext) {
    const user = auth.user!
    if (!this.isValidUuid(params.userId)) {
      return response.badRequest({ success: false, message: 'Contact invalide' })
    }

    const messages = await Message.query()
      .where((messageQuery) => {
        messageQuery
          .where((q) => q.where('sender_id', user.id).where('receiver_id', params.userId))
          .orWhere((q) => q.where('sender_id', params.userId).where('receiver_id', user.id))
      })
      .whereNull('deleted_at')
      .preload('sender')
      .preload('parentMessage', (parentQuery) => parentQuery.preload('sender'))
      .orderBy('created_at', 'asc')

    await Message.query()
      .where('sender_id', params.userId)
      .where('receiver_id', user.id)
      .whereNull('deleted_at')
      .where('is_read', false)
      .update({
        is_read: true,
        read_at: DateTime.now().toSQL(),
      })

    return response.ok({
      success: true,
      messages: messages.map((message) => this.formatConversationMessage(message, user)),
    })
  }

  public async sendConversationWeb({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const receiverId = String(request.input('receiverId') || request.input('receiver_id') || '').trim()
    const content = String(request.input('content') || '').trim()
    const subject = String(request.input('subject') || 'Conversation').trim()
    const parentMessageId = String(request.input('parentMessageId') || request.input('parent_message_id') || '').trim()

    if (!this.isValidUuid(receiverId) || !content) {
      return response.badRequest({
        success: false,
        message: 'Destinataire et contenu requis',
      })
    }

    const receiver = await User.findOrFail(receiverId)
    let parentMessage: Message | null = null
    if (parentMessageId) {
      if (!this.isValidUuid(parentMessageId)) {
        return response.badRequest({ success: false, message: 'Message ciblé invalide' })
      }

      parentMessage = await Message.query()
        .where('id', parentMessageId)
        .whereNull('deleted_at')
        .where((messageQuery) => {
          messageQuery
            .where((q) => q.where('sender_id', user.id).where('receiver_id', receiver.id))
            .orWhere((q) => q.where('sender_id', receiver.id).where('receiver_id', user.id))
        })
        .preload('sender')
        .first()

      if (!parentMessage) {
        return response.badRequest({ success: false, message: 'Message ciblé introuvable' })
      }
    }

    let attachmentData: Awaited<ReturnType<typeof this.storeMessageAttachment>> = null

    try {
      attachmentData = await this.storeMessageAttachment(request)
    } catch (error) {
      return response.badRequest({
        success: false,
        message: error instanceof Error ? error.message : 'Fichier joint invalide',
      })
    }

    const message = await Message.create({
      senderId: user.id,
      receiverId: receiver.id,
      schoolId: user.schoolId || receiver.schoolId,
      subject,
      content,
      parentMessageId: parentMessage?.id || null,
      type: 'general',
      isRead: false,
      hasAttachment: Boolean(attachmentData),
      attachmentUrl: attachmentData?.url || null,
      attachmentName: attachmentData?.name || null,
      attachmentSize: attachmentData?.size || null,
      attachmentMime: attachmentData?.mime || null,
    })

    if (parentMessage) {
      ;(message as any).parentMessage = parentMessage
    }

    return response.created({
      success: true,
      message: 'Message envoyé avec succès',
      sentMessage: this.formatConversationMessage(message, user),
    })
  }

  public async updateConversationMessage({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    const content = String(request.input('content') || '').trim()
    if (!content) return response.badRequest({ success: false, message: 'Contenu requis' })

    const message = await Message.query()
      .where('id', params.id)
      .where('sender_id', user.id)
      .whereNull('deleted_at')
      .firstOrFail()

    message.content = content
    message.editedAt = DateTime.now()
    await message.save()

    return response.ok({ success: true, message: this.formatConversationMessage(message, user) })
  }

  public async deleteConversationMessage({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const message = await Message.query()
      .where('id', params.id)
      .where('sender_id', user.id)
      .whereNull('deleted_at')
      .firstOrFail()

    message.deletedAt = DateTime.now()
    await message.save()

    return response.ok({ success: true })
  }

  public async exportConversationWeb({ params, auth, response }: HttpContext) {
    const user = auth.user!
    if (!this.isValidUuid(params.userId)) {
      return response.badRequest({ success: false, message: 'Contact invalide' })
    }

    const contact = await User.findOrFail(params.userId)
    const messages = await Message.query()
      .where((messageQuery) => {
        messageQuery
          .where((q) => q.where('sender_id', user.id).where('receiver_id', contact.id))
          .orWhere((q) => q.where('sender_id', contact.id).where('receiver_id', user.id))
      })
      .whereNull('deleted_at')
      .preload('sender')
      .orderBy('created_at', 'asc')

    const rows = [
      ['Date', 'Expéditeur', 'Sujet', 'Message'],
      ...messages.map((message) => [
        message.createdAt.toFormat('dd/MM/yyyy HH:mm'),
        message.sender?.fullName || 'Compte supprimé',
        message.subject,
        message.content.replace(/\r?\n/g, ' '),
      ]),
    ]
    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    response.header('content-type', 'text/csv; charset=utf-8')
    response.header(
      'content-disposition',
      `attachment; filename="conversation-${contact.id}.csv"`
    )
    return response.send(csv)
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
