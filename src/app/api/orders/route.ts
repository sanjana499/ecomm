import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        total_amount: orders.total_amount,
        shipping_charge: orders.shipping_charge,
        order_status: orders.order_status,
        created_at: orders.created_at,

        user_name: users.name,
        email: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.user_id, users.id))
      .orderBy(desc(orders.created_at));

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await db.insert(orders).values({
      user_id: body.user_id,
      product_id: body.product_id,

      total_amount: body.total_amount,
      shipping_charge: body.shipping_charge ?? 0,
      discount: body.discount ?? 0,

      items: JSON.stringify(body.items),
      address_id: body.address_id,

      shipping_address: body.shipping_address ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      pincode: body.pincode ?? "",

      payment_method: body.payment_method ?? "cod",
      order_status: body.order_status ?? "pending",
    });

    return NextResponse.json({ success: true, message: "Order created" });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, error: "Failed to create order" });
  }
}


