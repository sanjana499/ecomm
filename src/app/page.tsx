"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Key } from "react";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dealsData, setDealsData] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;



  //Login Show or Logged in link not show
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // useEffect(() => {
  //   if (!userId) return;

  //   const savedCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]");
  //   setCartCount(savedCart.length);

  // }, [userId]);


  // Replace your current useEffect(...) that initializes user + cart count with this:

  useEffect(() => {
    // Function to fetch cart for logged-in user
    const fetchCartCount = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        // Fetch cart from backend API
        const res = await fetch(`/api/cart?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();
        const items = data.items || [];

        // Calculate total quantity
        const count = items.reduce((sum: any, item: { quantity: any; }) => sum + (item.quantity ?? 1), 0);
        setCartCount(count);

        // Optionally store locally so other tabs can sync
        localStorage.setItem("cartData", JSON.stringify(items));
      } catch (error) {
        console.error("Cart fetch error:", error);
        setCartCount(0);
      }
    };

    // Initial fetch
    fetchCartCount();

    // Polling every 2s for same-tab updates
    const interval = setInterval(fetchCartCount, 2000);

    // Listen for storage changes (other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cartData") {
        const cart = JSON.parse(e.newValue || "[]");
        const count = cart.reduce((sum: any, item: { quantity: any; }) => sum + (item.quantity ?? 1), 0);
        setCartCount(count);
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);


  //Load cart//

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);

  interface Product {
    id: Key | null | undefined;
    title: string;
    color: string;
    size: string;
    quantity: number;
    price: string;
    offerPrice: string;
    desc: string;
    img: string;
  }

  // ✅ Banner slides (instead of undefined "deal")
  const bannerSlides = [
    { img: "/uploads/images/img5.jpg" },
    { img: "/uploads/images/img2.jpg" },
    { img: "/uploads/images/img5.jpg" },
  ];

  // ✅ Fetch products from DB
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/product");
      if (res.ok) {
        const data = await res.json();
        setDealsData(data.products || []);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Auto slider controls
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % bannerSlides.length);

  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  //Login Show or Logged in link not show
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedId && storedName) setUser({ id: storedId, name: storedName });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start py-8 px-4 bg-white dark:bg-zinc-900 shadow-md">
        {/* ✅ Navbar */}
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

            {/* Login link ONLY if user is not logged in */}
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
            <input
              type="text"
              placeholder="Search products..."
              className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            />


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
                        localStorage.removeItem("cartData"); // optional
                        setUser(null);
                        setCartCount(0); // immediately update icon
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


            {/* <button>
              <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button> */}

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
          <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3">
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

        {/* ✅ Auto Slider */}
        <div className="w-full mt-6 relative overflow-hidden rounded-md shadow-md">
          <div className="relative w-full h-[450px]">
            {bannerSlides.map((item, i) => (
              <div
                key={i}
                className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${currentIndex === i ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <Image
                  src={item.img}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition-opacity duration-700 ease-in-out"
                  priority
                  quality={100}
                  placeholder="empty"
                />
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow transition"
            >
              &#10094;
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-3 shadow transition"
            >
              &#10095;
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2">
              {bannerSlides.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all ${currentIndex === i
                    ? "bg-white scale-125"
                    : "bg-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ✅ Top Deals Section */}
        <section className="w-full bg-white mt-8 rounded-md shadow-sm p-6">
          <div className="flex justify-between items-center px-2 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Top Deals</h2>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.isArray(dealsData) && dealsData.length > 0 ? (
              dealsData.map((product: Product) => {
                // ✅ Convert to numbers to avoid type errors
                const price = Number(product.price) || 0;
                const offerPrice = Number(product.offerPrice) || 0;

                // ✅ Calculate discount %
                const discountPercent =
                  price > 0 ? Math.round(((price - offerPrice) / price) * 100) : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/category/slippers/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-transform hover:-translate-y-1 bg-white block"
                  >
                    {/* Product Image */}
                    <div className="relative w-full h-[180px] mb-3">
                      <Image
                        src={product.img}
                        alt={product.title}
                        fill
                        className="object-contain rounded-md bg-gray-100"
                      />

                      {/* ✅ Discount badge */}
                      {discountPercent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          {discountPercent}% OFF
                        </div>
                      )}
                    </div>

                    {/* ✅ Product Title */}
                    <h3 className="text-lg font-semibold text-gray-800 text-center line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                );
              })
            ) : (
              <p>No deals found.</p>
            )}
          </div>
        </section>


      </main>
    </div>
  );
}
