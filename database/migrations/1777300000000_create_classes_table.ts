import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ClassesSchema extends BaseSchema {
  protected tableName = 'classes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE')
      table.uuid('teacher_id').references('id').inTable('teachers').onDelete('SET NULL')
      table.string('name', 100).notNullable() // 6ème A, 5ème B, etc.
      table.string('level', 50).notNullable() // Maternelle, Primaire, Secondaire
      table.integer('grade_level').notNullable() // 1-6 pour primaire, 7-12 pour secondaire
      table.integer('max_capacity').defaultTo(50)
      table.integer('current_enrollment').defaultTo(0)
      table.string('academic_year', 20).notNullable() // 2024-2025
      table.enum('shift', ['morning', 'afternoon', 'evening']).defaultTo('morning')
      table.timestamps(true)

      table.index(['school_id', 'academic_year'])
      table.unique(['school_id', 'name', 'academic_year'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
