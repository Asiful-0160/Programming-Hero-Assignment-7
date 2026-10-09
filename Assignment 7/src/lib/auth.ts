import "server-only";
import { betterAuth } from "better-auth";
import { createAuthOptions } from "./auth-options";
import { createAuthDatabase } from "./auth-database";

let instance: ReturnType<typeof betterAuth> | undefined;

export function getAuth() {
  if (!instance) instance = betterAuth(createAuthOptions(createAuthDatabase().database));
  return instance;
}
