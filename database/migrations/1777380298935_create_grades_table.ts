import { BaseSchema } from '@adonisjs/lucid/schema'

export default class GradesSchema extends BaseSchema {
  protected tableName = 'grades'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.uuid('class_id').references('id').inTable('classes')
      table.uuid('subject_id').references('id').inTable('subjects')
      table.string('term', 20).notNullable() // T1, T2, T3
      table.string('exam_type', 50).notNullable() // composition, interrogation, projet
      table.decimal('score', 5, 2)
      table.decimal('max_score', 5, 2).defaultTo(20)
      table.decimal('percentage', 5, 2)
      table.text('teacher_comments')
      table.date('exam_date')
      table.boolean('published').defaultTo(false)
      table.timestamp('published_at')
      table.timestamps(true)
      
      table.index(['student_id', 'class_id', 'term'])
      table.index(['subject_id', 'exam_date'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}