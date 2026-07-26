import 'dotenv/config'
import { defineConfig } from 'prisma/config'

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is missing.");
}

const databaseUrl = process.env.DB_MODE === 'libsql' ? 'file:./database/dev.db' : process.env.DB_URL;

export default defineConfig({
  schema: 'src/prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl
  }
})