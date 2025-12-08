import { z } from "zod"

export const cuisineSchema = z.object({
  style: z.string(),
  priority: z.number().min(1).max(5),
})

export const onboardingSchema = z.object({
  userId: z.string().optional(),
  budget: z.number(),
  allergies: z.array(z.string()),
  dislikes: z.array(z.object({ item: z.string(), priority: z.number().min(1).max(5) })),
  cookingTime: z.number(),
  mealsPerDay: z.number(),
  snacksPerDay: z.number(),
  dietType: z.string(),
  cuisines: z.array(cuisineSchema),
  boostNutrient: z.boolean(),
  priorityNutrient: z.string().nullable().optional(),
})

export const recipeInputSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  cookTime: z.number(),
  cuisineCategory: z.string(),
  sourceType: z.string(),
  imageUrl: z.string().optional(),
  pricePerServing: z.number(),
  nutrients: z.record(z.number()),
  ingredients: z.array(z.object({ ingredientId: z.string(), quantityGrams: z.number() })).optional(),
})

