import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RolesSchema extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.string('name', 100).unique().notNullable()
      table.jsonb('permissions').notNullable().defaultTo(this.db.rawQuery("'[]'::jsonb").knexQuery)
      table.text('description')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
