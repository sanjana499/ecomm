// // import { NextResponse } from "next/server";
// // import { db } from "@/lib/db";
// // import { addresses, orders, users } from "@/lib/schema";
// // import { eq, desc } from "drizzle-orm";

// // export async function GET() {
// //   try {
// //     const rawData = await db
// //       .select({

// //         id: orders.id,
// //         user_id: orders.user_id,
// //         total_amount: orders.total_amount,
// //         shipping_charge: orders.shipping_charge,
// //         order_status: orders.order_status,
// //         created_at: orders.created_at,

// //         product_ids: orders.product_ids,
// //         quantities: orders.quantities,

// //         user_name: users.name,
// //         email: users.email,
// //       })
// //       .from(orders)
// //       .leftJoin(addresses, eq(orders.address_id, addresses.id))
// //       .leftJoin(users, eq(orders.user_id, users.id))
// //       .orderBy(desc(orders.created_at));

// //     const data = rawData.map((order: any) => ({
// //       ...order,

// //       // FIX → convert to array safely
// //       product_ids:
// //         typeof order.product_ids === "string"
// //           ? order.product_ids.split(",")
// //           : [],

// //       quantities:
// //         typeof order.quantities === "string"
// //           ? order.quantities.split(",").map(Number)
// //           : [],
// //     }));

// //     return NextResponse.json(data);
// //   } catch (error) {
// //     console.log(error);
// //     return NextResponse.json([]);
// //   }
// // }
// // export async function POST(req: Request) {
// //   try {
// //     const body = await req.json();
// // console.log("body",body);
// //     await db.insert(orders).values({
// //       user_id: body.user_id,

// //       // CORRECT: Each productId from items[]
// //       product_ids: body.items.map((item: any) => item.productId).join(","),

// //       // CORRECT: Quantity of each item
// //       quantities: body.items.map((item: any) => item.quantity).join(","),

// //       // Full items JSON
// //       items: JSON.stringify(body.items),

// //       customerId: body.customer_id,
// //       total_amount: body.total_amount,
// //       email: body.email || "",
// //       name: body.name || "",

// //       shipping_charge: body.shipping_charge || 0,
// //       discount: body.discount || 0,
// //       address_id: body.address_id || null,
// //       shipping_address: body.shipping_address || "",
// //       city: body.city || "",
// //       state: body.state || "",
// //       pincode: body.pincode || "",

// //       payment_method: body.payment_method || "cod",
// //       order_status: body.order_status || "success",
// //     });

// //     return NextResponse.json({
// //       success: true,
// //       message: "Order created successfully",
// //     });

// //   } catch (error) {
// //     console.error("Order Create Error:", error);
// //     return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
// //   }
// // }




// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { addresses, orders, order_items, users } from "@/lib/schema";  // <-- orderItems import REQUIRED
// import { eq, desc } from "drizzle-orm";

// export async function GET() {
//   try {
//     const rawData = await db
//       .select({
//         id: orders.id,
//         user_id: orders.user_id,
//         total_amount: orders.total_amount,
//         shipping_charge: orders.shipping_charge,
//         order_status: orders.order_status,
//         created_at: orders.created_at,

//         product_ids: orders.product_ids,
//         quantities: orders.quantities,

//         user_name: users.name,
//         email: users.email,
//       })
//       .from(orders)
//       .leftJoin(addresses, eq(orders.address_id, addresses.id))
//       .leftJoin(users, eq(orders.user_id, users.id))
//       .orderBy(desc(orders.created_at));

//     const data = rawData.map((order: any) => ({
//       ...order,
//       product_ids:
//         typeof order.product_ids === "string"
//           ? order.product_ids.split(",")
//           : [],
//       quantities:
//         typeof order.quantities === "string"
//           ? order.quantities.split(",").map(Number)
//           : [],
//     }));

//     return NextResponse.json(data);
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json([]);
//   }
// }


// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("body", body);

//     // 1. Insert Order
//     // 1. Insert Order
//     const result: any = await db.insert(orders).values({
//       user_id: Number(body.user_id),

//       product_ids: body.items.map((i: any) => i.productId).join(","),
//       quantities: body.items.map((i: any) => i.quantity).join(","),
//       items: JSON.stringify(body.items),

//       customerId: body.customer_id,
//       total_amount: body.total_amount,
//       email: body.email || "",
//       name: body.name || "",

