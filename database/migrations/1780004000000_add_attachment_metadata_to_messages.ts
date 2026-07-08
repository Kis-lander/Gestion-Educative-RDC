import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAttachmentMetadataToMessages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('attachment_url', 500).nullable()
      table.string('attachment_name', 255).nullable()
      table.integer('attachment_size').nullable()
      table.string('attachment_mime', 120).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('attachment_url')
      table.dropColumn('attachment_name')
      table.dropColumn('attachment_size')
      table.dropColumn('attachment_mime')
    })
  }
}
