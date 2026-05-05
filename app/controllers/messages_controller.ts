import { type HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Message from '#models/message'
import User from '#models/user'
import {
  sendMessageValidator,
  sendGlobalCommunicationValidator,
  sendSchoolCommunicationValidator,
} from '#validators/message'
import { DateTime } from 'luxon'

export default class MessageController {
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
            name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Inconnu',
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

    const query = User.query().where('status', 'active')

    if (payload.targetRole && payload.targetRole !== 'all') {
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
  public async sendSchoolCommunication({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(sendSchoolCommunicationValidator)
    const user = auth.user!

    if (user.role !== 'inspection' && user.schoolId !== payload.schoolId) {
      return response.forbidden({
        success: false,
        message: 'Non autorisé à envoyer une communication à cette école',
      })
    }

    const targetUsers = await User.query()
      .where('school_id', payload.schoolId)
      .where('status', 'active')
      .if(payload.targetRole && payload.targetRole !== 'all', (q) => {
        q.where('role', payload.targetRole!)
      })

    const messagesData = targetUsers.map((target) => ({
      senderId: user.id,
      receiverId: target.id,
      subject: payload.subject,
      content: payload.content,
      type: 'official' as const,
      schoolId: payload.schoolId,
    }))

    await Message.createMany(messagesData)

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
