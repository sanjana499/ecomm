"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";


export default function ProductDetails() {
  const { id } = useParams(); // ✅ Get product ID from URL
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addedQty, setAddedQty] = useState(0);
  const { cartCount, setCartCount } = useCart();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);


  const addToCart = async () => {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = await res.json();

      if (data.success) {
        setAddedQty(addedQty + 1);             // Button count
        setCartCount(cartCount + 1);           // Global navbar count update

        Swal.fire("Added to Cart", `${product.title} added to cart`, "success");
      } else {
        Swal.fire("Error", data.error || "Failed to add to cart", "error");
      }
    } catch {
      Swal.fire("Error", "Unable to add to cart", "error");
    }
  };

  // ✅ Fetch single product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Unable to load product details", "error");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading product details...</p>;

  if (!product)
    return <p className="text-center text-gray-500 mt-10">Product not found.</p>;

  return (
    <div>
      {/* 🔹 Top Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
        <div className="flex items-center h-5">
          <div className="relative w-[100px] h-[100px]">
            {/* Optional logo */}
          </div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            ShopEase
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6 relative">
          {["Home", "Contact"].map((item) => (
            <a
              key={item}
              href="/"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              {item}
            </a>
          ))}

          {/* Category Dropdown */}
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
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""
                  }`}
              />
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
                          href={`/category/slippers/${sub.id}`} // ✅ correct dynamic route
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

          <button onClick={() => router.push("/cart")} className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {cartCount}
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

      {/* 🔹 Product Details */}
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative w-full h-96">
            <Image
              src={
                product.img?.startsWith("/upload")
                  ? product.img
                  : `/upload/${product.img}`
              }
              alt={product.title || "Product Image"}
              fill
              className="object-contain rounded-md bg-gray-100"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {product.title}
            </h1>
            <p className="text-gray-600 mb-4">
              {product.description || "No description available."}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-green-600 text-2xl font-bold">
                ₹{product.offerPrice ?? product.price}
              </span>
              {product.offerPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.price}
                </span>
              )}
            </div>

            {product.color && (
              <p className="text-sm text-gray-700 mb-1">
                <strong>Color:</strong> {product.color}
              </p>
            )}
            {product.size && (
              <p className="text-sm text-gray-700 mb-1">
                <strong>Size:</strong> {product.size}
              </p>
            )}
            {product.gender && (
              <p className="text-sm text-gray-700 mb-1">
                <strong>Gender:</strong> {product.gender}
              </p>
            )}
            {product.type && (
              <p className="text-sm text-gray-700 mb-1">
                <strong>Type:</strong> {product.type}
              </p>
            )}

            {/* 🔹 Buttons in a single row */}
            <div className="mt-4 flex  gap-3">
              <button
                onClick={addToCart}
                className="w-32 bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700"
              >
                🛒 Add to Cart {addedQty > 0 && `(${addedQty})`}
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="w-28 bg-orange-500 text-white py-1.5 text-sm rounded-md hover:bg-orange-600 transition font-medium"
              >
                ⚡ Buy Now
              </button>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}
