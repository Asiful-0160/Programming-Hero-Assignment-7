import { APIError } from "better-auth/api";
import type { BetterAuthOptions } from "better-auth";


export function createAuthOptions(database: NonNullable<BetterAuthOptions["database"]>): BetterAuthOptions {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("Set BETTER_AUTH_SECRET to a random value of at least 32 characters in .env.local.");
  if (process.env.VERCEL && !process.env.BETTER_AUTH_URL) throw new Error("Set BETTER_AUTH_URL to your public deployment origin.");
  const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return {
    appName: "BazarDor",
    database,
    secret,
    baseURL,
    trustedOrigins: [new URL(baseURL).origin],
    databaseHooks: {
      user: {
        update: {
          before: async (user) => {
            if (user.name === undefined) return;
            const name = user.name.trim();
            if (!name || name.length > 100) throw new APIError("BAD_REQUEST", { message: "Name must contain 1 to 100 characters." });
            return { data: { ...user, name } };
          },
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },
    socialProviders: {
      ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? {
        google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET },
      } : {}),
      ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? {
        github: { clientId: process.env.GITHUB_CLIENT_ID, clientSecret: process.env.GITHUB_CLIENT_SECRET },
      } : {}),
    },
  };
}
