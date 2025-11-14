"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const router = useRouter();


  const handleDeliverHere = () => {
    if (selectedAddress) {
      router.push("/checkout/payment"); // yahi page path aapka hai
    }
  };
  // Fetch addresses
  useEffect(() => {
    fetch("/api/address")
      .then(async (res) => {
        const data = await res.json();
        setAddresses(data);
      })
      .catch(() => Swal.fire("Error", "Failed to load addresses", "error"));
  }, []);

  // Fetch cart items
  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items || [];
        setCartItems(items);
      })
      .catch(() => Swal.fire("Error", "Failed to load cart items", "error"));
  }, []);

  // Recalculate total
  useEffect(() => {
    const sum = cartItems.reduce(
      (acc: number, item: any) => acc + (item.offerPrice ?? item.price) * (item.quantity ?? 1),
      0
    );
    setTotal(sum + 5); // +5 platform fee
  }, [cartItems]);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => Swal.fire("Error", "Failed to load categories", "error"));
  }, []);

  const placeOrder = async () => {
    if (addresses.length === 0) {
      Swal.fire("No Address", "Please add a delivery address", "warning");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, total }),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire("Order Placed!", "Your order has been successfully placed.", "success");
    } else {
      Swal.fire("Error", data.error || "Failed to place order", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
        <div className="flex items-center h-5">
          <div className="relative w-[100px] h-[100px]">{/* logo */}</div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">ShopEase</h1>
        </div>

        <div className="hidden md:flex items-center gap-6 relative">
          {["Home", "Contact"].map((item) => (
            <a key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
              {item}
            </a>
          ))}

          {/* Categories Dropdown */}
          <div
            className="relative z-50"
            onMouseEnter={() => {
              clearTimeout((window as any).dropdownTimer);
              setOpenDropdown(true);
            }}
            onMouseLeave={() => {
              (window as any).dropdownTimer = setTimeout(() => {
                setOpenDropdown(false);
                setActiveCategory(null);
              }, 150);
            }}
          >
            <button
              className="flex items-center text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              Categories
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute left-0 mt-2 flex bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700 z-50">
                {/* Left - main categories */}
                <div className="w-44 border-r dark:border-zinc-700">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${activeCategory === cat.name
                        ? "bg-blue-100 dark:bg-zinc-700 text-blue-700"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-700"
                        }`}
                      onMouseEnter={() => setActiveCategory(cat.name)}
                    >
                      {cat.name}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </div>

                {/* Right - subcategories */}
                {activeCategory && (
                  <div className="w-52">
                    {categories
                      .find((cat) => cat.name === activeCategory)
                      ?.subcategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/slippers/${sub.id}`}
                          className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-zinc-700"
                          onClick={() => setOpenDropdown(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <a href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
            Login
          </a>
        </div>

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

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 mb-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
              {item}
            </a>
          ))}
        </div>
      )}

      {/* Checkout Layout */}
      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4">
          {/* Left: Address & Payment */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="border p-4 rounded-md mb-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {addr.name} {addr.phone}
                  </p>
                  <p>{addr.address}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress === addr.id}
                  onChange={() => setSelectedAddress(addr.id)}
                  className="w-5 h-5 accent-blue-500"
                />
              </div>
            ))}

            <button
              onClick={handleDeliverHere}
              className={`mt-4 w-50 py-2 rounded-md font-medium text-white transition ${selectedAddress ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-400 cursor-not-allowed"
                }`}
            >
              Deliver Here
            </button>


          </div>

          {/* Right: Order Summary */}
          <div className="w-full md:w-72 bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-gray-700">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{(item.offerPrice ?? item.price) * item.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹5</span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 bg-yellow-500 text-white w-full py-2 rounded-md font-medium hover:bg-yellow-600 transition"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
