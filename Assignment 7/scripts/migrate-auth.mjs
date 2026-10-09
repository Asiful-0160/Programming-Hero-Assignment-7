import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { getMigrations } from 'better-auth/db/migration';
import { createAuthOptions } from '../src/lib/auth-options.ts';
import { createAuthDatabase } from '../src/lib/auth-database.ts';

if (existsSync('.env.local')) loadEnvFile('.env.local');
const { database, close } = createAuthDatabase();
try {
  const migrations = await getMigrations(createAuthOptions(database));
  await migrations.runMigrations();
  console.log('Authentication database schema is ready.');
} finally {
  await close();
}
