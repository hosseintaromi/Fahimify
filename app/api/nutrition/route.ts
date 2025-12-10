import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { getDailyNutrition } from "@/app/actions/meal-log";
import { getUserProfile } from "@/app/actions/user";

export const GET = async (req: Request) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("fahimify-auth")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const currentUser = decoded;
  const profile = await getUserProfile(currentUser.userId);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { url } = req;
  const { searchParams } = new URL(url);
  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : new Date();

  const { logs, totalNutrients } = await getDailyNutrition(
    currentUser.userId,
    date
  );

  console.log("🍽️ Daily logs count:", logs.length);
  console.log("🍽️ Total nutrients:", totalNutrients);
  console.log("🍽️ Date queried:", date.toISOString());

  const targets = profile.nutrientTargets;

  const macros = {
    protein: {
      current: totalNutrients.protein || 0,
      target: targets.protein || 150,
      percentage: Math.round(
        ((totalNutrients.protein || 0) / (targets.protein || 150)) * 100
      ),
      unit: "g",
    },
    carbs: {
      current: totalNutrients.carbs || 0,
      target: targets.carbs || 300,
      percentage: Math.round(
        ((totalNutrients.carbs || 0) / (targets.carbs || 300)) * 100
      ),
      unit: "g",
    },
    fat: {
      current: totalNutrients.fat || 0,
      target: targets.fat || 70,
      percentage: Math.round(
        ((totalNutrients.fat || 0) / (targets.fat || 70)) * 100
      ),
      unit: "g",
    },
    calories: {
      current: totalNutrients.calories || 0,
      target: targets.calories || 2500,
      percentage: Math.round(
        ((totalNutrients.calories || 0) / (targets.calories || 2500)) * 100
      ),
      unit: "kcal",
    },
  };

  return NextResponse.json({
    macros,
    totalNutrients,
    logs,
    date: date.toISOString(),
  });
};
