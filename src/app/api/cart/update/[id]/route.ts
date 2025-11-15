import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cart } from "@/lib/schema";
import { eq } from "drizzle-orm";

// 🆙 UPDATE Quantity API
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cartId = Number(id);

    if (isNaN(cartId)) {
      return NextResponse.json({ error: "Invalid cart id" }, { status: 400 });
    }

    const body = await req.json();
    const { quantity } = body;

    if (quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Update quantity
    await db.update(cart)
      .set({ quantity })
      .where(eq(cart.id, cartId));

    return NextResponse.json({
      success: true,
      message: "Quantity updated",
    });

  } catch (err) {
    console.error("Quantity Update Error:", err);
    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}
