"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { Menu, ShoppingCart, User, ChevronDown, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";


export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);


  //Login Show or Logged in link not show
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  const [,] = useState<any[]>(() => {

    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("savedItems") || "[]");
    }
    return [];
  });


  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`/api/cart/count?userId=${userId}`);
      const data = await res.json();
      setCartCount(data.count);
    } catch (error) {
      console.log("Error fetching cart count");
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  // Update cart icon count whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    setCartCount(count);
  }, [cartItems]);


  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("userId", userId);
      const res = await fetch(`/api/cart?userId=${userId}`);
      const data = await res.json();

      if (res.ok) setCartItems(data.items);
    } catch (error) {
      Swal.fire("Error", "Failed to load cart items", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 1️⃣ Load cart items
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    fetch(`/api/cart?userId=${userId}`)
      .then(res => res.json())
      .then(data => setCartItems(data));
  }, []);


  const updateQuantity = async (id: any, newQty: number) => {
    if (newQty < 1) return;

    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: newQty }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ Toast Message
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        });

        Toast.fire({
          icon: "success",
          title: `Quantity updated to ${newQty}`,
        });

        // Refresh cart UI (optional)
        fetchCart();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);

  //Login Show or Logged in link not show
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedId && storedName) setUser({ id: storedId, name: storedName });
  }, []);


  const removeFromCart = async (id: number) => {
    try {
      const res = await fetch("/api/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }), // send id inside body
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Item removed from cart",
          timer: 1200,
          showConfirmButton: false,
        });

        fetchCart(); // refresh cart
      } else {
        Swal.fire("Error", "Failed to remove item", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };


  if (loading) return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;
  if (cartItems.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;

  // 💰 Calculate total
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.offerPrice ?? item.price) * (item.quantity ?? 1),
    0
  );
  const shipping = subtotal > 1000 ? 0 : 99;
  const platformFee = 5; // fixed
  const total = subtotal + shipping + platformFee;

  // Save to localStorage so CheckoutPage can read it
  localStorage.setItem("cartSubtotal", subtotal.toFixed(2));
  localStorage.setItem("cartShipping", shipping.toFixed(2));
  localStorage.setItem("cartPlatformFee", platformFee.toFixed(2));
  localStorage.setItem("cartTotal", total.toFixed(2));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔹 Top Navbar */}
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
          )}        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <ShoppingCart className="w-6 h-6" />
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
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-zinc-900 shadow-lg rounded-md 
                  border dark:border-zinc-700 z-50 overflow-hidden">
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

      {/* 🛒 Cart + Payment Section */}
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🧾 Cart Items (Left 2/3) */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">🛒 My Cart</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 mb-4 bg-white p-4 rounded-md shadow-sm items-center justify-between"
            >
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.img?.startsWith("/upload") ? item.img : `/upload/${item.img}`}
                    alt={item.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    Size: {item.size} | Color: {item.color}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity ?? 1}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{item.offerPrice ?? item.price}
                    </span>
                    {item.offerPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                </div>
                {/* 🗑️ Remove button */}
                {/* Remove + Quantity Controls (Flipkart Style) */}
                <div className="flex flex-col items-center gap-2">

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold"
                    >
                      -
                    </button>

                    <input
                      readOnly
                      value={item.quantity ?? 1}
                      className="w-10 text-center border rounded-md"
                    />

                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white py-1.5 text-sm rounded-md hover:bg-red-600 transition font-medium w-24"
                  >
                    Remove
                  </button>

                </div>

              </div>
            </div>

          ))}
        </div>

        {/* 💳 Payment Summary (Right 1/3) */}
        <div className="bg-white p-6 rounded-md shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4">💰 Payment Details</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
          </div>

          <div className="flex justify-between mt-3 text-gray-700">
              <p>Platform Fee</p>
              <p>₹{platformFee.toFixed(2)}</p>
            </div>


          <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => {
              const userId = localStorage.getItem("userId");

              if (!userId) {
                Swal.fire({
                  icon: "warning",
                  title: "Please login first",
                  text: "You must login before checkout!",
                  timer: 1500,
                  showConfirmButton: false,
                });

                // Redirect to login page
                setTimeout(() => {
                  router.push("/login");
                }, 1200);

                return;
              }

              // 🟢 1. Cart data ko localStorage me save karo
              if (cartItems && cartItems.length > 0) {
                localStorage.setItem("cartData", JSON.stringify(cartItems));
              }

              // 🟢 2. Redirect to checkout
              router.push("/checkout");
            }}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
          >
            Proceed to Checkout
          </button>

        </div>
      </div>
    </div>
  );
}
