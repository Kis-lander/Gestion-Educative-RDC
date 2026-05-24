import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateSchoolInspectionsTable extends BaseSchema {
  protected tableName = 'school_inspections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE').notNullable()
      table.date('inspection_date').notNullable()
      table.string('inspector', 150).notNullable()
      table.text('report').notNullable()
      table.integer('rating')
      table.text('recommendations')
      table.date('follow_up_date')
      table.timestamps(true)

      table.index(['school_id', 'inspection_date'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
