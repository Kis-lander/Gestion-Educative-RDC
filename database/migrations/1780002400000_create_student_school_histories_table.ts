import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'student_school_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('student_id').nullable().references('id').inTable('students').onDelete('SET NULL')
      table
        .uuid('transfer_authorization_id')
        .notNullable()
        .unique()
        .references('id')
        .inTable('transfer_authorizations')
        .onDelete('CASCADE')
      table.uuid('school_id').notNullable().references('id').inTable('schools')
      table.uuid('class_id').nullable().references('id').inTable('classes').onDelete('SET NULL')
      table.uuid('destination_school_id').notNullable().references('id').inTable('schools')
      table
        .uuid('destination_class_id')
        .nullable()
        .references('id')
        .inTable('classes')
        .onDelete('SET NULL')
      table.string('student_name', 255).notNullable()
      table.string('registration_number', 50).notNullable()
      table.string('class_name', 255)
      table.string('school_option', 255)
      table.string('academic_year', 50)
      table.date('enrolled_at')
      table.date('left_at').notNullable()
      table.text('transfer_reason')
      table.jsonb('personal_snapshot').notNullable().defaultTo('{}')
      table.jsonb('academic_snapshot').notNullable().defaultTo('{}')
      table.timestamps(true)

      table.index(['school_id', 'left_at'])
      table.index(['student_id', 'school_id'])
      table.index(['registration_number'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
