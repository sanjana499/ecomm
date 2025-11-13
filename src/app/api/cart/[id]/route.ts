import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";
import { eq } from "drizzle-orm";

// 🗑️ DELETE /api/cart/[id]
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Unwrap params promise
    const { id } = await context.params;
    const cartId = Number(id);

    if (isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid cart ID" }, { status: 400 });
    }

    // ✅ Delete from DB
    await db.delete(cart).where(eq(cart.id, cartId));

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Delete cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
