import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ForumTopicsSchema extends BaseSchema {
  protected tableName = 'forum_topics'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('subject_id').references('id').inTable('subjects').onDelete('CASCADE')
      table.uuid('class_id').references('id').inTable('classes').onDelete('CASCADE')
      table.uuid('created_by').references('id').inTable('users')
      table.string('title', 255).notNullable()
      table.text('content')
      table.boolean('is_pinned').defaultTo(false)
      table.boolean('is_locked').defaultTo(false)
      table.integer('views_count').defaultTo(0)
      table.timestamps(true)
      
      table.index(['subject_id', 'class_id'])
      table.index(['created_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}