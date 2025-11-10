"use client";

import Image from "next/image";
import { useParams, } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
interface Product {
    id: number;
    title: string;
    price: string;
    offerPrice: string;
    desc: string;
    color: string;
    size: string[];
    quantity: number;
    img: string[];
}

export default function ProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState("M");
    const price = 280;

    useEffect(() => {
        // Dummy data for demo
        const products: Product[] = [
            {
                id: 1,
                title: "Kaira Women Floral Print Viscose Rayon Straight Kurta",
                price: "1299",
                offerPrice: "280",
                desc: "Women Floral Print Viscose Rayon Straight Kurta in Light Blue with comfortable fit and soft fabric.",
                color: "Light Blue",
                size: ["XS", "S", "M", "L", "XL", "XXL"],
                quantity: 1,
                img: [
                    "/uploads/images/download.jpeg", // Adjust your image path here
                ],
            },
        ];

        const found = products.find((p) => p.id === Number(id));
        if (found) setProduct(found);
    }, [id]);

    

    if (!product) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div>
            {/* Top Navbar */}
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

            {/* Product Section */}
            <div className="flex flex-col md:flex-row p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md mt-6">
                {/* Left: Image */}
                <div className="w-full md:w-1/2 flex flex-col items-center">
                    <div className="relative w-[350px] h-[450px] mb-4">
                        <Image
                            src={product.img[0]}
                            alt={product.title}
                            fill
                            className="object-cover rounded-md"
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex gap-2">
                        {product.img.map((src, i) => (
                            <div
                                key={i}
                                className="relative w-20 h-24 border rounded-md cursor-pointer"
                            >
                                <Image
                                    src={src}
                                    alt={`thumb-${i}`}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Product Details */}
                <div className="w-full md:w-1/2 md:pl-8 mt-6 md:mt-0">
                    <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
                    <p className="text-green-600 font-semibold mb-3">
                        Special price ₹{product.offerPrice}{" "}
                        <span className="text-gray-500 line-through ml-2">
                            ₹{product.price}
                        </span>{" "}
                        <span className="text-sm text-green-600">78% off</span>
                    </p>

                    <p className="text-gray-600 mb-3">{product.desc}</p>

                    {/* Size Options */}
                    <div className="mb-4">
                        <h3 className="font-medium mb-2">Size:</h3>
                        <div className="flex gap-2">
                            {product.size.map((s) => (
                                <button
                                    key={s}
                                    className="border px-3 py-1 rounded hover:bg-yellow-100 transition"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => router.push("/cart")}
                            className="bg-yellow-400 text-black px-6 py-2 rounded-md font-medium hover:bg-yellow-500 transition"
                        >
                            🛒 Add to Cart
                        </button>
                        {/* Buy Now Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-orange-500 text-white px-6 py-2 rounded-md font-medium hover:bg-orange-600 transition"
                        >
                            ⚡ Buy Now
                        </button>

                        {/* ✅ Modal Popup */}
                        {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm bg-transparent z-50">

                                <div className="bg-white rounded-lg shadow-lg p-6 w-100 relative">
                                    {/* Close button */}
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="absolute top-2 right-3 text-gray-600 hover:text-gray-800 text-xl"
                                    >
                                        ×
                                    </button>

                                    <h3 className="text-lg font-semibold mb-3">Select Preferences</h3>

                                    {/* Size Selector */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">Select Size</label>
                                        <div className="flex gap-3">
                                            {["XS", "S", "M", "L", "XL"].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`px-3 py-1 border rounded-md ${selectedSize === size
                                                        ? "bg-orange-500 text-white border-orange-500"
                                                        : "hover:bg-gray-100"
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="mb-4">
                                        <p className="text-gray-700">
                                            Total Price:{" "}
                                            <span className="font-semibold text-green-600">₹{price}</span>
                                        </p>
                                    </div>

                                    {/* Confirm Buy Button */}
                                    <button
                                       onClick={() => {
                                        setShowModal(false);
                                        router.push("/checkout");
                                      }}
                                        className="bg-orange-500 text-white w-full py-2 rounded-md font-medium hover:bg-orange-600 transition"
                                    >
                                        ✅ Buy Now
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
