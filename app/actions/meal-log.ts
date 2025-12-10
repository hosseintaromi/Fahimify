"use server";

import { eq, and, gte, lt, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db/client";
import { mealLog } from "@/db/schema";

type MealLogInput = {
  recipeId: string;
  recipeTitle: string;
  cost: number;
  nutrients: Record<string, number>;
};

let tableCreated = false;

const ensureMealLogTable = async () => {
  if (tableCreated) return;

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meal_log (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        recipe_id TEXT NOT NULL,
        recipe_title TEXT NOT NULL,
        cost NUMERIC(10, 2) NOT NULL,
        nutrients JSONB NOT NULL DEFAULT '{}'::jsonb,
        consumed_at TIMESTAMP NOT NULL DEFAULT NOW(),
        week_start TIMESTAMP NOT NULL
      );
    `);
    tableCreated = true;
  } catch (err) {
    console.error("Failed to create meal_log table:", err);
  }
};

const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const logMeal = async (userId: string, meal: MealLogInput) => {
  await ensureMealLogTable();
  const weekStart = getWeekStart();

  const result = await db
    .insert(mealLog)
    .values({
      id: nanoid(),
      userId,
      recipeId: meal.recipeId,
      recipeTitle: meal.recipeTitle,
      cost: meal.cost.toString(),
      nutrients: meal.nutrients,
      weekStart,
    })
    .returning();

  return result[0];
};

export const getWeeklySpending = async (
  userId: string,
  weekStartStr?: string
) => {
  await ensureMealLogTable();
  const weekStart = weekStartStr ? new Date(weekStartStr) : getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  try {
    const logs = await db
      .select()
      .from(mealLog)
      .where(
        and(
          eq(mealLog.userId, userId),
          gte(mealLog.weekStart, weekStart),
          lt(mealLog.weekStart, weekEnd)
        )
      );

    const totalSpent = logs.reduce((sum, log) => sum + Number(log.cost), 0);

    const dailySpending = logs.reduce((acc, log) => {
      const day = new Date(log.consumedAt).toLocaleDateString("en-US", {
        weekday: "long",
      });
      acc[day] = (acc[day] || 0) + Number(log.cost);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSpent,
      logs,
      dailySpending,
      weekStart: weekStart.toISOString(),
    };
  } catch (err) {
    console.error("Error fetching weekly spending:", err);
    return {
      totalSpent: 0,
      logs: [],
      dailySpending: {},
      weekStart: weekStart.toISOString(),
    };
  }
};

export const getMealLogs = async (userId: string, limit: number = 50) => {
  await ensureMealLogTable();

  try {
    const logs = await db
      .select()
      .from(mealLog)
      .where(eq(mealLog.userId, userId))
      .orderBy(sql`${mealLog.consumedAt} DESC`)
      .limit(limit);

    return logs;
  } catch (err) {
    console.error("Error fetching meal logs:", err);
    return [];
  }
};

export const getDailyNutrition = async (
  userId: string,
  date: Date = new Date()
) => {
  await ensureMealLogTable();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const logs = await db
      .select()
      .from(mealLog)
      .where(
        and(
          eq(mealLog.userId, userId),
          gte(mealLog.consumedAt, startOfDay),
          lt(mealLog.consumedAt, endOfDay)
        )
      );

    const totalNutrients = logs.reduce((acc, log) => {
      const nutrients = log.nutrients as Record<string, number>;
      Object.entries(nutrients).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      logs,
      totalNutrients,
    };
  } catch (err) {
    console.error("Error fetching daily nutrition:", err);
    return {
      logs: [],
      totalNutrients: {},
    };
  }
};
