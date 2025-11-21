"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
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
  const [cartCount, setCartCount] = useState(0);
  // const [, setCartItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [platformFee, setPlatformFee] = useState(5);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [addressId, setAddressId] = useState<string | null>(null);
  //Login Show or Logged in link not show
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  
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




  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
  //   setCartItems(items);
  // }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cartData");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
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

  // Auto-select last address AFTER addresses are fetched
  useEffect(() => {
    if (addresses.length > 0) {
      const saved = localStorage.getItem("lastAddress");
      if (saved) {
        // setSelectedAddress(parseInt(saved));
        setSelectedAddress(Number(saved));
      }
    }
  }, [addresses]);

  
useEffect(() => {
  const q = searchParams.get("addressId");
  const stored = typeof window !== "undefined" ? localStorage.getItem("selectedAddressId") : null;

  setAddressId(q || stored);
}, [searchParams]);


  //Login Show or Logged in link not show
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedName = localStorage.getItem("userName");
    if (storedId && storedName) setUser({ id: storedId, name: storedName });
  }, []);



  const handleCheckout = () => {
    if (!selectedAddress) {
      Swal.fire("Error", "Please select an address", "error");
      return;
    }
  
    localStorage.setItem("selectedAddressId", String(selectedAddress));
  
    router.push(
      `/payment?subtotal=${subtotal}&shipping=${shipping}&platformFee=${platformFee}&total=${total}&addressId=${Number(selectedAddress)}`
    );
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

      {/* ---------------- MAIN CHECKOUT LAYOUT ---------------- */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">

        {/* LEFT : Address */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex justify-between 
                 bg-blue-600 text-white px-4 py-2 rounded-md">

            Delivery Address

          </h2>

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative border p-4 rounded-md mb-3 ${selectedAddress === addr.id ? "border-blue-500" : "border-gray-300"
                }`}
            >
              {/* 🔵 Top Right Controls Row */}
              <div className="absolute top-3 right-3 flex items-center gap-3">

                {/* 🟢 CHECKBOX */}
                <input
                  type="checkbox"
                  checked={selectedAddress === addr.id}
                  onChange={() => {
                    setSelectedAddress(Number(addr.id)); 
                    localStorage.setItem("lastAddress", String(addr.id));
                  }}
                  className="h-5 w-5 cursor-pointer"
                />



                {/* ✏️ EDIT */}
                <button
                  onClick={() => router.push(`/address/edit/${addr.id}`)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Pencil size={18} />
                </button>

                {/* 🗑 REMOVE */}
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              {/* Address Info */}
              <p className="font-medium pr-16">
                {addr.name} {addr.phone}
              </p>
              <p>{addr.address}</p>
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
          ))}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!userId}
              className="bg-green-600 text-white px-3 py-1 rounded-md"
            >
              + Add New
            </button>
          </div>
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
            onClick={handleCheckout}
            className={`mt-6 w-full py-3 rounded text-white transition
                  ${selectedAddress ? "bg-blue-700 hover:bg-blue-800 cursor-pointer" : "bg-gray-400 cursor-not-allowed"}
                `}
          >
            CheckOut
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

