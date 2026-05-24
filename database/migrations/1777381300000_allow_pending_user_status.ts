import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AllowPendingUserStatus extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropChecks('users_status_check')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.check('status in (\'active\', \'inactive\', \'suspended\', \'pending\')', [], 'users_status_check')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropChecks('users_status_check')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.check('status in (\'active\', \'inactive\', \'suspended\')', [], 'users_status_check')
    })
  }
}
