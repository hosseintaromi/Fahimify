import { sql } from "drizzle-orm"
import { db } from "../db/client"

async function main() {
  await db.execute(
    sql`TRUNCATE weekly_plan, recipe_ingredient, recipe_master, price_inventory, ingredient_master RESTART IDENTITY CASCADE;`,
  )
  console.log("DB truncated.")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

