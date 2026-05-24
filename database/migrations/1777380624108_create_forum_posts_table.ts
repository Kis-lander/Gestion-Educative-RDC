import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ForumPostsSchema extends BaseSchema {
  protected tableName = 'forum_posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('topic_id').references('id').inTable('forum_topics').onDelete('CASCADE')
      table.uuid('user_id').references('id').inTable('users')
      table.text('content').notNullable()
      table.uuid('parent_post_id').references('id').inTable('forum_posts').onDelete('CASCADE')
      table.boolean('is_approved').defaultTo(true)
      table.timestamps(true)

      table.index(['topic_id', 'created_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
