import { SchoolSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Student from '#models/student'
import Class from '#models/class'

export default class School extends SchoolSchema {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare province: string

  @column()
  declare territory: string

  @column()
  declare address: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column()
  declare logoUrl: string

  @column()
  declare status: 'active' | 'suspended' | 'pending'

  @column.dateTime()
  declare approvedAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   * Utilisation de l'import dynamique pour éviter les dépendances circulaires
   */
  @hasMany(() => User)
  declare users: HasMany<typeof User>

  @hasMany(() => Student)
  declare students: HasMany<typeof Student>

  @hasMany(() => Class)
  declare classes: HasMany<typeof Class>
}
