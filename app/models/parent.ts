import { ParentSchema } from '#database/schema'
import { DateTime } from 'luxon'
import { column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'

// Utilisation des alias de chemin (#models)
import User from '#models/user'
import Student from '#models/student'

export default class Parent extends ParentSchema {
    public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare profession: string | null

  @column()
  declare emergencyPhone: string

  @column()
  declare relationship: string // ex: Père, Mère, Tuteur

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * RELATIONS
   */

  // Lien vers le compte utilisateur (nom, email, mot de passe)
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Relation ManyToMany avec les élèves (un parent peut avoir plusieurs enfants)
  @manyToMany(() => Student, {
    pivotTable: 'parent_students', // Vérifie bien que le nom match ta migration (souvent au pluriel)
    pivotForeignKey: 'parent_id',
    pivotRelatedForeignKey: 'student_id',
    pivotTimestamps: true, // Recommandé si tu as created_at/updated_at dans ta table pivot
  })
  declare children: ManyToMany<typeof Student>
}