import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env.local')) loadEnvFile('.env.local');
const missing = ['DATABASE_URL', 'BETTER_AUTH_URL', 'BETTER_AUTH_SECRET', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'].filter(key => !process.env[key]?.trim());
const issues = missing.map(key => `${key} is missing`);
if (process.env.BETTER_AUTH_SECRET && process.env.BETTER_AUTH_SECRET.length < 32) issues.push('BETTER_AUTH_SECRET must contain at least 32 characters');
if (process.env.BETTER_AUTH_URL) {
  try { if (new URL(process.env.BETTER_AUTH_URL).protocol !== 'https:') issues.push('BETTER_AUTH_URL must use HTTPS for production'); }
  catch { issues.push('BETTER_AUTH_URL is not a valid URL'); }
}
if (process.env.DATABASE_URL) {
  try { if (!['postgres:', 'postgresql:'].includes(new URL(process.env.DATABASE_URL).protocol)) issues.push('DATABASE_URL must use PostgreSQL'); }
  catch { issues.push('DATABASE_URL is not a valid URL'); }
}
if (issues.length) { console.error('Submission setup is incomplete:\n' + issues.map(issue => `- ${issue}`).join('\n')); process.exitCode = 1; }
else console.log('Required deployment settings are present. Values were not printed; database connectivity and OAuth login still need live testing.');
