import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      ALTER TABLE forum_topics
      ADD COLUMN IF NOT EXISTS is_resolved boolean NOT NULL DEFAULT false
    `)
  }

  public async down() {
    await this.db.rawQuery('ALTER TABLE forum_topics DROP COLUMN IF EXISTS is_resolved')
  }
}
