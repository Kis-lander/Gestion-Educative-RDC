import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddMustChangePasswordToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('must_change_password').notNullable().defaultTo(false)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('must_change_password')
    })
  }
}
