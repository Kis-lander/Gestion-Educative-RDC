import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AssignmentsSchema extends BaseSchema {
  protected tableName = 'assignments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('teacher_id').references('id').inTable('teachers').onDelete('CASCADE')
      table.uuid('class_id').references('id').inTable('classes')
      table.uuid('subject_id').references('id').inTable('subjects')
      table.string('title', 255).notNullable()
      table.text('description')
      table.text('instructions')
      table.date('due_date').notNullable()
      table.time('due_time')
      table.integer('max_points').defaultTo(20)
      table.string('attachment_url')
      table.enum('status', ['draft', 'published', 'closed']).defaultTo('draft')
      table.timestamp('published_at')
      table.timestamps(true)
      
      table.index(['class_id', 'subject_id'])
      table.index(['due_date'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}