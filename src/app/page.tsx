"use client";

import Image from "next/image";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const deal = [
    {
      title: "Men's Fashion",
      price: "From ₹499",
      desc: "T-Shirts, Jeans, Jackets & more",
      img: "/uploads/images/img.jpeg",
    },
    {
      title: "Women's Fashion",
      price: "From ₹699",
      desc: "Dresses, Tops, Sarees & more",
      img: "/uploads/images/img2.jpeg",
    }, {
      title: "Women's Fashion",
      price: "From ₹699",
      desc: "Dresses, Tops, Sarees & more",
      img: "/uploads/images/img.jpeg",
    },

  ];


  interface Product {
    title: string;
    color: string;
    size: string;
    quantity: number;
    price: string;
    offerPrice: string;
    desc: string;
    img: string;
  }

  const dealsData: Product[] = [
    {
      title: "Women's Denim Jacket",
      color: "Blue",
      size: "L",
      quantity: 1,
      price: "1299",
      offerPrice: "899",
      desc: "Stylish black denim jacket perfect for winter.",
      img: "/uploads/images/download (1).jpeg",
    },
    {
      title: "men's Denim Jacket",
      color: "Black",
      size: "M",
      quantity: 1,
      price: "1999",
      offerPrice: "1399",
      desc: "Stylish black denim jacket perfect for winter.",
      img: "/uploads/images/images (8).jpeg",
    },

    {
      title: "Women's",
      color: "White",
      size: "9",
      quantity: 1,
      price: "2499",
      offerPrice: "1799",
      desc: "Lightweight and comfortable running shoes.",
      img: "/uploads/images/download (2).jpeg",
    },
    {
      title: "Men's Casual Shirt",
      color: "Brown",
      size: "Free",
      quantity: 1,
      price: "1599",
      offerPrice: "999",
      desc: "Comfortable cotton shirt with slim fit design.",
      img: "/uploads/images/images (9).jpeg",
    },
    {
      title: "Women's Frock",
      color: "Black",
      size: "Free",
      quantity: 1,
      price: "2999",
      offerPrice: "1999",
      desc: "Wireless earbuds with noise cancellation feature.",
      img: "/uploads/images/download.jpeg",
    },
  ];



  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % 2); // loops between 0 and 1 only

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + 2) % 2); // loops backwards safely



  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-8 px-4 bg-white dark:bg-zinc-900 shadow-md">
        {/* ✅ Navbar */}
        <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
          <div className="flex items-center h-5">
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

        {isMenuOpen && (
          <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3">
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

        {/* ✅ Flipkart-style Auto Slider (2 Slides Only) */}
        <div className="w-full mt-6 relative overflow-hidden rounded-md shadow-md">
          <div className="relative w-full h-[500px]"> {/* Increased height */}
            {deal.slice(0, 2).map((item, i) => (
              <div
                key={i}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000
                   ease-in-out ${currentIndex === i ? "" : "opacity-0 z-0"
                  }`}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />


                {/* Overlay Content */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 md:px-20 text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">
                    {item.title}
                  </h2>
                  <p className="text-2xl md:text-3xl font-semibold text-yellow-300">
                    {item.price}
                  </p>
                  <p className="text-lg md:text-xl max-w-lg">{item.desc}</p>
                  <button className="mt-5 bg-yellow-400 text-black font-medium w-28 py-2 rounded-md hover:bg-yellow-500 transition">
                    Shop Now
                  </button>

                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow transition"
            >
              &#10094;
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow transition"
            >
              &#10095;
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2">
              {deal.slice(0, 2).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentIndex === i ? "bg-white scale-125" : "bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
        <section className="w-full bg-white mt-8 rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center px-2 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Top Deals</h2>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {dealsData.map((product, i) => (
              <Link
                key={i}
                href={`/product/${i + 1}`} // 👈 Dynamic route: /product/1, /product/2, etc.
                className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-transform hover:-translate-y-1 bg-white block"
              >
                {/* 🖼 Product Image */}
                <div className="relative w-full h-72 mb-3">
                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* 🏷 Product Details */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">Color: {product.color}</p>
                <p className="text-sm text-gray-600 mb-1">Size: {product.size}</p>
                <p className="text-sm text-gray-600 mb-1">Qty: {product.quantity}</p>

                {/* 💰 Prices */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600 text-lg font-bold">
                    ₹{product.offerPrice}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{product.price}
                  </span>
                </div>

                {/* 📝 Description */}
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {product.desc}
                </p>
              </Link>
            ))}
          </div>

        </section>


      </main>
    </div>
  );
}
