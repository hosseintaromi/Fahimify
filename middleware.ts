import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fahimify-secret-key-change-in-production"
)
const AUTH_COOKIE_NAME = "fahimify-auth"

const publicPaths = ["/login"]
const protectedPaths = ["/", "/admin", "/recipes"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  const isProtectedPath = protectedPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  let isAuthenticated = false
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

