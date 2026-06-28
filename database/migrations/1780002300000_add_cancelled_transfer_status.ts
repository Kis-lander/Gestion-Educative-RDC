import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.defer(async (db) => {
      await db.rawQuery(`
        alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_status_check
      `)
      await db.rawQuery(`
        alter table transfer_authorizations
        add constraint transfer_authorizations_status_check
        check (status in ('pending', 'approved', 'rejected', 'used', 'cancelled'))
      `)
    })
  }

  public async down() {
    this.defer(async (db) => {
      await db.rawQuery(`
        update transfer_authorizations
        set status = 'rejected',
            rejection_reason = coalesce(rejection_reason, 'Demande annulée par l''école d''origine')
        where status = 'cancelled'
      `)
      await db.rawQuery(`
        alter table transfer_authorizations
        drop constraint if exists transfer_authorizations_status_check
      `)
      await db.rawQuery(`
        alter table transfer_authorizations
        add constraint transfer_authorizations_status_check
        check (status in ('pending', 'approved', 'rejected', 'used'))
      `)
    })
  }
}
