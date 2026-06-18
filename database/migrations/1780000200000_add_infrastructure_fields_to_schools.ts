import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddInfrastructureFieldsToSchools extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      alter table schools
      add column if not exists has_electricity boolean default false,
      add column if not exists has_internet boolean default false,
      add column if not exists has_library boolean default false
    `)
    await this.db.rawQuery(`
      update schools
      set
        has_electricity = coalesce(has_electricity, false),
        has_internet = coalesce(has_internet, false),
        has_library = coalesce(has_library, false)
    `)

    for (const column of ['has_electricity', 'has_internet', 'has_library']) {
      await this.db.rawQuery(`alter table schools alter column ${column} set default false`)
      await this.db.rawQuery(`alter table schools alter column ${column} set not null`)
    }
  }

  public async down() {
    await this.db.rawQuery(`
      alter table schools
      drop column if exists has_electricity,
      drop column if exists has_internet,
      drop column if exists has_library
    `)
  }
}
