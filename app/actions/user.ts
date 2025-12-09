"use server";

import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { users, userProfile } from "@/db/schema";
import { calculateBmrHenry, calculateTee } from "@/lib/nutrition";
import { onboardingSchema } from "@/lib/schemas";
import { listRecipes as listRecipesDb } from "@/lib/data";
import { euDrv } from "@/lib/dri";
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  setAuthCookie,
  clearAuthCookie,
  getCurrentUserFromCookie,
} from "@/lib/auth";

const defaultDri = { ...euDrv };

const defaultUl = {
  salt: 6,
};

export async function registerUser(username: string, password: string) {
  try {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Username already exists" };
    }

    const userId = nanoid();
    const passwordHash = await hashPassword(password);

    await db.insert(users).values({
      id: userId,
      username,
      passwordHash,
      hasCompletedOnboarding: false,
    });

    const token = await generateJWT({ userId, username });
    await setAuthCookie(token);

    return { success: true, userId };
  } catch (error) {
    console.error("Register error:", error);
    return { success: false, error: "Failed to register user" };
  }
}

export async function loginUser(username: string, password: string) {
  try {
    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      return { success: false, error: "Invalid username or password" };
    }

    const isValid = await verifyPassword(password, user[0].passwordHash);

    if (!isValid) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = await generateJWT({
      userId: user[0].id,
      username: user[0].username,
    });
    await setAuthCookie(token);

    return {
      success: true,
      userId: user[0].id,
      hasCompletedOnboarding: user[0].hasCompletedOnboarding,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

export async function logoutUser() {
  await clearAuthCookie();
  redirect("/login");
}

export async function getCurrentUser() {
  const payload = await getCurrentUserFromCookie();
  if (!payload) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return {
    id: user[0].id,
    username: user[0].username,
    hasCompletedOnboarding: user[0].hasCompletedOnboarding,
  };
}

export const submitOnboardingData = async (input: unknown) => {
  const parsed = onboardingSchema.parse(input);
  
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not authenticated");
  }
  
  const userId = currentUser.id;
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
  
  await db
    .update(users)
    .set({ hasCompletedOnboarding: true })
    .where(eq(users.id, userId));
  
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
  const existingProfile = await getUserProfile(userId);
  
  const defaultMetrics = {
    age: 30,
    sex: "male" as const,
    weightKg: 70,
    heightCm: 175,
    pal: 1.6,
  };
  
  const bmr = calculateBmrHenry(defaultMetrics);
  const tee = calculateTee(bmr, defaultMetrics.pal);
  const nutrientTargets = {
    dri: { ...defaultDri, calories: tee },
    ul: defaultUl,
  };
  
  if (existingProfile) {
    await db
      .update(userProfile)
      .set({
        personalMetrics: defaultMetrics,
        nutrientTargets,
        updatedAt: sql`NOW()`,
      })
      .where(eq(userProfile.userId, userId));
  } else {
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
    
    await db
      .insert(userProfile)
      .values({
        userId,
        personalMetrics: defaultMetrics,
        preferences,
        nutrientTargets,
      });
  }
  
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
  const existingProfile = await getUserProfile(userId);
  
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
  
  if (existingProfile) {
    await db
      .update(userProfile)
      .set({
        personalMetrics: metrics,
        nutrientTargets,
        updatedAt: sql`NOW()`,
      })
      .where(eq(userProfile.userId, userId));
  } else {
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
      });
  }
  
  return nutrientTargets;
};
