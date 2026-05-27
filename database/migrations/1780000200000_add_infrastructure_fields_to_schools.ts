import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddInfrastructureFieldsToSchools extends BaseSchema {
  public async up() {
    const hasElectricity = await this.schema.hasColumn('schools', 'has_electricity')
    const hasInternet = await this.schema.hasColumn('schools', 'has_internet')
    const hasLibrary = await this.schema.hasColumn('schools', 'has_library')

    this.schema.alterTable('schools', (table) => {
      if (!hasElectricity) table.boolean('has_electricity').notNullable().defaultTo(false)
      if (!hasInternet) table.boolean('has_internet').notNullable().defaultTo(false)
      if (!hasLibrary) table.boolean('has_library').notNullable().defaultTo(false)
    })
  }

  public async down() {
    const hasElectricity = await this.schema.hasColumn('schools', 'has_electricity')
    const hasInternet = await this.schema.hasColumn('schools', 'has_internet')
    const hasLibrary = await this.schema.hasColumn('schools', 'has_library')

    this.schema.alterTable('schools', (table) => {
      if (hasElectricity) table.dropColumn('has_electricity')
      if (hasInternet) table.dropColumn('has_internet')
      if (hasLibrary) table.dropColumn('has_library')
    })
  }
}
