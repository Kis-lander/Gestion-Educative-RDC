import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assignments'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('term', 100).nullable()
      table.string('evaluation_type', 50).notNullable().defaultTo('devoir')
      table.index(['term'])
      table.index(['evaluation_type'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['evaluation_type'])
      table.dropIndex(['term'])
      table.dropColumn('evaluation_type')
      table.dropColumn('term')
    })
  }
}
