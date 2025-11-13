"use client";

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu } from "lucide-react"; // ✅ added missing imports

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [total] = useState(285); // Later you can calculate dynamically
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ added missing state

  // ✅ Fetch address list
  useEffect(() => {
    fetch("/api/address")
      .then(async (res) => {
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Address data:", data);
        setAddresses(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        Swal.fire("Error", "Failed to load addresses", "error");
      });
  }, []);

  // ✅ Place order handler
  const placeOrder = async () => {
    if (!selectedAddress) {
      Swal.fire("Select Address", "Please choose a delivery address", "warning");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, addressId: selectedAddress, total }),
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
      {/* 🔹 Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2 mb-6">
        <div className="flex items-center h-5">
          <div className="relative w-[100px] h-[100px]"></div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            ShopEase
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
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

        {/* Icons */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          />

          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              2
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

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 mb-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              {item}
            </a>
          ))}
        </div>
      )}

      {/* ✅ Checkout Layout */}
      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4">
          {/* Left Section: Address */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border p-4 rounded-md mb-3 ${
                  selectedAddress === addr.id
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <p className="font-medium">
                  {addr.name} {addr.phone}
                </p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>

                <button
                  onClick={() => setSelectedAddress(addr.id)}
                  className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Deliver Here
                </button>
              </div>
            ))}
          </div>

          {/* Right Section: Price Details */}
          <div className="w-full md:w-72 bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Price Details</h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Price (1 item)</span>
                <span>₹280</span>
              </div>
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
