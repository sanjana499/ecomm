import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: "Phone & OTP required" },
        { status: 400 }
      );
    }

    // 1️⃣ Fetch user using Drizzle ORM
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.phoneNo, phone));

    if (userResult.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // 2️⃣ Compare OTP
    if (user.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 3️⃣ Clear OTP (set to null)
    await db
      .update(users)
      .set({ otp: null })
      .where(eq(users.phoneNo, phone));

    // 4️⃣ Return user
    return NextResponse.json({
      success: true,
      message: "OTP Verified Successfully",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phoneNo,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
