"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { orders } from "@/lib/schema";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="p-6 text-center text-gray-600">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 max-w-6xl mx-auto">

          <h1 className="text-3xl font-semibold mb-6">
            Order Details <span className="text-indigo-600">#{order.order_id}</span>
          </h1>


          <div className="grid gap-6">

            {/* Customer Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><span className="font-medium">Name:</span> {order.user_name ?? "N/A"}</p>
                <p><span className="font-medium">Email:</span> {order.email ?? "N/A"}</p>
                <p><span className="font-medium">Transaction ID:</span> {order.transaction_id ?? "N/A"}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><span className="font-medium">Order ID:</span> #{order.order_id}</p>
                <p><span className="font-medium">Customer ID:</span> #{order.customerId}</p>
                <p><span className="font-medium">Total Amount:</span> ₹{order.total_amount}</p>
                <p><span className="font-medium">Shipping Charge:</span> ₹{order.shipping_charge}</p>
                <p><span className="font-medium">Discount:</span> ₹{order.discount}</p>
                <p><span className="font-medium">Status:</span> {order.order_status}</p>
                <p><span className="font-medium">Payment Method:</span> {order.payment_method}</p>
                <p>
                  <span className="font-medium">Product ID:</span>
                  {order.product_ids?.join(", ")}
                </p>

              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p><span className="font-medium">Address ID:</span> {order.address_id ?? "N/A"}</p>
                <p><span className="font-medium">Address:</span> {order.shipping_address ?? "N/A"}</p>
                <p><span className="font-medium">City:</span> {order.city ?? "N/A"}</p>
                <p><span className="font-medium">State:</span> {order.state ?? "N/A"}</p>
                <p><span className="font-medium">Pincode:</span> {order.pincode ?? "N/A"}</p>
              </div>
            </div>


            {/* Items */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Items</h2>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Offer Price</th>
                  </tr>
                </thead>

                <tbody className="text-center">
                  {order.items?.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{item.title}</td>

                      <td className="p-2 border text-center">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover mx-auto"
                        />
                      </td>
                      <td className="p-2 border">{item.quantity}</td>
                      <td className="p-2 border">₹{item.price}</td>
                      <td className="p-2 border">₹{item.offerPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-500 text-sm text-right">Created At: {new Date(order.created_at).toLocaleString()}</p>

          </div>
        </div>
      </div>
    </div>
  );
}
