import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, order_items, cart, products } from "@/lib/schema";
import { getUserIdFromReq } from "@/lib/db";
import { eq, inArray, desc } from "drizzle-orm";



export async function POST(req: Request) {
  const userId = await getUserIdFromReq(req);
  if (!userId)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  const body = await req.json();
  let items: { productId: number; quantity: number }[] = body.items;

  // If no items provided → use cart
  if (!items || items.length === 0) {
    const cartRows = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    items = cartRows.map((r: any) => ({
      productId: r.product_id,
      quantity: r.quantity,
    }));

    if (items.length === 0)
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
  }

  // Fetch product prices
  const productIds = items.map((i) => i.productId);

  const productsRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const itemsWithPrice = items.map((i) => {
    const p = productsRows.find((x: any) => Number(x.id) === Number(i.productId));
    const price =
      p && p.offerPrice && Number(p.offerPrice) > 0
        ? Number(p.offerPrice)
        : Number(p?.price ?? 0);

    return { ...i, price };
  });

  const total = itemsWithPrice.reduce(
    (s, it) => s + it.price * it.quantity,
    0
  );

  const inserted = await db
  .insert(orders)
  .values({
    user_id: userId,                        // FIXED ✔
    total_amount: total.toString(),        // FIXED ✔ convert number → string
    status: "pending",
  })
  .$returningId();


  const orderId = inserted[0]?.id;

  // If not returned (rare), fetch latest
  let createdOrderId = orderId;
  if (!createdOrderId) {
    const last = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.created_at))
      .limit(1);
    createdOrderId = last[0]?.id;
  }

  // Insert order items
  await Promise.all(
    itemsWithPrice.map((it) =>
      db.insert(order_items).values({
        order_id: Number(createdOrderId),
        product_id: Number(it.productId),
        price: it.price.toString(),          // FIXED ✔
        quantity: Number(it.quantity),
      })
    )
  ); 

  // Clear cart
  await db.delete(cart).where(eq(cart.userId, userId));

  return NextResponse.json({ success: true, orderId: createdOrderId });
}
