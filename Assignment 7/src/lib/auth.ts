import "server-only";
import { betterAuth } from "better-auth";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createAuthOptions } from "./auth-options";

let instance: ReturnType<typeof betterAuth> | undefined;

export function getAuth() {
  if (!instance) {
    const path = resolve(/* turbopackIgnore: true */ process.env.AUTH_DATABASE_PATH || ".data/auth.sqlite");
    mkdirSync(dirname(path), { recursive: true });
    const database = new DatabaseSync(path);
    database.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
    instance = betterAuth(createAuthOptions(database));
  }
  return instance;
}
