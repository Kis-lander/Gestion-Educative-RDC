import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreatePublicCarouselImagesTable extends BaseSchema {
  protected tableName = 'public_carousel_images'

  public async up() {
    await this.db.rawQuery(`
      create table if not exists public_carousel_images (
        id uuid primary key default gen_random_uuid(),
        image_url text not null,
        description text not null,
        display_order integer not null default 0,
        status varchar(20) not null default 'active'
          check (status in ('active', 'hidden')),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    await this.db.rawQuery(`
      create index if not exists public_carousel_images_status_order_idx
        on public_carousel_images (status, display_order asc, created_at desc)
    `)
  }

  public async down() {
    await this.db.rawQuery('drop table if exists public_carousel_images')
  }
}
