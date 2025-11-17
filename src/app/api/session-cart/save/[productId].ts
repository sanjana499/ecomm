import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session.cart) session.cart = [];
  if (!session.savedItems) session.savedItems = [];

  const { productId } = req.query;

  if (req.method === "POST") {
    const index = session.cart.findIndex(i => i.productId === Number(productId));
    if (index === -1) return res.status(404).json({ message: "Item not in cart" });

    const [item] = session.cart.splice(index, 1);
    session.savedItems.push(item);

    return res.status(200).json({ cart: session.cart, savedItems: session.savedItems });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
