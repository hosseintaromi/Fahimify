import { NextResponse } from "next/server"
import { generatePlan } from "@/app/actions/plan"
import { setDefaultProfile, setProfileWithMetrics } from "@/app/actions/user"

export const POST = async (req: Request) => {
  const body = await req.json().catch(() => ({}))
  const mode = body.mode ?? "default"
  const userId = body.userId ?? "demo-user"

  if (mode === "metrics") {
    const { age, sex, weightKg, heightCm, pal, bodyType } = body
    await setProfileWithMetrics(userId, { age, sex, weightKg, heightCm, pal, bodyType })
  } else {
    await setDefaultProfile(userId)
  }

  const plan = await generatePlan(userId)
  return NextResponse.json(plan ?? {})
}

