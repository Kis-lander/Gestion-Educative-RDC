import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ConvertArithmeticColumnsToDouble extends BaseSchema {
  public async up() {
    await this.schema.alterTable('grades', (table) => {
      table.double('score').alter()
      table.double('max_score').defaultTo(20).alter()
      table.double('percentage').alter()
    })

    await this.schema.alterTable('school_fees', (table) => {
      table.double('amount').notNullable().alter()
    })

    await this.schema.alterTable('fee_payments', (table) => {
      table.double('amount_paid').notNullable().alter()
    })
  }

  public async down() {
    await this.schema.alterTable('grades', (table) => {
      table.decimal('score', 5, 2).alter()
      table.decimal('max_score', 5, 2).defaultTo(20).alter()
      table.decimal('percentage', 5, 2).alter()
    })

    await this.schema.alterTable('school_fees', (table) => {
      table.decimal('amount', 12, 2).notNullable().alter()
    })

    await this.schema.alterTable('fee_payments', (table) => {
      table.decimal('amount_paid', 12, 2).notNullable().alter()
    })
  }
}
