import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import path from "path";
import { existsSync } from "fs";
import { writeFile, unlink } from "fs/promises";

// ✅ GET single category by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 updated for Next.js 16
) {
  try {
    const { id } = await context.params; // 👈 must await
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    if (result.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("GET /categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
}

// ✅ PUT update category
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 await params
    const categoryId = Number(id);

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const image = formData.get("image") as File | null;

    let imagePath = "";

    // ✅ Optional image upload
    if (image && typeof image === "object") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const fs = require("fs");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const filename = `${Date.now()}_${image.name}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // ✅ Update database
    await db
      .update(categories)
      .set({
        name,
        description,
        status: status === "active",
        ...(imagePath && { image: imagePath }),
      })
      .where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /categories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// ✅ DELETE category
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
      .from(categories)
      .where(eq(categories.id, categoryId));

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // ✅ Delete image file if exists
    if (category.image) {
      const imagePath = path.join(process.cwd(), "public", category.image);
      if (existsSync(imagePath)) {
        await unlink(imagePath);
      }
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return NextResponse.json({ success: true, message: "Category deleted successfully!" });
  } catch (err: any) {
    console.error("DELETE /api/categories/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete category", details: err.message },
      { status: 500 }
    );
  }
}
