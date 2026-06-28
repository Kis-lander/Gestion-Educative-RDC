import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddStaffAssignmentScopeUniqueness extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS school_staff_one_school_wide_position_active
      ON school_staff_assignments (school_id, position)
      WHERE is_active = true
        AND school_section_id IS NULL
        AND position IN ('finance_director', 'secretary')
    `)

    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS school_staff_one_section_position_active
      ON school_staff_assignments (school_id, school_section_id, position)
      WHERE is_active = true
        AND school_section_id IS NOT NULL
        AND position IN (
          'preschool_director',
          'primary_director',
          'prefect',
          'studies_director',
          'pedagogical_advisor',
          'discipline_director',
          'deputy_discipline_director'
        )
    `)
  }

  public async down() {
    await this.db.rawQuery('DROP INDEX IF EXISTS school_staff_one_school_wide_position_active')
    await this.db.rawQuery('DROP INDEX IF EXISTS school_staff_one_section_position_active')
  }
}
