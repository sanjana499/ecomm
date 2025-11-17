// pages/api/session-cart/add.ts
import { NextApiRequest, NextApiResponse } from "next";
import { session } from "@/lib/session"; // ✅ expects req + res

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use the session wrapper correctly
  const sess = await session(req, res);

  if (!sess.cart) sess.cart = [];

  if (req.method === "POST") {
    const { productId, quantity } = req.body;

    // Check if product already in cart
    const existing = sess.cart.find((i: any) => i.productId === productId);
    if (existing) existing.quantity += quantity;
    else sess.cart.push({ productId, quantity });

    return res.status(200).json({ cart: sess.cart });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
