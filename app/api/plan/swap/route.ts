import { NextResponse } from "next/server";
import { swapPlanMeal } from "@/app/actions/plan";
import { getCurrentUser } from "@/app/actions/user";

export const POST = async (req: Request) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { dayIndex, mealIndex, strategy } = body;

  if (
    dayIndex === undefined ||
    mealIndex === undefined ||
    !strategy ||
    !["cheaper", "faster", "nutrient"].includes(strategy)
  ) {
    return NextResponse.json(
      {
        error: "Missing or invalid parameters",
        received: { dayIndex, mealIndex, strategy },
      },
      { status: 400 }
    );
  }

  const updatedPlan = await swapPlanMeal(
    currentUser.id,
    Number(dayIndex),
    Number(mealIndex),
    strategy as "cheaper" | "faster" | "nutrient"
  );

  if (!updatedPlan) {
    return NextResponse.json({ error: "Failed to swap meal" }, { status: 500 });
  }

  return NextResponse.json(updatedPlan);
};
