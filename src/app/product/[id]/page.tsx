"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu } from "lucide-react";


export default function ProductDetails() {
    const { id } = useParams(); // ✅ Get product ID from URL
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ✅ Fetch single product details
    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`/api/product/${id}`);
                if (!res.ok) throw new Error("Failed to fetch product");
                const data = await res.json();
                setProduct(data.product);
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Unable to load product details", "error");
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchProduct();
    }, [id]);

    if (loading)
        return <p className="text-center text-gray-500 mt-10">Loading product details...</p>;

    if (!product)
        return <p className="text-center text-gray-500 mt-10">Product not found.</p>;

    return (
        <div>
            {/* 🔹 Top Navbar */}
            <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 px-6 py-3">
                <div className="flex items-center h-5 gap-3">

                    <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
                        ShopEase
                    </h1>
                </div>

                {/* 🔹 Desktop Menu */}
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

                {/* 🔹 Right Icons */}
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

            {/* 🔹 Product Details */}
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <div className="relative w-full h-96">
                        <Image
                            src={
                                product.img?.startsWith("/upload")
                                    ? product.img
                                    : `/upload/${product.img}`
                            }
                            alt={product.title || "Product Image"}
                            fill
                            className="object-contain rounded-md bg-gray-100"
                        />
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                            {product.title}
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {product.description || "No description available."}
                        </p>

                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-green-600 text-2xl font-bold">
                                ₹{product.offerPrice ?? product.price}
                            </span>
                            {product.offerPrice && (
                                <span className="text-gray-400 line-through text-lg">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>

                        {product.color && (
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Color:</strong> {product.color}
                            </p>
                        )}
                        {product.size && (
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Size:</strong> {product.size}
                            </p>
                        )}
                        {product.gender && (
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Gender:</strong> {product.gender}
                            </p>
                        )}
                        {product.type && (
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Type:</strong> {product.type}
                            </p>
                        )}

                        {/* 🔹 Buttons in a single row */}
                        <div className="mt-4 flex  gap-3">
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch("/api/cart/add", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ productId: product.id, quantity: 1 }),
                                        });

                                        const data = await res.json();
                                        if (data.success) {
                                            Swal.fire("Added to Cart", `${product.title} added to cart`, "success").then(() => {
                                                router.push("/cart");
                                            });
                                        } else {
                                            Swal.fire("Error", data.error || "Failed to add to cart", "error");
                                        }
                                    } catch (err) {
                                        Swal.fire("Error", "Unable to add to cart", "error");
                                    }
                                }}
                                className="w-32 bg-blue-600 text-white py-1.5 text-sm rounded-md hover:bg-blue-700 transition font-medium"
                            >
                                🛒 Add to Cart
                            </button>

                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-28 bg-orange-500 text-white py-1.5 text-sm rounded-md hover:bg-orange-600 transition font-medium"
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
