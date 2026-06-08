import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUserSettingsTable extends BaseSchema {
  public async up() {
    const exists = await this.schema.hasTable('user_settings')

    if (exists) return

    this.schema.createTable('user_settings', (table) => {
      table.uuid('id').primary()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('group').notNullable()
      table.string('key').notNullable()
      table.text('value').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['user_id', 'key'])
      table.index(['user_id', 'group'])
    })
  }

  public async down() {
    const exists = await this.schema.hasTable('user_settings')

    if (exists) this.schema.dropTable('user_settings')
  }
}
