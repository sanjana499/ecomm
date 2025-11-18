import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your drizzle db config
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

        // From users table
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
