import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateInspectionSettingsTable extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      create table if not exists inspection_settings (
        key varchar(255) primary key,
        "group" varchar(255) not null,
        value text null,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)
  }

  public async down() {
    await this.db.rawQuery(`drop table if exists inspection_settings`)
  }
}
