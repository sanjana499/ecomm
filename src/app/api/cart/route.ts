import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart, products } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const userIdParam = new URL(request.url).searchParams.get("userId");

    console.log("🔍 Received userId:", userIdParam);

    if (!userIdParam) {
      return NextResponse.json(
        { error: "userId is missing. Please send ?userId=123" },
        { status: 400 }
      );
    }

    const userId = Number(userIdParam);

    const items = await db
      .select({
        id: cart.id,
        productId: cart.productId,
        quantity: cart.quantity,
        title: products.title,
        img: products.img,
        price: products.price,
        offerPrice: products.offerPrice,
      })
      .from(cart)
      .leftJoin(products, eq(cart.productId, products.id))
      .where(eq(cart.userId, userId));

    return NextResponse.json({
      items,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
