import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUserNameOrderIndex extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['first_name', 'last_name', 'postnom'], 'users_name_order_idx')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['first_name', 'last_name', 'postnom'], 'users_name_order_idx')
    })
  }
}
