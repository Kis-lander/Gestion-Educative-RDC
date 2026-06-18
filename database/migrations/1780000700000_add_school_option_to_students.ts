import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSchoolOptionToStudents extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    await this.db.rawQuery(`alter table students add column if not exists school_option varchar(100)`)
  }

  public async down() {
    await this.db.rawQuery(`alter table students drop column if exists school_option`)
  }
}
