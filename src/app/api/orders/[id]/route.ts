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

        // // ✔ users table se correct customer_id
        // customer_id: users.customerId,

        // // ✔ users table se city, state
        // city: users.city,
        // state: users.state,

        customer_id: orders.customerId, // ← Correct

        city: orders.city,
        state: orders.state,

        transaction_id: orders.transaction_id,
        total_amount: orders.total_amount,
        shipping_charge: orders.shipping_charge,
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

      // product_ids: order.product_ids
      //   ? String(order.product_ids).split(",")
      //   : [],

      product_ids: order.product_ids
        ? String(order.product_ids).split(",").map(Number)
        : [],


      quantities: order.quantities
        ? String(order.quantities).split(",").map(Number)
        : [],

      //quantities: order.quantities ? JSON.parse(order.quantities) : [],
    });


  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const body = await req.json();

  try {
    // --------------------------------------------
    // 1️⃣ Get order first (to know user_id)
    // --------------------------------------------
    const existing = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!existing.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const userId = existing[0].user_id;

    // --------------------------------------------
    // 2️⃣ Update USERS table (name + email)
    // --------------------------------------------
    await db
      .update(users)
      .set({
        name: body.user_name,
        email: body.email,
      })
      .where(eq(users.id, userId));

    // --------------------------------------------
    // 3️⃣ Update ORDERS table (pincode included now)
    // --------------------------------------------
    await db
      .update(orders)
      .set({
        name: body.user_name,
        email: body.email,
        customerId: body.customer_id,
        city: body.city,
        state: body.state,
        shipping_address: body.shipping_address,
        pincode: body.pincode, // ← FIXED
        total_amount: String(body.total_amount ?? "0"),
        shipping_charge: String(body.shipping_charge ?? "0"),
        discount: String(body.discount ?? "0"),
        order_status: body.order_status,
        payment_method: body.payment_method,
      })
      .where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  // 1️⃣ Invalid ID check
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  try {
    // 2️⃣ Check if order exists
    const existing = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!existing.length) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3️⃣ Delete order now
    await db.delete(orders).where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}




