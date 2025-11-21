import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("CART ADD BODY =>", body);

    const { user_id, product_id, quantity } = body;

    if (!user_id || !product_id) {
      return NextResponse.json(
        { error: "user_id and product_id are required" },
        { status: 400 }
      );
    }

    const inserted = await db.insert(cart).values({
      userId: Number(user_id),
      productId: Number(product_id),
      quantity: Number(quantity) || 1,
    });

    return NextResponse.json(
      { success: true, message: "Added to cart", inserted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cart Add Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}
