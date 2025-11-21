"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { cartCount, setCartCount } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedQty, setAddedQty] = useState(0);
  //Login Show or Logged in link not show
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 🔹 Load Categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => Swal.fire("Error", "Failed to load categories", "error"));
  }, []);

  // 🔹 Load Product
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        Swal.fire("Error", "Unable to load product", "error");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);


  // 🔹 Add to Cart
  const addToCart = async (product: { productId: number; quantity: number }) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        Swal.fire("Login Required", "Please login first", "warning");
        return;
      }

      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId),
          product_id: Number(product.productId),
          quantity: Number(product.quantity) || 1,
        }),
      });

      const data = await res.json();
      console.log("ADD CART RESPONSE =>", data);

      if (data.success) {
        setAddedQty(addedQty + 1);
        setCartCount(cartCount + 1);

        Swal.fire({
          icon: "success",
          title: "Added to cart!",
          showConfirmButton: false,
          timer: 1200,
        });

        router.push("/cart");
      }
    } catch (err) {
      console.error("ADD CART ERROR =>", err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };



  const handleBuyNow = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to continue.",
      });

      return router.push("/login");
    }

    router.push(`/checkout?product=${product.id}`);
  };

  //Login Show or Logged in link not show
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedId && storedName) setUser({ id: storedId, name: storedName });
  }, []);


  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading product...</p>;

  if (!product)
    return <p className="text-center mt-10 text-gray-500">Product not found.</p>;



  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <nav className="w-full flex items-center justify-between border-b pb-2">
        <h1 className="text-2xl font-bold">ShopEase</h1>

        <div className="hidden md:flex items-center gap-6 relative">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/contact" className="hover:text-blue-600">Contact</a>

          {/* Categories */}
          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => {
              setTimeout(() => {
                setOpenDropdown(false);
                setActiveCategory(null);
              }, 120);
            }}
          >
            <button className="flex items-center hover:text-blue-600">
              Categories
              <ChevronDown className={`ml-1 h-4 w-4 ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute left-0 mt-2 flex bg-white shadow-lg rounded-lg z-50">
                <div className="w-44 border-r">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`px-4 py-2 flex justify-between cursor-pointer ${activeCategory === cat.name ? "bg-blue-100" : "hover:bg-blue-50"
                        }`}
                      onMouseEnter={() => setActiveCategory(cat.name)}
                    >
                      {cat.name}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </div>

                {activeCategory && (
                  <div className="w-52">
                    {categories
                      .find((c) => c.name === activeCategory)
                      ?.subcategories.map((sub: any) => (
                        <Link
                          key={sub.id}
                          href={`/category/${sub.id}`}
                          className="block px-4 py-2 hover:bg-blue-100"
                        >
                          {sub.name}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {!user && (
            <a
              href="/login"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              Login
            </a>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative"
            onClick={() => router.push("/cart")}
          >
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>


          {/* Profile dropdown if logged in */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-md hover:shadow-lg transition relative"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-zinc-700 dark:text-white font-medium text-sm">{user.name}</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 shadow-lg rounded-md border dark:border-zinc-700 z-50 overflow-hidden">
                  {/* My Profile link */}
                  {/* <a
                               href={`/profile?userId=${user.id}`} // GET parameter se user id pass karenge
                               className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                               onClick={() => setIsUserMenuOpen(false)}
                             >
                               My Profile
                             </a> */}

                  <a
                    href={`/profile/${user.id}`} // path param
                    className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Profile
                  </a>

                  {/* Logout */}
                  <button
                    onClick={() => {
                      localStorage.removeItem("userId");
                      localStorage.removeItem("userName");
                      setUser(null);
                      setIsUserMenuOpen(false);
                      Swal.fire("Success", "Logged out successfully", "success");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ---------------- Mobile Menu ---------------- */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col mt-3 gap-3">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/contact" className="hover:text-blue-600">Contact</a>
          <a href="/login" className="hover:text-blue-600">Login</a>
        </div>
      )}


      {/* 🔹 PRODUCT DETAILS */}
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative w-full h-96">
            <Image
              src={product.img?.startsWith("/upload") ? product.img : `/upload/${product.img}`}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>

            <p className="text-gray-600 mb-4">{product.description}</p>

            <div className="flex gap-3 items-center">
              <span className="text-green-600 text-2xl font-bold">
                ₹{product.offerPrice ?? product.price}
              </span>

              {product.offerPrice && (
                <span className="line-through text-gray-400 text-lg">₹{product.price}</span>
              )}
            </div>

            {/* SIZE SELECTOR (Fixed) */}
            <div className="mt-4">
              <label className="text-sm font-semibold">Select Size</label>

              <div className="flex gap-2 mt-2">
                {["M", "L", "XL", "XXL", "XXXL"].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-1 rounded-md border text-sm font-medium transition
                      ${selectedSize === sz
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    quantity: 1,
                  })
                }
                disabled={!selectedSize}
                className={`w-32 py-2 rounded-md ${!selectedSize
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                🛒 Add to Cart
              </button>


              <button
                onClick={handleBuyNow}
                className="w-28 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
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
