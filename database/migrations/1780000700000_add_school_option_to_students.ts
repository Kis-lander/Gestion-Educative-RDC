import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSchoolOptionToStudents extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('school_option', 100).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('school_option')
    })
  }
}
