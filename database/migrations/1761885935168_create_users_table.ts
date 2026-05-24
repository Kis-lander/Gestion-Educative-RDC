import { BaseSchema } from '@adonisjs/lucid/schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('school_id').references('id').inTable('schools').onDelete('SET NULL')
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('first_name', 100).notNullable()
      table.string('last_name', 100).notNullable()
      table.string('phone', 20)
      table.string('avatar_url')
      table
        .enum('role', [
          'inspection',
          'director',
          'finance_director',
          'teacher',
          'parent',
          'student',
          'discipline_director',
        ])
        .notNullable()
      table.enum('status', ['active', 'inactive', 'suspended']).defaultTo('active')
      table.timestamp('last_login')
      table.string('remember_me_token')
      table.timestamps(true)

      // Index composites pour optimisations
      table.index(['school_id', 'role'])
      table.index(['email', 'status'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
