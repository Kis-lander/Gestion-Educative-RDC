import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUserSettingsTable extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      create table if not exists user_settings (
        id uuid primary key,
        user_id uuid not null references users(id) on delete cascade,
        "group" varchar(255) not null,
        key varchar(255) not null,
        value text null,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)
    await this.db.rawQuery(`
      create unique index if not exists user_settings_user_id_key_unique
      on user_settings (user_id, key)
    `)
    await this.db.rawQuery(`
      create index if not exists user_settings_user_id_group_index
      on user_settings (user_id, "group")
    `)
  }

  public async down() {
    await this.db.rawQuery(`drop table if exists user_settings`)
  }
}
