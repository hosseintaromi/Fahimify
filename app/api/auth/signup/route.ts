import { NextResponse } from "next/server";
import { hashPassword, generateJWT, setAuthCookie } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: "Username already exists" },
        { status: 409 }
      );
    }

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = nanoid();

    await db.insert(users).values({
      id: userId,
      username,
      email,
      password: "",
      passwordHash: hashedPassword,
      role: "user",
      hasCompletedOnboarding: false,
    });

    const token = await generateJWT({ userId, username });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
