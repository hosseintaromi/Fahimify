import { NextResponse } from "next/server";
import { logMeal, getWeeklySpending } from "@/app/actions/meal-log";
import { getCurrentUser } from "@/app/actions/user";

export const POST = async (req: Request) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { recipeId, recipeTitle, cost, nutrients } = body;

  if (!recipeId || !recipeTitle || cost === undefined) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const result = await logMeal(currentUser.id, {
    recipeId,
    recipeTitle,
    cost: Number(cost),
    nutrients: nutrients || {},
  });

  return NextResponse.json(result);
};

export const GET = async (req: Request) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const weekStart = searchParams.get("weekStart");

  const spending = await getWeeklySpending(
    currentUser.id,
    weekStart || undefined
  );

  return NextResponse.json(spending);
};
