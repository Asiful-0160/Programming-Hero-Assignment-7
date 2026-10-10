# বাজার দর — BazarDor

A responsive Bengali market-price application built for Programming Hero Assignment 7.

- **Live website:** [BazarDor](https://programming-hero-assignment-7-assig.vercel.app)
- **Repository:** [Programming-Hero-Assignment-7](https://github.com/Asiful-0160/Programming-Hero-Assignment-7)

## Features

- Live market-price ticker and top six price increases and decreases.
- Product cards with Bengali prices and category-based numeric sorting.
- Protected product details with minimum, maximum, average and market prices.
- BetterAuth email/password, Google and GitHub authentication.
- Profile viewing and name updates on a separate edit page.
- Responsive layouts, loading skeletons, retry states and friendly missing-page messages.

## Technologies

Next.js App Router, React, TypeScript, Tailwind CSS, DaisyUI, BetterAuth, PostgreSQL (Neon), SQLite for local development, and Playwright. Hosted on Vercel.

## Run locally

The application is in `assignment-7`. Use Node.js 24.x (24.15 or newer).

```sh
cd assignment-7
npm ci
npm run auth:setup
npm run auth:migrate
npm run dev
```

See the [application README](assignment-7/README.md) for environment setup and tests, and the [deployment guide](assignment-7/docs/DEPLOYMENT.md) for hosting instructions.