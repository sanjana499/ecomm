import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import path from "path";
import { eq } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { categories, sub_categories } from "@/lib/schema";

// ✅ GET — Fetch all categories
export async function GET() {
  try {
    const allCategories = await db.select().from(categories);

    const result = await Promise.all(
      allCategories.map(async (cat) => {
        const subs = await db
          .select()
          .from(sub_categories)
          .where(eq(sub_categories.categories_id, cat.id)); // ✅ correct column

        // Always return subcategories array (even if empty)
        return { ...cat, subcategories: subs || [] };
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
// ✅ POST — Add a new category with image upload
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const file = formData.get("image") as File | null;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "upload");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    let imagePath = "";
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(uploadDir, fileName);
      await writeFile(uploadPath, buffer);
      imagePath = `/upload/${fileName}`;
    }

    // ✅ Normalize status
    const normalizedStatus =
      status === "active" || status === "true" || status === "1" ? true : false;

    // ✅ Generate slug automatically
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    // ✅ Insert into DB
    await db.insert(categories).values({
      name: name.trim(),
      description: description || "",
      status: normalizedStatus,
      image: imagePath,
      slug, // ✅ include slug field
    });

    return NextResponse.json({
      success: true,
      message: "Category added successfully!",
    });
  } catch (err: any) {
    console.error("POST /api/categories error:", err);
    return NextResponse.json(
      { error: "Failed to add category", details: err.message },
      { status: 500 }
    );
  }
}
