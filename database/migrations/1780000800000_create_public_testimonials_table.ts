import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreatePublicTestimonialsTable extends BaseSchema {
  protected tableName = 'public_testimonials'

  public async up() {
    await this.db.rawQuery(`
      create table if not exists public_testimonials (
        id uuid primary key default gen_random_uuid(),
        author_name varchar(120) not null,
        author_role varchar(120),
        school_name varchar(160),
        province varchar(120),
        content text not null,
        rating integer not null default 5 check (rating between 1 and 5),
        status varchar(20) not null default 'approved'
          check (status in ('pending', 'approved', 'rejected')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    await this.db.rawQuery(`
      create index if not exists public_testimonials_status_created_at_idx
        on public_testimonials (status, created_at desc)
    `)
  }

  public async down() {
    await this.db.rawQuery('drop table if exists public_testimonials')
  }
}
