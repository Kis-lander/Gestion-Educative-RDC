import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ScopeForumTopicsToSchoolSections extends BaseSchema {
  protected tableName = 'forum_topics'

  public async up() {
    await this.db.rawQuery(`
      ALTER TABLE forum_topics
      ADD COLUMN IF NOT EXISTS school_section_id uuid
    `)

    await this.db.rawQuery(`
      CREATE INDEX IF NOT EXISTS forum_topics_school_section_id_created_at_index
      ON forum_topics (school_section_id, created_at)
    `)

    await this.db.rawQuery(`
      UPDATE forum_topics
      SET school_section_id = classes.school_section_id
      FROM classes
      WHERE forum_topics.class_id = classes.id
        AND forum_topics.school_section_id IS NULL
    `)
  }

  public async down() {
    await this.db.rawQuery('DROP INDEX IF EXISTS forum_topics_school_section_id_created_at_index')
    await this.db.rawQuery('ALTER TABLE forum_topics DROP COLUMN IF EXISTS school_section_id')
  }
}
