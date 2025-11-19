// src/app/api/user/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, context: { params: any }) {
  // Await the params to unwrap them
  const params = await context.params;
  const id = params.id;

  if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  try {
    const result = await db
      .select({
        name: users.name,
        email: users.email,
        phone_no: users.phoneNo,
      })
      .from(users)
      .where(eq(users.id, Number(id)))
      .execute();

    const user = result[0];

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
