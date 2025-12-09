import { seedMockData } from "../lib/data"

async function main() {
  const res = await seedMockData()
  console.log(`Seeded recipes: ${res.recipes}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

