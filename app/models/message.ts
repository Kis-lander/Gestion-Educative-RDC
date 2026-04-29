import { MessageSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Imports via alias de chemin (#models)
import User from '#models/user'
import School from '#models/school'

export default class Message extends MessageSchema {
    public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare senderId: string

  /**
   * Peut être null si isGlobal est vrai (ex: message pour toute l'école)
   */
  @column()
  declare receiverId: string | null

  @column()
  declare schoolId: string

  @column()
  declare subject: string

  @column()
  declare content: string

  @column()
  declare type: 'official' | 'parent_teacher' | 'general' | 'system'

  @column()
  declare isGlobal: boolean

  @column()
  declare isRead: boolean

  @column.dateTime()
  declare readAt: DateTime | null

  @column()
  declare hasAttachment: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // L'expéditeur du message
  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  // Le destinataire (si ce n'est pas un message global)
  @belongsTo(() => User, { foreignKey: 'receiverId' })
  declare receiver: BelongsTo<typeof User>

  // L'école dans laquelle le message circule
  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>
}