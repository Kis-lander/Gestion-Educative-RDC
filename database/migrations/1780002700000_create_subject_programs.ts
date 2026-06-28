import { BaseSchema } from '@adonisjs/lucid/schema'
import {
  COMMON_SUBJECT_CODES,
  NATIONAL_SUBJECT_CATALOG,
  OPTION_SUBJECT_CODES,
} from '../../app/services/national_subject_catalog.js'

export default class extends BaseSchema {
  protected tableName = 'subject_programs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('subject_id').notNullable().references('id').inTable('subjects').onDelete('CASCADE')
      table.string('level', 100).notNullable()
      table.integer('grade_level_min').notNullable()
      table.integer('grade_level_max').notNullable()
      table.string('school_option', 150).nullable()
      table.integer('default_coefficient').notNullable().defaultTo(1)
      table.integer('default_hours_per_week').notNullable().defaultTo(2)
      table.timestamps(true)

      table.unique(
        ['subject_id', 'level', 'grade_level_min', 'grade_level_max', 'school_option'],
        { indexName: 'subject_programs_scope_unique' }
      )
      table.index(['level', 'school_option'])
    })

    this.defer(async (db) => {
      for (const definition of NATIONAL_SUBJECT_CATALOG) {
        await db
          .table('subjects')
          .insert({
            name: definition.name,
            code: definition.code,
            description: definition.description,
            coefficient: definition.coefficient,
            is_standard: true,
            created_at: new Date(),
            updated_at: new Date(),
          })
          .onConflict('code')
          .merge({
            name: definition.name,
            description: definition.description,
            coefficient: definition.coefficient,
            is_standard: true,
            updated_at: new Date(),
          })
      }

      const subjects = await db.from('subjects').where('is_standard', true)
      const byCode = new Map(subjects.map((subject) => [subject.code, subject]))
      const rows: Record<string, any>[] = []

      for (const code of COMMON_SUBJECT_CODES) {
        const subject = byCode.get(code)
        if (!subject) continue
        rows.push({
          subject_id: subject.id,
          level: 'Tous',
          grade_level_min: 1,
          grade_level_max: 12,
          school_option: null,
          default_coefficient: subject.coefficient || 1,
          default_hours_per_week: code === 'FRA' || code === 'MAT' ? 5 : 2,
          created_at: new Date(),
          updated_at: new Date(),
        })
      }

      for (const [option, codes] of Object.entries(OPTION_SUBJECT_CODES)) {
        for (const code of codes) {
          const subject = byCode.get(code)
          if (!subject) continue
          rows.push({
            subject_id: subject.id,
            level: 'Humanités',
            grade_level_min: 9,
            grade_level_max: 12,
            school_option: option,
            default_coefficient: subject.coefficient || 1,
            default_hours_per_week: subject.coefficient >= 3 ? 6 : subject.coefficient === 2 ? 4 : 2,
            created_at: new Date(),
            updated_at: new Date(),
          })
        }
      }

      if (rows.length) {
        await db.table('subject_programs').insert(rows).onConflict().ignore()
      }
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
