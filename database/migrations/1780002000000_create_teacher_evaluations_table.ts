import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateTeacherEvaluationsTable extends BaseSchema {
  protected tableName = 'teacher_evaluations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('teacher_id').notNullable().references('id').inTable('teachers').onDelete('CASCADE')
      table.uuid('evaluator_id').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.date('evaluation_date').notNullable()
      table.integer('score').nullable()
      table.text('comments').nullable()
      table.timestamps(true)

      table.index(['teacher_id', 'evaluation_date'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
