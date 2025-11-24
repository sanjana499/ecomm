// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { User, ShoppingCart, Box, Grid, TrendingUp, Clock } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any | null>(null);
  const COLORS = ["#4ade80", "#60a5fa", "#f97316", "#f43f5e", "#a78bfa", "#f59e0b"];

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch((e) => console.error("Failed to load stats", e));
  }, []);

  const cards = [
    { title: "Total Users", key: "users", icon: <User size={20} className="text-green-500" /> },
    { title: "Total Orders", key: "orders", icon: <ShoppingCart size={20} className="text-green-500" /> },
    { title: "Total Products", key: "products", icon: <Box size={20} className="text-green-500" /> },
    { title: "Total Categories", key: "categories", icon: <Grid size={20} className="text-green-500" /> },
    { title: "Month Statistics (orders)", key: "monthlyOrders", icon: <TrendingUp size={20} className="text-green-500" /> },
    {
      title: "Pending Orders",
      key: "pending",
      icon: <Clock className="text-green-500" size={24} />
    },
  ];



  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <main className="p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {cards.map((c) => (
              <div key={c.key} className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center">
                <div className="mb-2">{c.icon}</div>
                <div className="text-sm text-gray-600">{c.title}</div>
                <div className="text-2xl font-bold mt-2">
                  {stats ? (stats[c.key] ?? 0) : "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line chart - last 7 days orders */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Orders - Last 7 days</h3>
              {stats?.dailyOrders ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={stats.dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className="py-10 text-center text-gray-400">Loading...</div>}
            </div>

            {/* Bar chart - Top Products */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Top Products (by qty sold)</h3>

              {stats?.topProducts && stats.topProducts.length ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="sold" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-10 text-center text-gray-400">No data</div>
              )}
            </div>


            {/* Pie chart - category sales */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Category-wise Sales</h3>

              {stats?.categorySales && stats.categorySales.length ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={stats.categorySales}
                      dataKey="sold"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ payload }) => payload.category}

                    >
                      {stats.categorySales.map((_entry: any, idx: number) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    {/* 👉 Custom Tooltip to show category + sold count */}
                    <Tooltip
                      formatter={(value: number, _name: string, item: any) => [
                        `${value} sold`,
                        item.payload.category,
                      ]}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-10 text-center text-gray-400">No data</div>
              )}
            </div>


          </div>

          {/* Additional panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-3">Order Status Overview</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded shadow">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <h2 className="text-2xl font-bold text-blue-600">
                    {stats?.orderStatus?.pending ?? 0}
                  </h2>
                </div>

                <div className="bg-green-50 p-3 rounded shadow">
                  <p className="text-sm text-gray-600">Success Orders</p>
                  <h2 className="text-2xl font-bold text-green-600">
                    {stats?.orderStatus?.success ?? 0}
                  </h2>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Low Stock Products</h3>
              {stats?.lowStockProducts?.length ? (
                <ul className="text-sm space-y-2">
                  {stats.lowStockProducts.map((p: any) => (
                    <li key={p.id} className="flex justify-between">
                      <span>{p.title || p.name || `#${p.id}`}</span>
                      <strong>{p.quantity}</strong>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-500">No low stock products</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
