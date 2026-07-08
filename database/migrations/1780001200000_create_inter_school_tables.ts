import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateInterSchoolTables extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      create table if not exists inter_school_events (
        id uuid primary key default gen_random_uuid(),
        organizer_school_id uuid references schools(id) on delete cascade,
        title varchar(255) not null,
        description text not null,
        event_type varchar(50) not null default 'seminar',
        start_date date not null,
        end_date date not null,
        location varchar(255) not null,
        max_participants integer,
        registration_deadline date,
        participation_fee numeric(12, 2) default 0,
        status varchar(50) not null default 'open',
        additional_info text,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      create table if not exists event_participants (
        id uuid primary key default gen_random_uuid(),
        event_id uuid not null references inter_school_events(id) on delete cascade,
        school_id uuid references schools(id) on delete cascade,
        participants_count integer not null default 1,
        notes text,
        status varchar(50) not null default 'registered',
        registered_at timestamptz,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      create table if not exists inter_school_exchanges (
        id uuid primary key default gen_random_uuid(),
        from_school_id uuid references schools(id) on delete cascade,
        to_school_id uuid references schools(id) on delete cascade,
        subject varchar(255) not null,
        message text not null,
        exchange_type varchar(50) not null default 'general',
        proposed_date date,
        participants integer,
        status varchar(50) not null default 'pending',
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      create table if not exists inter_school_exchange_messages (
        id uuid primary key default gen_random_uuid(),
        exchange_id uuid not null references inter_school_exchanges(id) on delete cascade,
        sender_id uuid references users(id) on delete set null,
        school_id uuid references schools(id) on delete cascade,
        content text not null,
        attachment_url varchar(500),
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      create table if not exists best_practices (
        id uuid primary key default gen_random_uuid(),
        school_id uuid references schools(id) on delete cascade,
        title varchar(255) not null,
        category varchar(80) not null default 'pedagogy',
        description text not null,
        results text,
        resources jsonb default '[]'::jsonb,
        tags jsonb default '[]'::jsonb,
        is_public boolean not null default true,
        likes integer not null default 0,
        views integer not null default 0,
        rating numeric(3, 2) not null default 0,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      create table if not exists best_practice_comments (
        id uuid primary key default gen_random_uuid(),
        practice_id uuid not null references best_practices(id) on delete cascade,
        user_id uuid references users(id) on delete set null,
        content text not null,
        likes integer not null default 0,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`create index if not exists inter_school_events_start_date_index on inter_school_events(start_date)`)
    await this.db.rawQuery(`create index if not exists inter_school_exchanges_from_to_index on inter_school_exchanges(from_school_id, to_school_id)`)
    await this.db.rawQuery(`create index if not exists best_practices_category_index on best_practices(category)`)
  }

  public async down() {
    await this.db.rawQuery(`drop table if exists best_practice_comments`)
    await this.db.rawQuery(`drop table if exists best_practices`)
    await this.db.rawQuery(`drop table if exists inter_school_exchange_messages`)
    await this.db.rawQuery(`drop table if exists inter_school_exchanges`)
    await this.db.rawQuery(`drop table if exists event_participants`)
    await this.db.rawQuery(`drop table if exists inter_school_events`)
  }
}
