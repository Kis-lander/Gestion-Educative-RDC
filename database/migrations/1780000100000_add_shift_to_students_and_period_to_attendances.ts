import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddShiftToStudentsAndPeriodToAttendances extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      alter table students
      add column if not exists shift text
      check (shift in ('morning', 'afternoon', 'evening'))
      default 'morning'
    `)
    await this.db.from('students').whereNull('shift').update({ shift: 'morning' })
    await this.db.rawQuery(`alter table students alter column shift set default 'morning'`)
    await this.db.rawQuery(`alter table students alter column shift set not null`)
    await this.db.rawQuery(`
      create index if not exists students_school_id_class_id_shift_index
      on students (school_id, class_id, shift)
    `)

    await this.db.rawQuery(`
      create table if not exists attendances (
        id uuid primary key default gen_random_uuid(),
        class_id uuid not null references classes(id) on delete cascade,
        student_id uuid not null references students(id) on delete cascade,
        date date not null,
        period text not null default 'morning'
          check (period in ('morning', 'afternoon', 'full')),
        status text not null check (status in ('present', 'absent', 'late', 'excused')),
        reason text null,
        justification text null,
        justification_document varchar(255) null,
        justified_at timestamptz null,
        justified_by uuid null references users(id) on delete set null,
        recorded_by uuid null references users(id) on delete set null,
        created_at timestamptz,
        updated_at timestamptz
      )
    `)

    await this.db.rawQuery(`
      alter table attendances
      add column if not exists period text
      check (period in ('morning', 'afternoon', 'full'))
      default 'morning'
    `)
    await this.db.from('attendances').whereNull('period').update({ period: 'morning' })
    await this.db.rawQuery(`alter table attendances alter column period set default 'morning'`)
    await this.db.rawQuery(`alter table attendances alter column period set not null`)
    await this.db.rawQuery(`
      create index if not exists attendances_class_id_date_period_index
      on attendances (class_id, date, period)
    `)
    await this.db.rawQuery(`
      create unique index if not exists attendances_class_id_student_id_date_period_unique
      on attendances (class_id, student_id, date, period)
    `)
    await this.db.rawQuery(`
      create index if not exists attendances_student_id_date_index
      on attendances (student_id, date)
    `)
  }

  public async down() {
    await this.db.rawQuery(`drop index if exists students_school_id_class_id_shift_index`)
    await this.db.rawQuery(`alter table students drop column if exists shift`)

    const hasAttendances = await this.schema.hasTable('attendances')
    if (hasAttendances) {
      await this.db.rawQuery(`drop index if exists attendances_class_id_date_period_index`)
      await this.db.rawQuery(`alter table attendances drop column if exists period`)
    }
  }
}
