import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SchoolFeesSchema extends BaseSchema {
  protected tableName = 'school_fees'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE')
      table.string('fee_type', 100).notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.string('currency', 3).defaultTo('USD')
      table.string('academic_year', 20).notNullable()
      table.string('term', 20)
      table.boolean('is_mandatory').defaultTo(true)
      table.text('description')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}