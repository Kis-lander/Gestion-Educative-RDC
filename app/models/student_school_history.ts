import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import School from '#models/school'
import Class from '#models/class'
import TransferAuthorization from '#models/transfer_authorization'

export default class StudentSchoolHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string | null

  @column()
  declare transferAuthorizationId: string

  @column()
  declare schoolId: string

  @column()
  declare classId: string | null

  @column()
  declare destinationSchoolId: string

  @column()
  declare destinationClassId: string | null

  @column()
  declare studentName: string

  @column()
  declare registrationNumber: string

  @column()
  declare className: string | null

  @column()
  declare schoolOption: string | null

  @column()
  declare academicYear: string | null

  @column.date()
  declare enrolledAt: DateTime | null

  @column.date()
  declare leftAt: DateTime

  @column()
  declare transferReason: string | null

  @column()
  declare personalSnapshot: Record<string, any>

  @column()
  declare academicSnapshot: Record<string, any>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => TransferAuthorization)
  declare transferAuthorization: BelongsTo<typeof TransferAuthorization>

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @belongsTo(() => School, { foreignKey: 'destinationSchoolId' })
  declare destinationSchool: BelongsTo<typeof School>

  @belongsTo(() => Class)
  declare class: BelongsTo<typeof Class>

  @belongsTo(() => Class, { foreignKey: 'destinationClassId' })
  declare destinationClass: BelongsTo<typeof Class>
}
