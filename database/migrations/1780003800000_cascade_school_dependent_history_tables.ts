import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_from_school_id_foreign,
        add constraint transfer_authorizations_from_school_id_foreign
          foreign key (from_school_id) references schools(id) on delete cascade
    `)

    await this.db.rawQuery(`
      alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_to_school_id_foreign,
        add constraint transfer_authorizations_to_school_id_foreign
          foreign key (to_school_id) references schools(id) on delete cascade
    `)

    await this.db.rawQuery(`
      alter table student_school_histories
        drop constraint if exists student_school_histories_school_id_foreign,
        add constraint student_school_histories_school_id_foreign
          foreign key (school_id) references schools(id) on delete cascade
    `)

    await this.db.rawQuery(`
      alter table student_school_histories
        drop constraint if exists student_school_histories_destination_school_id_foreign,
        add constraint student_school_histories_destination_school_id_foreign
          foreign key (destination_school_id) references schools(id) on delete cascade
    `)
  }

  public async down() {
    await this.db.rawQuery(`
      alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_from_school_id_foreign,
        add constraint transfer_authorizations_from_school_id_foreign
          foreign key (from_school_id) references schools(id)
    `)

    await this.db.rawQuery(`
      alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_to_school_id_foreign,
        add constraint transfer_authorizations_to_school_id_foreign
          foreign key (to_school_id) references schools(id)
    `)

    await this.db.rawQuery(`
      alter table student_school_histories
        drop constraint if exists student_school_histories_school_id_foreign,
        add constraint student_school_histories_school_id_foreign
          foreign key (school_id) references schools(id)
    `)

    await this.db.rawQuery(`
      alter table student_school_histories
        drop constraint if exists student_school_histories_destination_school_id_foreign,
        add constraint student_school_histories_destination_school_id_foreign
          foreign key (destination_school_id) references schools(id)
    `)
  }
}
