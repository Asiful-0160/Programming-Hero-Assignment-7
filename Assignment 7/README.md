# বাজার দর — BazarDor

A Bengali market-price application for comparing everyday essentials across local markets.

## Project status

Stage 3: home page with a hero, live API price ticker, top six percentage risers and fallers, and all product cards. Includes Bengali price formatting, skeletons, retry and empty states, and automatic fallback to the alternate assignment API. Category, product detail, and authentication destinations will be implemented in the next stages.

## Technologies

Next.js App Router, React, TypeScript, Tailwind CSS, DaisyUI, BetterAuth, and react-hot-toast.
BetterAuth is installed but not configured yet; database and OAuth setup will be added during the authentication stage.

## Planned features

- Daily product prices with top price rises and falls.
- Category browsing with numeric price sorting.
- Protected product details and market-by-market price comparisons.
- Email/password, Google, and GitHub authentication.
- Profile viewing and name updates.
- Responsive Bengali interface with loading states and toast notifications.

## Local development

Use Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Validation

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

Run `npm start` to serve a completed production build.

## Structure

- `src/app`: App Router pages, root layout, and global styles.
- `public/images`: supplied assignment artwork.
- `src/components/layout`: shared header, navigation, date, and footer.
- `src/lib/categories.ts`: category metadata verified against the assignment API.

No environment variables are required for this initial stage. Never commit authentication secrets.

## Submission

- Live URL: pending deployment
- Repository URL: pending manual repository creation


