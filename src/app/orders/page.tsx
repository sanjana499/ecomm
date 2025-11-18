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
      <h1 className="text-xl font-bold mb-4">Orders List</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Total + Shipping</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.user_name}</td>
                  <td className="p-2">{o.email}</td>
                  <td className="p-2">
                    ₹{Number(o.total_amount) + Number(o.shipping_charge)}
                  </td>
                  <td className="p-2">{o.order_status}</td>
                  <td className="p-2">
                    {new Date(o.created_at).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => router.push(`/admin/orders/${o.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
   </div>
    </div>
  );
}
