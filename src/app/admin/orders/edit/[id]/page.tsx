"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Swal from "sweetalert2";

export default function EditOrderPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing order
  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch order");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setOrder((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      const data = await res.json();

      if (data.error) {
        Swal.fire("Error", data.error, "error");
      } else {
        Swal.fire({
          icon: "success",
          title: "Order updated",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push(`/admin/orders/${id}`); // Redirect to view page
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update order", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-8 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Edit Order #{order.order_id}
          </h1>

          <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200">

            {/* Customer Info */}
            <div>
              <h2 className="text-lg font-bold mb-2">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={order.user_name ?? ""}
                  onChange={(e) => handleChange("user_name", e.target.value)}
                  placeholder="Customer Name"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="email"
                  value={order.email ?? ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h2 className="text-lg font-bold mb-2">Order Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={order.total_amount ?? 0}
                  onChange={(e) => handleChange("total_amount", e.target.value)}
                  placeholder="Total Amount"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="number"
                  value={order.shipping_charge ?? 0}
                  onChange={(e) => handleChange("shipping_charge", e.target.value)}
                  placeholder="Shipping Charge"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="number"
                  value={order.discount ?? 0}
                  onChange={(e) => handleChange("discount", e.target.value)}
                  placeholder="Discount"
                  className="p-2 border rounded w-full"
                />
                <select
                  value={order.order_status}
                  onChange={(e) => handleChange("order_status", e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={order.payment_method}
                  onChange={(e) => handleChange("payment_method", e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="cod">COD</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>

            {/* Shipping Info */}
            <div>
              <h2 className="text-lg font-bold mb-2">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={order.shipping_address ?? ""}
                  onChange={(e) => handleChange("shipping_address", e.target.value)}
                  placeholder="Address"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  value={order.city ?? ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="City"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  value={order.state ?? ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="State"
                  className="p-2 border rounded w-full"
                />
                <input
                  type="text"
                  value={order.pincode ?? ""}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  placeholder="Pincode"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => router.push(`/admin/orders/${id}`)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}


