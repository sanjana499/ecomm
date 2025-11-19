import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 }
      );
    }

    // MySQL JSON filter
    const result = await db
      .select()
      .from(orders)
      .where(
        sql`JSON_CONTAINS(${orders.items}, JSON_OBJECT("product_id", ${productId}))`
      );

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch product orders" },
      { status: 500 }
    );
  }
}
