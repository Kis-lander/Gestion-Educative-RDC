import { DisciplineSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Imports via alias de chemin (#models)
import Student from '#models/student'
import User from '#models/user'

export default class Discipline extends DisciplineSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  /**
   * ID de l'utilisateur ayant rapporté l'incident (Professeur, Préfet de discipline, etc.)
   */
  @column()
  declare reportedBy: string

  @column()
  declare incidentType:
    | 'absence'
    | 'late'
    | 'misconduct'
    | 'violence'
    | 'fraud'
    | 'uniform_violation'
    | 'other'

  @column()
  declare description: string

  @column()
  declare severity: 'minor' | 'moderate' | 'major' | 'critical'

  @column()
  declare sanction: 'warning' | 'community_service' | 'suspension' | 'expulsion' | 'none'

  @column.date()
  declare incidentDate: DateTime

  @column()
  declare actionTaken: string | null

  @column()
  declare parentNotified: boolean

  @column.dateTime()
  declare parentNotifiedAt: DateTime | null

  @column()
  declare parentResponse: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // L'élève concerné par la sanction
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  // L'utilisateur (staff) qui a signalé l'incident
  @belongsTo(() => User, { foreignKey: 'reportedBy' })
  declare reporter: BelongsTo<typeof User>
}
