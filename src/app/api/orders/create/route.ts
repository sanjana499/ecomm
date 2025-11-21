import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, order_items, cart, products } from "@/lib/schema";
import { getUserIdFromReq } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";

export async function POST(req: Request) {
  const userId = await getUserIdFromReq(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  let items: { productId: number; quantity: number }[] = body.items;

  // If items not provided → take items from cart
  if (!items || items.length === 0) {
    const cartRows = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    items = cartRows.map((r: any) => ({
      productId: r.productId, // cart.productId field correct
      quantity: r.quantity,
    }));

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 }
      );
    }
  }

  // Fetch product prices
  const productIds = items.map((i) => i.productId);

  const productsRows = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const itemsWithPrice = items.map((i) => {
    const p = productsRows.find(
      (x: any) => Number(x.id) === Number(i.productId)
    );

    const price =
      p && p.offerPrice && Number(p.offerPrice) > 0
        ? Number(p.offerPrice)
        : Number(p?.price ?? 0);

    return { ...i, price };
  });

  // Calculate total
  const total = itemsWithPrice.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  );

  // INSERT INTO ORDERS + get inserted ID
  const [insertedOrder] = await db
    .insert(orders)
    .values({
      user_id: userId,

      // 👇 These 3 fields were not saving earlier — FIXED
      product_ids: JSON.stringify(itemsWithPrice.map((i) => i.productId)),
      quantities: JSON.stringify(itemsWithPrice.map((i) => i.quantity)),
      items: JSON.stringify(itemsWithPrice),

      // User details
      customerId: body.customer_id,
      email: body.email,
      name: body.name,

      total_amount: total.toString(),
      shipping_charge: body.shipping_charge ?? "0",
      discount: body.discount ?? "0",

      transaction_id: body.transaction_id ?? null,
      payment_method: body.payment_method ?? "online",
      order_status: "pending",

      shipping_address: body.shipping_address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      address_id: body.address_id ?? 0,
    })
    .$returningId();

  const orderId = insertedOrder?.id || insertedOrder;

  if (!orderId) {
    return NextResponse.json(
      { success: false, error: "Order Insert Failed" },
      { status: 500 }
    );
  }

  // Insert each order item
  await Promise.all(
    itemsWithPrice.map((it) =>
      db.insert(order_items).values({
        order_id: Number(orderId),
        product_id: Number(it.productId),
        price: it.price.toString(),
        quantity: Number(it.quantity),
      })
    )
  );

  // Clear cart
  await db.delete(cart).where(eq(cart.userId, userId));

  return NextResponse.json({ success: true, orderId });
}
