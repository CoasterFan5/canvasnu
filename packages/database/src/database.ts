import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
if (!process.env.DATABASE_URL) throw new Error("Ru Roh, DB ENV ERR");

export const db = drizzle(postgres(process.env.DATABASE_URL));
