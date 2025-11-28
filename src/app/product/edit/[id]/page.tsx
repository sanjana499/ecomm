"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();

  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    price: "",
    offerPrice: "",
    quantity: "",
    description: "",
    desc: "",
    color: "",
    size: "",
    type: "",
    gender: "",
    category_id: "",
    sub_category_id: "",
    img: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ Load product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/product/${id}`);
        const data = await res.json();
        const p = data.product || data;
        console.log("PRODUCT FROM API ===>", p);

        setForm({
          title: p.title || "",
          category_id: p.category_id?.toString() || "",
          sub_category_id: p.sub_category_id?.toString() || "",
          price: p.price || "",
          offerPrice: p.offerPrice || "",
          quantity: p.quantity || "",
          description: p.description || "",
          desc: p.desc || "",
          color: p.color || "",
          size: p.size || "",
          type: p.type || "",
          gender: p.gender || "",
          img: null,
        });
        fetchSubcategories(p.category_id);

        setPreview(p.img || null);
        // ⭐ Load subcategories for selected category
        if (p.category_id) {
          fetchSubcategories(p.category_id);
        }
      } catch {
        Swal.fire("Error", "Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  // ✅ Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, img: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "img" && value instanceof File) formData.append("img", value);
        else if (typeof value === "string") formData.append(key, value);
      });

      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire("Success", "Product updated successfully", "success");
        router.push("/product");
      } else {
        Swal.fire("Error", data.error || "Update failed", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (loading) return <div className="p-4">Loading product...</div>;

  return (
    <div className="flex bg-gray-50 text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ 3 columns grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Dropdown */}
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
                value={form.category_id}
                onChange={(e) => {
                  const selectedCategory = e.target.value;

                  setForm({
                    ...form,
                    category_id: selectedCategory,
                    sub_category_id: "",   // reset
                  });

                  fetchSubcategories(selectedCategory); // load subcategories
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
                value={form.sub_category_id}
                onChange={(e) =>
                  setForm({ ...form, sub_category_id: e.target.value })
                }
                disabled={!form.category_id}    // disable until category chosen
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Title"
                className="border p-2 rounded w-full"
                required
              />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded w-full"
              />
              <input
                name="offerPrice"
                value={form.offerPrice}
                onChange={handleChange}
                placeholder="Offer Price"
                className="border p-2 rounded w-full"
              />
              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="border p-2 rounded w-full"
              />
              {/* <input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Color"
                className="border p-2 rounded w-full"
              /> */}
              <select
                className="border p-2 rounded w-full"
                value={form.color}
                onChange={(e) =>
                  setForm({ ...form, color: e.target.value })
                }
              >
                <option value="">Select Color</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Brown">Brown</option>
                <option value="Grey">Grey</option>
              </select>

              {/* <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="Size"
                className="border p-2 rounded w-full"
              /> */}

              <select
                className="border p-2 rounded w-full"
                value={form.size}
                onChange={(e) =>
                  setForm({ ...form, size: e.target.value })
                }
              >
                <option value="">Select Size</option>
                {["S", "M", "L", "XL", "XXL", "XXXL"].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>


              {/* ✅ Type dropdown */}
              <div>
                <label className="block mb-1 text-sm font-medium">Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Type</option>
                  <option value="casual">Casual</option>
                  <option value="sports">Sports</option>
                  <option value="formal">Formal</option>
                  <option value="party">Party</option>
                </select>
              </div>

              {/* ✅ Gender dropdown */}
              <div>
                <label className="block mb-1 text-sm font-medium">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Gender</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>

            {/* ✅ Description Fields */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short Description"
              className="border p-2 rounded w-full"
            />

            <textarea
              name="desc"
              value={form.desc}
              onChange={handleChange}
              placeholder="Full Description"
              className="border p-2 rounded w-full h-28"
            />

            {/* ✅ Image Upload */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Product Image
              </label>
              <input type="file" onChange={handleFileChange} accept="image/*" />
              {preview && (
                <img
                  src={
                    preview.startsWith("/uploads")
                      ? preview
                      : `/api/images${preview}`
                  }
                  alt="Preview"
                  className="w-24 h-24 mt-2 object-cover rounded border"
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
