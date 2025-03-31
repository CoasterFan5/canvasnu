import { defineConfig } from "drizzle-kit";
import * as dotenvx from "@dotenvx/dotenvx";
dotenvx.config({
  path: "../../.env",
});

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./src/drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },

  verbose: true,
  strict: true,
  dialect: "postgresql",
});
