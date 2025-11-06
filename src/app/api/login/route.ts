import { NextResponse } from "next/server";
import { db } from "@/lib/db";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const user = existingUser[0];

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid password" });
    }

    // ✅ Return success
    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Something went wrong" });
  }
}
