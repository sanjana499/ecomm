"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";

export default function EditAddressPage() {
  const router = useRouter();

  // ✅ Get dynamic route param the correct way
  const { id } = useParams();  // <-- This is the correct fix!

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

  if (!address) return <p>Loading...</p>;

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Address</h2>

      <input id="edit-name" defaultValue={address.name} className="border p-2 w-full mb-3" />
      <input id="edit-phone" defaultValue={address.phone} className="border p-2 w-full mb-3" />
      <input id="edit-flat" defaultValue={address.flat_no} className="border p-2 w-full mb-3" />
      <input id="edit-address" defaultValue={address.address} className="border p-2 w-full mb-3" />
      <input id="edit-city" defaultValue={address.city} className="border p-2 w-full mb-3" />
      <input id="edit-state" defaultValue={address.state} className="border p-2 w-full mb-3" />
      <input id="edit-pincode" defaultValue={address.pincode} className="border p-2 w-full mb-3" />

      <button
        onClick={updateAddress}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
