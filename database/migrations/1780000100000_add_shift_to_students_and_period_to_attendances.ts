import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddShiftToStudentsAndPeriodToAttendances extends BaseSchema {
  public async up() {
    const hasStudentsShift = await this.schema.hasColumn('students', 'shift')
    if (!hasStudentsShift) {
      this.schema.alterTable('students', (table) => {
        table.enum('shift', ['morning', 'afternoon', 'evening']).notNullable().defaultTo('morning')
        table.index(['school_id', 'class_id', 'shift'])
      })
    }

    await this.db.from('students').whereNull('shift').update({ shift: 'morning' })

    const hasAttendances = await this.schema.hasTable('attendances')
    if (!hasAttendances) {
      this.schema.createTable('attendances', (table) => {
        table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
        table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE').notNullable()
        table.uuid('student_id').references('id').inTable('students').onDelete('CASCADE').notNullable()
        table.date('date').notNullable()
        table.enum('period', ['morning', 'afternoon', 'full']).notNullable().defaultTo('morning')
        table.enum('status', ['present', 'absent', 'late', 'excused']).notNullable()
        table.text('reason').nullable()
        table.text('justification').nullable()
        table.string('justification_document').nullable()
        table.timestamp('justified_at').nullable()
        table.uuid('justified_by').references('id').inTable('users').onDelete('SET NULL').nullable()
        table.uuid('recorded_by').references('id').inTable('users').onDelete('SET NULL').nullable()
        table.timestamps(true)

        table.unique(['class_id', 'student_id', 'date', 'period'])
        table.index(['class_id', 'date', 'period'])
        table.index(['student_id', 'date'])
      })
      return
    }

    const hasAttendancesPeriod = await this.schema.hasColumn('attendances', 'period')
    if (!hasAttendancesPeriod) {
      this.schema.alterTable('attendances', (table) => {
        table.enum('period', ['morning', 'afternoon', 'full']).notNullable().defaultTo('morning')
        table.index(['class_id', 'date', 'period'])
      })
    }

    await this.db.from('attendances').whereNull('period').update({ period: 'morning' })
  }

  public async down() {
    const hasStudentsShift = await this.schema.hasColumn('students', 'shift')
    if (hasStudentsShift) {
      this.schema.alterTable('students', (table) => {
        table.dropIndex(['school_id', 'class_id', 'shift'])
        table.dropColumn('shift')
      })
    }

    const hasAttendances = await this.schema.hasTable('attendances')
    if (hasAttendances) {
      const hasAttendancesPeriod = await this.schema.hasColumn('attendances', 'period')
      if (hasAttendancesPeriod) {
        this.schema.alterTable('attendances', (table) => {
          table.dropIndex(['class_id', 'date', 'period'])
          table.dropColumn('period')
        })
      }
    }
  }
}
