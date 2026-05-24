import { BaseSchema } from '@adonisjs/lucid/schema'

export default class SchoolsSchema extends BaseSchema {
  protected tableName = 'schools'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('teacher_id').nullable()
      table.string('name', 255).notNullable()
      table.string('code', 50).unique().notNullable()
      table.string('province', 100).notNullable()
      table.string('territory', 100).notNullable()
      table.string('address').notNullable()
      table.string('phone', 20)
      table.string('email', 255)
      table.string('logo_url')
      table.enum('status', ['active', 'suspended', 'pending']).defaultTo('pending')
      table.timestamp('approved_at')
      table.timestamps(true)

      // Index pour optimiser les recherches
      table.index(['province', 'territory'])
      table.index(['status'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
