"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Swal from "sweetalert2";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   fetch("/api/orders")
  //     .then((r) => r.json())
  //     .then((data) => setOrders(data))
  //     .catch(() => setOrders([]));
  // }, []);

  // useEffect(() => {
  //   fetch("/api/orders")
  //     .then((r) => r.json())
  //     .then((data) => {
  //       // If API returns { success: true, orders: [...] }
  //       setOrders(data.orders ?? []);
  //     })
  //     .catch(() => setOrders([]));
  // }, []);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        // console.log("Fetched orders IDs:", data.map((o: any) => o.id)); // ✅ Add this
        setOrders(data ?? []); // <- data is already array
      })
      .catch(() => setOrders([]));
  }, []);


  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      // User cancelled
      if (!result.isConfirmed) return;

      // 👇 DELETE API CALL
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.error) {
        return Swal.fire("Error", data.error, "error");
      }

      // Remove from list
      setOrders((prev) => prev.filter((o) => o.id !== id));
      

      // Success message
      Swal.fire({
        title: "Deleted!",
        text: "Order has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "Failed to delete order", "error");
    }
  };


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
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
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
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/orders/${o.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Order"
                        >
                          View
                        </button>
                        <button
                          onClick={() => router.push(`/admin/orders/edit/${o.id}`)}
                          className="text-green-600 hover:text-green-800"
                          title="Edit Order"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
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
