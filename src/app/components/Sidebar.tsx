"use client";

import { useEffect, useState } from "react";
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
  PlusCircle,
  ChevronUp,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);


  const [orders, setOrders] = useState<any[]>([]); // ✅ FIX

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    router.push("/");
  };

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => console.log("Failed to fetch orders"));
  }, []);

  return (
    <div className="h-screen w-64 bg-gray-50 border-r border-gray-200 shadow-sm flex flex-col justify-between fixed">
      <div>
        <div className="p-4 border-b text-gray-700 font-bold text-2xl flex items-center gap-2">
          <span>🛒</span> Admin Panel
        </div>

        <div className="p-4 flex flex-col gap-1">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActive("Dashboard");
              router.push("/dashboard");
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${active === "Dashboard"
              ? "bg-green-100 text-green-700 font-semibold shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          {/* Orders Dropdown */}
          <div>
            <button
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span>Orders</span>
              </div>
              {isOrdersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {isOrdersOpen && (
              <div className="ml-8 mt-2 flex flex-col gap-1">
                {/* Order List */}
                <button
                  onClick={() => {
                    setActive("Order List");
                    router.push("/orders");
                  }}
                  className={`text-sm px-3 py-1.5 rounded-md text-left ${active === "Order List"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  Order List
                </button>

                <button
                  onClick={() => {
                    const latestOrderId = orders[0]?.id || 1;   // 👍 safe fallback
                    setActive("Order Details");
                    router.push(`/admin/orders/${latestOrderId}`);
                  }}
                  className={`text-sm px-3 py-1.5 rounded-md text-left ${active === "Order Details"
                      ? "bg-green-100 text-green-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  Order Details
                </button>


              </div>
            )}
          </div>

          {/* Product */}
          <div className="space-y-2">
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${active === "Product"
                ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                }`}
            >
              <div className="flex items-center gap-3">
                <Package size={18} />
                <span>Product</span>
              </div>
              {openDropdown ? <ChevronUp size={16} /> : <ChevronRight size={16} />}
            </button>

            {openDropdown && (
              <div className="ml-10 space-y-1">
                <button
                  onClick={() => {
                    setActive("Add Product");
                    router.push("/product/add_product");
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${active === "Add Product"
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                    }`}
                >
                  <PlusCircle size={16} />
                  <span>Add Product</span>
                </button>

                <button
                  onClick={() => {
                    setActive("Product List");
                    router.push("/product");
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-all duration-200 ${active === "Product List"
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                    }`}
                >
                  <Package size={16} />
                  <span>Product List</span>
                </button>
              </div>
            )}
          </div>

          {/* Customers */}
          <button
            onClick={() => {
              setActive("Customers");
              router.push("/admin/customers");
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${active === "Customers"
              ? "bg-green-100 text-green-700 font-semibold shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
          >
            <Users size={18} />
            <span>Customers</span>
          </button>

          {/* Analytics */}
          <button
            onClick={() => {
              setActive("Analytics");
              router.push("/dashboard");
            }}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-all duration-200 ${active === "Analytics"
              ? "bg-green-100 text-green-700 font-semibold shadow-sm"
              : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
              }`}
          >
            <BarChart2 size={18} />
            <span>Analytics</span>
          </button>

          {/* Master */}
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

            {isMasterOpen && (
              <div className="ml-8 mt-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setActive("Category");
                    router.push("/master/categories");
                  }}
                  className={`text-sm px-3 py-1.5 rounded-md text-left ${active === "Category"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  Category
                </button>

                <button
                  onClick={() => {
                    setActive("Sub Category");
                    router.push("/master/sub_categories");
                  }}
                  className={`text-sm px-3 py-1.5 rounded-md text-left ${active === "Sub Category"
                    ? "bg-green-100 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  Sub Category
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout */}
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
