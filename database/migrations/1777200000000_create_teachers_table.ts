import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TeachersSchema extends BaseSchema {
  protected tableName = 'teachers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique()
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE')
      table.string('employee_number', 50).unique().notNullable()
      table.string('qualification', 200)
      table.text('specialization')
      table.date('hire_date')
      table.enum('status', ['active', 'on_leave', 'terminated']).defaultTo('active')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}