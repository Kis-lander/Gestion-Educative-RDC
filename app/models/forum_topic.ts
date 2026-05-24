import { ForumTopicSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import Subject from '#models/subject'
import Class from '#models/class'
import User from '#models/user'
import ForumPost from '#models/forum_post'

export default class ForumTopic extends ForumTopicSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare subjectId: string | null // Peut être null si le sujet est général à la classe

  @column()
  declare classId: string

  @column()
  declare createdBy: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare isPinned: boolean

  @column()
  declare isLocked: boolean

  @column()
  declare viewsCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // La matière concernée par la discussion (optionnel)
  @belongsTo(() => Subject)
  declare subject: BelongsTo<typeof Subject>

  // La classe à laquelle appartient ce forum
  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  // L'utilisateur (élève ou prof) qui a lancé le sujet
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: BelongsTo<typeof User>

  // Les réponses (posts) au sein de ce sujet
  @hasMany(() => ForumPost)
  declare posts: HasMany<typeof ForumPost>
}
