import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";         // Drizzle connection
import { users } from "@/lib/schema"; // Users table schema
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { name, email, password, country, state, city } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate Customer ID
    const customerId = "#" + Math.floor(100000 + Math.random() * 900000);

    // Insert user in database
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      country,
      state,
      city,
      customerId,
    });

    return NextResponse.json({ success: true, message: "User registered successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
