import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!db) {
    if (typeof window !== "undefined") {
      throw new Error("Database should not be accessed on the client side")
    }
    
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set")
    }
    const sql = neon(databaseUrl)
    db = drizzle(sql, { schema })
  }
  return db
}