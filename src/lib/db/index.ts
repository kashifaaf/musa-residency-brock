import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;
let connection: postgres.Sql | null = null;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    
    connection = postgres(process.env.DATABASE_URL, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    
    db = drizzle(connection, { schema });
  }
  
  return db;
}

export async function closeDb() {
  if (connection) {
    await connection.end();
    connection = null;
    db = null;
  }
}

export { schema };