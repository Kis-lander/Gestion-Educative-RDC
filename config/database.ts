import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const databaseUrl = env.get('DATABASE_URL')
const postgresUrl = databaseUrl?.match(/^postgres(ql)?:\/\//) ? databaseUrl : null

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      // Cette ligne vérifie d'abord si DATABASE_URL existe,
      // sinon elle utilise l'objet avec les variables séparées.
      connection: postgresUrl || {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT') || 5432),
        user: env.get('DB_USER'),
        password: String(env.get('DB_PASSWORD') ?? ''),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
