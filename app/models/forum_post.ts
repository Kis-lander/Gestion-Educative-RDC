import { ForumPostSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import ForumTopic from '#models/forum_topic'
import User from '#models/user'

export default class ForumPost extends ForumPostSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare topicId: string

  @column()
  declare userId: string

  @column()
  declare content: string

  /**
   * ID du message auquel on répond.
   * Est null s'il s'agit d'une réponse directe au sujet (topic).
   */
  @column()
  declare parentPostId: string | null

  @column()
  declare isApproved: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // Le sujet auquel appartient cette réponse
  @belongsTo(() => ForumTopic)
  declare topic: BelongsTo<typeof ForumTopic>

  // L'auteur de la réponse
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Relation réflexive : accéder au message parent
  @belongsTo(() => ForumPost, { foreignKey: 'parentPostId' })
  declare parentPost: BelongsTo<typeof ForumPost>
}
