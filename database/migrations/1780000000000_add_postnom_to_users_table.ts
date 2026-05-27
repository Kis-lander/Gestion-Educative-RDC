import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPostnomToUsersTable extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('postnom', 100).nullable().after('first_name')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('postnom')
    })
  }
}
