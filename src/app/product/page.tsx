"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { Pencil, Trash2 } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    subCategoryId: "",
    price: "",
    status: "active",
    description: "",
  });

  // ✅ Fetch products
  const fetchProducts = async () => {
    const res = await fetch("/api/product");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Add or update product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/product/${editId}` : `/api/product`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: editId ? "Product Updated!" : "Product Added!",
        text: editId
          ? "Product updated successfully."
          : "Product added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      setFormData({
        name: "",
        categoryId: "",
        subCategoryId: "",
        price: "",
        status: "active",
        description: "",
      });
      setShowForm(false);
      setEditId(null);
      fetchProducts();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: data.error || "Something went wrong.",
      });
    }
  };

  // ✅ Delete product
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

  // ✅ Edit handler
  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      categoryId: product.category_id,
      subCategoryId: product.sub_category_id,
      price: product.price,
      status: product.status,
      description: product.description,
    });
    setEditId(product.id);
    setShowForm(true);
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-8 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Products</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setFormData({
                  name: "",
                  categoryId: "",
                  subCategoryId: "",
                  price: "",
                  status: "active",
                  description: "",
                });
              }}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transform transition duration-200"
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>
          </div>

          {/* ✅ Add/Edit Product Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4 border border-gray-100"
            >
              <input
                type="text"
                placeholder="Product Name"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Category ID"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Sub Category ID"
                className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
                value={formData.subCategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, subCategoryId: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="border border-gray-300 rounded-lg px-4 py-2 w-40"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />

              <select
                className="border border-gray-300 rounded-lg px-4 py-2 w-40"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                {editId ? "Update" : "Save"}
              </button>
            </form>
          )}

          {/* ✅ Product Table */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
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
                {products.length > 0 ? (
                  products.map((p, i) => (
                    <tr
                      key={`${p.id}-${i}`}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } border-b hover:bg-blue-50 transition duration-150`}
                    >
                      <td className="px-6 py-3">{i + 1}</td>
                      <td className="px-6 py-3">{p.name}</td>
                      <td className="px-6 py-3">{p.category_id}</td>
                      <td className="px-6 py-3">{p.sub_category_id}</td>
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
                      <td className="px-6 py-3 text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-6">
                      No products available
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
