import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateHelpDocumentationFeedbackTable extends BaseSchema {
  protected tableName = 'help_documentation_feedback'

  public async up() {
    await this.db.rawQuery(`
      create table if not exists help_documentation_feedback (
        id uuid primary key default gen_random_uuid(),
        helpful boolean not null,
        page varchar(120) not null default 'documentation',
        remark text,
        status varchar(20) not null default 'new'
          check (status in ('new', 'reviewed', 'archived')),
        user_id uuid references users(id) on delete set null,
        school_id uuid references schools(id) on delete set null,
        user_role varchar(80),
        user_name varchar(180),
        user_email varchar(180),
        user_agent text,
        ip_address varchar(80),
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      )
    `)

    await this.db.rawQuery(`
      create index if not exists help_documentation_feedback_status_created_at_idx
        on help_documentation_feedback (status, created_at desc)
    `)

    await this.db.rawQuery(`
      create index if not exists help_documentation_feedback_school_created_at_idx
        on help_documentation_feedback (school_id, created_at desc)
    `)
  }

  public async down() {
    await this.db.rawQuery('drop table if exists help_documentation_feedback')
  }
}
