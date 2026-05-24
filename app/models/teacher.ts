import { TeacherSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import User from '#models/user'
import School from '#models/school'
import Class from '#models/class'
import Assignment from '#models/assignment'

export default class Teacher extends TeacherSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare schoolId: string

  @column()
  declare employeeNumber: string

  @column()
  declare qualification: string

  @column()
  declare specialization: string

  @column.date()
  declare hireDate: DateTime

  @column()
  declare status: 'active' | 'on_leave' | 'terminated'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // Accès aux informations d'authentification et profil de base
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // École de rattachement
  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  // Classes dont il est titulaire ou responsable
  @hasMany(() => Class)
  declare classes: HasMany<typeof Class>

  // Devoirs ou tâches assignées
  @hasMany(() => Assignment)
  declare assignments: HasMany<typeof Assignment>
}
