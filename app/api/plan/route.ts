import { NextResponse } from "next/server"
import { generatePlan } from "@/app/actions/plan"

export const POST = async (req: Request) => {
  const body = await req.json()
  const userId = body.userId ?? "demo-user"
  const plan = await generatePlan(userId)
  return NextResponse.json(plan)
}

