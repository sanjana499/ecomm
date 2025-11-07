import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sub_categories } from "@/lib/schema";
import { eq } from "drizzle-orm";

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

