// src/app/api/product/route.ts
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(products);
    return NextResponse.json(result); // ✅ must return JSON
  } catch (error: any) {
    console.error("❌ GET /api/product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      category_id,
      sub_category_id,
      price,
      description,
      color, size
    } = body;

    await db.insert(products).values({
      name,
      category_id: Number(category_id),
      sub_category_id: sub_category_id ? Number(sub_category_id) : null,
      price,
      status: "inactive",
      description,
      color, // ✅ add this
      size,  // ✅ add this
    });

    return NextResponse.json({ message: "Product added successfully!" });
  } catch (error: any) {
    console.error("❌ POST /api/product error:", error);
    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}
