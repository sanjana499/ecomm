import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";

// ✅ GET — Fetch all active (non-deleted) categories
export async function GET() {
  try {
    const data = await db
      .select()
      .from(categories)
      .where(and(eq(categories.status, "active"), isNull(categories.deletedAt)));

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch categories", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ POST — Add a new category
export async function POST(req: Request) {
  try {
    const { name, description, status, image } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await db.insert(categories).values({
      name: name.trim(),
      description: description || "",
      status: status ?? "active",
      image: image || "",
    });

    return NextResponse.json({
      success: true,
      message: "Category added successfully!",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to add category", details: err.message },
      { status: 500 }
    );
  }
}
