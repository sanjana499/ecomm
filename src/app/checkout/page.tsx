"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [platformFee, setPlatformFee] = useState(5);
  const [total, setTotal] = useState(0);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const userIdStr = localStorage.getItem("userId");
    setUserId(userIdStr ? parseInt(userIdStr) : null);
  }, []);

  useEffect(() => {
    setSubtotal(parseFloat(localStorage.getItem("cartSubtotal") || "0"));
    setShipping(parseFloat(localStorage.getItem("cartShipping") || "0"));
    setPlatformFee(parseFloat(localStorage.getItem("cartPlatformFee") || "5"));
    setTotal(parseFloat(localStorage.getItem("cartTotal") || "0"));
  }, []);

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

  useEffect(() => {
    fetch("/api/address")
      .then((res) => res.json())
      .then((data) => setAddresses(data))
      .catch(() => Swal.fire("Error", "Failed to load addresses", "error"));
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() =>
        Swal.fire("Error", "Failed to load categories", "error")
      );
  }, []);

  const placeOrder = async () => {
    if (!selectedAddress)
      return Swal.fire("Select Address", "Please choose an address", "warning");
  
    if (!selectedPayment)
      return Swal.fire("Select Payment", "Please select payment method", "warning");
  
    let paymentDetails: any = {};
  
    // ---------------- UPI ----------------
    if (selectedPayment === "upi") {
      const upi = (document.querySelector('input[placeholder="Enter UPI ID"]') as any)?.value;
      if (!upi) return Swal.fire("Enter UPI ID", "Please enter UPI ID", "warning");
      paymentDetails = { upi };
    }
  
    // ---------------- CARD ----------------
    if (selectedPayment === "card") {
      const card = {
        number: (document.querySelector('input[placeholder="Card Number"]') as any)?.value,
        expiry: (document.querySelector('input[placeholder="Expiry MM/YY"]') as any)?.value,
        cvv: (document.querySelector('input[placeholder="CVV"]') as any)?.value,
      };
  
      if (!card.number || !card.expiry || !card.cvv)
        return Swal.fire("Enter Card Details", "Fill all card fields", "warning");
  
      paymentDetails = card;
    }
  
    // ---------------- WALLET ----------------
    if (selectedPayment === "wallet") {
      const wallet = (document.querySelector('input[placeholder="Wallet / Promo Code"]') as any)?.value;
      if (!wallet)
        return Swal.fire("Enter Wallet", "Enter wallet or promo code", "warning");
  
      paymentDetails = { wallet };
    }
  
    // ---------------- COD ----------------
    if (selectedPayment === "cod") {
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: localStorage.getItem("userId"),
            total_amount: total,
            items: cartItems,
            address_id: selectedAddress,
            payment_method: "cod",
             order_status: "success"
          }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          Swal.fire("Order Placed!", "Your COD order has been placed.", "success");
  
          // 🔥 Redirect to success page
          router.push("/orders/success");
        } else {
          Swal.fire("Error", data.error || "Failed to place order", "error");
        }
      } catch (e) {
        Swal.fire("Error", "Something went wrong", "error");
      }
  
      return; // stop function
    }
  
    // ---------------- Online Payment Not Implemented ----------------
    Swal.fire("Online Payment", "Online payment not implemented yet!", "info");
  };
  

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItems(items);
  }, []);

  const addAddress = async () => {
    const idStr = localStorage.getItem("userId");
    const userId = idStr ? parseInt(idStr) : null;

    if (!userId) return Swal.fire("Error", "Please login first", "error");

    const payload = {
      user_id: userId,
      name: (document.getElementById("add-name") as any)?.value,
      phone: (document.getElementById("add-phone") as any)?.value,
      address: (document.getElementById("add-address") as any)?.value,
      city: (document.getElementById("add-city") as any)?.value,
      state: (document.getElementById("add-state") as any)?.value,
      pincode: (document.getElementById("add-pincode") as any)?.value,
      flat_no: (document.getElementById("flat_no") as any)?.value,
    };

    const res = await fetch("/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire("Success", "Address added successfully", "success");
      setShowAddModal(false);
      setAddresses((prev) => [...prev, data]);
    } else {
      Swal.fire("Error", data.error || "Something went wrong", "error");
    }
  };

  const fetchAddresses = async () => {
    const res = await fetch("/api/address");
    const data = await res.json();
    setAddresses(data);
  };

  const deleteAddress = async (id: number) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This address will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirmDelete.isConfirmed) return;

    const res = await fetch(`/api/address/${id}`, { method: "DELETE" });

    if (res.ok) {
      Swal.fire("Deleted!", "Address removed successfully.", "success");
      fetchAddresses();
    } else {
      Swal.fire("Error", "Failed to delete address.", "error");
    }
  };

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
                      className={`px-4 py-2 flex justify-between cursor-pointer ${
                        activeCategory === cat.name ? "bg-blue-100" : "hover:bg-blue-50"
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

          <a href="/login" className="hover:text-blue-600">Login</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <User className="w-6 h-6" />

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

      {/* ---------------- MAIN CHECKOUT LAYOUT ---------------- */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        
        {/* LEFT : Address */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex justify-between">
            Delivery Address
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!userId}
              className="bg-green-600 text-white px-3 py-1 rounded-md"
            >
              + Add New
            </button>
          </h2>

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border p-4 rounded-md mb-3 ${
                selectedAddress === addr.id ? "border-blue-500" : "border-gray-300"
              }`}
            >
              <p className="font-medium">{addr.name} {addr.phone}</p>
              <p>{addr.address}</p>
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => {
                    setSelectedAddress(addr.id);
                    setTimeout(() => {
                      paymentRef.current?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Deliver Here
                </button>

                <button
                  onClick={() => router.push(`/address/edit/${addr.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Payment Section */}
          {selectedAddress && (
            <div ref={paymentRef} className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Payment Options</h3>

              <div className="flex flex-col gap-3">
                {[
                  { id: "upi", label: "UPI", icon: "💸" },
                  { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  { id: "wallet", label: "Wallet / Other", icon: "👛" },
                  { id: "cod", label: "Cash On Delivery", icon: "🚚" },
                ].map((option) => (
                  <div
                    key={option.id}
                    className="border p-4 rounded-lg cursor-pointer"
                    onClick={() => setSelectedPayment(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={selectedPayment === option.id}
                        readOnly
                      />
                      <span className="text-xl">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>

                    {selectedPayment === option.id && (
                      <div className="mt-3 ml-7 flex flex-col gap-2">
                        {option.id === "upi" && (
                          <input
                            type="text"
                            placeholder="Enter UPI ID"
                            className="border rounded px-3 py-2"
                          />
                        )}

                        {option.id === "card" && (
                          <>
                            <input
                              type="text"
                              placeholder="Card Number"
                              className="border rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="Expiry MM/YY"
                              className="border rounded px-3 py-2"
                            />
                            <input
                              type="text"
                              placeholder="CVV"
                              className="border rounded px-3 py-2"
                            />
                          </>
                        )}

                        {option.id === "wallet" && (
                          <input
                            type="text"
                            placeholder="Wallet / Promo Code"
                            className="border rounded px-3 py-2"
                          />
                        )}

                        {option.id === "cod" && (
                          <p className="text-gray-500 text-sm">
                            Pay with Cash when your order arrives.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                className="bg-black text-white w-full mt-4 py-3 rounded"
                onClick={placeOrder}
              >
                PLACE ORDER
              </button>
            </div>
          )}
        </div>

        {/* RIGHT : PRICE DETAILS */}
        <div className="w-full md:w-72 bg-white p-6 shadow rounded-lg h-fit">
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
            <div className="border-t pt-2 font-semibold flex justify-between">
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
  className="mt-6 bg-black text-white w-full py-3 rounded"
  onClick={placeOrder}
>
  PLACE ORDER
</button>

        </div>
      </div>

      {/* ---------------- ADD ADDRESS MODAL ---------------- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">

            <h3 className="text-xl font-semibold mb-4">Add New Address</h3>

            <div className="space-y-3">
              <input id="add-name" placeholder="Full Name" className="border p-2 rounded w-full" />
              <input id="add-phone" placeholder="Phone Number" className="border p-2 rounded w-full" />
              <input id="add-address" placeholder="Address" className="border p-2 rounded w-full" />
              
              <div className="flex gap-3">
                <input id="add-city" placeholder="City" className="border p-2 rounded w-full" />
                <input id="add-state" placeholder="State" className="border p-2 rounded w-full" />
              </div>

              <input id="add-pincode" placeholder="Pincode" className="border p-2 rounded w-full" />
              <input id="flat_no" placeholder="Flat No" className="border p-2 rounded w-full" />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={addAddress}
                className="px-5 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
