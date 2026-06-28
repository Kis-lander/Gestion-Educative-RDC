import { BaseSchema } from '@adonisjs/lucid/schema'
import {
  NATIONAL_SUBJECT_CATALOG,
  findNationalSubject,
} from '../../app/services/national_subject_catalog.js'

export default class extends BaseSchema {
  public async up() {
    const hasIsStandard = await this.schema.hasColumn('subjects', 'is_standard')
    if (!hasIsStandard) {
      this.schema.alterTable('subjects', (table) => {
        table.boolean('is_standard').notNullable().defaultTo(true)
      })
    }

    const hasCoefficient = await this.schema.hasColumn('class_subject', 'coefficient')
    if (!hasCoefficient) {
      this.schema.alterTable('class_subject', (table) => {
        table.integer('coefficient').nullable()
      })
    }

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

      const canonicalRows = await db.from('subjects').where('is_standard', true)
      const canonicalByCode = new Map(canonicalRows.map((row) => [row.code, row]))
      const allSubjects = await db.from('subjects').orderBy('created_at', 'asc')

      for (const legacy of allSubjects) {
        const definition = findNationalSubject(`${legacy.name} ${legacy.code}`)
        if (!definition) {
          await db.from('subjects').where('id', legacy.id).update({ is_standard: false })
          continue
        }

        const canonical = canonicalByCode.get(definition.code)
        if (!canonical || canonical.id === legacy.id) continue

        const legacyAssignments = await db
          .from('class_subject')
          .where('subject_id', legacy.id)

        for (const assignment of legacyAssignments) {
          const existing = await db
            .from('class_subject')
            .where('class_id', assignment.class_id)
            .where('subject_id', canonical.id)
            .first()

          if (existing) {
            await db.from('class_subject').where('id', assignment.id).delete()
          } else {
            await db
              .from('class_subject')
              .where('id', assignment.id)
              .update({
                subject_id: canonical.id,
                coefficient: assignment.coefficient || legacy.coefficient || canonical.coefficient,
              })
          }
        }

        await db.from('grades').where('subject_id', legacy.id).update({ subject_id: canonical.id })
        await db
          .from('assignments')
          .where('subject_id', legacy.id)
          .update({ subject_id: canonical.id })
        await db.from('subjects').where('id', legacy.id).delete()
      }

      await db.rawQuery(`
        update class_subject
        set coefficient = coalesce(
          class_subject.coefficient,
          subjects.coefficient,
          1
        )
        from subjects
        where subjects.id = class_subject.subject_id
      `)
      await db.rawQuery(`
        alter table class_subject
        alter column coefficient set default 1,
        alter column coefficient set not null
      `)
    })
  }

  public async down() {
    const hasCoefficient = await this.schema.hasColumn('class_subject', 'coefficient')
    if (hasCoefficient) {
      this.schema.alterTable('class_subject', (table) => {
        table.dropColumn('coefficient')
      })
    }

    const hasIsStandard = await this.schema.hasColumn('subjects', 'is_standard')
    if (hasIsStandard) {
      this.schema.alterTable('subjects', (table) => {
        table.dropColumn('is_standard')
      })
    }
  }
}
