import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addresses } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;   // ⬅️ FIX: must await here!

    await db.delete(addresses).where(eq(addresses.id, Number(id)));

    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete address", details: String(error) },
      { status: 500 }
    );
  }
}
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const data = await db.select().from(addresses).where(eq(addresses.id, Number(id)));

  return NextResponse.json(data[0] || {});
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  await db
    .update(addresses)
    .set({
      name: body.name,
      phone: body.phone,
      flat_no: body.flat_no,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
    })
    .where(eq(addresses.id, Number(id)));

  return NextResponse.json({ message: "Address updated successfully" });
}