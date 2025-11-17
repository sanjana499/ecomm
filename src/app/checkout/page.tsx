"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react"; // ✅ added missing imports

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  //const [total] = useState(285); // Later you can calculate dynamically
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ added missing state
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);


  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [platformFee, setPlatformFee] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setSubtotal(parseFloat(localStorage.getItem("cartSubtotal") || "0"));
    setShipping(parseFloat(localStorage.getItem("cartShipping") || "0"));
    setPlatformFee(parseFloat(localStorage.getItem("cartPlatformFee") || "5"));
    setTotal(parseFloat(localStorage.getItem("cartTotal") || "0"));
  }, []);

  // Load cart count
  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (data.items) {
          const totalItems = data.items.reduce(
            (sum: number, item: any) => sum + (item.quantity || 1),
            0
          );
          setCartCount(totalItems);
        }
      } catch (e) {
        console.error("Failed to load cart count:", e);
      }
    }

    loadCart();
  }, []);

  // Fetch addresses
  useEffect(() => {
    fetch("/api/address")
      .then(async (res) => {
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Address data:", data);
        setAddresses(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        Swal.fire("Error", "Failed to load addresses", "error");
      });
  }, []);

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);

  // ✅ Place order handler with validation & cookie-based auth
  const placeOrder = async () => {
    // 1️⃣ Validate address
    if (!selectedAddress) {
      Swal.fire("Select Address", "Please choose a delivery address", "warning");
      return;
    }
  
    // 2️⃣ Validate payment method
    if (!selectedPayment) {
      Swal.fire("Select Payment", "Please select a payment method", "warning");
      return;
    }
  
    // 3️⃣ Payment Details (if needed)
    let paymentDetails: any = {};
  
    if (selectedPayment === "upi") {
      const upiInput = (document.querySelector<HTMLInputElement>(
        'input[placeholder="Enter UPI ID"]'
      ))?.value;
  
      if (!upiInput) {
        Swal.fire("Enter UPI ID", "Please enter your UPI ID", "warning");
        return;
      }
  
      paymentDetails = { upiId: upiInput };
    }
  
    if (selectedPayment === "card") {
      const cardNumber = (document.querySelector<HTMLInputElement>(
        'input[placeholder="Card Number"]'
      ))?.value;
      const expiry = (document.querySelector<HTMLInputElement>(
        'input[placeholder="Expiry MM/YY"]'
      ))?.value;
      const cvv = (document.querySelector<HTMLInputElement>(
        'input[placeholder="CVV"]'
      ))?.value;
  
      if (!cardNumber || !expiry || !cvv) {
        Swal.fire("Enter Card Details", "Please fill all card fields", "warning");
        return;
      }
  
      paymentDetails = { cardNumber, expiry, cvv };
    }
  
    if (selectedPayment === "wallet") {
      const wallet = (document.querySelector<HTMLInputElement>(
        'input[placeholder="Wallet / Promo Code"]'
      ))?.value;
  
      if (!wallet) {
        Swal.fire("Enter Wallet / Promo Code", "Please enter wallet or promo code", "warning");
        return;
      }
  
      paymentDetails = { wallet };
    }
  
    // 4️⃣ COD Order
    if (selectedPayment === "cod") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localStorage.getItem("userId"),
            total_amount: total,
            items: cartItems,
            address_id: selectedAddress,
            payment_method: "cod",
          }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          Swal.fire("Order Placed!", "Your COD order has been placed.", "success");
        } else {
          Swal.fire("Error", data.error || "Failed to place order", "error");
        }
      } catch (e) {
        Swal.fire("Error", "Something went wrong", "error");
      }
  
      return;
    }
  
    // 5️⃣ Online Payment (future)
    Swal.fire("Online Checkout", "Online payment is not implemented yet!", "info");
  };
  
  
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔹 Navbar */}
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
                className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""}`}
              />
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
                      ?.subcategories.map((sub: any) => (
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

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 mb-6">
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

      {/* ✅ Checkout Layout */}
      <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4">
          {/* Left Section: Address */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border p-4 rounded-md mb-3 ${selectedAddress === addr.id
                  ? "border-blue-500"
                  : "border-gray-300"
                  }`}
              >
                <p className="font-medium">
                  {addr.name} {addr.phone}
                </p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>

                <button
                  onClick={() => setSelectedAddress(addr.id)}
                  className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  Deliver Here
                </button>
              </div>
            ))}

            {/* Payment Section - show only if address is selected */}
            {selectedAddress && (
              <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Payment Options</h3>
            
              <div className="flex flex-col gap-3">
                {[
                  { id: "upi", label: "UPI", icon: "💸" },
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "wallet", label: "Wallet / Other", icon: "👛" },
                  { id: "cod", label: "Cash On Delivery", icon: "🚚" },   // ✅ COD ADDED HERE
                ].map((option) => (
                  <div
                    key={option.id}
                    className="flex flex-col border rounded-lg p-4 cursor-pointer hover:shadow-sm transition"
                    onClick={() => setSelectedPayment(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === option.id}
                        readOnly
                        className="w-4 h-4"
                      />
                      <span className="text-xl">{option.icon}</span>
                      <span className="font-medium text-gray-700">{option.label}</span>
                    </div>
            
                    {/* Show input fields for selected payment */}
                    {selectedPayment === option.id && (
                      <div className="mt-3 ml-7 flex flex-col gap-2">
                        {option.id === "upi" && (
                          <input
                            type="text"
                            placeholder="Enter UPI ID"
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                        )}
            
                        {option.id === "card" && (
                          <>
                            <input
                              type="text"
                              placeholder="Card Number"
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="Expiry MM/YY"
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="CVV"
                              className="border border-gray-300 rounded px-3 py-2"
                            />
                          </>
                        )}
            
                        {option.id === "wallet" && (
                          <input
                            type="text"
                            placeholder="Wallet / Promo Code"
                            className="border border-gray-300 rounded px-3 py-2"
                          />
                        )}
            
                        {option.id === "cod" && (
                          <p className="text-gray-500 text-sm">
                            Pay with Cash when your order is delivered.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            
              {/* ORDER BUTTON */}
              <button
                className="bg-black text-white w-full mt-4 py-3 rounded"
                onClick={selectedPayment === "cod" ? placeOrder : placeOrder}
              >
                PLACE ORDER
              </button>
            </div>
            
            )}
          </div>

          {/* Right Section: Price Details */}
          <div className="w-full md:w-72 bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Price Details</h2>

            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Price</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                <span>Total Payable</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="mt-6 bg-yellow-500 text-white w-full py-2 rounded-md font-medium hover:bg-yellow-600 transition"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
