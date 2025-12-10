import { NextResponse } from "next/server";
import { getRecipeById } from "@/lib/data";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Recipe ID required" }, { status: 400 });
  }

  const recipe = await getRecipeById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
  }

  return NextResponse.json(recipe);
};
