import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const rawData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        total_amount: orders.total_amount,
        shipping_charge: orders.shipping_charge,
        order_status: orders.order_status,
        created_at: orders.created_at,

        product_ids: orders.product_ids,
        quantities: orders.quantities,

        user_name: users.name,
        email: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.user_id, users.id))
      .orderBy(desc(orders.created_at));

    const data = rawData.map((order: any) => ({
      ...order,

      // FIX → convert to array safely
      product_ids:
        typeof order.product_ids === "string"
          ? order.product_ids.split(",")
          : [],

      quantities:
        typeof order.quantities === "string"
          ? order.quantities.split(",").map(Number)
          : [],
    }));

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

      // CORRECT: Each productId from items[]
      product_ids: body.items.map((item: any) => item.productId).join(","),

      // CORRECT: Quantity of each item
      quantities: body.items.map((item: any) => item.quantity).join(","),

      // Full items JSON
      items: JSON.stringify(body.items),

      customerId: body.customer_id,
      total_amount: body.total_amount,
      email: body.email || "",
      name: body.name || "",

      shipping_charge: body.shipping_charge || 0,
      discount: body.discount || 0,
      address_id: body.address_id || null,
      shipping_address: body.shipping_address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.pincode || "",

      payment_method: body.payment_method || "cod",
      order_status: body.order_status || "success",
    });

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
    });

  } catch (error) {
    console.error("Order Create Error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}