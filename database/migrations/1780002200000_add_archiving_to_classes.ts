import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddArchivingToClasses extends BaseSchema {
  protected tableName = 'classes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('archived_at', { useTz: true }).nullable()
      table.uuid('archived_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.index(['school_id', 'archived_at'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['school_id', 'archived_at'])
      table.dropColumn('archived_by')
      table.dropColumn('archived_at')
    })
  }
}
