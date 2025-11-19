"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 10;

    useEffect(() => {
        fetch("/api/customers")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setCustomers(data);
                } else {
                    setCustomers([]);
                }
            })
            .catch(() => setCustomers([]));
    }, []);

    // -------------------------
    // FILTERED DATA
    // -------------------------
    const filteredData = customers.filter((c) => {
        return (
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase()) ||
            c.country?.toLowerCase().includes(search.toLowerCase())
        );
    });

    // -------------------------
    // PAGINATION LOGIC
    // -------------------------
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filteredData.slice(startIndex, startIndex + pageSize);

    // -------------------------
    // SORT BASED ON customerId (ASC)
    // -------------------------
    const sortedCustomers = [...paginated].sort(
        (a, b) => a.customerId - b.customerId
    );

    return (
        <div className="flex bg-white text-gray-800 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Topbar />
                <div className="p-6">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-4">

                        {/* Search Input */}
                        <div className="relative w-64">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search customers..."
                                className="border px-4 py-2 rounded-lg w-full pr-10"
                            />

                            {search && (
                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setCurrentPage(1);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <select className="border px-4 py-2 rounded-lg">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>

                            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg">
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Customer Table */}
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4"><input type="checkbox" /></th>
                                    <th className="p-4 text-left">CUSTOMER</th>
                                    <th className="p-4 text-left">CUSTOMER ID</th>
                                    <th className="p-4 text-left">COUNTRY</th>
                                    <th className="p-4 text-left">ORDER</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedCustomers.map((c: any, i: number) => (
                                    <tr key={c.id} className="border-t hover:bg-gray-50 transition">

                                        <td className="p-4"><input type="checkbox" /></td>

                                        {/* Customer */}
                                        <td className="p-4 flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold">{c.name}</p>
                                                <p className="text-gray-500 text-xs">{c.email}</p>
                                            </div>
                                        </td>

                                        {/* 2-digit Customer ID (serial based on sorted customerId) */}
                                        <td className="p-4 text-gray-700 font-medium">
                                            {(i + 1).toString().padStart(2, "0")}
                                        </td>

                                        {/* Country */}
                                        <td className="p-4 flex items-center gap-2">
                                            {c.countryCode ? (
                                                <Image
                                                    width={20}
                                                    height={20}
                                                    src={`https://flagsapi.com/${c.countryCode.toUpperCase()}/flat/32.png`}
                                                    alt={c.country}
                                                />
                                            ) : "N/A"}

                                            <span>{c.country}</span>
                                        </td>

                                        {/* Orders */}
                                        <td className="p-4 font-semibold text-gray-700">
                                            {c.orders}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex gap-2 mt-4 justify-end">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <span className="px-3 py-2 bg-gray-100 rounded">
                            Page {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
