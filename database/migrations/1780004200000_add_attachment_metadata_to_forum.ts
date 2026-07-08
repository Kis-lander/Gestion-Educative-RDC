import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAttachmentMetadataToForum extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      ALTER TABLE forum_topics
        ADD COLUMN IF NOT EXISTS attachment_url varchar(500),
        ADD COLUMN IF NOT EXISTS attachment_name varchar(255),
        ADD COLUMN IF NOT EXISTS attachment_size integer,
        ADD COLUMN IF NOT EXISTS attachment_mime varchar(120)
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_posts
        ADD COLUMN IF NOT EXISTS attachment_url varchar(500),
        ADD COLUMN IF NOT EXISTS attachment_name varchar(255),
        ADD COLUMN IF NOT EXISTS attachment_size integer,
        ADD COLUMN IF NOT EXISTS attachment_mime varchar(120)
    `)
  }

  public async down() {
    await this.db.rawQuery(`
      ALTER TABLE forum_topics
        DROP COLUMN IF EXISTS attachment_url,
        DROP COLUMN IF EXISTS attachment_name,
        DROP COLUMN IF EXISTS attachment_size,
        DROP COLUMN IF EXISTS attachment_mime
    `)

    await this.db.rawQuery(`
      ALTER TABLE forum_posts
        DROP COLUMN IF EXISTS attachment_url,
        DROP COLUMN IF EXISTS attachment_name,
        DROP COLUMN IF EXISTS attachment_size,
        DROP COLUMN IF EXISTS attachment_mime
    `)
  }
}
