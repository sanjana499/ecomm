"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Orders</h1>

          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, idx) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.user?.name || o.user?.email || "—"}</td>
                  <td className="p-2">₹{o.total_amount}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <button onClick={() => router.push(`/admin/orders/${o.id}`)} className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
