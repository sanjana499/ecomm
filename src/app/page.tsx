"use client";
import Image from "next/image";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-8 px-4 bg-white dark:bg-zinc-900 shadow-md">

        {/* ✅ Navbar */}
        <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
          {/* Logo */}
          <div className="flex items-center h-5">
  {/* Image container */}
  <div className="relative w-[100px] h-[100px]">
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
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Home</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Shop</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Categories</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Contact</a>
            <a href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Login</a>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search products..."
              className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            />

            {/* Icons */}
            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </button>
            <button>
              <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3">
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Home</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Shop</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Categories</a>
            <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Contact</a>
          </div>
        )}

       {/* ✅ Category Bar */}
<div className="w-full bg-white dark:bg-zinc-900 py-4 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
  <div className="flex justify-center gap-10 overflow-x-auto px-6">
    {[
     
      { name: "Mobiles & Tablets", img: "/categories/mobiles.jpeg" },
      { name: "Fashion", img: "/categories/fashion.jpeg" },
      { name: "Electronics", img: "/categories/electronics.jpeg" },
      { name: "Home & Furniture", img: "/categories/home.jpg" },
      { name: "TVs & Appliances", img: "/categories/tv.jpg" },
      { name: "Flight Bookings", img: "/categories/flight1.jpeg" },
      { name: "Beauty, Food..", img: "/categories/beauty.jpeg" },
      { name: "Grocery", img: "/categories/grocery.jpeg" },
    ].map((cat, i) => (
      <div
        key={i}
        className="flex flex-col items-center text-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 cursor-pointer"
      >
        <div className="relative w-14 h-14 mb-2">
          <Image
            src={cat.img}
            alt={cat.name}
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xs font-medium">{cat.name}</span>
      </div>
    ))}
  </div>
</div>

      </main>
    </div>
  );
}
