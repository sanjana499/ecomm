"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Key } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

interface Product {
  id: Key | null | undefined;
  title: string;
  color: string | null;
  size: string | null;
  quantity: number;
  price: string;
  offerPrice: string | null;
  desc: string | null;
  description: string | null;
  img: string;

  category_name: string | null;
  sub_category_name: string | null;
  status: string;
}

export default function ProductPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data.products || []);
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
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          </div>

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
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Sub Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Offer Price</th>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Quantity</th>
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
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2">{p.title}</td>
                      <td className="px-4 py-2">{p.category_name || "—"}</td>
                      <td className="px-4 py-2">{p.sub_category_name || "—"}</td>
                      <td className="px-4 py-2">₹{p.price}</td>
                      <td className="px-4 py-2">₹{p.offerPrice || "—"}</td>

                      <td className="px-4 py-2">
                        <Image
                          src={p.img}
                          alt={p.title}
                          width={80}
                          height={80}
                          className="object-contain rounded-md bg-gray-100"
                        />
                      </td>

                      <td className="px-4 py-2">{p.quantity}</td>
                      <td className="px-4 py-2 capitalize">{p.status}</td>
                      <td className="px-4 py-2 max-w-[100px] line-clamp-2 overflow-hidden">
                        {p.description || "—"}
                      </td>

                      <td className="px-2 py-1 text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/product/edit/${p.id}`)
                            }
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(Number(p.id))}
                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
