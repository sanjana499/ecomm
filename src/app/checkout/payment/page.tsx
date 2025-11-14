"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { ChevronDown, ChevronRight, ShoppingCart, User, Menu } from "lucide-react";

interface CartItem {
  cartId: number;
  productId: number;
  title: string;
  price: number;           // number now
  offerPrice: number | null; // number or null
  quantity: number | null;
}

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("UPI");
  const [upiId, setUpiId] = useState<string>("");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);

  const platformFee = 15;

  // Navbar states
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Example categories (replace with API if needed)
  const categories = [
    { id: 1, name: "Men", subcategories: [{ id: 1, name: "Shirts" }, { id: 2, name: "Shoes" }] },
    { id: 2, name: "Women", subcategories: [{ id: 3, name: "Dresses" }, { id: 4, name: "Slippers" }] },
  ];

  // Fetch cart items from API
  useEffect(() => {
  async function fetchPaymentData() {
    try {
      const selectedProducts = localStorage.getItem("selectedProducts");
      const ids = selectedProducts ? JSON.parse(selectedProducts) : [];

      const res = await fetch(`/api/payment?selected=${ids.join(",")}`);
      const data = await res.json();

      if (res.ok) {
        const items: CartItem[] = (data.cartItems || []).map((item: { quantity: any; price: any; offerPrice: any; }) => ({
          ...item,
          quantity: item.quantity ?? 1,
          price: Number(item.price),
          offerPrice: item.offerPrice ?? null,
        }));

        setCartItems(items);

        const total = items.reduce((acc, item) => {
          const price = item.offerPrice ?? item.price;
          return acc + price * (item.quantity ?? 1);
        }, 0);
        setTotalAmount(total);

        const totalItems = items.reduce((acc, item) => acc + (item.quantity ?? 1), 0);
        setTotalItems(totalItems);
      } else {
        Swal.fire("Error", data.error || "Failed to fetch payment data", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Unable to fetch payment data", "error");
    } finally {
      setLoading(false);
    }
  }

  fetchPaymentData();
}, []);



  const handlePay = () => {
    if (selectedMethod === "UPI" && !upiId) {
      Swal.fire("Error", "Please enter your UPI ID", "error");
      return;
    }

    Swal.fire("Success", `Payment of ₹${totalAmount} successful via ${selectedMethod}`, "success");
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading cart...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2 px-6">
        <div className="flex items-center h-5">
          <div className="relative w-[100px] h-[100px]">{/* logo */}</div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">ShopEase</h1>
        </div>

        <div className="hidden md:flex items-center gap-6 relative">
          {["Home", "Contact"].map((item) => (
            <Link key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
              {item}
            </Link>
          ))}

          {/* Categories Dropdown */}
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
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""}`} />
            </button>

            {openDropdown && (
              <div className="absolute left-0 mt-2 flex bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700 z-50">
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

                {activeCategory && (
                  <div className="w-52">
                    {categories
                      .find((cat) => cat.name === activeCategory)
                      ?.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/slippers/${sub.id}`}
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

          <Link href="/login" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
            Login
          </Link>
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
              {cartItems.length}
            </span>
          </button>
          <button>
            <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 mb-6 px-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <Link key={item} href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
              {item}
            </Link>
          ))}
        </div>
      )}

      {/* Main Payment Section */}
      <div className="flex justify-center items-start p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
          {/* Left: Payment Methods */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>

            {["UPI", "Credit/Debit/ATM Card", "Net Banking", "Cash on Delivery", "Gift Card"].map((method) => (
              <div key={method} className="mb-4 flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => setSelectedMethod(method)}
                  className="w-5 h-5 accent-blue-500 mr-3"
                />
                <label className="text-gray-700 dark:text-white">{method}</label>
              </div>
            ))}

            {selectedMethod === "UPI" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter your UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              onClick={handlePay}
              className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-medium transition"
            >
              Pay ₹{totalAmount}
            </button>
          </div>

          {/* Right: Price Summary */}
          <div className="w-full md:w-72 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Price Details</h3>
            <div className="flex justify-between mb-2">
              <span>Price ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</span>
              <span>₹{totalAmount - platformFee}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>
            <p className="mt-2 text-green-600 text-sm">5% Cashback on payment offers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
