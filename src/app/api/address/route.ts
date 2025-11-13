import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addresses } from "@/lib/schema";

export async function GET() {
  try {
    console.log("🔹 /api/addresses route called");
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
