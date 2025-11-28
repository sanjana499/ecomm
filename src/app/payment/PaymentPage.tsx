"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { ShoppingCart, User, Menu, ChevronDown, ChevronRight } from "lucide-react";
import { cart } from "@/lib/schema";

export default function PaymentPage() {

  const router = useRouter();
  const params = useSearchParams();

  // ---------------- STATES ----------------
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [addressId, setAddressId] = useState<string | null>(null);
  const cartCount = cartItems.length;
  const [cart, setCart] = useState<any[]>([]);

  const [discount, setDiscount] = useState(0);


  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ---------------- READ PARAMS ----------------
  useEffect(() => {
    setSubtotal(Number(params.get("subtotal") || 0));
    setShipping(Number(params.get("shipping") || 0));
    setPlatformFee(Number(params.get("platformFee") || 0));
    setTotal(Number(params.get("total") || 0));

    setDiscount(Number(params.get("discount") || 0)); // <-- yaha

    const addr = params.get("addressId");
    if (addr) {
      setAddressId(addr);
      setSelectedAddress(addr);
    }
  }, [params]);

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const uid = localStorage.getItem("userId");
    const uname = localStorage.getItem("userName");

    if (uid && uname) {
      setUser({ id: uid, name: uname });
    }
  }, []);

  // ---------------- LOAD CART ----------------
  useEffect(() => {
    const stored = localStorage.getItem("cartData");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);



  // ---------------- PLACE ORDER ----------------
  const placeOrder = async (method: string) => {

    const selectedAddrData = await fetch(`/api/address/${selectedAddress}`).then(res => res.json());

    console.log(selectedAddrData);

    if (!selectedAddress) {
      Swal.fire("Address Required", "Please select an address", "error");
      return;
    }

    if (!cartItems.length) {
      Swal.fire("Cart Empty", "Please add a product first.", "warning");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: localStorage.getItem("userId"),
          customer_id: localStorage.getItem("userId"),
          total_amount: total,
          items: cartItems,
          address_id: selectedAddress,
          payment_method: method,
          order_status: method === "cod" ? "success" : "pending",
          name: selectedAddrData.name,
          email: selectedAddrData.email,
          city: selectedAddrData.city,
          state: selectedAddrData.state,
          shipping_address: selectedAddrData.address,
          //shipping: shipping,
          pincode: params.get("pincode"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Order Placed!", "Your order was successful!", "success");
        router.push(`/orders/success?orderId=${data.orderId}`);
      } else {
        Swal.fire("Error", data.error || "Order failed!", "error");
      }

    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const paymentMethods = [
    { id: "upi", title: "UPI", desc: "Instant payment" },
    { id: "card", title: "Credit / Debit / ATM Card" },
    { id: "netbank", title: "Net Banking" },
    { id: "cod", title: "Cash on Delivery" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ---------------- NAVBAR ---------------- */}
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
              }, 150);
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
                      className={`px-4 py-2 flex justify-between cursor-pointer ${activeCategory === cat.name
                        ? "bg-blue-100" : "hover:bg-blue-50"}`}
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
            <a href="/login" className="hover:text-blue-600">Login</a>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative" onClick={() => router.push("/cart")}>
            <ShoppingCart className="w-6 h-6 text-zinc-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-zinc-100 px-3 py-1 rounded-md"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <ChevronDown className={`h-4 w-4 ${isUserMenuOpen ? "rotate-180" : ""}`} />
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
        </div>
      </nav>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div className="bg-white max-w-6xl mx-auto rounded-2xl shadow-lg p-8 mt-10 flex gap-8">

        {/* LEFT – PAYMENT OPTIONS */}
        <div className="w-1/3 border-r pr-6">
          <h3 className="text-xl font-semibold mb-4">Payment Options</h3>

          <div className="space-y-2">
            {paymentMethods.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all
                  ${selectedMethod === m.id ? "bg-blue-100 border-blue-500" : "bg-gray-50"}
                `}
              >
                <div className="font-semibold">{m.title}</div>
                {m.desc && <p className="text-sm text-gray-600">{m.desc}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE CONTENT */}
        <div className="w-1/2 px-4">
          <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>

          {/* UPI */}
          {selectedMethod === "upi" && (
            <div className="border rounded-2xl p-6 bg-white shadow-md">
              <p className="font-semibold">Add New UPI ID</p>

              <button
                onClick={() => placeOrder("upi")}
                className="bg-black text-white w-full mt-6 py-3 rounded-xl text-lg font-semibold"
              >
                Pay ₹{total}
              </button>
            </div>
          )}

          {/* CARD */}
          {selectedMethod === "card" && (
            <div className="border rounded-2xl p-6 bg-white shadow-md">
              <button
                onClick={() => placeOrder("card")}
                className="bg-black text-white w-full mt-6 py-3 rounded-xl text-lg font-semibold"
              >
                Pay ₹{total + platformFee}
              </button>
            </div>
          )}

          {/* NET BANKING */}
          {selectedMethod === "netbank" && (
            <div className="border rounded-2xl p-6 bg-white shadow-md">
              <button
                onClick={() => placeOrder("netbank")}
                className="bg-black text-white w-full mt-6 py-3 rounded-xl text-lg font-semibold"
              >
                Pay ₹{total + platformFee}
              </button>
            </div>
          )}

          {/* COD */}
          {selectedMethod === "cod" && (
            <div className="border rounded-2xl p-6 bg-white shadow-md text-center">
              <p className="font-semibold text-lg">Cash on Delivery</p>

              <button
                onClick={() => placeOrder("cod")}
                className={`w-full mt-6 py-3 rounded-xl text-lg font-semibold 
                  bg-yellow-500 hover:bg-yellow-600 text-black`}
              >
                Place Order
              </button>
            </div>
          )}
        </div>

        {/* RIGHT – SUMMARY */}
        {/* ---------------- RIGHT – ORDER SUMMARY ---------------- */}
        <div className="w-1/3">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="bg-blue-50 p-5 rounded-2xl shadow-md flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
            {/* 1️⃣ Order Items */}
            <div>
              <h4 className="font-semibold text-lg mb-2">Items ({cartItems.length})</h4>
              <div className="space-y-2">
                {cartItems.map((item,index) => (
                  <div key={`${item.productId}-${index}`}  className="flex justify-between items-center border-b pb-2">
                    <div className="flex flex-col">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{((item.offerPrice || item.price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2️⃣ Subtotals */}
            <div className="border-t pt-2 space-y-1 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
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
              {/** Optional discount */}
              {discount && Number(discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(discount).toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* 3️⃣ Total */}
            <div className="border-t pt-2 flex justify-between font-bold text-blue-700 text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* 4️⃣ Shipping Address */}
            {selectedAddress && (
              <div className="border-t pt-2 text-sm space-y-1">
                <p className="font-semibold">Shipping To:</p>
                <p>{selectedAddress}</p>
                {/** Optionally: City, State, Pincode */}
                {params.get("city") && <p>{params.get("city")}, {params.get("state")} - {params.get("pincode")}</p>}
              </div>
            )}

            {/* 5️⃣ Payment Method */}
            <div className="border-t pt-2 text-sm flex justify-between items-center">
              <span>Payment Method</span>
              <span className="font-medium">{selectedMethod.toUpperCase()}</span>
            </div>

            {/* 6️⃣ Optional: Cashback / Offer */}
            <div className="bg-green-100 p-3 rounded-lg mt-2 shadow-sm text-green-800 text-sm">
              <p className="font-semibold">5% Cashback</p>
              <p className="mt-1">Claim now with payment offers</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
