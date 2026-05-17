import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    const sql = neon(databaseUrl)
    db = drizzle(sql, { schema })
  }
  
  return db
}

export type Database = ReturnType<typeof getDb>