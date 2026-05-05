import { DateTime } from 'luxon'
import { BaseModel, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import School from '#models/school'
import FeePayment from '#models/fee_payment'

export default class SchoolFee extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string

  @column()
  declare feeType: string

  @column()
  declare amount: number

  @column()
  declare currency: string

  @column()
  declare academicYear: string

  @column()
  declare term: string | null

  @column()
  declare isMandatory: boolean

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---

  /**
   * Relation vers l'école
   */
  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  /**
   * Une charge (fee) peut avoir plusieurs paiements associés
   */
  @hasMany(() => FeePayment, {
    foreignKey: 'feeId',
  })
  declare payments: HasMany<typeof FeePayment>
}
