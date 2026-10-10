import test from 'node:test';
import assert from 'node:assert/strict';
import { Pool } from 'pg';
import { createAuthDatabase } from '../src/lib/auth-database.ts';

test('Vercel cannot silently fall back to ephemeral SQLite', () => {
  assert.throws(() => createAuthDatabase({ VERCEL: '1' }), /DATABASE_URL/);
});
test('database selection accepts PostgreSQL without connecting and rejects other protocols', async () => {
  const selected = createAuthDatabase({ DATABASE_URL: 'postgresql://test:test@localhost:5432/test' });
  assert.ok(selected.database instanceof Pool);
  await selected.close();
  assert.throws(() => createAuthDatabase({ DATABASE_URL: 'https://localhost/database' }), /PostgreSQL/);
});
