import { BaseSchema } from '@adonisjs/lucid/schema'

export default class DisciplinesSchema extends BaseSchema {
  protected tableName = 'disciplines'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.uuid('reported_by').references('id').inTable('users')
      table.enum('incident_type', ['absence', 'late', 'misconduct', 'violence', 'fraud', 'uniform_violation', 'other'])
      table.text('description').notNullable()
      table.enum('severity', ['minor', 'moderate', 'major', 'critical'])
      table.enum('sanction', ['warning', 'community_service', 'suspension', 'expulsion', 'none'])
      table.date('incident_date').notNullable()
      table.text('action_taken')
      table.boolean('parent_notified').defaultTo(false)
      table.timestamp('parent_notified_at')
      table.text('parent_response')
      table.timestamps(true)
      
      table.index(['student_id', 'incident_date'])
      table.index(['severity', 'sanction'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}