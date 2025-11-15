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

  const [savedItems, setSavedItems] = useState<any[]>(() => {
    // LocalStorage se saved items load karo
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("savedItems") || "[]");
    }
    return [];
  });


  // const fetchCartCount = async () => {
  //   try {
  //     const res = await fetch("/api/cart/count");
  //     const data = await res.json();
  //     setCartCount(data.count);
  //   } catch (error) {
  //     console.log("Error fetching cart count");
  //   }
  // };

  // useEffect(() => {
  //   fetchCartCount();
  // }, []);

  // Update cart icon count whenever cartItems change
  useEffect(() => {
    const count = cartItems.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    setCartCount(count);
  }, [cartItems]);


  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (res.ok) setCartItems(data.items);
    } catch (error) {
      Swal.fire("Error", "Failed to load cart items", "error");
    } finally {
      setLoading(false);
    }
  };




  const updateQuantity = async (cartId: number, newQty: number) => {
    if (newQty < 1) return;

    await fetch(`/api/cart/update/${cartId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity: newQty }),
    });

    fetchCart();        // update cart items
    //fetchCartCount();   // update cart icon count

    //fetchCart(); // now works 👍
  };




  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);

  // 🧩 Fetch Cart Items
  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (res.ok) setCartItems(data.items);
      } catch (error) {
        Swal.fire("Error", "Failed to load cart items", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // 🗑️ Remove Item from Cart
  const removeFromCart = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Remove Item?",
      text: "Are you sure you want to remove this item from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        //await fetchCartCount(); // ✅ Update cart icon count immediately
        Swal.fire("Removed!", "Item removed from cart.", "success");
      } else {
        Swal.fire("Error", "Failed to remove item", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
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
  // Save to localStorage so CheckoutPage can read it
  localStorage.setItem("cartSubtotal", subtotal.toFixed(2));
  localStorage.setItem("cartShipping", shipping.toFixed(2));
  localStorage.setItem("cartPlatformFee", platformFee.toFixed(2));
  localStorage.setItem("cartTotal", total.toFixed(2));

  //Save Later Button//
const handleSaveForLater = async (item: any) => {
  try {
    // Remove from cart
    setCartItems(prev => prev.filter(i => i.id !== item.id));

    // Add to savedItems state
    setSavedItems(prev => {
      const updated = [...prev, item];
      localStorage.setItem("savedItems", JSON.stringify(updated));
      return updated;
    });

    // Optional server removal
    await fetch(`/api/cart/${item.id}`, { method: "DELETE" });

    Swal.fire("Saved!", "Item moved to Save for Later.", "success");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to save item", "error");
  }
};
  //Move To Cart//
// ✅ Move Item back to Cart
const handleMoveToCart = async (item: any) => {
  try {
    // Remove from savedItems state
    setSavedItems(prev => {
      const updated = prev.filter(i => i.id !== item.id);
      localStorage.setItem("savedItems", JSON.stringify(updated));
      return updated;
    });

    // Add back to cartItems
    setCartItems(prev => [...prev, item]);

    // Optional server add
    // await fetch("/api/cart/add", { method: "POST", body: JSON.stringify(item) });

    Swal.fire("Moved!", "Item moved back to Cart.", "success");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Failed to move item to cart", "error");
  }
};


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

          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
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
                    {/* - Button */}
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) - 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold"
                    >
                      -
                    </button>

                    {/* Qty Display */}
                    <input
                      readOnly
                      value={item.quantity ?? 1}
                      className="w-10 text-center border rounded-md"
                    />

                    {/* + Button */}
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity ?? 1) + 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center text-lg font-bold"
                    >
                      +
                    </button>
                  </div>


                  {/* ✅ Save for Later Button */}
                  <button
                     onClick={() => handleSaveForLater(item)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition text-sm"
                  >
                    Save for Later
                  </button>


                  {/* Saved Items Section */}
                  {savedItems.length > 0 && (
                    <div className="mt-6">
                      <h2 className="text-lg font-semibold mb-2">Saved for Later</h2>
                      {savedItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 border mb-2 rounded">
                          <span>{item.title}</span>
                          <button
                             onClick={() => handleMoveToCart(item)}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Move to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}




                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white py-1.5 text-sm rounded-md hover:bg-red-600 transition font-medium w-24"
                  >
                    Remove
                  </button>

                </div>

              </div>


              {/* 🗑️ Place Order button */}

              <button
                onClick={() => {
                  // Save cart details to localStorage
                  localStorage.setItem("cartItems", JSON.stringify(cartItems));
                  localStorage.setItem("cartSubtotal", subtotal.toFixed(2));
                  localStorage.setItem("cartShipping", shipping.toFixed(2));
                  localStorage.setItem("cartPlatformFee", "5"); // platform fee
                  localStorage.setItem("cartTotal", total.toFixed(2));

                  // Navigate to checkout page
                  router.push("/checkout");
                }}
                className="mt-6 w-50 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition font-semibold"
              >
                Proceed to Checkout
              </button>


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
          <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            onClick={() => Swal.fire("Proceeding to Payment", "Redirecting...", "info")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
