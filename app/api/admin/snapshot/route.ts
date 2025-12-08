import { NextResponse } from "next/server"
import { fetchAdminSnapshot } from "@/app/actions/admin"

export const GET = async () => {
  const data = await fetchAdminSnapshot()
  return NextResponse.json(data)
}

