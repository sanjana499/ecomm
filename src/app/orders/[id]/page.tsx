"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  
  const { id } = React.use(params);  // ✅ Correct Next.js 16 method

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`/api/orders`)
      const data = await res.json();
      console.log("data",data);
      setOrder(data);
    }

    load();
  }, [id]);

  if (!order) {
    return <div className="p-5 text-center">Loading order...</div>;
  }

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-5 space-y-4">
          <h1 className="text-xl font-bold">Order #{order.id}</h1>

          <div className="border p-4 rounded bg-white shadow-sm">
            <p>User: {order.user?.name || "Guest"}</p>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.total_amount
            }</p>
          </div>

          <div className="border p-4 rounded bg-white shadow-sm">
            <h3 className="font-semibold mb-2">Items</h3>

            {order.items?.map((it: any) => (
              <div
                key={it.id}
                className="flex justify-between border p-2 rounded"
              >
                <div>
                  <div className="font-medium">
                    {it.product?.title || "Product #" + it.product_id}
                  </div>
                  <div>Qty: {it.quantity}</div>
                  <div>Product ID: {it.product_id}</div>
                </div>

                <div>₹{it.price}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
