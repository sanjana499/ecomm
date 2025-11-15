import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";

export async function GET() {
  try {
    const result = await db
      .select({ count: cart.id })
      .from(cart);

    return NextResponse.json({
      count: result.length,
    });
  } catch (error) {
    console.error("Cart count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
