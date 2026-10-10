import { Pool } from "pg";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export function createAuthDatabase(env: NodeJS.ProcessEnv = process.env) {
  if (env.DATABASE_URL) {
    const url = new URL(env.DATABASE_URL);
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("DATABASE_URL must be a PostgreSQL connection URL.");
    const database = new Pool({ connectionString: env.DATABASE_URL, max: 3, idleTimeoutMillis: 10000, connectionTimeoutMillis: 10000 });
    return { database, close: () => database.end() };
  }
  if (env.VERCEL) throw new Error("Set DATABASE_URL to a hosted PostgreSQL database before using authentication on Vercel.");
  const path = resolve(/* turbopackIgnore: true */ env.AUTH_DATABASE_PATH || ".data/auth.sqlite");
  mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
  return { database, close: async () => { database.close(); } };
}
