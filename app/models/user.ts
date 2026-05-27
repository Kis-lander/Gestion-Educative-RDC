import { UserSchema } from '#database/schema'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'
import { column, belongsTo, hasMany, beforeCreate, beforeSave } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import School from '#models/school'
import Message from '#models/message'

export default class User extends UserSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare schoolId: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstName: string

  @column()
  declare postnom: string | null

  @column()
  declare lastName: string

  @column()
  declare phone: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare role:
    | 'inspection'
    | 'director'
    | 'finance_director'
    | 'teacher'
    | 'parent'
    | 'student'
    | 'discipline_director'

  @column()
  declare status: 'active' | 'inactive' | 'suspended' | 'pending'

  @column.dateTime()
  declare lastLogin: DateTime | null

  @column()
  declare rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */
  @belongsTo(() => School)
  declare school: BelongsTo<typeof School>

  @hasMany(() => Message, { foreignKey: 'senderId' })
  declare sentMessages: HasMany<typeof Message>

  @hasMany(() => Message, { foreignKey: 'receiverId' })
  declare receivedMessages: HasMany<typeof Message>

  /**
   * HOOKS
   */
  @beforeCreate()
  public static assignId(user: User) {
    user.id = user.id ?? randomUUID()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.use('scrypt').make(user.password)
    }
  }

  /**
   * GETTERS & METHODS
   */
  public get fullName(): string {
    return [this.firstName, this.postnom, this.lastName].filter(Boolean).join(' ')
  }

  public hasRole(role: string | string[]): boolean {
    if (Array.isArray(role)) {
      return role.includes(this.role)
    }
    return this.role === role
  }
}
