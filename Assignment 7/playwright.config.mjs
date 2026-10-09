import { defineConfig } from '@playwright/test';
import { randomBytes } from 'node:crypto';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3100', headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' },
  webServer: {
    command: 'node scripts/migrate-auth.mjs && node node_modules/next/dist/bin/next start -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      BETTER_AUTH_URL: 'http://localhost:3100',
      BETTER_AUTH_SECRET: randomBytes(48).toString('base64url'),
      AUTH_DATABASE_PATH: '.data/auth-e2e.sqlite',
      DATABASE_URL: '', VERCEL: '',
      GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '', GITHUB_CLIENT_ID: '', GITHUB_CLIENT_SECRET: '',
    },
  },
});
