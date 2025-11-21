"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Package,
    Truck,
    RotateCcw,
    User,
    MapPin,
    CreditCard,
    Wallet,
    Bell,
    Star,
    Heart,
    LogOut,
    Gift,
    Folder,
    UserCog,
    Folders,
    Power
} from "lucide-react";
import Swal from "sweetalert2";

type User = {
    name: string;
    email: string;
    phone_no: string;
    gender?: string;
};

const ProfilePage = () => {
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [formData, setFormData] = useState<User | null>(null);



    const router = useRouter();
    // Track active menu page
    const [currentPage, setCurrentPage] = useState("profile");


    useEffect(() => {
        if (!userId) return;

        fetch(`/api/user/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                    setFormData(data.user);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    const handleEditClick = (field: string) => setEditingField(field);
    const handleChange = (field: keyof User, value: string) => {
        if (!formData) return;
        setFormData({ ...formData, [field]: value });
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!user) return <div className="p-6 text-center">User not found</div>;

    const nameParts = formData?.name.split(" ") || [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        Swal.fire("Success", "Logged out successfully", "success");

        router.push("/login"); // redirect
    };


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto flex gap-6">

                {/* ================= Left Sidebar ================= */}
                <aside className="w-64 shrink-0">

                    {/* USER CARD (ONLY THIS HAS GAP) */}
                    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-3 mb-3">
                        <img
                            src="/profile-user.svg"
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-gray-600 text-sm">Hello,</p>
                            <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
                        </div>
                    </div>


                    {/* SECTIONS START (NO GAP ANYWHERE BELOW THIS) */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">

                        {/* ACCOUNT SETTINGS */}
                        <div className="border-b p-4">
                            <div className="flex items-center gap-2">
                                <UserCog className="text-blue-600" />
                                <h3 className="text-gray-800 font-semibold text-sm">ACCOUNT SETTINGS</h3>
                            </div>

                            <ul className="mt-2 space-y-1 text-gray-600 text-[13px]">

                                {/* ACTIVE PAGE: PROFILE INFORMATION */}
                                <li
                                    onClick={() => {
                                        setCurrentPage("profile");
                                        router.push(`/profile/${userId}`);
                                    }}
                                    className={`py-1 pl-7 cursor-pointer 
        ${currentPage === "profile"
                                            ? "text-blue-600 font-semibold"
                                            : "hover:text-blue-600"
                                        }`}
                                >
                                    Profile Information
                                </li>

                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">
                                    Manage Addresses
                                </li>

                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">
                                    PAN Card Information
                                </li>
                            </ul>
                        </div>

                        {/* MY ORDERS */}
                        <div className="border-b p-4">
                            <div className="flex items-center gap-2">
                                <Folders className="text-blue-600" />
                                <h3 className="text-gray-800 font-semibold text-sm">MY ORDERS</h3>
                            </div>

                            <ul className="mt-2 space-y-1 text-gray-600 text-[13px]">
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Track Orders</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Cancel Orders</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Returns</li>
                            </ul>
                        </div>

                        {/* PAYMENTS */}
                        <div className="border-b p-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="text-blue-600" />
                                <h3 className="text-gray-800 font-semibold text-sm">PAYMENTS</h3>
                            </div>

                            <ul className="mt-2 space-y-1 text-gray-600 text-[13px]">
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Gift Cards ₹0</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Saved UPI</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">Saved Cards</li>
                            </ul>
                        </div>

                        {/* MY STUFF */}
                        <div className="border-b p-4">
                            <div className="flex items-center gap-2">
                                <Folder className="text-blue-600" />
                                <h3 className="text-gray-800 font-semibold text-sm">MY STUFF</h3>
                            </div>

                            <ul className="mt-2 space-y-1 text-gray-600 text-[13px]">
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">My Coupons</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">My Reviews & Ratings</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">All Notifications</li>
                                <li className="py-1 pl-7 hover:text-blue-600 cursor-pointer">My Wishlist</li>
                            </ul>
                        </div>

                        {/* LOGOUT (NO GAP BEFORE THIS) */}
                        <div
                            onClick={handleLogout}
                            className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                        >
                            <Power size={20} className="text-blue-600" />
                            <span className="text-red-600 font-semibold">Logout</span>
                        </div>
                    </div>

                </aside>



                {/* ================= Main Content ================= */}
                <main className="flex-1 space-y-6">

                    {/* Personal Info Card */}
                    <div className="bg-white rounded-lg shadow p-6 space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                        {/* Row 1: First Name + Last Name */}
                        <div className="flex gap-6 mt-10 p-6">
                            <div className="relative w-1/2">
                                <label className="text-gray-700 text-sm font-semibold">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    readOnly={editingField !== "firstName"}
                                    onChange={(e) => handleChange("name", `${e.target.value} ${lastName}`)}
                                    className={`mt-2 w-full border px-3 py-2 rounded ${editingField === "firstName"
                                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        : "cursor-not-allowed bg-gray-100"
                                        }`}
                                />
                                <button
                                    onClick={() => handleEditClick("firstName")}
                                    className="absolute top-0 right-0 px-2 py-1 text-blue-500 text-sm"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="relative w-1/2">
                                <label className="text-gray-700 text-sm font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    readOnly={editingField !== "lastName"}
                                    onChange={(e) => handleChange("name", `${firstName} ${e.target.value}`)}
                                    className={`mt-2 w-full border px-3 py-2 rounded ${editingField === "lastName"
                                        ? "focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        : "cursor-not-allowed bg-gray-100"
                                        }`}
                                />
                                <button
                                    onClick={() => handleEditClick("lastName")}
                                    className="absolute top-0 right-0 px-2 py-1 text-blue-500 text-sm"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>

                        {/* Row 2: Gender */}
                        <div className="flex flex-col gap-3 relative mt-10 p-6">
                            <label className="text-gray-700 text-sm font-semibold">
                                Your Gender
                            </label>

                            <div className="flex gap-6 mt-2">
                                {["Male", "Female"].map((g) => (
                                    <label
                                        key={g}
                                        className={`flex items-center gap-2 ${editingField !== "gender" ? "cursor-not-allowed" : "cursor-pointer"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData?.gender === g}
                                            onChange={(e) => handleChange("gender", e.target.value)}
                                            disabled={editingField !== "gender"}
                                            className="cursor-pointer"
                                        />
                                        {g}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Row 3: Email */}
                        <div className="relative w-1/3 mt-10 p-6">
                            <label className="text-gray-700 text-xsl font-semibold">Email Address</label>
                            <input
                                type="email"
                                value={formData?.email || ""}
                                readOnly={editingField !== "email"}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={`mt-2 w-full border px-3 py-2 rounded ${editingField === "email"
                                    ? "focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    : "cursor-not-allowed bg-gray-100"
                                    }`}
                            />
                            <button
                                onClick={() => handleEditClick("email")}
                                className="absolute top-0 right-0 px-2 mt-5 py-1 text-blue-500 text-sm"
                            >
                                Edit
                            </button>
                        </div>

                        {/* Row 4: Mobile */}
                        <div className="relative w-1/3 mt-10 p-6">
                            <label className="text-gray-700 text-xsl font-semibold">Mobile Number</label>
                            <input
                                type="tel"
                                value={formData?.phone_no || ""}
                                readOnly={editingField !== "phone_no"}
                                onChange={(e) => handleChange("phone_no", e.target.value)}
                                className={`mt-2 w-full border px-3 py-2 rounded ${editingField === "phone_no"
                                    ? "focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    : "cursor-not-allowed bg-gray-100"
                                    }`}
                            />
                            <button
                                onClick={() => handleEditClick("phone_no")}
                                className="absolute top-0 right-0 px-2 mt-5 py-1 text-blue-500 text-sm"
                            >
                                Edit
                            </button>
                        </div>


                        {/* 🔥🔥🔥 NOW FAQs + DELETE + IMAGE ARE INSIDE SAME CARD 🔥🔥🔥 */}

                        {/* FAQs */}
                        <div className="space-y-4 mt-10">
                            <h2 className="text-xl font-semibold">FAQs</h2>

                            <div>
                                <p className="font-semibold">What happens when I update my email address (or mobile number)?</p>
                                <p className="text-gray-600">
                                    Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">When will my Flipkart account be updated with the new email address (or mobile number)?</p>
                                <p className="text-gray-600">
                                    It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">What happens to my existing Flipkart account when I update my email address (or mobile number)?</p>
                                <p className="text-gray-600">
                                    Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional.
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold">Does my Seller account get affected when I update my email address?</p>
                                <p className="text-gray-600">
                                    Flipkart has a 'single sign-on' policy. Any changes will reflect in your Seller account also.
                                </p>
                            </div>
                        </div>

                        {/* Deactivate/Delete Account */}
                        <div className="space-y-4 mt-10">

                            <button
                                className="w-full text-left text-sm text-blue-600 font-semibold py-2 hover:bg-red-50 rounded"
                            >
                                Deactivate Account
                            </button>

                            <button
                                className="w-full text-left text-sm text-red-600 font-semibold py-2 hover:bg-red-50 rounded"
                            >
                                Delete Account
                            </button>

                            <div className="-mx-6 -mb-6 mt-4">
                                <img
                                    src="/minimalBoat.jpg"
                                    alt="Account Security"
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                        </div>

                    </div>

                </main>

            </div>
        </div>
    );
};

export default ProfilePage;
