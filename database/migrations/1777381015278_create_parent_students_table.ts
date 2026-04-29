import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ParentStudentSchema extends BaseSchema {
  protected tableName = 'parent_student'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('parent_id').references('id').inTable('parents').onDelete('CASCADE')
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.boolean('is_primary').defaultTo(false)
      table.timestamps(true)
      
      table.unique(['parent_id', 'student_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}