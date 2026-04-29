import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FeePaymentsSchema extends BaseSchema {
  protected tableName = 'fee_payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE')
      table.uuid('fee_id').references('id').inTable('school_fees')
      table.decimal('amount_paid', 12, 2).notNullable()
      table.string('currency', 3).defaultTo('USD')
      table.date('payment_date').notNullable()
      table.string('payment_method', 50)
      table.string('reference_number')
      table.string('receipt_number').unique()
      table.text('notes')
      table.uuid('recorded_by').references('id').inTable('users')
      table.timestamps(true)
      
      table.index(['student_id', 'payment_date'])
      table.index(['receipt_number'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}