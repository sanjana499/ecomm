"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: true,
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ✅ Fetch single category details
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch category");

        setFormData({
          name: data.name || "",
          description: data.description || "",
          status: data.status === true || data.status === "active",
          image: data.image || "",
        });
      } catch (err) {
        console.error("Error fetching category:", err);
        Swal.fire("❌ Error", "Failed to load category data", "error");
      }
    };

    fetchCategory();
  }, [id]);

  // ✅ Update category handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("status", formData.status ? "active" : "inactive");
    if (imageFile) fd.append("image", imageFile);

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: fd,
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire("✅ Success", "Category updated successfully!", "success");
        router.push("/master/categories");
      } else {
        Swal.fire("❌ Error", data.error || "Update failed", "error");
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire("❌ Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 bg-gray-50 min-h-screen">
          <h1 className="text-2xl font-bold mb-6">Edit Category</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-lg p-6 max-w-lg space-y-4"
          >
            {/* ✅ Category Name */}
            <input
              type="text"
              placeholder="Category Name"
              className="border px-3 py-2 rounded-md w-full"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            {/* ✅ Description */}
            <textarea
              placeholder="Description"
              className="border px-3 py-2 rounded-md w-full"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            {/* ✅ Existing Image Preview */}
            {formData.image && (
              <img
                src={formData.image}
                alt="Current"
                className="w-40 h-40 object-cover rounded-md mb-2"
              />
            )}

            {/* ✅ Image Upload */}
            <input
              type="file"
              accept="image/*"
              className="border px-3 py-2 rounded-md w-full"
              onChange={(e) =>
                setImageFile(e.target.files ? e.target.files[0] : null)
              }
            />

            {/* ✅ Status Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.checked })
                }
              />
              <label>Active</label>
            </div>

            {/* ✅ Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => router.push("/master/categories")}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
