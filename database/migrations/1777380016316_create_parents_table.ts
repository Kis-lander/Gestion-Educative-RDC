import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ParentsSchema extends BaseSchema {
  protected tableName = 'parents'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').unique()
      table.string('profession')
      table.string('emergency_phone', 20)
      table.string('relationship', 50) // père, mère, tuteur, etc.
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
