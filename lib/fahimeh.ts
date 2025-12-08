export type RecipeInput = {
  id: string
  title: string
  instructions: string
  cookTime: number
  cuisineCategory: string
  sourceType: string
  imageUrl?: string
  pricePerServing: number
  nutrients: Record<string, number>
  ingredients?: { ingredientId: string; quantityGrams: number }[]
}

export type UserPreferences = {
  budget: number
  allergies: string[]
  dislikes: string[]
  likes: string[]
  cuisines: { style: string; priority: number }[]
  maxCookTime: number
  mealsPerDay: number
  boostNutrient?: string
}

export type NutrientTargets = {
  dri: Record<string, number>
  ul?: Record<string, number>
}

export type MealSlot = {
  recipeId: string
  title: string
  price: number
  cookTime: number
  nutrients: Record<string, number>
}

export type DayPlan = {
  dateIndex: number
  meals: MealSlot[]
}

export type WeeklyPlanResult = {
  totalCost: number
  days: DayPlan[]
}

const preferenceWeight = (recipe: RecipeInput, likes: string[], cuisines: { style: string; priority: number }[]) => {
  const likeBoost = likes.some((item) => recipe.title.toLowerCase().includes(item.toLowerCase())) ? 1.2 : 1
  const cuisineScore =
    cuisines.find((c) => c.style.toLowerCase() === recipe.cuisineCategory.toLowerCase())?.priority ?? 1
  return likeBoost * cuisineScore
}

const nutrientScore = (recipe: RecipeInput, target: NutrientTargets, boost?: string) => {
  const keys = Object.keys(target.dri)
  if (!keys.length) return 0
  return keys.reduce((sum, key) => {
    const expected = target.dri[key] ?? 0
    if (!expected) return sum
    const value = recipe.nutrients[key] ?? 0
    const ratio = value / expected
    const boostWeight = boost && boost.toLowerCase() === key.toLowerCase() ? 2 : 1
    return sum + ratio * boostWeight
  }, 0)
}

const normalizePrice = (recipes: RecipeInput[]) => {
  const max = Math.max(...recipes.map((r) => r.pricePerServing))
  const min = Math.min(...recipes.map((r) => r.pricePerServing))
  return { min, max: max || 1 }
}

const calculateScore = (
  recipe: RecipeInput,
  preferences: UserPreferences,
  target: NutrientTargets,
  priceRange: { min: number; max: number },
) => {
  const pref = preferenceWeight(recipe, preferences.likes, preferences.cuisines)
  const nut = nutrientScore(recipe, target, preferences.boostNutrient)
  const normalizedPrice = (recipe.pricePerServing - priceRange.min) / (priceRange.max - priceRange.min || 1)
  return pref * 1.5 + nut * 2 - normalizedPrice
}

const passesFilters = (recipe: RecipeInput, preferences: UserPreferences) => {
  if (recipe.cookTime > preferences.maxCookTime) return false
  const lowerTitle = recipe.title.toLowerCase()
  if (preferences.dislikes.some((d) => lowerTitle.includes(d.toLowerCase()))) return false
  if (preferences.allergies.length && recipe.ingredients) {
    const hit = recipe.ingredients.some((ing) =>
      preferences.allergies.some((a) => ing.ingredientId.toLowerCase().includes(a.toLowerCase())),
    )
    if (hit) return false
  }
  return true
}

export const generateWeeklyPlan = (
  recipes: RecipeInput[],
  preferences: UserPreferences,
  target: NutrientTargets,
): WeeklyPlanResult => {
  if (!recipes.length) {
    return { totalCost: 0, days: [] }
  }
  const valid = recipes.filter((r) => passesFilters(r, preferences))
  const priceRange = normalizePrice(valid.length ? valid : recipes)
  const ranked = [...valid].sort(
    (a, b) => calculateScore(b, preferences, target, priceRange) - calculateScore(a, preferences, target, priceRange),
  )
  const days: DayPlan[] = []
  let cost = 0
  const used = new Set<string>()
  for (let d = 0; d < 7; d += 1) {
    const meals: MealSlot[] = []
    for (let m = 0; m < preferences.mealsPerDay; m += 1) {
      const candidate = ranked.find((r) => !used.has(r.id) && cost + r.pricePerServing <= preferences.budget)
      const pick = candidate ?? ranked[0] ?? recipes[0]
      if (pick) {
        meals.push({
          recipeId: pick.id,
          title: pick.title,
          price: pick.pricePerServing,
          cookTime: pick.cookTime,
          nutrients: pick.nutrients,
        })
        used.add(pick.id)
        cost += pick.pricePerServing
      }
    }
    days.push({ dateIndex: d, meals })
  }
  return { totalCost: cost, days }
}

export const swapMeal = (
  plan: WeeklyPlanResult,
  dayIndex: number,
  mealIndex: number,
  recipes: RecipeInput[],
  preferences: UserPreferences,
  target: NutrientTargets,
  strategy: "cheaper" | "faster" | "nutrient",
): WeeklyPlanResult => {
  const current = plan.days[dayIndex]?.meals[mealIndex]
  if (!current) return plan
  const priceRange = normalizePrice(recipes)
  const sorted = [...recipes].sort((a, b) => {
    if (strategy === "cheaper") return a.pricePerServing - b.pricePerServing
    if (strategy === "faster") return a.cookTime - b.cookTime
    return calculateScore(b, preferences, target, priceRange) - calculateScore(a, preferences, target, priceRange)
  })
  const replacement = sorted.find((r) => r.id !== current.recipeId && passesFilters(r, preferences)) ?? recipes[0]
  const updated = plan.days.map((day, idx) => {
    if (idx !== dayIndex) return day
    const meals = day.meals.map((meal, mIdx) =>
      mIdx === mealIndex
        ? {
            recipeId: replacement.id,
            title: replacement.title,
            price: replacement.pricePerServing,
            cookTime: replacement.cookTime,
            nutrients: replacement.nutrients,
          }
        : meal,
    )
    return { ...day, meals }
  })
  const totalCost = updated.reduce(
    (sum, day) => sum + day.meals.reduce((mSum, meal) => mSum + meal.price, 0),
    0,
  )
  return { days: updated, totalCost }
}

