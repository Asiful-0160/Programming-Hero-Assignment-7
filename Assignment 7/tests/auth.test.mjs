import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { createAuthOptions } from '../src/lib/auth-options.ts';
import { validateAuthFields } from '../src/lib/auth-validation.ts';

test('form validation rejects blank name, invalid email, short password, and mismatch', () => {
  const valid = { name: 'Test User', email: 'person@example.com', password: 'long-password-123', confirmPassword: 'long-password-123' };
  assert.equal(validateAuthFields('signup', valid), null);
  assert.ok(validateAuthFields('signup', { ...valid, name: '  ' }));
  assert.ok(validateAuthFields('signin', { ...valid, email: 'bad' }));
  assert.ok(validateAuthFields('signin', { ...valid, password: 'short' }));
  assert.ok(validateAuthFields('signup', { ...valid, confirmPassword: 'different' }));
});

test('BetterAuth email lifecycle, password hashing, origin protection, and session revocation', async () => {
  process.env.BETTER_AUTH_SECRET = randomBytes(48).toString('base64url');
  process.env.BETTER_AUTH_URL = 'http://localhost:3000';
  const database = new DatabaseSync(':memory:');
  const options = createAuthOptions(database);
  const { runMigrations } = await getMigrations(options);
  await runMigrations();
  const auth = betterAuth(options);
  const email = 'auth-test@example.com';
  const password = 'Test-pass-12345!';
  const request = (path, body, cookie = '', origin = 'http://localhost:3000') => auth.handler(new Request(`http://localhost:3000/api/auth/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'content-type': 'application/json', origin, ...(cookie ? { cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }));
  try {
    const rejected = await request('sign-up/email', { email, password: 'short', name: 'Test User' });
    assert.equal(rejected.ok, false);
    const signup = await request('sign-up/email', { email, password, name: 'Test User' });
    assert.equal(signup.status, 200);
    const signupData = await signup.json();
    assert.equal(signupData.token, null, 'registration must not automatically sign in');
    const stored = database.prepare('SELECT password FROM account WHERE providerId = ?').get('credential');
    assert.ok(stored.password && stored.password !== password, 'password must be hashed');
    const wrongPassword = await request('sign-in/email', { email, password: 'wrong-password' });
    assert.equal(wrongPassword.status, 401);
    const foreignOrigin = await request('sign-in/email', { email, password }, '', 'https://untrusted.example');
    assert.equal(foreignOrigin.status, 403);
    const login = await request('sign-in/email', { email, password });
    assert.equal(login.status, 200);
    const setCookies = login.headers.getSetCookie();
    assert.ok(setCookies.some(value => /httponly/i.test(value)));
    const cookie = setCookies.map(value => value.split(';')[0]).join('; ');
    assert.ok(cookie);
    const session = await request('get-session', undefined, cookie);
    assert.equal((await session.json()).user.email, email);
    const logout = await request('sign-out', {}, cookie);
    assert.equal(logout.status, 200);
    const afterLogout = await request('get-session', undefined, cookie);
    assert.equal(await afterLogout.json(), null);
  } finally {
    database.close();
  }
});
