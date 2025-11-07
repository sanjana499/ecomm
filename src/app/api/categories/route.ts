import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

// ✅ GET — Fetch all categories
export async function GET() {
  try {
    const data = await db.select().from(categories).orderBy(categories.id);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: err.message },
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

    // ✅ Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // ✅ Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // ✅ Handle file upload
    let imagePath = "";
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const uploadPath = path.join(uploadDir, fileName);

      await writeFile(uploadPath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    // ✅ Normalize status to boolean (true = active, false = inactive)
    const normalizedStatus =
      status === "active" || status === "true" || status === "1" ? true : false;

    console.log("🟩 Received status value:", status);
    console.log("✅ Normalized status (boolean):", normalizedStatus);

    // ✅ Insert into DB
    await db.insert(categories).values({
      name: name.trim(),
      description: description || "",
      status: normalizedStatus, // now stores true/false
      image: imagePath,
    });

    return NextResponse.json({
      success: true,
      message: "Category added successfully!",
    });
  } catch (err: any) {
    console.error("POST /api/categories error:", err);
    return NextResponse.json(
      {
        error: "Failed to add category",
        details: err.message,
      },
      { status: 500 }
    );
  }
}