import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateOtpCodesTable extends BaseSchema {
  protected tableName = 'otp_codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('email', 255).notNullable()
      table.string('purpose', 50).notNullable().defaultTo('login')
      table.string('code_hash', 255).notNullable()
      table.integer('attempts').notNullable().defaultTo(0)
      table.timestamp('expires_at').notNullable()
      table.timestamp('used_at')
      table.timestamps(true)

      table.index(['email', 'purpose'])
      table.index(['user_id', 'purpose'])
      table.index(['expires_at'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
