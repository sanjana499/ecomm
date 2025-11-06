"use client";

import { useState } from "react";
import { Plus, Edit, Trash } from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function ChildCategoryPage() {
  const [childCategories, setChildCategories] = useState([
    { id: 1, name: "Casual Shoes", parent: "Footwear", status: "Active" },
    { id: 2, name: "Smart Watches", parent: "Accessories", status: "Inactive" },
  ]);

  const [newChild, setNewChild] = useState({ name: "", parent: "", status: "Active" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChild.name || !newChild.parent) return alert("Please fill all fields");

    setChildCategories([
      ...childCategories,
      { id: Date.now(), ...newChild },
    ]);
    setNewChild({ name: "", parent: "", status: "Active" });
  };

  const handleDelete = (id: number) => {
    setChildCategories(childCategories.filter((c) => c.id !== id));
  };

  return (

     <div className="flex bg-white text-gray-800 min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Topbar />
           

    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">
        Child Category Management
      </h1>

      {/* ✅ Add New Child Category */}
      <form
        onSubmit={handleAdd}
        className="bg-white shadow-md rounded-xl p-6 mb-8 max-w-2xl"
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" /> Add Child Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Child Category Name"
            value={newChild.name}
            onChange={(e) => setNewChild({ ...newChild, name: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Parent Category"
            value={newChild.parent}
            onChange={(e) => setNewChild({ ...newChild, parent: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          />
          <select
            value={newChild.status}
            onChange={(e) => setNewChild({ ...newChild, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
        >
          Add Child Category
        </button>
      </form>

      {/* ✅ Table Section */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">All Child Categories</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Name</th>
              <th className="pb-3">Parent</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {childCategories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-none">
                <td className="py-2">{cat.name}</td>
                <td className="py-2 text-gray-600">{cat.parent}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cat.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>
                <td className="py-2 flex gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
}
