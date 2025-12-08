import { pgTable, text, integer, numeric, jsonb, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const recipeMaster = pgTable("recipe_master", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  instructions: text("instructions"),
  cookTime: integer("cook_time").notNull(),
  cuisineCategory: text("cuisine_category").notNull(),
  sourceType: text("source_type").notNull(),
  imageUrl: text("image_url"),
  pricePerServing: numeric("price_per_serving", { precision: 10, scale: 2 }).notNull(),
  nutrients: jsonb("nutrients").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const ingredientMaster = pgTable("ingredient_master", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nutritionalData: jsonb("nutritional_data").notNull(),
  allergenTags: jsonb("allergen_tags").notNull().default(sql`'[]'::jsonb`),
})

export const priceInventory = pgTable("price_inventory", {
  id: text("id").primaryKey(),
  ingredientId: text("ingredient_id").notNull(),
  storeName: text("store_name").notNull(),
  region: text("region").notNull(),
  pricePerUnit: numeric("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  unitSize: numeric("unit_size", { precision: 10, scale: 2 }).notNull(),
  unitType: text("unit_type").notNull(),
})

export const recipeIngredient = pgTable("recipe_ingredient", {
  id: text("id").primaryKey(),
  recipeId: text("recipe_id").notNull(),
  ingredientId: text("ingredient_id").notNull(),
  quantityGrams: numeric("quantity_grams", { precision: 10, scale: 2 }).notNull(),
})

export const userProfile = pgTable("user_profile", {
  userId: text("user_id").primaryKey(),
  personalMetrics: jsonb("personal_metrics").notNull(),
  preferences: jsonb("preferences").notNull(),
  nutrientTargets: jsonb("nutrient_targets").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const weeklyPlan = pgTable("weekly_plan", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  totalCost: numeric("total_cost", { precision: 12, scale: 2 }).notNull(),
  days: jsonb("days").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

