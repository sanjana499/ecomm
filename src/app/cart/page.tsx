"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Menu, ShoppingCart, User, ChevronDown, ChevronRight } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => Swal.fire("Error", "Failed to load categories", "error"));
  }, []);

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
      const res = await fetch(`/api/cart/${id}`, { method: "DELETE" });
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

  // 🔹 Update Quantity
  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) + delta) }
          : item
      )
    );
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  if (!cartItems || cartItems.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;

  // 💰 Calculate total dynamically
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.offerPrice ?? item.price) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div>
      {/* 🔹 Top Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
        <div className="flex items-center h-5">
          <div className="relative w-[100px] h-[100px]">{/* Logo */}</div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">ShopEase</h1>
        </div>

        <div className="hidden md:flex items-center gap-6 relative">
          {["Home", "Contact"].map((item) => (
            <a key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">{item}</a>
          ))}

          {/* Category Dropdown */}
          <div
            className="relative z-50"
            onMouseEnter={() => { clearTimeout((window as any).dropdownTimer); setOpenDropdown(true); }}
            onMouseLeave={() => { (window as any).dropdownTimer = setTimeout(() => { setOpenDropdown(false); setActiveCategory(null); }, 150); }}
          >
            <button className="flex items-center text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
              onClick={() => setOpenDropdown(!openDropdown)}>
              Categories
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute left-0 mt-2 flex bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700 z-50">
                <div className="w-44 border-r dark:border-zinc-700">
                  {categories.map((cat) => (
                    <div key={cat.id} className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${activeCategory === cat.name ? "bg-blue-100 dark:bg-zinc-700 text-blue-700" : "text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-700"}`}
                      onMouseEnter={() => setActiveCategory(cat.name)}>
                      {cat.name}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </div>
                {activeCategory && (
                  <div className="w-52">
                    {categories.find((cat) => cat.name === activeCategory)?.subcategories.map((sub: any) => (
                      <Link key={sub.id} href={`/category/slippers/${sub.id}`}
                        className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-zinc-700"
                        onClick={() => setOpenDropdown(false)}>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <a href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Login</a>
        </div>

        <div className="flex items-center gap-4">
          <input type="text" placeholder="Search products..."
            className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white" />
          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>

          <button><User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" /></button>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" /></button>
        </div>
      </nav>

      {/* 🔹 Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 px-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">{item}</a>
          ))}
        </div>
      )}

      {/* 🛒 Cart + Payment Section */}
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">My Cart ({cartItems.length})</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative w-28 h-28">
                  <Image
                    src={item.img?.startsWith("/upload") ? item.img : `/upload/${item.img}`}
                    alt={item.title}
                    fill
                    className="object-contain rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">Seller: ShopEase</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-bold text-xl">₹{item.offerPrice ?? item.price}</span>
                    {item.offerPrice && <span className="line-through text-gray-400">₹{item.price}</span>}
                  </div>

                  <p className="text-sm text-gray-700 mt-1">Delivery by <span className="font-medium">Mon Nov 17</span></p>

                  {/* Quantity + Remove */}
                  <div className="mt-3 flex items-center gap-4">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >-</button>

                    <span className="px-3 py-1 border rounded">{item.quantity ?? 1}</span>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >+</button>

                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-semibold hover:text-red-600">REMOVE</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-6 rounded-lg border shadow-md h-fit">
          <h3 className="text-gray-600 font-semibold mb-4 text-lg">PRICE DETAILS</h3>
          <div className="flex justify-between mb-3">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span>Delivery Charges</span>
            <span className="text-green-600">{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>
          <div className="border-t pt-3 flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}
