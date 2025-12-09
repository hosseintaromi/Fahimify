import { NextResponse } from "next/server"
import { getUserProfile, getCurrentUser } from "@/app/actions/user"

export const GET = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json(null, { status: 401 })
  }
  const profile = await getUserProfile(currentUser.id)
  return NextResponse.json(profile ?? null)
}

