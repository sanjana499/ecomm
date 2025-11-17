"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire("Error", "Please enter both email and password", "error");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        // ⭐ LOGIN SUCCESS — STORE SESSION ⭐
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.name);

        Swal.fire("Success", "Login Successful", "success");
        router.push("/"); // home page or dashboard
      } else {
        Swal.fire("Error", data.message || "Invalid login", "error");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-950">
      <main className="flex flex-col items-center justify-center w-full p-6">
        <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
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
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="#"
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-4">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
