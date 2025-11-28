import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        order_id: orders.id,
        total_amount: orders.total_amount,
        payment_method: orders.payment_method,
        created_at: orders.created_at,
        user_id: orders.user_id,

        items: orders.items,
        product_ids: orders.product_ids,
        quantities: orders.quantities,

        // 👇 Customer Info From users table
        user_name: users.name,
        email: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(users.id, orders.user_id)) // 👈 IMPORTANT JOIN
      .where(eq(orders.order_status, "success"))
      .orderBy(orders.id);

    // Parse JSON fields
    // const parsedData = data.map((order: any) => ({
    //   ...order,
    //   items: JSON.parse(order.items ?? "[]"),
    //   product_ids: order.product_ids ? JSON.parse(order.product_ids) : [],
    //   quantities: order.quantities ? JSON.parse(order.quantities) : [],
    // }));
    const parsedData = data.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items ?? "[]"), // Ye sahi hai kyunki tum items ko JSON.stringify karte ho DB me
      product_ids: order.product_ids
        ? order.product_ids.split(",").map(Number) // <-- split by comma + convert to number
        : [],
      quantities: order.quantities
        ? order.quantities.split(",").map(Number) // <-- split by comma + convert to number
        : [],
    }));


    return NextResponse.json({ success: true, orders: parsedData });
    //return NextResponse.json({ success: true, orders: data });
  } catch (error) {
    console.error("Success orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
