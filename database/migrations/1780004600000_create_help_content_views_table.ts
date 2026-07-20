import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateHelpContentViewsTable extends BaseSchema {
  protected tableName = 'help_content_views'

  public async up() {
    await this.db.rawQuery(`
      create table if not exists help_content_views (
        slug varchar(120) primary key,
        title varchar(255) not null,
        views_count integer not null default 0,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    await this.db.rawQuery(`
      create index if not exists help_content_views_count_idx
        on help_content_views (views_count desc, updated_at desc)
    `)
  }

  public async down() {
    await this.db.rawQuery('drop table if exists help_content_views')
  }
}
