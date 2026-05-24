import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TransferAuthorizationsSchema extends BaseSchema {
  protected tableName = 'transfer_authorizations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.uuid('from_school_id').references('id').inTable('schools')
      table.uuid('to_school_id').references('id').inTable('schools')
      table.string('authorization_code', 50).unique().notNullable()
      table.enum('status', ['pending', 'approved', 'rejected', 'used']).defaultTo('pending')
      table.text('reason')
      table.text('rejection_reason')
      table.timestamp('valid_until')
      table.timestamp('issued_at')
      table.uuid('approved_by').references('id').inTable('users')
      table.timestamps(true)

      table.index(['authorization_code'])
      table.index(['student_id', 'status'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
