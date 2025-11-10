"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { Trash2, Edit } from "lucide-react";

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    parent_category_id: "",
    description: "",
    status: "active",
  });

  // ✅ Fetch all subcategories
  const fetchSubCategories = async () => {
    const res = await fetch("/api/sub_categories");
    const data = await res.json();
    setSubCategories(Array.isArray(data) ? data : []);
  };

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  // ✅ Handle form submit (Add / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      category_id: formData.parent_category_id,
      description: formData.description,
      status: formData.status,
    };

    const url = editId
      ? `/api/sub_categories/${editId}`
      : "/api/sub_categories";

    const res = await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: editId ? "Subcategory Updated!" : "Subcategory Added!",
        timer: 1500,
        showConfirmButton: false,
      });
      setFormData({
        name: "",
        parent_category_id: "",
        description: "",
        status: "active",
      });
      setShowModal(false);
      setEditId(null);
      fetchSubCategories();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.error || "Something went wrong.",
      });
    }
  };

  // ✅ Delete Subcategory
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      const res = await fetch(`/api/sub_categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Deleted!", data.message, "success");
        fetchSubCategories();
      } else {
        Swal.fire("Error!", data.error || "Failed to delete", "error");
      }
    }
  };

  // ✅ Open modal for Add/Edit
  const openModal = (subCategory?: any) => {
    if (subCategory) {
      setEditId(subCategory.id);
      setFormData({
        name: subCategory.name,
        parent_category_id: subCategory.categories_id || "",
        description: subCategory.description || "",
        status: subCategory.status || "active",
      });
    } else {
      setEditId(null);
      setFormData({
        name: "",
        parent_category_id: "",
        description: "",
        status: "active",
      });
    }
    setShowModal(true);
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 bg-gray-50 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Sub Categories</h1>
            <button
              onClick={() => openModal()}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Add Sub Category
            </button>
          </div>

          {/* ✅ Sub Category Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.length > 0 ? (
                  subCategories.map((s, i) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">{s.name}</td>
                      <td className="px-4 py-2">
                        {categories.find((c) => c.id === s.categories_id)?.name ||
                          "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {s.description}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            s.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right flex gap-2 justify-end">
                        <button
                          onClick={() => openModal(s)}
                          className="text-blue-600 hover:text-blue-800 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No subcategories available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Sub Category" : "Add Sub Category"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <select
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={formData.parent_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_category_id: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Sub Category Name"
                className="border rounded-md px-3 py-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description"
                className="border rounded-md px-3 py-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <select
                className="border rounded-md px-3 py-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
