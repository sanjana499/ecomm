"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Menu, ShoppingCart, User } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🧩 Fetch Cart Items
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (res.ok) setCartItems(data.items);
      } catch (error) {
        Swal.fire("Error", "Failed to load cart items", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // 🗑️ Remove Item from Cart
  const removeFromCart = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("Removed!", "Item removed from cart.", "success");
      } else {
        Swal.fire("Error", "Failed to remove item", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;

  // 💰 Calculate total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.offerPrice ?? item.price) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div>
      {/* 🔹 Top Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 px-6 py-3">
        <div className="flex items-center h-5 gap-3">
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            ShopEase
          </h1>
        </div>

        {/* 🔹 Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a
              key={item}
              href="/"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              {item}
            </a>
          ))}
          <a
            href="/login"
            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
          >
            Login
          </a>
        </div>

        {/* 🔹 Right Icons */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          />

          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </button>

          <button>
            <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 px-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a
              key={item}
              href="/"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* 🛒 Cart + Payment Section */}
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🧾 Cart Items (Left 2/3) */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🛒 My Cart</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 mb-4 bg-white p-4 rounded-md shadow-sm items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.img?.startsWith("/upload") ? item.img : `/upload/${item.img}`}
                    alt={item.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity ?? 1}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{item.offerPrice ?? item.price}
                    </span>
                    {item.offerPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 🗑️ Remove button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* 💳 Payment Summary (Right 1/3) */}
        <div className="bg-white p-6 rounded-md shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4">💰 Payment Details</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => Swal.fire("Proceeding to Payment", "Redirecting...", "info")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
