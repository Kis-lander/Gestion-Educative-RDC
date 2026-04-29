import { SubjectSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin pour la structure du projet
import Grade from '#models/grade'
import Assignment from '#models/assignment'

export default class Subject extends SubjectSchema {
    public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string // ex: "Mathématiques", "Chimie", "Français"

  @column()
  declare code: string // ex: "MATH101", "BIO-HUM"

  @column()
  declare description: string | null

  /**
   * Le coefficient (ou poids) de la matière pour le calcul des points.
   */
  @column()
  declare coefficient: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // Les notes obtenues par les élèves dans cette matière
  @hasMany(() => Grade)
  declare grades: HasMany<typeof Grade>

  // Les devoirs ou travaux de session liés à cette matière
  @hasMany(() => Assignment)
  declare assignments: HasMany<typeof Assignment>
}