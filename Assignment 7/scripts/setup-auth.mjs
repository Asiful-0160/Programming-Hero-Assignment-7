import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

if (!existsSync('.env.local')) {
  writeFileSync('.env.local', `BETTER_AUTH_SECRET=${randomBytes(48).toString('base64url')}\nBETTER_AUTH_URL=http://localhost:3000\nAUTH_DATABASE_PATH=.data/auth.sqlite\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\nGITHUB_CLIENT_ID=\nGITHUB_CLIENT_SECRET=\n`, { flag: 'wx' });
  console.log('Created .env.local with a generated secret. Secret values are not printed.');
} else {
  console.log('Existing .env.local preserved.');
}
mkdirSync('.data', { recursive: true });
