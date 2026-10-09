import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import { getMigrations } from 'better-auth/db/migration';
import { createAuthOptions } from '../src/lib/auth-options.ts';

if (existsSync('.env.local')) loadEnvFile('.env.local');
const path = resolve(process.env.AUTH_DATABASE_PATH || '.data/auth.sqlite');
mkdirSync(dirname(path), { recursive: true });
const database = new DatabaseSync(path);
try {
  const migrations = await getMigrations(createAuthOptions(database));
  await migrations.runMigrations();
  console.log('Authentication database schema is ready.');
} finally {
  database.close();
}
