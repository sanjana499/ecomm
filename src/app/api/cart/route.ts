import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // aapke drizzle ya mysql config ka path
import { cart } from "@/lib/schema"; // aapki cart table schema
import { eq } from "drizzle-orm";
import { products } from "@/lib/schema"; // product table

export async function GET() {
  try {
    // Join products and cart to get price info
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
      .leftJoin(products, eq(cart.productId, products.id));

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const priceValue = Number(item.offerPrice ?? item.price ?? 0);
      const quantity = Number(item.quantity ?? 1);
      return sum + priceValue * quantity;
    }, 0);
    

    const shipping = subtotal > 1000 ? 0 : 99;
    const total = subtotal + shipping;

    return NextResponse.json({
      items,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
