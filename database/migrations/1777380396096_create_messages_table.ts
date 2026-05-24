import { BaseSchema } from '@adonisjs/lucid/schema'

export default class MessagesSchema extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('sender_id').references('id').inTable('users').onDelete('SET NULL')
      table.uuid('receiver_id').references('id').inTable('users').onDelete('CASCADE')
      table.uuid('school_id').references('id').inTable('schools').onDelete('CASCADE')
      table.string('subject', 255).notNullable()
      table.text('content').notNullable()
      table.enum('type', ['official', 'parent_teacher', 'general', 'system'])
      table.boolean('is_global').defaultTo(false)
      table.boolean('is_read').defaultTo(false)
      table.timestamp('read_at')
      table.boolean('has_attachment').defaultTo(false)
      table.timestamps(true)

      table.index(['receiver_id', 'is_read'])
      table.index(['sender_id', 'created_at'])
      table.index(['school_id', 'type'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
