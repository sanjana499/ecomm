import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return NextResponse.json(
                { success: false, message: "Phone number is required" },
                { status: 400 }
            );
        }

        // ⭐ Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("OTP sent to:", phone, "OTP:", otp);

        // ⭐ Check if phone already exists
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.phoneNo, phone));

        if (existingUser.length > 0) {
            // ⭐ Update OTP for existing user
            await db
                .update(users)
                .set({ otp })
                .where(eq(users.phoneNo, phone));
        } else {
            // ⭐ Create user entry with mobile only (user will fill email later)
            await db.insert(users).values({
                name: "",
                email: null,
                password: "",
                country: "",
                state: "",
                city: "",
                customerId: "",
                phoneNo: phone,
                otp
            });


        }

        return NextResponse.json({ success: true, otp });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
