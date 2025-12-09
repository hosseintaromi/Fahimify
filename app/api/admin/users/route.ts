import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/client"
import { users } from "@/db/schema"
import { sql, desc, asc, like, or, count } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const onboardingFilter = searchParams.get("onboarding") || "all"

    const offset = (page - 1) * limit

    let query = db.select().from(users)

    if (search) {
      query = query.where(
        or(
          like(users.username, `%${search}%`),
          like(users.id, `%${search}%`)
        )
      ) as any
    }

    if (onboardingFilter === "completed") {
      query = query.where(sql`${users.hasCompletedOnboarding} = true`) as any
    } else if (onboardingFilter === "pending") {
      query = query.where(sql`${users.hasCompletedOnboarding} = false`) as any
    }

    const orderColumn = sortBy === "username" ? users.username : users.createdAt
    const orderDirection = sortOrder === "asc" ? asc : desc

    const usersData = await query
      .orderBy(orderDirection(orderColumn))
      .limit(limit)
      .offset(offset)

    let countQuery = db.select({ count: count() }).from(users)

    if (search) {
      countQuery = countQuery.where(
        or(
          like(users.username, `%${search}%`),
          like(users.id, `%${search}%`)
        )
      ) as any
    }

    if (onboardingFilter === "completed") {
      countQuery = countQuery.where(sql`${users.hasCompletedOnboarding} = true`) as any
    } else if (onboardingFilter === "pending") {
      countQuery = countQuery.where(sql`${users.hasCompletedOnboarding} = false`) as any
    }

    const totalResult = await countQuery
    const total = totalResult[0]?.count || 0

    const usersWithoutPasswords = usersData.map(user => ({
      id: user.id,
      username: user.username,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      createdAt: user.createdAt,
    }))

    return NextResponse.json({
      users: usersWithoutPasswords,
      total,
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

