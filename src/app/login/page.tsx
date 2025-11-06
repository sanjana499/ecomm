"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { ShoppingCart, User, Menu, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Error", "Please enter both email and password", "error");
      return;
    }

    Swal.fire("Success", "Login successful!", "success");
    // router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black font-sans">
      
      {/* ✅ Navbar */}
      <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-[60px] h-[60px]">
            <Image
              src="/logo (1).png"
              alt="Logo"
              fill
              className="object-contain rounded-md"
            />
          </div>
          <h1 className="text-xl font-bold text-zinc-800 dark:text-white">
            ShopEase
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Home</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Shop</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Categories</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Contact</a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
          />

          {/* Icons */}
          <button className="relative">
            <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              2
            </span>
          </button>
          <button>
            <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
          </button>

          {/* Mobile Menu Button */}
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
        <div className="w-full flex flex-col mt-2 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 px-6 bg-white dark:bg-zinc-900">
          <a href="/" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Home</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Shop</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Categories</a>
          <a href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">Contact</a>
        </div>
      )}

      {/* ✅ Login Form */}
      <main className="flex flex-col items-center justify-center flex-1 w-full p-6">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8 mt-6">
          <h1 className="text-2xl font-bold text-center text-zinc-800 dark:text-white mb-6">
            Login to <span className="text-blue-600">ShopEase</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Login
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
              Register
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
