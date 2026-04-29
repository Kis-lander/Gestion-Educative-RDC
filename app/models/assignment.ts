import { AssignmentSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import Teacher from '#models/teacher'
import Class from '#models/class'
import Subject from '#models/subject'
import AssignmentSubmission from '#models/assignment_submission'

export default class Assignment extends AssignmentSchema {
    public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare teacherId: string

  @column()
  declare classId: string

  @column()
  declare subjectId: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare instructions: string | null

  @column.date()
  declare dueDate: DateTime

  @column()
  declare dueTime: string | null

  @column()
  declare maxPoints: number

  @column()
  declare attachmentUrl: string | null

  @column()
  declare status: 'draft' | 'published' | 'closed'

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // L'enseignant qui a créé le devoir
  @belongsTo(() => Teacher)
  declare teacher: BelongsTo<typeof Teacher>

  // La classe concernée
  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  // La matière concernée
  @belongsTo(() => Subject)
  declare subject: BelongsTo<typeof Subject>

  // Les copies (soumissions) des élèves
  @hasMany(() => AssignmentSubmission)
  declare submissions: HasMany<typeof AssignmentSubmission>
}