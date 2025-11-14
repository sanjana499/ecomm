import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, order_items, products, users } from "@/lib/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(req: Request, context: any) {
  const { params } = await context;  // unwrap
  const orderId = Number(params.id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const o = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!o.length)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const order = o[0];

  const items = await db
    .select()
    .from(order_items)
    .where(eq(order_items.order_id, orderId));

  const productIds = items.map((it) => it.product_id);

  const prods = productIds.length
    ? await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds))
    : [];

  const itemsWithProduct = items.map((it) => ({
    ...it,
    product: prods.find((p) => p.id === it.product_id) || null,
  }));

  let user = null;

  if (order.user_id) {
    const u = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, order.user_id))
      .limit(1);

    user = u[0] || null;
  }

  return NextResponse.json({
    ...order,
    items: itemsWithProduct,
    user,
  });
}


