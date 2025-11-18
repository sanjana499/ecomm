import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addresses } from "@/lib/schema";
import { eq } from "drizzle-orm";

// =========================
//      GET ALL
// =========================
export async function GET() {
  try {
    const data = await db.select().from(addresses);
    return NextResponse.json(data);

  } catch (error) {
    console.error("❌ Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// =========================
//        ADD (POST)
// =========================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { user_id, name, phone, flat_no, address, city, state, pincode } = body;

    // Validate
    if (!user_id || !name || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Insert into DB
    await db.insert(addresses).values({
      userId: user_id,   // DB field
      name,
      phone,
      flat_no,
      address,
      city,
      state,
      pincode,
    });

    return NextResponse.json({ message: "Address added successfully" });

  } catch (error) {
    console.error("❌ Error inserting address:", error);
    return NextResponse.json(
      { error: "Server error", details: String(error) },
      { status: 500 }
    );
  }
}
