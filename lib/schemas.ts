import { z } from "zod"

export const cuisineSchema = z.object({
  style: z.string(),
  priority: z.number().min(1).max(5),
})

export const onboardingSchema = z.object({
  userId: z.string().optional(),
  budget: z.number().min(50, "Budget must be at least €50").max(10000, "Budget must be at most €10000"),
  allergies: z.array(z.string()),
  dislikes: z.array(z.object({ item: z.string(), priority: z.number().min(1).max(5) })),
  cookingTime: z.number().min(5).max(300),
  mealsPerDay: z.number().min(1).max(6),
  snacksPerDay: z.number().min(0).max(5),
  dietType: z.string(),
  cuisines: z.array(cuisineSchema),
  boostNutrient: z.boolean(),
  priorityNutrient: z.string().nullable().optional(),
})

export const recipeInputSchema = z.object({
  title: z.string(),
  instructions: z.union([z.string(), z.array(z.string())]),
  cookTime: z.number(),
  cuisineCategory: z.string(),
  sourceType: z.string(),
  imageUrl: z.string().optional(),
  pricePerServing: z.number(),
  nutrients: z.record(z.number()),
  ingredients: z.array(z.object({ ingredientId: z.string(), quantityGrams: z.number() })).optional(),
})

