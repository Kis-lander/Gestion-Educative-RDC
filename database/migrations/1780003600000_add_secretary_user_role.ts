import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddSecretaryUserRole extends BaseSchema {
  public async up() {
    await this.db.rawQuery(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_role_enum') THEN
          ALTER TYPE users_role_enum ADD VALUE IF NOT EXISTS 'secretary';
        END IF;
      END
      $$;
    `)

    await this.db.rawQuery('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check')
    await this.db.rawQuery(`
      ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role in ('inspection', 'director', 'finance_director', 'teacher', 'parent', 'student', 'discipline_director', 'secretary'))
    `)
  }

  public async down() {
    await this.db.rawQuery('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check')
    await this.db.rawQuery(`
      ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role in ('inspection', 'director', 'finance_director', 'teacher', 'parent', 'student', 'discipline_director'))
    `)
  }
}
