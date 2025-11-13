"use client";
import { useState } from "react";
import Swal from "sweetalert2";

interface Product {
  title: string;
  img: string;
  color: string;
  size: string;
  quantity: string;
  price: string;
  offerPrice: string;
  desc: string;
  category: string;
}

export default function AddProductPage() {
  // ✅ State for form
  const [form, setForm] = useState<Product>({
    title: "",
    img: "",
    color: "",
    size: "",
    quantity: "",
    price: "",
    offerPrice: "",
    desc: "",
    category: "",
  });

  // ✅ Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire("✅ Success!", data.message, "success");
      setForm({
        title: "",
        img: "",
        color: "",
        size: "",
        quantity: "",
        price: "",
        offerPrice: "",
        desc: "",
        category: "",
      });
    } else {
      Swal.fire("❌ Error", data.error || "Something went wrong", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {(Object.keys(form) as (keyof Product)[]).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
