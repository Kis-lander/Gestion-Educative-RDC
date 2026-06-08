import { BaseSchema } from '@adonisjs/lucid/schema'

export default class EnforceThreePartUserNames extends BaseSchema {
  public async up() {
    const hasPostnom = await this.schema.hasColumn('users', 'postnom')
    if (!hasPostnom) return

    await this.db.rawQuery(`
      update users
      set postnom = 'A completer'
      where postnom is null or btrim(postnom) = ''
    `)

    await this.db.rawQuery(`
      update users
      set first_name = 'A completer'
      where first_name is null or btrim(first_name) = ''
    `)

    await this.db.rawQuery(`
      update users
      set last_name = 'A completer'
      where last_name is null or btrim(last_name) = ''
    `)

    await this.db.rawQuery(`alter table users alter column postnom set default 'A completer'`)
    await this.db.rawQuery(`alter table users alter column postnom set not null`)
  }

  public async down() {
    const hasPostnom = await this.schema.hasColumn('users', 'postnom')
    if (!hasPostnom) return

    await this.db.rawQuery(`alter table users alter column postnom drop not null`)
    await this.db.rawQuery(`alter table users alter column postnom drop default`)
  }
}
