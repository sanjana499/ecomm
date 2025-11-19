// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  const params = await context.params; // ✅ unwrap the promise
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const data = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        transaction_id: orders.transaction_id,
        email: orders.email,
        user_name: orders.user_name,
        total_amount: orders.total_amount,
        shipping_charge: orders.shipping_charge,
        order_status: orders.order_status,
        payment_method: orders.payment_method,
        product_id: orders.product_id,
        items: orders.items,
        address_id: orders.address_id,
        shipping_address: orders.shipping_address,
        city: orders.city,
        state: orders.state,
        pincode: orders.pincode,
        discount: orders.discount,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(eq(orders.id, id));

    if (!data[0]) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = { ...data[0], items: JSON.parse(data[0].items || "[]") };
    return NextResponse.json(order);
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}


// DELETE /api/orders/:id
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [product] = await db.select().from(orders).where(eq(orders.id, productId));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(orders).where(eq(orders.id, productId));

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    console.error("❌ DELETE /api/product/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}