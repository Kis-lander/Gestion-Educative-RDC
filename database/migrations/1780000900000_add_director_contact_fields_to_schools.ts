import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddDirectorContactFieldsToSchools extends BaseSchema {
  protected tableName = 'schools'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('director_name', 255)
      table.string('director_phone', 50)
      table.string('director_email', 255)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('director_name')
      table.dropColumn('director_phone')
      table.dropColumn('director_email')
    })
  }
}
