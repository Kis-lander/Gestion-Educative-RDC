import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'forum_reactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.enum('target_type', ['topic', 'post']).notNullable()
      table.uuid('target_id').notNullable()
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.enum('reaction', ['like', 'dislike']).notNullable()
      table.timestamps(true)

      table.unique(['target_type', 'target_id', 'user_id'])
      table.index(['target_type', 'target_id', 'reaction'])
      table.index(['user_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
