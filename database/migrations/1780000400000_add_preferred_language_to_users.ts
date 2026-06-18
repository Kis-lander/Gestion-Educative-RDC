import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddPreferredLanguageToUsers extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      alter table users
      add column if not exists preferred_language varchar(8) default 'fr'
    `)
    await this.db.rawQuery(`update users set preferred_language = 'fr' where preferred_language is null`)
    await this.db.rawQuery(`alter table users alter column preferred_language set default 'fr'`)
    await this.db.rawQuery(`alter table users alter column preferred_language set not null`)
  }

  public async down() {
    await this.db.rawQuery(`alter table users drop column if exists preferred_language`)
  }
}
