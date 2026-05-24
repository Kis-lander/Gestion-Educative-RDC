import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SubjectsSchema extends BaseSchema {
  protected tableName = 'subjects'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name', 100).notNullable()
      table.string('code', 20).unique().notNullable()
      table.text('description')
      table.integer('coefficient').defaultTo(1)
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
