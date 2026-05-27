import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateInspectionSettingsTable extends BaseSchema {
  public async up() {
    const exists = await this.schema.hasTable('inspection_settings')

    if (exists) return

    this.schema.createTable('inspection_settings', (table) => {
      table.string('key').primary()
      table.string('group').notNullable()
      table.text('value').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  public async down() {
    const exists = await this.schema.hasTable('inspection_settings')

    if (exists) this.schema.dropTable('inspection_settings')
  }
}
