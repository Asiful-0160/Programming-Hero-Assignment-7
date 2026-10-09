# বাজার দর — BazarDor

A Bengali market-price application for comparing everyday essentials across local markets.

## Project status

Stage 2: shared responsive header, category navigation, Bengali date (Asia/Dhaka), locally served Bengali typography, and footer. Category and authentication links target routes that will be implemented in later stages. The live price ticker follows with the product API integration.

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

