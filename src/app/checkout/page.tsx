"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingCart, User, Menu } from "lucide-react";

export default function CheckoutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 px-6 py-3 bg-white">
        <div className="flex items-center h-5 gap-3">
          <div className="relative w-20 h-20">
            <Image
              src="/logo (1).png"
              alt="Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            ShopEase
          </h1>
        </div>

        {/* Desktop Menu */}
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

        {/* Right Icons */}
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
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 px-6 bg-white">
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

      {/* ✅ Checkout Page Layout */}
      <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row p-6">
        {/* Left Section */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 mb-4 md:mb-0 md:mr-4">
          <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>

          <div className="border p-4 rounded-md mb-3">
            <p className="font-medium">Sanjana 6005193936</p>
            <p>
              Government Girls Hostel near Vishnu Mandir, Medical Road, Asuran
              Chowk, Gorakhpur, Uttar Pradesh - 273001
            </p>
            <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
              Deliver Here
            </button>
          </div>

          <div className="border p-4 rounded-md">
            <p className="font-medium">Antika Prasad 9919536576</p>
            <p>
              Mahuawa Khurd, Sohang Kushinagar, Jokwa Bazar ke Aage,
              Fazilanagar, Uttar Pradesh - 274401
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-80 bg-white shadow-md rounded-lg p-6 h-fit">
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
              <span>₹285</span>
            </div>
          </div>

          <button className="mt-6 bg-orange-500 text-white w-full py-3 rounded-md font-medium hover:bg-orange-600 transition">
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
}
