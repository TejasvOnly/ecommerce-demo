import { drizzle } from "drizzle-orm/neon-http";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import { neon } from "@neondatabase/serverless";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const sql = neon(env.DATABASE_URL);

export const db = drizzle(sql, { schema });
