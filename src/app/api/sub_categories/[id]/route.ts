import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sub_categories } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const subCategoryId = parseInt(id);

    if (isNaN(subCategoryId)) {
      return NextResponse.json(
        { error: "Invalid subcategory ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, categories_id, description, status } = body; // ✅ fixed

    const [existing] = await db
      .select()
      .from(sub_categories)
      .where(eq(sub_categories.id, subCategoryId));

    if (!existing) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    await db
      .update(sub_categories)
      .set({
        name,
        categories_id, // ✅ fixed
        description,
        status,
      })
      .where(eq(sub_categories.id, subCategoryId));

    return NextResponse.json({
      success: true,
      message: "Subcategory updated successfully!",
    });
  } catch (error: any) {
    console.error("PUT /api/sub_categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update subcategory", details: error.message },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 await params
    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const [category] = await db
      .select()
      .from(sub_categories)
      .where(eq(sub_categories.id, categoryId));

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await db.delete(sub_categories).where(eq(sub_categories.id, categoryId));

    return NextResponse.json({ success: true, message: "Category deleted successfully!" });
  } catch (err: any) {
    console.error("DELETE /api/categories/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete category", details: err.message },
      { status: 500 }
    );
  }
}

