import { NextResponse } from "next/server"
import { generatePlan } from "@/app/actions/plan"
import { getCurrentUser } from "@/app/actions/user"

export const POST = async (req: Request) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const plan = await generatePlan(currentUser.id)
  return NextResponse.json(plan)
}

