"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart2,
  FolderKanban,
  ChevronDown,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const router = useRouter();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Orders", icon: Package },
    { name: "Products", icon: Package },
    { name: "Customers", icon: Users },
    { name: "Analytics", icon: BarChart2 },
  ];

  const handleLogout = () => {
    // ✅ Clear local/session storage if needed
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    // ✅ Redirect to login page
    router.push("/login");
  };

  return (
    <div className="h-screen w-64 bg-gray-50 border-r border-gray-200 shadow-sm flex flex-col justify-between fixed">
      {/* ✅ Top Section */}
      <div>
        <div className="p-4 border-b text-gray-700 font-bold text-2xl flex items-center gap-2">
          <span>🛒</span> Admin Panel
        </div>

        {/* ✅ Menu Items */}
        <div className="p-4 flex flex-col gap-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}

          {/* ✅ Master Dropdown */}
          {/* ✅ Master Dropdown */}
<div>
  <button
    onClick={() => setIsMasterOpen(!isMasterOpen)}
    className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
  >
    <div className="flex items-center gap-3">
      <FolderKanban size={18} />
      <span>Master</span>
    </div>
    {isMasterOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
  </button>

  {/* Dropdown Items */}
  {isMasterOpen && (
    <div className="ml-8 mt-2 flex flex-col gap-1">
      <button
        onClick={() => {
          setActive("Category");
          router.push("/master/category"); // ✅ navigate to category page
        }}
        className={`text-sm px-3 py-1.5 rounded-md text-left ${
          active === "Category"
            ? "bg-green-100 text-green-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Category
      </button>

      <button
        onClick={() => {
          setActive("Sub Category");
          router.push("/master/sub-category"); // ✅ navigate to sub-category page
        }}
        className={`text-sm px-3 py-1.5 rounded-md text-left ${
          active === "Sub Category"
            ? "bg-green-100 text-green-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Sub Category
      </button>

      <button
        onClick={() => {
          setActive("Child Category");
          router.push("/master/child-category"); // ✅ navigate to child-category page
        }}
        className={`text-sm px-3 py-1.5 rounded-md text-left ${
          active === "Child Category"
            ? "bg-green-100 text-green-700 font-semibold"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Child Category
      </button>
    </div>
  )}
</div>
        </div>
      </div>

      {/* ✅ Logout Section */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 w-full text-sm transition-all duration-200"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
