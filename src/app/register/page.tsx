"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ShoppingCart, User, Menu } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert("Please fill in all fields!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        alert("Registration successful!");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
  
        // ✅ Redirect to login page after success
        router.push("/login");
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black font-sans">
    
      {/* ✅ Register Form Section */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
           Sing Up{" "}
           <br />
            <span className="text-blue-600 font-bold">ShopEase</span>
          </h2>
         

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-700 mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-8 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
