import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const { userId, productId, quantity } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await db.insert(cart).values({
      userId: userId || 1, // temporary static user
      productId,
      quantity: quantity || 1,
    });

    return NextResponse.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
