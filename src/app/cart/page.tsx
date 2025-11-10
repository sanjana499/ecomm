"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, Menu } from "lucide-react";

export default function CartPage() {
    const [quantity, setQuantity] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const product = {
        id: 1,
        title: "Kaira Women Floral Print Straight Kurta",
        color: "Light Blue",
        size: "XS",
        seller: "Kairab",
        price: 1299,
        offerPrice: 280,
        deliveryDate: "Sat Nov 15",
        img: "/uploads/images/download.jpeg",
    };

    const discount = product.price - product.offerPrice;
    const coupons = 20;
    const platformFee = 5;
    const total = product.offerPrice - coupons + platformFee;

    return (
        <div>
            {/* Navbar */}
            <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 px-6 py-3">
                <div className="flex items-center h-5 gap-3">
                    <div className="relative w-20 h-20">
                        <Image
                            src="/logo (1).png"
                            alt="Logo"
                            fill
                            className="object-contain rounded-md"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                        ShopEase
                    </h1>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {["Home", "Men's", "Women's", "Contact"].map((item) => (
                        <a
                            key={item}
                            href="/"
                            className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
                        >
                            {item}
                        </a>
                    ))}
                    <a
                        href="/login"
                        className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
                    >
                        Login
                    </a>
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
                    />

                    <button className="relative">
                        <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            2
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

            {/* Mobile Menu */}
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section */}
                    <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold border-b pb-3 mb-4">
                            Flipkart (1)
                        </h2>

                        {/* Delivery Info */}
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <div>
                                <p className="font-medium">
                                    Deliver to:{" "}
                                    <span className="text-blue-600">
                                        Sanjana, 273001
                                    </span>
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Government girls hostel near Vishnu Mandir, Medical Road...
                                </p>
                            </div>
                            <button className="text-blue-600 border border-blue-600 rounded-md px-3 py-1 text-sm">
                                Change
                            </button>
                        </div>

                        {/* Product Info */}
                        <div className="flex gap-4 border-b pb-4 mb-4">
                            <div className="relative w-24 h-32">
                                <Image
                                    src={product.img}
                                    alt={product.title}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Size: {product.size}, {product.color}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Seller: {product.seller}{" "}
                                    <span className="text-blue-600 text-xs font-medium">
                                        Assured
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    Delivery by{" "}
                                    <span className="font-medium">
                                        {product.deliveryDate}
                                    </span>
                                </p>

                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-green-600">
                                        ₹{product.offerPrice}
                                    </span>
                                    <span className="line-through text-gray-400 text-sm">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-green-600 text-sm font-medium">
                                        78% Off
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Or Pay ₹250 + 30
                                </p>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-2">
                                    <button
                                        className="border rounded-full px-2"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        −
                                    </button>
                                    <span className="font-medium">{quantity}</span>
                                    <button
                                        className="border rounded-full px-2"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        +
                                    </button>
                                    <button className="ml-6 text-blue-600 text-sm">
                                        SAVE FOR LATER
                                    </button>
                                    <button className="text-blue-600 text-sm">REMOVE</button>
                                </div>
                            </div>
                        </div>

                        {/* ✅ Place Order Button (Right aligned) */}
                        <div className="flex justify-end">
                            <button className="bg-orange-500 text-white font-medium py-2 w-48 rounded-md hover:bg-orange-600 transition">
                                PLACE ORDER
                            </button>
                        </div>
                    </div>

                    {/* Right Section — Price Details */}
                    <div className="w-full lg:w-1/3 bg-white p-4 rounded-lg shadow-sm h-fit">
                        <h3 className="text-lg font-semibold border-b pb-3 mb-4">
                            PRICE DETAILS
                        </h3>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Price (1 item)</span>
                                <span>₹{product.price}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{discount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Coupons for you</span>
                                <span>-₹{coupons}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹{platformFee}</span>
                            </div>
                        </div>

                        <hr className="my-3" />
                        <div className="flex justify-between font-semibold text-gray-800">
                            <span>Total Amount</span>
                            <span>₹{total}</span>
                        </div>
                        <p className="text-green-600 text-sm mt-2">
                            You will save ₹{discount + coupons} on this order
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
