import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    const client = postgres(connectionString);
    db = drizzle(client, { schema });
  }
  return db;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

export * from './schema';