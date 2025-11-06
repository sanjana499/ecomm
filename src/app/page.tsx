"use client";

import Image from "next/image";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Banner Data
  const banners = [
    { title: "Beds", price: "From ₹8,999", desc: "Wooden Street, Sleepyhead & more", img: "/banners/bannerBed.jpg" },
    { title: "Laptops", price: "From ₹35,000", desc: "HP, Lenovo, ASUS & more", img: "/banners/bannerLaptop.jpg" },
    { title: "Sofas", price: "From ₹12,999", desc: "Wakefit, Urban Ladder & more", img: "/banners/bannerSofa.jpg" },
    { title: "Smart TVs", price: "From ₹9,999", desc: "Samsung, LG, Mi & more", img: "/banners/bannerTV.jpg" },
  ];

  // ✅ Slider logic
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  

  // ✅ Top Deals Data
 const deals = [
  { name: "Fans & Geysers", price: "From ₹999", img: "/top-deals/d.jpg" },
  { name: "Home Essentials", price: "Shop Now!", img: "/top-deals/d1.jpg" },
  { name: "Projectors", price: "From ₹6990", img: "/top-deals/d2.jpg" },
  { name: "Speakers", price: "From ₹499*", img: "/top-deals/d4.jpg" },
  
];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-8 px-4 bg-white dark:bg-zinc-900 shadow-md">
        {/* ✅ Navbar */}
        <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
          <div className="flex items-center h-5">
            <div className="relative w-[100px] h-[100px]">
              <Image src="/logo (1).png" alt="Logo" fill className="object-contain rounded-md" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">ShopEase</h1>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {["Home", "Shop", "Categories", "Contact"].map((item) => (
              <a key={item} href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">{item}</a>
            ))}
            <a href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Login</a>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            />

            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">2</span>
            </button>
            <button><User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" /></button>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3">
            {["Home", "Shop", "Categories", "Contact"].map((item) => (
              <a key={item} href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">{item}</a>
            ))}
          </div>
        )}

<<<<<<< HEAD
        {/* ✅ Category Bar */}
        <div className="w-full bg-white dark:bg-zinc-900 py-4 border-b border-gray-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-center gap-10 overflow-x-auto px-6">
            {[
              { name: "Mobiles & Tablets", img: "/categories/mobiles.jpeg" },
              { name: "Fashion", img: "/categories/fashion.jpeg" },
              { name: "Electronics", img: "/categories/electronics.jpeg" },
              { name: "Home & Furniture", img: "/categories/h&f2.jpg" },
              { name: "TVs & Appliances", img: "/categories/tv&h.jpg" },
              { name: "Flight Bookings", img: "/categories/flyB.jpg" },
              { name: "Beauty, Food..", img: "/categories/food.jpg" },
              { name: "Grocery", img: "/categories/grocery.jpg" },
            ].map((cat, i) => (
              <div key={i} className="flex flex-col items-center text-center text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 cursor-pointer">
                <div className="relative w-14 h-14 mb-2">
                  <Image src={cat.img} alt={cat.name} fill className="object-contain" />
                </div>
                <span className="text-xs font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
=======
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
>>>>>>> 8bd37c39fadbb44db30b2cd470e3a8bbad182c6e
        </div>

        {/* ✅ Flipkart-style Banner Slider */}
        <div className="w-full mt-6 relative overflow-hidden rounded-md shadow-md">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((item, i) => (
              <div
                key={i}
                className="w-full flex-shrink-0 flex items-center justify-between bg-[#2874f0] text-white px-10 md:px-20 py-10 h-[280px]"
              >
                <div className="flex flex-col justify-center space-y-3">
                  <h2 className="text-4xl font-semibold">{item.title}</h2>
                  <p className="text-2xl font-semibold">{item.price}</p>
                  <p className="text-sm opacity-90">{item.desc}</p>
                  <button className="w-fit bg-white text-[#2874f0] font-medium px-5 py-2 rounded-sm hover:bg-blue-100 transition">
                    Shop Now
                  </button>
                </div>

                <div className="relative w-[260px] h-[180px]">
                  <Image src={item.img} alt={item.title} fill className="object-contain" priority />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button onClick={prevSlide} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
            <span className="text-[#2874f0] text-xl font-bold">&#10094;</span>
          </button>
          <button onClick={nextSlide} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition">
            <span className="text-[#2874f0] text-xl font-bold">&#10095;</span>
          </button>

          {/* ✅ Flipkart-style Indicator Bars */}
          <div className="absolute bottom-2 w-full flex justify-center items-center gap-1.5">
            {banners.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="relative cursor-pointer transition-all"
                style={{
                  width: currentIndex === i ? "48px" : "12px",
                  height: "4px",
                  borderRadius: "2px",
                  margin: "0 4px",
                  backgroundColor: "rgba(0,0,0,0.13)",
                  overflow: "hidden",
                }}
              >
                {currentIndex === i && (
                  <div className="absolute top-0 left-0 h-full bg-black transition-all duration-700" style={{ width: "32px", borderRadius: "2px" }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Top Deals Section */}
        <section className="w-full bg-white mt-8 rounded-md shadow-sm p-4">
          <div className="flex justify-between items-center px-2 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Top Deals</h2>
            <a href="#" className="text-blue-600 font-medium hover:underline">View All</a>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {deals.map((deal, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[160px] border border-gray-200 rounded-md p-3 hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative w-full h-[140px] mb-2">
                  <Image src={deal.img} alt={deal.name} fill className="object-contain rounded" />
                </div>
                <h3 className="text-sm font-medium text-gray-800 truncate">{deal.name}</h3>
                <p className="text-green-600 text-sm font-semibold">{deal.price}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
