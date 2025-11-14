import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders1 } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, addressId, total } = body;

    await db.insert(orders1).values({
      userId,
      addressId,
      total,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}
