import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const url = process.env.DATABASE_URL ?? "postgresql://opc:opc@localhost:5432/opc";

async function main(): Promise<void> {
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);
  console.log("Running migrations against:", url.replace(/:[^:@]+@/, ":***@"));
  await migrate(db, { migrationsFolder: "./src/migrations" });
  console.log("Migrations complete.");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
