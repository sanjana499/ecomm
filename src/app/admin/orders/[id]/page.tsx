"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

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
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-8 max-w-6xl mx-auto">

          {/* PAGE HEADER */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Order <span className="text-indigo-600">#{order.order_id}</span>
            </h1>
            <p className="text-gray-500 mt-1">
              Detailed breakdown of this order including customer, shipping, and items
            </p>
          </div>

          <div className="grid gap-8">

            {/* CUSTOMER INFO */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                <p><span className="font-semibold">Name:</span> {order.user_name ?? "N/A"}</p>
                <p><span className="font-semibold">Email:</span> {order.email ?? "N/A"}</p>
                <p><span className="font-semibold">Transaction ID:</span> {order.transaction_id ?? "N/A"}</p>
              </div>
            </div>

            {/* ORDER INFO */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Order Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold">Order ID:</span> #{order.order_id}</p>
                <p><span className="font-semibold">Customer ID:</span> #{order.customerId}</p>
                <p><span className="font-semibold">Total Amount:</span> ₹{order.total_amount}</p>
                <p><span className="font-semibold">Shipping Charge:</span> ₹{order.shipping_charge}</p>
                <p><span className="font-semibold">Discount:</span> ₹{order.discount}</p>

                <p>
                  <span className="font-semibold">Payment Method:</span> 
                  <span className="ml-1 capitalize">{order.payment_method}</span>
                </p>

                <p>
                  <span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs 
                    ${order.order_status === "success" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}
                  `}>
                    {order.order_status}
                  </span>
                </p>

                <p><span className="font-semibold">Product IDs:</span> {order.product_ids?.join(", ")}</p>
              </div>
            </div>

            {/* SHIPPING INFO */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-700">Shipping Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <p><span className="font-semibold">Address ID:</span> {order.address_id ?? "N/A"}</p>
                <p><span className="font-semibold">Address:</span> {order.shipping_address ?? "N/A"}</p>
                <p><span className="font-semibold">City:</span> {order.city ?? "N/A"}</p>
                <p><span className="font-semibold">State:</span> {order.state ?? "N/A"}</p>
                <p><span className="font-semibold">Pincode:</span> {order.pincode ?? "N/A"}</p>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-700">Ordered Items</h2>

              <div className="overflow-auto border rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200 text-gray-700 text-sm">
                    <tr>
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">Product</th>
                      <th className="p-3 border">Image</th>
                      <th className="p-3 border">Qty</th>
                      <th className="p-3 border">Price</th>
                      <th className="p-3 border">Offer Price</th>
                    </tr>
                  </thead>

                  <tbody className="text-center">
                    {order.items?.map((item: any, index: number) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 border">{index + 1}</td>
                        <td className="p-3 border font-medium">{item.title}</td>

                        <td className="p-3 border">
                          <img
                            src={item.img}
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover mx-auto shadow"
                          />
                        </td>

                        <td className="p-3 border">{item.quantity}</td>
                        <td className="p-3 border">₹{item.price}</td>
                        <td className="p-3 border">₹{item.offerPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER */}
            <p className="text-gray-500 text-sm text-right">
              Created At: {new Date(order.created_at).toLocaleString()}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
