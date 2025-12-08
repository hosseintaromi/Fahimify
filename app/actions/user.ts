"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { userProfile } from "@/db/schema";
import { calculateBmrHenry, calculateTee } from "@/lib/nutrition";
import { onboardingSchema } from "@/lib/schemas";
import { listRecipes as listRecipesDb } from "@/lib/data";
import { euDrv } from "@/lib/dri";

const defaultDri = { ...euDrv };

const defaultUl = {
  salt: 6,
};

export const submitOnboardingData = async (input: unknown) => {
  const parsed = onboardingSchema.parse(input);
  const userId = parsed.userId ?? "demo-user";
  const metrics = {
    age: 25,
    sex: "male" as const,
    weightKg: 70,
    heightCm: 175,
    pal: 1.6,
  };
  const bmr = calculateBmrHenry({
    age: metrics.age,
    sex: metrics.sex,
    weightKg: metrics.weightKg,
    heightCm: metrics.heightCm,
  });
  const tee = calculateTee(bmr, metrics.pal);
  const nutrientTargets = {
    dri: { ...defaultDri, calories: tee },
    ul: defaultUl,
  };
  const preferences = {
    budget: parsed.budget,
    allergies: parsed.allergies,
    dislikes: parsed.dislikes.map((d) => d.item),
    likes: [],
    cuisines: parsed.cuisines,
    maxCookTime: parsed.cookingTime,
    mealsPerDay: parsed.mealsPerDay,
    boostNutrient: parsed.boostNutrient
      ? parsed.priorityNutrient ?? ""
      : undefined,
  };
  await db
    .insert(userProfile)
    .values({
      userId,
      personalMetrics: metrics,
      preferences,
      nutrientTargets,
    })
    .onConflictDoUpdate({
      target: userProfile.userId,
      set: {
        personalMetrics: metrics,
        preferences,
        nutrientTargets,
        updatedAt: sql`NOW()`,
      },
    });
  const recipesAvailable = (await listRecipesDb()).length;
  return { ok: true, nutrientTargets, recipesAvailable };
};

export const getUserProfile = async (userId: string) => {
  const targetId = userId ?? "demo-user";
  const profile = await db
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, targetId))
    .limit(1);
  return profile[0] ?? null;
};

export const listRecipes = async () => listRecipesDb();

export const setDefaultProfile = async (userId: string) => {
  const preferences = {
    budget: 150,
    allergies: [],
    dislikes: [],
    likes: [],
    cuisines: [],
    maxCookTime: 45,
    mealsPerDay: 3,
    boostNutrient: undefined as string | undefined,
  };
  const nutrientTargets = { dri: { ...defaultDri }, ul: defaultUl };
  await db
    .insert(userProfile)
    .values({
      userId,
      personalMetrics: {
        age: 30,
        sex: "male",
        weightKg: 70,
        heightCm: 175,
        pal: 1.6,
      },
      preferences,
      nutrientTargets,
    })
    .onConflictDoUpdate({
      target: userProfile.userId,
      set: {
        preferences,
        nutrientTargets,
        updatedAt: sql`NOW()`,
      },
    });
  return nutrientTargets;
};

export const setProfileWithMetrics = async (
  userId: string,
  metrics: {
    age: number;
    sex: "male" | "female";
    weightKg: number;
    heightCm: number;
    pal: number;
    bodyType?: string;
  }
) => {
  const bmr = calculateBmrHenry({
    age: metrics.age,
    sex: metrics.sex,
    weightKg: metrics.weightKg,
    heightCm: metrics.heightCm,
  });
  const tee = calculateTee(bmr, metrics.pal);
  const nutrientTargets = {
    dri: { ...defaultDri, calories: tee },
    ul: defaultUl,
  };
  const preferences = {
    budget: 150,
    allergies: [],
    dislikes: [],
    likes: [],
    cuisines: [],
    maxCookTime: 45,
    mealsPerDay: 3,
    boostNutrient: undefined as string | undefined,
    bodyType: metrics.bodyType,
  };
  await db
    .insert(userProfile)
    .values({
      userId,
      personalMetrics: metrics,
      preferences,
      nutrientTargets,
    })
    .onConflictDoUpdate({
      target: userProfile.userId,
      set: {
        personalMetrics: metrics,
        preferences,
        nutrientTargets,
        updatedAt: sql`NOW()`,
      },
    });
  return nutrientTargets;
};
