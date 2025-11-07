"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { Edit, Trash2 } from "lucide-react";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("status", formData.status ? "active" : "inactive");
    if (imageFile) fd.append("image", imageFile);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      console.log("data", data);
      if (res.ok) {
        Swal.fire("✅ Success", "Category added successfully!", "success");
        setFormData({ name: "", description: "", status: true });
        setImageFile(null);
        setShowForm(false);
        fetchCategories();
      } else {
        Swal.fire("❌ Error", data.error || "Failed to add category", "error");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
  
    if (!confirm.isConfirmed) return;
  
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
  
    if (res.ok) {
      Swal.fire("Deleted!", data.message, "success");
      fetchCategories(); // ✅ Refresh list
    } else {
      Swal.fire("Error", data.error || "Failed to delete category", "error");
    }
  };
  
  

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Categories</h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Category
            </button>
          </div>

          {/* ✅ Category Table */}
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Image</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((c, i) => (
                    <tr key={c.id || i} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">{c.name}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            c.status === true || c.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {c.status === true || c.status === "active"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {c.description || "-"}
                      </td>
                     
                        <td className="flex">
 
<button
  onClick={() => router.push(`/master/categories/edit/${c.id}`)}
  className="p-2 rounded-full hover:bg-blue-100 transition"
  title="Edit"
>
  <Edit className="w-4 h-4 text-blue-600 hover:text-blue-800" />
</button>

                            <button
                                className="p-2 rounded-full hover:bg-red-100 transition"
                                title="Delete"
                                onClick={() => handleDelete(c.id)}
                              >
                                <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                              </button>
                          </td>


                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-gray-500 py-4 italic"
                    >
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Popup Form Modal */}
          {showForm && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-transparent z-50">
    <div className="bg-white/70 backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* ✅ Category Name */}
          <input
            type="text"
            placeholder="Category Name"
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          {/* ✅ Image Upload */}
          <input
            type="file"
            accept="image/*"
            className="border border-gray-300 px-3 py-2 rounded-md"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        {/* ✅ Description */}
        <textarea
          placeholder="Description"
          className="border border-gray-300 w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* ✅ Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.checked })
            }
          />
          <label className="text-gray-700">Active</label>
        </div>

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}


        </div>
      </div>
    </div>
  );
}
