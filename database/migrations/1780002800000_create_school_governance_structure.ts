import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    this.schema.createTable('school_sections', (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').notNullable().references('id').inTable('schools').onDelete('CASCADE')
      table.string('code', 30).notNullable()
      table.string('name', 100).notNullable()
      table.integer('display_order').notNullable().defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamps(true)

      table.unique(['school_id', 'code'])
      table.index(['school_id', 'is_active'])
    })

    this.schema.createTable('school_staff_assignments', (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').notNullable().references('id').inTable('schools').onDelete('CASCADE')
      table
        .uuid('school_section_id')
        .nullable()
        .references('id')
        .inTable('school_sections')
        .onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('position', 60).notNullable()
      table.boolean('is_primary').notNullable().defaultTo(true)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.uuid('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamps(true)

      table.unique(['user_id', 'school_section_id', 'position'], {
        indexName: 'school_staff_assignment_unique',
      })
      table.index(['school_id', 'position', 'is_active'])
      table.index(['school_section_id', 'position'])
    })

    this.schema.alterTable('classes', (table) => {
      table
        .uuid('school_section_id')
        .nullable()
        .references('id')
        .inTable('school_sections')
        .onDelete('SET NULL')
      table.index(['school_id', 'school_section_id'])
    })

    this.defer(async (db) => {
      const schools = await db.from('schools').select('id')

      for (const school of schools) {
        const definitions = [
          { code: 'maternelle', name: 'Section maternelle', display_order: 1 },
          { code: 'primaire', name: 'Section primaire', display_order: 2 },
          { code: 'secondaire', name: 'Section secondaire', display_order: 3 },
        ]

        for (const definition of definitions) {
          await db
            .table('school_sections')
            .insert({
              school_id: school.id,
              ...definition,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .onConflict(['school_id', 'code'])
            .ignore()
        }

        const sections = await db.from('school_sections').where('school_id', school.id)
        const sectionByCode = new Map(sections.map((section) => [section.code, section.id]))

        await db
          .from('classes')
          .where('school_id', school.id)
          .whereNull('school_section_id')
          .whereILike('level', '%matern%')
          .update({ school_section_id: sectionByCode.get('maternelle'), updated_at: new Date() })
        await db
          .from('classes')
          .where('school_id', school.id)
          .whereNull('school_section_id')
          .whereILike('level', '%primaire%')
          .update({ school_section_id: sectionByCode.get('primaire'), updated_at: new Date() })
        await db
          .from('classes')
          .where('school_id', school.id)
          .whereNull('school_section_id')
          .update({ school_section_id: sectionByCode.get('secondaire'), updated_at: new Date() })

        const directors = await db
          .from('users')
          .where('school_id', school.id)
          .where('role', 'director')

        for (const director of directors) {
          await db
            .table('school_staff_assignments')
            .insert({
              school_id: school.id,
              school_section_id: null,
              user_id: director.id,
              position: 'promoter',
              is_primary: true,
              is_active: true,
              created_by: null,
              created_at: new Date(),
              updated_at: new Date(),
            })
            .onConflict()
            .ignore()
        }
      }
    })
  }

  public async down() {
    this.schema.alterTable('classes', (table) => {
      table.dropIndex(['school_id', 'school_section_id'])
      table.dropColumn('school_section_id')
    })
    this.schema.dropTable('school_staff_assignments')
    this.schema.dropTable('school_sections')
  }
}
