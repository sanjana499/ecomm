"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import Swal from "sweetalert2";

export default function AddOrderPage() {
  const [formData, setFormData] = useState({
    shipping_name: "",
    shipping_email: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_country: "",
    shipping_zip: "",
    notes: "",
    payment_method: "cod",
    order_status: "pending",
    products: [
      { product_id: "", name: "", price: "", quantity: "", color: "", size: "" },
    ],
  });

  interface Product {
    [key: string]: string;
    product_id: string;
    name: string;
    price: string;
    quantity: string;
    color: string;
    size: string;
  }
  
  type ProductField = 'product_id' | 'name' | 'price' | 'quantity' | 'color' | 'size';
  
  const handleProductChange = (index: number, field: ProductField, value: string) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;
    setFormData({ ...formData, products: updatedProducts });
  };
  

  const addProductRow = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { product_id: "", name: "", price: "", quantity: "", color: "", size: "" },
      ],
    });
  };

  const removeProductRow = (index: number) => {
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire("Success", "Order placed successfully!", "success");
      setFormData({
        shipping_name: "",
        shipping_email: "",
        shipping_phone: "",
        shipping_address: "",
        shipping_city: "",
        shipping_state: "",
        shipping_country: "",
        shipping_zip: "",
        notes: "",
        payment_method: "cod",
        order_status: "pending",
        products: [
          { product_id: "", name: "", price: "", quantity: "", color: "", size: "" },
        ],
      });
    } else {
      Swal.fire("Error", data.error || "Something went wrong.", "error");
    }
  };

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        
      </div>
    </div>
  );
}
