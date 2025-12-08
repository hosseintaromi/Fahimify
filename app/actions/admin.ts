"use server";

import { db } from "@/db/client";
import { userProfile, weeklyPlan } from "@/db/schema";
import { listIngredients, listPrices, listRecipes } from "@/lib/data";

export const fetchAdminSnapshot = async () => {
  const [users, plans, recipes, ingredients, prices] = await Promise.all([
    db.select().from(userProfile),
    db.select().from(weeklyPlan),
    listRecipes(),
    listIngredients(),
    listPrices(),
  ]);
  return {
    users,
    plans,
    recipes,
    ingredients,
    prices,
  };
};
