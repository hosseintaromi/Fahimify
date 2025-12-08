"use server"

import { desc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { db } from "@/db/client"
import { weeklyPlan } from "@/db/schema"
import { generateWeeklyPlan, swapMeal } from "@/lib/fahimeh"
import { listRecipes } from "@/lib/data"
import { getUserProfile } from "./user"

const fallbackPreferences = {
  budget: 50,
  allergies: [],
  dislikes: [],
  likes: [],
  cuisines: [],
  maxCookTime: 60,
  mealsPerDay: 3,
}

const fallbackTargets = { dri: { calories: 2000 } }

const persistPlan = async (userId: string, plan: ReturnType<typeof generateWeeklyPlan>) => {
  await db.delete(weeklyPlan).where(eq(weeklyPlan.userId, userId))
  await db.insert(weeklyPlan).values({
    id: nanoid(),
    userId,
    totalCost: plan.totalCost,
    days: plan.days,
  })
}

export const generatePlan = async (userId: string) => {
  const targetUser = userId ?? "demo-user"
  const profile = await getUserProfile(targetUser)
  const recipes = await listRecipes()
  const plan = generateWeeklyPlan(
    recipes,
    profile?.preferences ?? fallbackPreferences,
    profile?.nutrientTargets ?? fallbackTargets,
  )
  await persistPlan(targetUser, plan)
  return plan
}

export const getPlan = async (userId: string) => {
  const targetUser = userId ?? "demo-user"
  const rows = await db
    .select()
    .from(weeklyPlan)
    .where(eq(weeklyPlan.userId, targetUser))
    .orderBy(desc(weeklyPlan.createdAt))
    .limit(1)
  if (!rows[0]) return null
  return { totalCost: Number(rows[0].totalCost ?? 0), days: rows[0].days }
}

export const swapPlanMeal = async (
  userId: string,
  dayIndex: number,
  mealIndex: number,
  strategy: "cheaper" | "faster" | "nutrient",
) => {
  const plan = await getPlan(userId)
  const profile = await getUserProfile(userId ?? "demo-user")
  if (!plan || !profile) return null
  const recipes = await listRecipes()
  const updated = swapMeal(plan, dayIndex, mealIndex, recipes, profile.preferences, profile.nutrientTargets, strategy)
  await persistPlan(userId ?? "demo-user", updated)
  return updated
}

