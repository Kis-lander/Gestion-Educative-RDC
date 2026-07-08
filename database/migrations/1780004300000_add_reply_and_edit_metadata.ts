import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddReplyAndEditMetadata extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      ALTER TABLE messages
        ADD COLUMN IF NOT EXISTS parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS edited_at timestamptz
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_topics
        ADD COLUMN IF NOT EXISTS edited_at timestamptz
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_posts
        ADD COLUMN IF NOT EXISTS parent_topic_id uuid REFERENCES forum_topics(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS edited_at timestamptz
    `)
  }

  public async down() {
    await this.db.rawQuery(`
      ALTER TABLE messages
        DROP COLUMN IF EXISTS parent_message_id,
        DROP COLUMN IF EXISTS edited_at
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_topics
        DROP COLUMN IF EXISTS edited_at
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_posts
        DROP COLUMN IF EXISTS parent_topic_id,
        DROP COLUMN IF EXISTS edited_at
    `)
  }
}
