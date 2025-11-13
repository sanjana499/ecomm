"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    subCategoryId: "",
    price: "",
    offerPrice: "",
    quantity: "",
    description: "",
    desc: "",
    color: "",
    size: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const fetchSubcategories = async (categoryId: string) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }
    const res = await fetch(`/api/sub_categories?categoryId=${categoryId}`);
    const data = await res.json();
    setSubcategories(data);
  };

  // ✅ Handle Form Submit (with image upload)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("title", formData.title);
    form.append("category_id", formData.categoryId);
    form.append("sub_category_id", formData.subCategoryId || "");
    form.append("price", formData.price);
    form.append("offerPrice", formData.offerPrice || "");
    form.append("quantity", formData.quantity || "0");
    form.append("description", formData.description);
    form.append("desc", formData.desc);
    form.append("color", formData.color);
    form.append("size", formData.size);

    // ✅ Must match backend name exactly: "img"
    if (image) form.append("img", image);

    const res = await fetch(`/api/product`, {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Product Added!",
        text: data.message || "Success!",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => router.push("/product"), 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: data.error || "Something went wrong.",
      });
    }
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="p-8 bg-gray-50 min-h-screen">
          <div className="flex items-center justify-between mb-6 p-4 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-100"
          >
            {/* Category Dropdown */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.categoryId}
              onChange={(e) => {
                const selectedCategory = e.target.value;
                setFormData({
                  ...formData,
                  categoryId: selectedCategory,
                  subCategoryId: "",
                });
                fetchSubcategories(selectedCategory);
              }}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Subcategory Dropdown */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.subCategoryId}
              onChange={(e) =>
                setFormData({ ...formData, subCategoryId: e.target.value })
              }
              disabled={!formData.categoryId}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* Product Title */}
            <input
              type="text"
              placeholder="Product Title"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            {/* Price */}
            <input
              type="number"
              placeholder="Price"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />

            {/* Offer Price */}
            <input
              type="number"
              placeholder="Offer Price"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.offerPrice}
              onChange={(e) =>
                setFormData({ ...formData, offerPrice: e.target.value })
              }
            />

            <input type="file" accept="image/*"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              } />
            {image && (
              <p className="text-sm text-green-600 mt-1">
                Selected: {image.name}
              </p>
            )}
            {/* Image Upload */}
            {/* <div className="md:col-span-3">
              <label className="block text-gray-700 font-medium mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files ? e.target.files[0] : null)
                }
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />
              {image && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {image.name}
                </p>
              )}
            </div> */}

            {/* Quantity */}
            <input
              type="number"
              placeholder="Quantity"
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />

            {/* Color */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
            >
              <option value="">Select Color</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
            </select>

            {/* Size */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
            >
              <option value="">Select Size</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>

            {/* Description */}
            <div className="md:col-span-3">
              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full min-h-20"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Short Description */}
            <div className="md:col-span-3">
              <textarea
                placeholder="Short Description (desc)"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full min-h-[60px]"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 md:col-span-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
              >
                {editId ? "Update" : "Save"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/product")}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-semibold shadow-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
