import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Student from '#models/student'
import SchoolFee from '#models/school_fee'
import User from '#models/user'

export default class FeePayment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare feeId: string

  @column()
  declare amountPaid: number

  @column()
  declare currency: string

  @column.date()
  declare paymentDate: DateTime

  @column()
  declare paymentMethod: string | null

  @column()
  declare referenceNumber: string | null

  @column()
  declare receiptNumber: string

  @column()
  declare notes: string | null

  @column()
  declare recordedBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // --- Relations ---

  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => SchoolFee, {
    foreignKey: 'feeId',
  })
  declare fee: BelongsTo<typeof SchoolFee>

  @belongsTo(() => User, {
    foreignKey: 'recordedBy',
  })
  declare recorder: BelongsTo<typeof User>
}
