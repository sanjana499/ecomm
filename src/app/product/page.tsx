"use client";

import { useRouter } from "next/navigation"; // ✅ correct import
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { Trash2 } from "lucide-react";

export default function ProductPage() {
  const router = useRouter(); // ✅ initialize router
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch(`/api/product/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          fetchProducts();
        } else {
          Swal.fire("Error!", "Failed to delete product.", "error");
        }
      }
    });
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-8 bg-gray-50 min-h-screen">
          {/* ✅ Header with Add Product button */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <button
              onClick={() => router.push("/product/add_product")} // ✅ navigate
              className="bg-linear-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transform transition duration-200"
            >
              + Add Product
            </button>
          </div>

          {/* ✅ Product Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading products...
              </div>
            ) : products.length > 0 ? (
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Category ID</th>
                    <th className="px-6 py-3">Sub Category ID</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => (
                    <tr
                      key={p.id}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } border-b hover:bg-blue-50 transition duration-150`}
                    >
                      <td className="px-6 py-3">{i + 1}</td>
                      <td className="px-6 py-3 font-medium">{p.name}</td>
                      <td className="px-6 py-3">{p.category_id}</td>
                      <td className="px-6 py-3">{p.sub_category_id || "-"}</td>
                      <td className="px-6 py-3 font-semibold text-blue-700">
                        ₹{p.price}
                      </td>
                      <td
                        className={`px-6 py-3 font-medium ${
                          p.status === "active"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {p.status}
                      </td>
                      <td className="px-6 py-3 text-gray-700">
                        {p.description || "-"}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-500 py-10">
                No products available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
