import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

let db: ReturnType<typeof drizzle> | null = null

export function getDb() {
  if (!db) {
    if (typeof window !== 'undefined') {
      throw new Error("Database access is not allowed in the browser")
    }
    
    const url = process.env.DATABASE_URL
    if (!url) {
      throw new Error("DATABASE_URL environment variable is required")
    }
    const sql = neon(url)
    db = drizzle(sql, { schema })
  }
  return db
}