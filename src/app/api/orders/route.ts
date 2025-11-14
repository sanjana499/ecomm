import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, order_items, products, users } from "@/lib/schema";
import { desc, eq, inArray } from "drizzle-orm";

export async function GET() {
  const allOrders = await db
    .select({
      id: orders.id,
      user_id: orders.user_id,
      total_amount: orders.total_amount,
      status: orders.status,
      created_at: orders.created_at,
    })
    .from(orders)
    .orderBy(desc(orders.created_at));

  const result = await Promise.all(
    allOrders.map(async (o) => {
      // Fetch items
      const items = await db
        .select({
          id: order_items.id,
          product_id: order_items.product_id,
          price: order_items.price,
          quantity: order_items.quantity,
        })
        .from(order_items)
        .where(eq(order_items.order_id, o.id));

      const productIds = items.map((it) => it.product_id);

      const prods = productIds.length
        ? await db.select().from(products).where(inArray(products.id, productIds))
        : [];

      const itemsWithProduct = items.map((it) => ({
        ...it,
        product: prods.find((p) => p.id === it.product_id) || null,
      }));

      // Fetch user safely
      let userData = null;

      if (o.user_id !== null) {
        const u = await db
          .select({
            id: users.id,
            name: users.name,
            email: users.email,
          })
          .from(users)
          .where(eq(users.id, o.user_id!))
          .limit(1);

        userData = u[0] || null;
      }

      return {
        ...o,
        items: itemsWithProduct,
        user: userData,
      };
    })
  );

  return NextResponse.json(result);
}
