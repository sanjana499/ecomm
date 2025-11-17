import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";
import { eq } from "drizzle-orm";

// 🗑️ DELETE /api/cart/[id]
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json(); // 🟢 ID from body

    if (!id) {
      return NextResponse.json(
        { error: "Cart ID is required" },
        { status: 400 }
      );
    }

    await db.delete(cart).where(eq(cart.id, Number(id)));

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
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, quantity } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID missing" },
        { status: 400 }
      );
    }

    await db
      .update(cart)
      .set({ quantity })
      .where(eq(cart.id, id));

    return NextResponse.json({ success: true }); // ⭐ MUST RETURN JSON
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}