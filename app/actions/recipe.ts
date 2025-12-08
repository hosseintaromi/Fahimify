"use server"

import { nanoid } from "nanoid"
import { addRecipe, listIngredients as listIngredientsDb, listPrices as listPricesDb } from "@/lib/data"
import { recipeInputSchema } from "@/lib/schemas"

export const createRecipe = async (input: unknown) => {
  const parsed = recipeInputSchema.parse(input)
  const recipe = { ...parsed, id: nanoid() }
  await addRecipe(recipe)
  return recipe
}

export const listIngredients = async () => listIngredientsDb()

export const listPrices = async () => listPricesDb()

