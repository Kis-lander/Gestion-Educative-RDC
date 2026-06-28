import { UserSchema } from '#database/schema'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { randomUUID } from 'node:crypto'
import { column, computed, belongsTo, hasMany, beforeCreate, beforeSave } from '@adonisjs/lucid/orm'
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
  declare lastName: string

  @column()
  declare postnom: string

  @column()
  declare phone: string | null

  @column()
  declare avatarUrl: string | null

  @column()
  declare preferredLanguage: string

  @column()
  declare mustChangePassword: boolean

  @column()
  declare role:
    | 'inspection'
    | 'director'
    | 'finance_director'
    | 'teacher'
    | 'parent'
    | 'student'
    | 'discipline_director'
    | 'secretary'

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
    user.normalizeThreePartName()

    if (user.$dirty.password) {
      user.password = await hash.use('scrypt').make(user.password)
    }
  }

  /**
   * GETTERS & METHODS
   */
  @computed()
  public get fullName(): string {
    return [this.firstName, this.lastName, this.postnom].filter(Boolean).join(' ')
  }

  private normalizeThreePartName() {
    const fallback = 'A completer'
    const parts = [this.firstName, this.lastName, this.postnom]
      .flatMap((value) => String(value || '').trim().split(/\s+/))
      .filter(Boolean)

    if (parts.length >= 3) {
      this.firstName = parts[0]
      this.lastName = parts[1]
      this.postnom = parts.slice(2).join(' ')
      return
    }

    this.firstName = parts[0] || fallback
    this.lastName = parts[1] || fallback
    this.postnom = parts[2] || fallback
  }

  public hasRole(role: string | string[]): boolean {
    if (Array.isArray(role)) {
      return role.includes(this.role)
    }
    return this.role === role
  }
}
