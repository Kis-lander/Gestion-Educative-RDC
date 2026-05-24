import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ClassSubjectSchema extends BaseSchema {
  protected tableName = 'class_subject'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE')
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE')
      table.uuid('teacher_id').references('id').inTable('teachers').onDelete('SET NULL')
      table.integer('hours_per_week')
      table.timestamps(true)

      table.unique(['class_id', 'subject_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
