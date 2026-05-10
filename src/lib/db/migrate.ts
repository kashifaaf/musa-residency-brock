import { migrate } from 'drizzle-orm/neon-http/migrator';
import { getDb } from './index';

async function main() {
  console.log('Running migrations...');
  
  try {
    const db = getDb();
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();