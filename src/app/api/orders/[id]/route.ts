import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    const result = await db
  .select({
    order_id: orders.id,
    user_id: orders.user_id,

    user_name: users.name,
    email: users.email,

    // ✔ users table se correct customer_id
    customer_id: users.customerId,

    // ✔ users table se city, state
    city: users.city,
    state: users.state,

    transaction_id: orders.transaction_id,
    total_amount: orders.total_amount,
    shipping: orders.shipping,
    discount: orders.discount,
    order_status: orders.order_status,
    payment_method: orders.payment_method,
    address_id: orders.address_id,
    shipping_address: orders.shipping_address,
    pincode: orders.pincode,
    created_at: orders.created_at,

    product_ids: orders.product_ids,
    quantities: orders.quantities,
    items: orders.items,
  })
  .from(orders)
  .leftJoin(users, eq(orders.user_id, users.id))
  .where(eq(orders.id, orderId));


    if (!result.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = result[0];

    return NextResponse.json({
      ...order,
      items: JSON.parse(order.items ?? "[]"),
    
      product_ids: order.product_ids
        ? String(order.product_ids).split(",")
        : [],
    
      quantities: order.quantities
        ? String(order.quantities).split(",").map(Number)
        : [],
    });
    

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
