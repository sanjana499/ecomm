import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.cart) session.cart = [];

  const { productId } = req.query;

  if (req.method === "PUT") {
    const { quantity } = req.body;
    const item = session.cart.find(i => i.productId === Number(productId));
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    return res.status(200).json({ cart: session.cart });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
