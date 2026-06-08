import { StudentSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin pour une meilleure structure
import User from '#models/user'
import School from '#models/school'
import Class from '#models/class'
import Grade from '#models/grade'
import Discipline from '#models/discipline'
import Parent from '#models/parent'

export default class Student extends StudentSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare schoolId: string

  @column()
  declare classId: string | null

  @column()
  declare schoolOption: string | null

  @column()
  declare registrationNumber: string

  @column.date()
  declare birthDate: DateTime

  @column()
  declare birthPlace: string

  @column()
  declare nationality: string

  @column()
  declare parentPhone: string

  @column()
  declare gender: 'male' | 'female'

  @column()
  declare medicalInfo: string | null

  @column()
  declare address: string

  @column()
  declare academicStatus: 'active' | 'transferred' | 'graduated' | 'suspended' | 'expelled'

  @column()
  declare shift: 'morning' | 'afternoon' | 'evening'

  @column.date()
  declare enrollmentDate: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @hasMany(() => Grade)
  declare grades: HasMany<typeof Grade>

  @hasMany(() => Discipline)
  declare disciplines: HasMany<typeof Discipline>

  @hasMany(() => Parent)
  declare parents: HasMany<typeof Parent>
}
