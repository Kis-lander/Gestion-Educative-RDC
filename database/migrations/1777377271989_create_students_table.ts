import { BaseSchema } from '@adonisjs/lucid/schema'

export default class StudentsSchema extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique()
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE')
      table.uuid('class_id').references('id').inTable('classes').onDelete('SET NULL')
      table.string('registration_number', 50).unique().notNullable()
      table.date('birth_date')
      table.string('birth_place', 100)
      table.string('nationality', 50).defaultTo('Congolaise')
      table.string('parent_phone', 20)
      table.enum('gender', ['male', 'female'])
      table.text('medical_info')
      table.text('address')
      table
        .enum('academic_status', ['active', 'transferred', 'graduated', 'suspended', 'expelled'])
        .defaultTo('active')
      date: 'enrollment_date'
      table.timestamps(true)

      table.index(['school_id', 'class_id', 'academic_status'])
      table.index(['registration_number'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
