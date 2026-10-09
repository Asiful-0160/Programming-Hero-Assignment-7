# Final validation — 10 October 2026

## Passed locally

- 13 unit/integration tests: authentication lifecycle, password hashing, request-origin rejection, session revocation, database selection, numeric sorting, formatting, market calculations, and API fallback.
- 9 real-browser tests: registration/login/logout, protected pages, profile editing, persistent updates, product detail retry/missing states, storefront layouts at 320/768/1440 pixels, category sorting, page refresh, ticker pause, reduced motion, loading and empty states, and unknown routes.
- ESLint, TypeScript (production build), and Next.js production build.
- `npm ci --dry-run --ignore-scripts --offline`: lockfile consistency check; not a fresh Linux install.
- Production dependency audit: zero known vulnerabilities reported. Five development-only advisories remain in the existing ESLint dependency chain.
- Mobile profile/product screenshots and desktop home screenshot inspected. Browser product data is isolated test data, not a substitute for the live APIs.

## Still required before submission

- Provision hosted PostgreSQL, configure `DATABASE_URL`, run migration, and test database connectivity. PostgreSQL selection compiles and is unit-tested; a real hosted connection has not been tested.
- Configure and test Google/GitHub OAuth credentials and the production HTTPS origin.
- Deploy to Vercel and repeat the live checks in DEPLOYMENT.md.
- Restore access to the product APIs: both supplied endpoints returned HTTP 429 during the final check. The application's retry/error paths work; live price availability is outside the app's control.
- Add the live URL to README.md.
- Make the final two meaningful commits manually. There were six commits when this review started. No commits or pushes were performed by the assistant.
