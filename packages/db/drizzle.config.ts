import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://opc:opc@localhost:5432/opc",
  },
  strict: true,
  verbose: true,
} satisfies Config;
