import { defineConfig } from 'drizzle-kit';
const dotenv = require('dotenv');

dotenv.config();
// Ensure DATABASE_URL is set
const databaseUrl = process.env.DATABASE_URL;
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL, ensure the database is provisioned');
}

export default defineConfig({
  out: './migrations',
  schema: './db/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    url: databaseUrl as string,
  },
});
