import { sql } from "drizzle-orm";
import { db } from "../db/client";

async function main() {
  await db.execute(
    sql`
      CREATE TABLE IF NOT EXISTS meal_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        recipe_id TEXT NOT NULL,
        recipe_title TEXT NOT NULL,
        cost NUMERIC(10, 2) NOT NULL,
        nutrients JSONB NOT NULL DEFAULT '{}'::jsonb,
        consumed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        week_start TIMESTAMP NOT NULL
      );
    `
  );
  console.log("meal_log table created successfully.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
