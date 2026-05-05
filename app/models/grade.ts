import { GradeSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Imports via alias de chemin (#models)
import Student from '#models/student'
import Class from '#models/class'
import Subject from '#models/subject'

export default class Grade extends GradeSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare classId: string

  @column()
  declare subjectId: string

  @column()
  declare term: string // ex: "Premier Trimestre", "Semestre 1"

  @column()
  declare examType: string // ex: "Interrogation", "Examen", "Travail Journalier"

  @column()
  declare score: number | null

  @column()
  declare maxScore: number

  @column()
  declare percentage: number | null

  @column()
  declare teacherComments: string | null

  @column.date()
  declare examDate: DateTime

  @column()
  declare published: boolean

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @belongsTo(() => Subject)
  declare subject: BelongsTo<typeof Subject>

  /**
   * HOOKS
   * Calcul automatique du pourcentage avant la sauvegarde
   */
  @beforeSave()
  public static async calculatePercentage(grade: Grade) {
    if (grade.score !== null && grade.score !== undefined && grade.maxScore > 0) {
      if (Number.isFinite(grade.score) && Number.isFinite(grade.maxScore)) {
        grade.percentage = (grade.score / grade.maxScore) * 100
      }
    }
  }
}
