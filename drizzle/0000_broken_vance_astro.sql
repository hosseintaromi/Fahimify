CREATE TABLE IF NOT EXISTS "ingredient_master" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"nutritional_data" jsonb NOT NULL,
	"allergen_tags" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price_inventory" (
	"id" text PRIMARY KEY NOT NULL,
	"ingredient_id" text NOT NULL,
	"store_name" text NOT NULL,
	"region" text NOT NULL,
	"price_per_unit" numeric(10, 2) NOT NULL,
	"unit_size" numeric(10, 2) NOT NULL,
	"unit_type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_ingredient" (
	"id" text PRIMARY KEY NOT NULL,
	"recipe_id" text NOT NULL,
	"ingredient_id" text NOT NULL,
	"quantity_grams" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recipe_master" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"instructions" text,
	"cook_time" integer NOT NULL,
	"cuisine_category" text NOT NULL,
	"source_type" text NOT NULL,
	"image_url" text,
	"price_per_serving" numeric(10, 2) NOT NULL,
	"nutrients" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"personal_metrics" jsonb NOT NULL,
	"preferences" jsonb NOT NULL,
	"nutrient_targets" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"total_cost" numeric(12, 2) NOT NULL,
	"days" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
