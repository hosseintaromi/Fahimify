import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { sampleIngredients, samplePrices, sampleRecipes } from "@/db/mock-data";
import {
  ingredientMaster,
  priceInventory,
  recipeIngredient,
  recipeMaster,
} from "@/db/schema";
import type { RecipeInput } from "./fahimeh";
import { eq } from "drizzle-orm";

const ensureSeeded = async () => {
  if (process.env.SEED_MOCK !== "true") return;
  const counts = await db
    .select({ value: recipeMaster.id })
    .from(recipeMaster)
    .limit(1);
  if (counts.length) return;
  await db
    .insert(ingredientMaster)
    .values(
      sampleIngredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        nutritionalData: ing.nutritionalData,
        allergenTags: ing.allergenTags,
      }))
    )
    .onConflictDoNothing();

  await db
    .insert(priceInventory)
    .values(
      samplePrices.map((price) => ({
        id: price.id,
        ingredientId: price.ingredientId,
        storeName: price.storeName,
        region: price.region,
        pricePerUnit: price.pricePerUnit.toString(),
        unitSize: price.unitSize.toString(),
        unitType: price.unitType,
      }))
    )
    .onConflictDoNothing();

  await db
    .insert(recipeMaster)
    .values(
      sampleRecipes.map((rec) => ({
        id: rec.id,
        title: rec.title,
        instructions: rec.instructions,
        cookTime: rec.cookTime,
        cuisineCategory: rec.cuisineCategory,
        sourceType: rec.sourceType,
        imageUrl: rec.imageUrl,
        pricePerServing: rec.pricePerServing.toString(),
        nutrients: rec.nutrients,
      })) as any
    )
    .onConflictDoNothing();

  const recipeIngredients = sampleRecipes.flatMap((rec) =>
    (rec.ingredients ?? []).map((ing) => ({
      id: nanoid(),
      recipeId: rec.id,
      ingredientId: ing.ingredientId,
      quantityGrams: ing.quantityGrams.toString(),
    }))
  );
  if (recipeIngredients.length) {
    await db
      .insert(recipeIngredient)
      .values(
        recipeIngredients.map((ri) => ({
          id: ri.id,
          recipeId: ri.recipeId,
          ingredientId: ri.ingredientId,
          quantityGrams: ri.quantityGrams.toString(),
        })) as any
      )
      .onConflictDoNothing();
  }
};

export const listRecipes = async (): Promise<RecipeInput[]> => {
  await ensureSeeded();
  const recipes = await db.select().from(recipeMaster);
  const recipeIngs = await db.select().from(recipeIngredient);
  return recipes.map((rec) => ({
    id: rec.id,
    title: rec.title,
    instructions: rec.instructions ?? "",
    cookTime: rec.cookTime,
    cuisineCategory: rec.cuisineCategory,
    sourceType: rec.sourceType,
    imageUrl: rec.imageUrl ?? "",
    pricePerServing: Number(rec.pricePerServing ?? 0),
    nutrients: (rec.nutrients as Record<string, number>) ?? {},
    ingredients: recipeIngs
      .filter((ri) => ri.recipeId === rec.id)
      .map((ri) => ({
        ingredientId: ri.ingredientId,
        quantityGrams: Number(ri.quantityGrams),
      })),
  }));
};

export const addRecipe = async (recipe: RecipeInput) => {
  await ensureSeeded();
  const steps =
    Array.isArray(recipe.instructions) && recipe.instructions.length
      ? recipe.instructions.join("\n")
      : recipe.instructions;
  await db.insert(recipeMaster).values({
    id: recipe.id,
    title: recipe.title,
    instructions: steps,
    cookTime: recipe.cookTime,
    cuisineCategory: recipe.cuisineCategory,
    sourceType: recipe.sourceType,
    imageUrl: recipe.imageUrl,
    pricePerServing: recipe.pricePerServing.toString(),
    nutrients: recipe.nutrients,
  });
  if (recipe.ingredients?.length) {
    await db.insert(recipeIngredient).values(
      recipe.ingredients.map((ing) => ({
        id: nanoid(),
        recipeId: recipe.id,
        ingredientId: ing.ingredientId,
        quantityGrams: ing.quantityGrams.toString(),
      }))
    );
  }
  return recipe;
};

export const listIngredients = async () => {
  await ensureSeeded();
  return db.select().from(ingredientMaster);
};

export const listPrices = async () => {
  await ensureSeeded();
  return db.select().from(priceInventory);
};

export const getRecipeById = async (
  id: string
): Promise<RecipeInput | null> => {
  await ensureSeeded();
  const recipes = await db
    .select()
    .from(recipeMaster)
    .where(eq(recipeMaster.id, id));
  if (!recipes.length) return null;
  const rec = recipes[0];
  const recipeIngs = await db
    .select()
    .from(recipeIngredient)
    .where(eq(recipeIngredient.recipeId, id));
  return {
    id: rec.id,
    title: rec.title,
    instructions: rec.instructions ?? "",
    cookTime: rec.cookTime,
    cuisineCategory: rec.cuisineCategory,
    sourceType: rec.sourceType,
    imageUrl: rec.imageUrl ?? "",
    pricePerServing: Number(rec.pricePerServing ?? 0),
    nutrients: (rec.nutrients as Record<string, number>) ?? {},
    ingredients: recipeIngs.map((ri) => ({
      ingredientId: ri.ingredientId,
      quantityGrams: Number(ri.quantityGrams),
    })),
  };
};

export const seedMockData = async () => {
  await ensureSeeded();
  const recipes = await db.select().from(recipeMaster);
  return { recipes: recipes.length };
};
