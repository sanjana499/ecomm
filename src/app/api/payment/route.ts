import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cart_items, products } from "@/lib/schema";

// Fetch cart items from DB
const userId = 1; // your logged-in user
const cartRows = await db
  .select({
    cartId: cart_items.id,
    quantity: cart_items.quantity,
    productId: products.id,
    title: products.title,
    price: products.price,
    offerPrice: products.offerPrice,
  })
  .from(cart_items)
  .innerJoin(products, eq(products.id, cart_items.product_id))
  .where(eq(cart_items.user_id, userId));

// Now cartRows is an array — you can map over it
const cartItemsFormatted = cartRows.map(item => ({
  ...item,
  quantity: item.quantity ?? 1,
  price: Number(item.price),
  offerPrice: item.offerPrice ? Number(item.offerPrice) : null,
}));

// Calculate total
const totalAmount = cartItemsFormatted.reduce((acc, item) => {
  const price = item.offerPrice ?? item.price;
  return acc + price * (item.quantity ?? 1);
}, 0);