//       shipping_charge: body.shipping_charge || 0,
//       discount: body.discount || 0,
//       address_id: body.address_id || null,
//       shipping_address: body.shipping_address || "",
//       city: body.city || "",
//       state: body.state || "",
//       pincode: body.pincode || "",

//       payment_method: body.payment_method || "cod",
//       order_status: body.order_status || "success",
//     });

//     console.log("INSERT RESULT:", result);

//     // UNIVERSAL INSERT ID DETECT
//     const orderId =
//       result.insertId ||
//       result.lastInsertRowid ||
//       result[0]?.insertId ||
//       result[0]?.lastInsertRowid ||
//       null;

//     console.log("DETECTED ORDER ID:", orderId);

//     if (!orderId) {
//       throw new Error("insertId missing from MySQL response");
//     }


//     // // 2. GET orderId correctly
//     // const orderId = result.insertId;
//     // console.log("NEW ORDER ID:", orderId);

//     // if (!orderId) {
//     //   throw new Error("insertId missing from MySQL response");
//     // }

//     // 3. Insert ordered items
//     for (const item of body.items) {
//       await db.insert(order_items).values({
//         order_id: orderId,
//         product_id: item.productId,

//         price: String(item.offerPrice || item.price),
//         total_price: String((item.offerPrice || item.price) * item.quantity),

//         quantity: item.quantity,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Order + Items stored successfully",
//       orderId,
//     });

//   } catch (error) {
//     console.error("Order Create Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to create order" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addresses, orders, order_items, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const rawData = await db
      .select({
        id: orders.id,
        user_id: orders.user_id,
        total_amount: orders.total_amount,
        shipping_charge: orders.shipping_charge,
        order_status: orders.order_status,
        created_at: orders.created_at,

        product_ids: orders.product_ids,
        quantities: orders.quantities,

        // user_name: users.name,
        // email: users.email,
        user_name: orders.name ?? users.name,
        email: orders.email ?? users.email,

        customer_id: orders.customerId, // <-- yaha alias add karo
      })
      .from(orders)
      .leftJoin(addresses, eq(orders.address_id, addresses.id))
      .leftJoin(users, eq(orders.user_id, users.id))
      .orderBy(desc(orders.created_at));

    const data = rawData.map((order: any) => ({
      ...order,
      product_ids:
        typeof order.product_ids === "string"
          ? order.product_ids.split(",")
          : [],
      quantities:
        typeof order.quantities === "string"
          ? order.quantities.split(",").map(Number)
          : [],
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY:", body);

    // 1. Get user's email from users table
    const userData = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, Number(body.user_id)))
      .limit(1);

    const userEmail = userData[0]?.email || "";


    // SAFE VALUES
    const shippingCharge = String(body.shipping_charge ?? body.shipping ?? 0);
    const discount = String(body.discount ?? 0);
    const totalAmount = String(body.total_amount ?? 0);

    // 1. Insert Main Order
    const result: any = await db.insert(orders).values({
      user_id: Number(body.user_id),

      product_ids: body.items.map((i: any) => i.productId).join(","),
      quantities: body.items.map((i: any) => i.quantity).join(","),
      items: JSON.stringify(body.items),

      customerId: body.customer_id,
      total_amount: totalAmount,

      //email: body.email || "",
      email: userEmail, // ← yaha user ka email bhej rahe hain
      name: body.name || "",

      shipping_charge: shippingCharge,
      discount: discount,
      address_id: Number(body.address_id) || null,
      shipping_address: body.shipping_address || "",
      city: body.city || "",
      state: body.state || "",
      pincode: body.pincode || "",

      payment_method: body.payment_method || "cod",
      order_status: body.order_status || "success",
    });

    console.log("INSERT RESULT:", result);

    const orderId =
      result?.insertId ||
      result?.[0]?.insertId ||
      null;

    console.log("FINAL ORDER ID:", orderId);

    if (!orderId) throw new Error("orderId missing");

    // 2. Insert Order Items
    for (const item of body.items) {
      const price = Number(item.offerPrice ?? item.price);
      const quantity = Number(item.quantity);
      const total_price = price * quantity;

      console.log("ITEM INSERT:", {
        order_id: orderId,
        product_id: item.productId,
        price,
        total_price,
        quantity,
      });

      await db.insert(order_items).values({
        order_id: orderId,
        product_id: Number(item.productId),
        price: String(price),
        total_price: String(total_price),
        quantity: quantity,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order + items stored successfully",
      orderId,
    });

  } catch (error) {
    if (error instanceof Error) {
      console.error("Order insert error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}




