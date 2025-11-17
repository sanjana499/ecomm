import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allUsers = await db.select().from(users);

    const list = [];

    for (const u of allUsers) {
      // Orders Count
      const orderCount = await db
        .select()
        .from(orders)
        .where(eq(orders.user_id, u.id));

      list.push({
        id: u.id,
        customerId: u.customerId,
        name: u.name,
        email: u.email,
        country: u.country,
        orders: orderCount.length,
        countryCode: u.country.slice(0, 2).toLowerCase(),
       
      });
    }

    return NextResponse.json(list);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Error loading customers" });
  }
}
