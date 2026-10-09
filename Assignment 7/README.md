# বাজার দর — BazarDor

A Bengali market-price application for comparing everyday essentials across local markets.

## Current features

- Responsive Bengali navigation and locally served Bengali typography.
- Live price ticker with pause and reduced-motion support.
- Top six price risers and fallers, plus all 33 API products.
- Category browsing with numeric price sorting, loading, retry, and empty states.
- BetterAuth email/password registration, sign-in, persistent sessions, and logout.
- Friendly 404 pages and Bengali validation/toast messages.

Protected product details now include market-based minimum, maximum and average prices, a responsive market table, retry and missing-product states. Both the page and its API validate the session on the server. Protected profile and name-editing pages are implemented at `/profile` and `/profile/edit`, with server-side name validation and immediate session/navbar refresh. Google/GitHub sign-in is wired but requires your OAuth credentials; buttons are unavailable until configured.

## Technologies

Next.js App Router, React, TypeScript, Tailwind CSS, DaisyUI, BetterAuth, SQLite/PostgreSQL, react-hot-toast, and Playwright.

## Local development

Use Node.js **24.15 or newer** (built-in SQLite) and npm.

```sh
npm ci
npm run auth:setup
npm run auth:migrate
npm run dev
```

Open http://localhost:3000. Registration leads to sign-in; successful sign-in leads home. Email verification and password reset are intentionally omitted per the assignment.

`auth:setup` creates `.env.local` with a random secret only if that file does not already exist. `auth:migrate` creates/updates BetterAuth's schema. The local database is `.data/auth.sqlite`. Environment secrets, databases, and browser-test artifacts are ignored by Git. Keep `.env.example` committed as the configuration template.

## Google and GitHub sign-in

Create your own OAuth applications and fill in these server-only keys in `.env.local`:

```dotenv
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Use these callback URLs for local development:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

Set Google's authorized JavaScript origin and GitHub's homepage URL to `http://localhost:3000`. After changing credentials, restart development or rebuild/restart the production server. Provider availability on the forms is set during page rendering/build.

Official setup references: [Google](https://better-auth.com/docs/authentication/google), [GitHub](https://better-auth.com/docs/authentication/github), [Next.js integration](https://better-auth.com/docs/integrations/next).

`BETTER_AUTH_URL` must match the origin you visit, including its port. For a different local port, change that setting before starting the app. Never share or commit `.env.local`.

## Validation

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run test:browser
```

Browser tests use an installed Google Chrome and a separate `.data/auth-e2e.sqlite` database on port 3100. Use `PLAYWRIGHT_CHANNEL=msedge` if Chrome is unavailable. Test passwords and accounts are generated only in isolated test databases. Storefront tests cover 320px, 768px, and 1440px widths, sorting, retry/empty states, and reduced motion using isolated test data. Tests also cover validation, registration, login, persistent sessions, logout, hashed passwords, rejected origins, product formatting, sorting, and API fallback.

Run `npm start` to serve the production build at http://localhost:3000.

## Deployment note

Vercel deployment with hosted PostgreSQL is prepared. Set `DATABASE_URL` to select PostgreSQL, run `npm run auth:migrate` against that database, and configure the public origin and OAuth credentials. SQLite remains the local default; it is never used as fallback on Vercel. See [the deployment guide](docs/DEPLOYMENT.md) for the exact root directory, environment variables, migrations, and verification steps. Run `npm run deploy:check` with production settings before submission.

## Structure

- `src/app`: pages and API routes.
- `src/components`: layout, products, categories, and authentication UI.
- `src/lib`: product logic and server/client authentication configuration.
- `scripts`: local secret setup and database migrations.
- `tests`: unit/integration tests and browser authentication flow.
- `public/images`: supplied assignment artwork.

## Submission

- Live URL: pending deployment
- Repository URL: https://github.com/Asiful-0160/Programming-Hero-Assignment-7

Market averages use the arithmetic mean of each market's min/max midpoint. Product-detail tests use isolated fixtures; the application always uses the supplied APIs and shows an error when both are unavailable.
