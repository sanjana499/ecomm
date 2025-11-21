"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { XCircle } from "lucide-react";

export default function SuccessOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders/success");
                const data = await res.json();

                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                Swal.fire("Error", "Failed to load successful orders", "error");
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    // ❌ Cancel Order Function
    const cancelOrder = async (orderId: number) => {
        const confirm = await Swal.fire({
            title: "Cancel Order?",
            text: "Are you sure you want to cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Cancel",
        });

        if (!confirm.isConfirmed) return;

        const res = await fetch(`/api/orders/cancel/${orderId}`, {
            method: "PUT",
        });

        const data = await res.json();

        if (data.success) {
            Swal.fire("Cancelled", "Your order has been cancelled.", "success");
            setOrders((prev) => prev.filter((o) => o.order_id !== orderId));
        } else {
            Swal.fire("Error", "Failed to cancel order", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-100 flex flex-col items-center p-6 relative overflow-hidden">

            {/* 🌸 Flower Animation */}
            {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-fall absolute text-pink-300 text-4xl"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * -100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    >
                        🌸
                    </div>
                ))}
            </div> */}

            {/* 🎉 Success Card */}
            <div className="bg-white shadow-xl rounded-2xl p-8 mt-30 w-full max-w-xl text-center animate-[fadeInUp_0.6s_ease-out] border border-gray-200">
                <div className="flex justify-center">
                    <div className="animate-[pop_0.4s_ease-out] bg-green-100 p-4 rounded-full">
                        <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-green-600 mt-4">Order Placed Successfully!</h1>
                <p className="text-gray-600 mt-2">  Thank you for shopping with us! Your order has been placed and will be delivered soon.</p>
            </div>

            {/* 🧾 Orders List */}
            {/* <div className="mt-10 bg-white w-full max-w-3xl shadow-lg rounded-xl p-6 animate-[fadeIn_0.6s_ease-out] border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Successful Orders</h2>

                {orders.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No successful orders found.</p>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.order_id}
                                className="p-5 rounded-xl border bg-gray-50 hover:bg-white hover:shadow-md transition transform hover:-translate-y-1 relative"
                            >

                             
                                <button
                                    onClick={() => cancelOrder(order.order_id)}
                                    className="absolute top-3 right-3 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>

                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-gray-700 font-medium">
                                            Order ID: <span className="font-bold">{order.order_id}</span>
                                        </p>
                                        <p className="text-gray-600">
                                            Customer: <span className="font-medium">{order.user_name}</span>
                                        </p>
                                        <p className="text-gray-600">Payment: {order.payment_method}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xl font-bold text-green-600">₹{order.total_amount}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div> */}

            {/* 🌸 ANIMATION CSS */}
            <style jsx>{`
                @keyframes fall {
                    0% { transform: translateY(-10vh) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(360deg); }
                }
                .animate-fall {
                    animation: fall 6s linear infinite;
                }
                @keyframes pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

        </div>
    );
}
