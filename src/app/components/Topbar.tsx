import { Search } from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm p-4 flex items-center justify-between">
      <h1 className="text-gray-700 font-semibold text-lg">
        Welcome E-commerce Dashboard
      </h1>
      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-gray-600"
        />
        <Search className="text-green-700" size={18} />
      </div>
    </div>
  );
}
