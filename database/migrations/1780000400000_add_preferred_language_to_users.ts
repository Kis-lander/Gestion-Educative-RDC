import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPreferredLanguageToUsers extends BaseSchema {
  public async up() {
    const exists = await this.schema.hasColumn('users', 'preferred_language')

    if (exists) return

    this.schema.alterTable('users', (table) => {
      table.string('preferred_language', 8).notNullable().defaultTo('fr')
    })
  }

  public async down() {
    const exists = await this.schema.hasColumn('users', 'preferred_language')

    if (!exists) return

    this.schema.alterTable('users', (table) => {
      table.dropColumn('preferred_language')
    })
  }
}
