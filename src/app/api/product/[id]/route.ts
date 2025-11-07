import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // 👈 Promise type
) {
  try {
    const { id } = await context.params; // ✅ must await
    console.log("🧩 Product delete request for ID:", id);

    const productId = parseInt(id);
    if (isNaN(productId)) {
      console.log("❌ Invalid product ID");
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      console.log("⚠️ Product not found");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, productId));
    console.log("✅ Product deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (err: any) {
    console.error("❌ DELETE /api/product/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}
