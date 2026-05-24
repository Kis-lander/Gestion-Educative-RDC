import { ClassSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin pour la cohérence du projet
import School from '#models/school'
import Teacher from '#models/teacher'
import Student from '#models/student'
import Subject from '#models/subject'

export default class Class extends ClassSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string

  /**
   * teacher_id peut être null si la classe n'a pas encore de titulaire assigné
   */
  @column()
  declare teacherId: string | null

  @column()
  declare name: string

  @column()
  declare level: string // ex: "Littéraire", "Commerciale et Gestion"

  @column()
  declare gradeLevel: number // ex: 1, 2, 3, 4 (pour les humanités)

  @column()
  declare maxCapacity: number

  @column()
  declare currentEnrollment: number

  @column()
  declare academicYear: string // ex: "2025-2026"

  @column()
  declare shift: 'morning' | 'afternoon' | 'evening'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // La classe appartient à une école
  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  // Le titulaire de la classe (Teacher)
  @belongsTo(() => Teacher)
  declare teacher: BelongsTo<typeof Teacher>

  // Les élèves inscrits dans cette classe
  @hasMany(() => Student)
  declare students: HasMany<typeof Student>

  // Les matières enseignées dans cette classe
  @hasMany(() => Subject)
  declare subjects: HasMany<typeof Subject>
}
