// app/api/sub_category/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sub_categories } from "@/lib/schema";
import { eq, isNull, and } from "drizzle-orm";

// ✅ GET - Fetch all active sub-categories (not deleted)
export async function GET() {
  try {
    const data = await db
      .select()
      .from(sub_categories)
      .where(and(eq(sub_categories.status, "active"), isNull(sub_categories.deletedAt)))
      .orderBy(sub_categories.id);

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/sub_categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch sub-categories", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ POST - Add new sub-category
export async function POST(req: Request) {
  try {
    const { name, category_id, description, status } = await req.json();

    // ✅ Validation
    if (!name?.trim() || !category_id) {
      return NextResponse.json(
        { error: "Name and categories_id are required" },
        { status: 400 }
      );
    }

    const result = await db.insert(sub_categories).values({
      name: name.trim(),
      category_id: Number(category_id),
      description: description?.trim() || "",
      status: status?.trim() || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    return NextResponse.json({
      success: true,
      message: "Sub-category added successfully!",
      result,
    });
  } catch (err: any) {
    console.error("POST /api/sub_categories error:", err);
    return NextResponse.json(
      { error: "Failed to add sub-category", details: err.message },
      { status: 500 }
    );
  }
}
