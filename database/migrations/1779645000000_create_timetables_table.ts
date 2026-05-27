import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TimetablesSchema extends BaseSchema {
  protected tableName = 'timetables'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE')
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE')
      table.uuid('teacher_id').references('id').inTable('teachers').onDelete('SET NULL')
      table.string('academic_year', 20).notNullable()
      table.string('term', 20).notNullable()
      table.enum('shift', ['morning', 'afternoon', 'evening']).nullable()
      table.integer('day_of_week').notNullable()
      table.time('start_time').notNullable()
      table.time('end_time').notNullable()
      table.string('room', 50).nullable()
      table.timestamps(true)

      table.index(['class_id', 'academic_year', 'term'])
      table.unique(['class_id', 'academic_year', 'term', 'shift', 'day_of_week', 'start_time'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
