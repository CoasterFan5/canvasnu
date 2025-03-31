import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "$env/dynamic/private";
if (!env.DATABASE_URL) throw new Error("Ru Roh, DB ENV ERR");

export const db = drizzle(postgres(env.DATABASE_URL));
