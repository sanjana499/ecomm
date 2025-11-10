"use client";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Clock, Users, Package, Grid, ClipboardCheck, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Pending Orders", value: 0, icon: <Clock className="text-green-500" size={24} /> },
    { title: "Total Users", value: 0, icon: <Users className="text-green-500" size={24} /> },
    { title: "Total Products", value: 0, icon: <Package className="text-green-500" size={24} /> },
    { title: "Total Categories", value: 0, icon: <Grid className="text-green-500" size={24} /> },
    { title: "Completed Orders", value: 0, icon: <ClipboardCheck className="text-green-500" size={24} /> },
    { title: "Month Statistics", value: 0, icon: <TrendingUp className="text-green-500" size={24} /> },
  ];

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all"
              >
                <div className="mb-3">{item.icon}</div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
