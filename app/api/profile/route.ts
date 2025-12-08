import { NextResponse } from "next/server"
import { getUserProfile } from "@/app/actions/user"

export const GET = async () => {
  const profile = await getUserProfile("demo-user")
  return NextResponse.json(profile ?? {})
}

