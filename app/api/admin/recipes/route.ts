import { NextResponse } from "next/server"
import { createRecipe } from "@/app/actions/recipe"

export const POST = async (req: Request) => {
  try {
    const payload = await req.json()
    const recipe = await createRecipe(payload)
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create recipe"
    return NextResponse.json({ message }, { status: 400 })
  }
}

