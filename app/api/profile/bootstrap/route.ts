import { NextResponse } from "next/server"
import { generatePlan } from "@/app/actions/plan"
import { setDefaultProfile, setProfileWithMetrics, getCurrentUser } from "@/app/actions/user"

export const POST = async (req: Request) => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const mode = body.mode ?? "default"

  if (mode === "metrics") {
    const { age, sex, weightKg, heightCm, pal, bodyType } = body
    await setProfileWithMetrics(currentUser.id, { age, sex, weightKg, heightCm, pal, bodyType })
  } else {
    await setDefaultProfile(currentUser.id)
  }

  const plan = await generatePlan(currentUser.id)
  return NextResponse.json(plan ?? {})
}

