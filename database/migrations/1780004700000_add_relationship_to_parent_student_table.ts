import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddRelationshipToParentStudentTable extends BaseSchema {
  protected tableName = 'parent_student'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('relationship', 50).nullable()
    })

    this.defer(async (db) => {
      await db.rawQuery(`
        UPDATE parent_student
        SET relationship = parents.relationship
        FROM parents
        WHERE parent_student.parent_id = parents.id
          AND parent_student.relationship IS NULL
      `)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('relationship')
    })
  }
}
