"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = useParams();
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function loadAddress() {
      const res = await fetch(`/api/address/${id}`);
      const data = await res.json();
      setAddress(data);
    }
    loadAddress();
  }, [id]);

  const updateAddress = async () => {
    const payload = {
      id,
      name: (document.getElementById("edit-name") as any).value,
      phone: (document.getElementById("edit-phone") as any).value,
      flat_no: (document.getElementById("edit-flat") as any).value,
      address: (document.getElementById("edit-address") as any).value,
      city: (document.getElementById("edit-city") as any).value,
      state: (document.getElementById("edit-state") as any).value,
      pincode: (document.getElementById("edit-pincode") as any).value,
    };

    const res = await fetch(`/api/address/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.message) {
      Swal.fire("Updated!", "Address updated successfully", "success");
      router.push("/checkout");
    } else {
      Swal.fire("Error", data.error || "Failed to update");
    }
  };

  if (!address) return <p className="text-center mt-10">Loading...</p>;

  return (

    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />

        <div className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
          <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Edit Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-gray-600 font-medium">Full Name</label>
                <input
                  id="edit-name"
                  defaultValue={address.name}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-600 font-medium">Phone</label>
                <input
                  id="edit-phone"
                  defaultValue={address.phone}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Flat */}
              <div>
                <label className="text-gray-600 font-medium">Flat / House No.</label>
                <input
                  id="edit-flat"
                  defaultValue={address.flat_no}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-gray-600 font-medium">Address</label>
                <input
                  id="edit-address"
                  defaultValue={address.address}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-gray-600 font-medium">City</label>
                <input
                  id="edit-city"
                  defaultValue={address.city}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* State */}
              <div>
                <label className="text-gray-600 font-medium">State</label>
                <input
                  id="edit-state"
                  defaultValue={address.state}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pincode */}
              <div className="md:col-span-2">
                <label className="text-gray-600 font-medium">Pincode</label>
                <input
                  id="edit-pincode"
                  defaultValue={address.pincode}
                  className="border rounded-lg p-3 w-full mt-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => router.push("/checkout")}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={updateAddress}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
