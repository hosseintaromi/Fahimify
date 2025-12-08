import { NextResponse } from "next/server"
import { submitOnboardingData } from "@/app/actions/user"

export const POST = async (req: Request) => {
  const body = await req.json()
  const result = await submitOnboardingData(body)
  return NextResponse.json(result)
}

