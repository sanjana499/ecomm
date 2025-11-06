import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";

// ✅ GET - Fetch all products (only non-deleted)
export async function GET() {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .where(isNull(products.deleted_at)) // only non-deleted
      .orderBy(products.id);

    return NextResponse.json(allProducts);
  } catch (error: any) {
    console.error("GET /api/product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST - Add new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category_id, sub_category_id, price, status, description } = body;

    // ✅ Validation
    if (!name?.trim() || !category_id || !price) {
      return NextResponse.json(
        { error: "Name, category, and price are required." },
        { status: 400 }
      );
    }

    // ✅ Insert Product
    const result = await db.insert(products).values({
      name: name.trim(),
      category_id: Number(category_id),
      sub_category_id: sub_category_id ? Number(sub_category_id) : null,
      price: price.toString(), // for decimal column
      status: status !== undefined ? Boolean(status) : true,
      description: description?.trim() || "",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    });

    return NextResponse.json({
      success: true,
      message: "✅ Product added successfully!",
      result,
    });
  } catch (error: any) {
    console.error("POST /api/product error:", error);
    return NextResponse.json(
      { error: "Failed to add product", details: error.message },
      { status: 500 }
    );
  }
}
