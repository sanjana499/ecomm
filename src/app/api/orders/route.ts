import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { desc } from "drizzle-orm";   // ✅ REQUIRED IMPORT

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, total_amount, items, address_id } = body;

    const inserted = await db
      .insert(orders)
      .values({
        user_id,
        total_amount,
        status: "pending",
        payment_method: "cod",       // COD SAVE
        items: JSON.stringify(items), // MUST BE TEXT
        address_id,
      });

    return Response.json({ success: true, message: "COD Order Placed" });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Order failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.created_at)); // FIXED

    return Response.json(result);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Failed to fetch orders" });
  }
}
