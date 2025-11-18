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

  const [loginMode, setLoginMode] = useState<"email" | "phone">("email");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  const router = useRouter();

  // ===========================
  // EMAIL LOGIN
  // ===========================
  const handleEmailLogin = async (e: React.FormEvent) => {
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
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("userName", data.user.name);

        Swal.fire("Success", "Login Successful", "success");
        router.push("/");
      } else {
        Swal.fire("Error", data.message || "Invalid login", "error");
      }
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "Something went wrong", "error");
      console.error(err);
    }
  };

  // ===========================
  // SEND OTP
  // ===========================
  const sendOtp = async () => {
    if (!phone) {
      Swal.fire("Error", "Enter phone number", "error");
      return;
    }

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (data.success) {
      Swal.fire("Success", `OTP Sent: ${data.otp}`, "success");
      setServerOtp(data.otp); 
      setOtpSent(true);
    } else {
      Swal.fire("Error", data.message, "error");
    }
  };

  // ===========================
  // VERIFY OTP
  // ===========================
  // ===========================
// VERIFY OTP
// ===========================
const verifyOtp = async () => {
  if (!otp) {
    Swal.fire("Error", "Enter OTP", "error");
    return;
  }

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await res.json();
  console.log("Verify OTP Response:", data);

  if (data.success) {
    localStorage.setItem("userId", data.user.id);
    localStorage.setItem("userName", data.user.name);

    Swal.fire("Success", "Login Successful", "success");
    router.push("/");
  } else {
    Swal.fire("Error", data.message, "error");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
      <main className="w-full max-w-sm p-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-zinc-800 dark:text-white mb-6">
            Login to <span className="text-blue-600">ShopEase</span>
          </h1>

          {/* LOGIN TABS */}
          <div className="flex mb-4 border-b">
            <button
              type="button"
              onClick={() => setLoginMode("email")}
              className={`flex-1 py-2 text-center ${
                loginMode === "email"
                  ? "border-b-2 border-blue-600 font-semibold"
                  : ""
              }`}
            >
              Email Login
            </button>

            <button
              type="button"
              onClick={() => setLoginMode("phone")}
              className={`flex-1 py-2 text-center ${
                loginMode === "phone"
                  ? "border-b-2 border-blue-600 font-semibold"
                  : ""
              }`}
            >
              Phone Login
            </button>
          </div>

          {/* EMAIL LOGIN UI */}
          {loginMode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-800 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {/* PHONE LOGIN UI */}
          {loginMode === "phone" && (
            <>
              {!otpSent ? (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={sendOtp}
                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                  >
                    Send OTP
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg"
                  >
                    Verify OTP
                  </button>
                </>
              )}
            </>
          )}

          <p className="text-center text-sm mt-4 text-zinc-500">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
