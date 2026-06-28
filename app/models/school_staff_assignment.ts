import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import School from '#models/school'
import SchoolSection from '#models/school_section'
import User from '#models/user'

export default class SchoolStaffAssignment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string

  @column()
  declare schoolSectionId: string | null

  @column()
  declare userId: string

  @column()
  declare position: string

  @column()
  declare isPrimary: boolean

  @column()
  declare isActive: boolean

  @column()
  declare createdBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @belongsTo(() => SchoolSection, { foreignKey: 'schoolSectionId' })
  declare section: BelongsTo<typeof SchoolSection>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
