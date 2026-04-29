import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AssignmentSubmissionsSchema extends BaseSchema {
  protected tableName = 'assignment_submissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('assignment_id').references('id').inTable('assignments').onDelete('CASCADE')
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.text('submission_content')
      table.string('attachment_url')
      table.timestamp('submitted_at')
      table.decimal('grade', 5, 2)
      table.text('teacher_feedback')
      table.boolean('is_late').defaultTo(false)
      table.enum('status', ['draft', 'submitted', 'graded']).defaultTo('draft')
      table.timestamps(true)
      
      table.unique(['assignment_id', 'student_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}