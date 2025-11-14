import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sub_categories, categories } from "@/lib/schema";
import { eq, isNull } from "drizzle-orm";

// ✅ GET - fetch all subcategories with category name
export async function GET() {
  try {
    const result = await db
      .select({
        id: sub_categories.id,
        name: sub_categories.name,
        description: sub_categories.description,
        status: sub_categories.status,
        categories_id: sub_categories.categories_id,
        category_name: categories.name,
      })
      .from(sub_categories)
      .leftJoin(categories, eq(sub_categories.categories_id, categories.id))
    
      .orderBy(sub_categories.id);

    // console.log("✅ Fetched Subcategories:", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ GET /api/sub_categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subcategories", details: error.message },
      { status: 500 }
    );
  }
}


// ✅ POST - add subcategory
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming subcategory data:", body); // ✅ debug
    const { name, category_id, description, status } = body;

    if (!name?.trim() || !category_id) {
      return NextResponse.json(
        { error: "Name and parent category are required." },
        { status: 400 }
      );
    }

    const result = await db.insert(sub_categories).values({
      name: name.trim(),
      categories_id: Number(category_id), // or remove Number() if IDs are strings
      description: description?.trim() || "",
      status: status || "active",
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    });
console.log("result",result);
    return NextResponse.json({
      success: true,
      message: "✅ Subcategory added successfully!",
      result,
    });
  } catch (error: any) {
    console.error("POST /api/sub_categories error:", error);
    return NextResponse.json(
      { error: "Failed to add subcategory", details: error.message },
      { status: 500 }
    );
  }
}

