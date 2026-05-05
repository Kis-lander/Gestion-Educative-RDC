import { TransferAuthorizationSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// Imports via alias de chemin (#models)
import Student from '#models/student'
import School from '#models/school'
import User from '#models/user'

export default class TransferAuthorization extends TransferAuthorizationSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare studentId: string

  @column()
  declare fromSchoolId: string

  @column()
  declare toSchoolId: string

  @column()
  declare authorizationCode: string

  @column()
  declare status: 'pending' | 'approved' | 'rejected' | 'used'

  @column()
  declare reason: string

  @column()
  declare rejectionReason: string | null

  @column.dateTime()
  declare validUntil: DateTime

  @column.dateTime()
  declare issuedAt: DateTime | null

  /**
   * ID de l'inspecteur ou du directeur ayant approuvé le transfert
   */
  @column()
  declare approvedBy: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */
  @belongsTo(() => Student)
  declare student: BelongsTo<typeof Student>

  @belongsTo(() => School, { foreignKey: 'fromSchoolId' })
  declare fromSchool: BelongsTo<typeof School>

  @belongsTo(() => School, { foreignKey: 'toSchoolId' })
  declare toSchool: BelongsTo<typeof School>

  @belongsTo(() => User, { foreignKey: 'approvedBy' })
  declare approver: BelongsTo<typeof User>

  /**
   * HOOKS
   */
  @beforeCreate()
  public static async initializeTransfer(authorization: TransferAuthorization) {
    // Génération du code de transfert unique
    if (!authorization.authorizationCode) {
      const datePart = DateTime.now().toFormat('yyyyMMdd')
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
      authorization.authorizationCode = `TRF-${datePart}-${randomPart}`
    }
  }
}
