# Deploy BazarDor to Vercel

## 1. Repository and project settings

Import `https://github.com/Asiful-0160/Programming-Hero-Assignment-7` into Vercel.

- Framework: Next.js
- Root Directory: **assignment-7** (the repository root is one directory above the app)
- Node.js: **24.x**
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: leave the Next.js default

Do not configure a static export: authentication and product APIs require server functions.

## 2. Hosted PostgreSQL

Create a PostgreSQL database through your preferred provider, such as Neon through the Vercel Marketplace. Use the provider's connection URL and its required TLS parameters. Use a pooled connection URL for the app when the provider offers one; use a direct connection for migrations if the provider requires it.

The app automatically selects PostgreSQL when `DATABASE_URL` is set. Without it, local development uses SQLite. On Vercel, missing `DATABASE_URL` is an error instead of silently using temporary filesystem storage.

Local SQLite accounts do not automatically transfer to PostgreSQL. Create an account in the deployed app after migration.

## 3. Vercel environment variables

Configure these in your Vercel project before the final production deployment:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Hosted PostgreSQL connection URL |
| `BETTER_AUTH_SECRET` | New random secret, at least 32 characters |
| `BETTER_AUTH_URL` | Exact public HTTPS origin, e.g. `https://your-project.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google web OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret |

Generate a production secret in your own terminal with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` and paste it directly into Vercel. Do not commit or share secrets. Do not use `NEXT_PUBLIC_` prefixes for these settings.

Use a separate GitHub OAuth app for production so the local callback can remain configured. Set both providers' production callback URLs:

- Google: `https://your-project.vercel.app/api/auth/callback/google`
- GitHub: `https://your-project.vercel.app/api/auth/callback/github`

For Google, also configure the public origin. Configure the consent-screen audience appropriately for examiners; do not leave required examiner accounts blocked by a test-user restriction. Rebuild after setting credentials because button availability is rendered during the build.

## 4. Initialize the hosted database

Run `npm run auth:migrate` from a trusted environment with `DATABASE_URL` and `BETTER_AUTH_SECRET` set to the hosted database's settings. The same command selects PostgreSQL automatically and applies BetterAuth's schema. It does not copy local SQLite users.

You can temporarily configure those settings in the ignored `.env.local` file to run migration locally. Preserve your local settings if you want to return to SQLite afterwards. The script respects existing shell environment variables over `.env.local`.

Run `npm run deploy:check` against the intended production settings. This checks required values without printing secrets; it does not prove the database is reachable or OAuth is configured correctly. Do not run migrations automatically during every Vercel build or request.

## 5. Verify the deployed application

- Register, sign in, refresh, update your name, and sign out.
- Test Google and GitHub from the public URL.
- Open `/category/chal` and refresh it directly.
- Open a product while signed out: it must require sign-in.
- Sign in, open a product, and check all market prices.
- Open `/profile/edit` directly and test a name update.
- Check a nonexistent category and a nonexistent product while signed in.
- Check mobile navigation, product cards, sorting, ticker pause, and the footer.
- Test the actual upstream product endpoints; a deployment cannot repair their HTTP 429 rate limits.

## 6. Submission

Add the live URL to README.md, retain the GitHub URL, and verify at least eight meaningful commits before submitting. The code has not been published merely by following local setup.

References: [Vercel Next.js](https://vercel.com/docs/frameworks/full-stack/nextjs), [BetterAuth PostgreSQL](https://better-auth.com/docs/adapters/postgresql), [Google OAuth](https://better-auth.com/docs/authentication/google), [GitHub OAuth](https://better-auth.com/docs/authentication/github).
