import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    const hasEnrollmentDate = await this.schema.hasColumn(this.tableName, 'enrollment_date')

    if (!hasEnrollmentDate) {
      this.schema.alterTable(this.tableName, (table) => {
        table.date('enrollment_date').nullable()
      })
    }

    this.defer(async (db) => {
      await db.rawQuery(`
        update students
        set enrollment_date = coalesce(created_at::date, current_date)
        where enrollment_date is null
      `)
      await db.rawQuery(`
        alter table students
        alter column enrollment_date set default current_date,
        alter column enrollment_date set not null
      `)
    })
  }

  public async down() {
    const hasEnrollmentDate = await this.schema.hasColumn(this.tableName, 'enrollment_date')

    if (hasEnrollmentDate) {
      this.schema.alterTable(this.tableName, (table) => {
        table.dropColumn('enrollment_date')
      })
    }
  }
}
