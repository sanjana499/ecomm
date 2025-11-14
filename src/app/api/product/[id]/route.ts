import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { promises as fs, constants } from "fs";
import path from "path";

// ✅ GET Product by ID
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await db.select().from(products).where(eq(products.id, productId)).limit(1);

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product: product[0] });
  } catch (error) {
    console.error("❌ GET /api/product/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// ✅ UPDATE Product
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // must be Promise type like GET
) {
  try {
    const { id } = await context.params; // ✅ await here
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const file = formData.get("img") as File | null;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadsDir, constants.F_OK);
    } catch {
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.chmod(uploadsDir, 0o777);
    }

    let fileName: string | null = null;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);
    }

    const updatedData: any = {};
    formData.forEach((value, key) => {
      if (key !== "img") updatedData[key] = value;
    });

    if (fileName) updatedData.img = `/uploads/${fileName}`;

    await db.update(products).set(updatedData).where(eq(products.id, productId));

    return NextResponse.json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// ✅ DELETE Product
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [product] = await db.select().from(products).where(eq(products.id, productId));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    console.error("❌ DELETE /api/product/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}
