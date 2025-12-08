import { generateWeeklyPlan, swapMeal, type NutrientTargets } from "@/lib/fahimeh"

const recipes = [
  {
    id: "r1",
    title: "Meal A",
    instructions: "",
    cookTime: 20,
    cuisineCategory: "Test",
    sourceType: "SYSTEM",
    pricePerServing: 2,
    nutrients: { calories: 500, protein: 20 },
  },
  {
    id: "r2",
    title: "Meal B",
    instructions: "",
    cookTime: 10,
    cuisineCategory: "Test",
    sourceType: "SYSTEM",
    pricePerServing: 1.5,
    nutrients: { calories: 450, protein: 18 },
  },
]

const prefs = {
  budget: 30,
  allergies: [],
  dislikes: [],
  likes: [],
  cuisines: [],
  maxCookTime: 60,
  mealsPerDay: 3,
}

const targets: NutrientTargets = { dri: { calories: 2000, protein: 50 } }

describe("fahimeh", () => {
  it("generates 7 days of meals", () => {
    const plan = generateWeeklyPlan(recipes, prefs, targets)
    expect(plan.days).toHaveLength(7)
  })

  it("swaps a meal", () => {
    const plan = generateWeeklyPlan(recipes, prefs, targets)
    const updated = swapMeal(plan, 0, 0, recipes, prefs, targets, "cheaper")
    expect(updated.days[0].meals[0].recipeId).not.toBe(plan.days[0].meals[0].recipeId)
  })
})

