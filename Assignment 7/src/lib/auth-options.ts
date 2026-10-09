import type { BetterAuthOptions } from "better-auth";
import type { DatabaseSync } from "node:sqlite";

export function createAuthOptions(database: DatabaseSync): BetterAuthOptions {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("Set BETTER_AUTH_SECRET to a random value of at least 32 characters in .env.local.");
  const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return {
    appName: "BazarDor",
    database,
    secret,
    baseURL,
    trustedOrigins: [new URL(baseURL).origin],
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
