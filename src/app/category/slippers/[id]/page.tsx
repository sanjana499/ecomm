"use client";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { ShoppingCart, User, Menu ,ChevronDown, ChevronRight } from "lucide-react"; // ✅ ADDED ICON IMPORTS
import Link from "next/link";

export default function SlippersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ ADDED STATE
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  // 🔹 Selected Filter States
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Failed to load products");
        const { products, filters } = await res.json();
        setProducts(products);
        setFilters(filters);
      } catch {
        Swal.fire("Error", "Something went wrong while loading products", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

    useEffect(() => {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch(() =>
          Swal.fire("Error", "Failed to load categories", "error")
        );
    }, []);

  // 🔹 Apply Filters
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const price = Number(item.offerPrice ?? item.price);
      const inPriceRange = price >= priceRange[0] && price <= priceRange[1];

      const matchColor = selectedColor ? item.color === selectedColor : true;
      const matchSize = selectedSize ? item.size === selectedSize : true;
      const matchDiscount = selectedDiscount
        ? Math.round(((Number(item.price) - Number(item.offerPrice)) / Number(item.price)) * 100) ===
        parseInt(selectedDiscount)
        : true;
      const matchType = selectedType ? item.type === selectedType : true;
      const matchGender = selectedGender ? item.gender === selectedGender : true;
      const matchCategory = selectedCategory ? item.category_id == selectedCategory : true;

      return inPriceRange && matchColor && matchSize && matchDiscount && matchType && matchGender && matchCategory;
    });
  }, [
    products,
    priceRange,
    selectedColor,
    selectedSize,
    selectedDiscount,
    selectedType,
    selectedGender,
    selectedCategory,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔹 Navbar */}
      <nav className="w-full flex items-center justify-between border-b border-gray-200 dark:border-zinc-700 pb-2">
          <div className="flex items-center h-5">
            <div className="relative w-[100px] h-[100px]">
              {/* Optional logo */}
            </div>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
              ShopEase
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-6 relative">
            {["Home", "Contact"].map((item) => (
              <a
                key={item}
                href="/"
                className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
              >
                {item}
              </a>
            ))}

            {/* Category Dropdown */}
            <div
              className="relative z-50"
              onMouseEnter={() => {
                clearTimeout((window as any).dropdownTimer);
                setOpenDropdown(true);
              }}
              onMouseLeave={() => {
                (window as any).dropdownTimer = setTimeout(() => {
                  setOpenDropdown(false);
                  setActiveCategory(null);
                }, 150);
              }}
            >
              <button
                className="flex items-center text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
                onClick={() => setOpenDropdown(!openDropdown)}
              >
                Categories
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${openDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openDropdown && (
                <div className="absolute left-0 mt-2 flex bg-white dark:bg-zinc-800 rounded-lg shadow-lg border dark:border-zinc-700 z-50">
                  {/* Left - main categories */}
                  <div className="w-44 border-r dark:border-zinc-700">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${activeCategory === cat.name
                          ? "bg-blue-100 dark:bg-zinc-700 text-blue-700"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-zinc-700"
                          }`}
                        onMouseEnter={() => setActiveCategory(cat.name)}
                      >
                        {cat.name}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>

                  {/* Right - subcategories */}
                  {activeCategory && (
                    <div className="w-52">
                      {categories
                        .find((cat) => cat.name === activeCategory)
                        ?.subcategories.map((sub: any) => (
                          <Link
                            key={sub.id}
                            href={`/category/slippers/${sub.id}`} // ✅ correct dynamic route
                            className="block px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-100 dark:hover:bg-zinc-700"
                            onClick={() => setOpenDropdown(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            <a
              href="/login"
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600"
            >
              Login
            </a>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden md:block border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            />

            <button className="relative">
              <ShoppingCart className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                2
              </span>
            </button>
            <button>
              <User className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-200" />
            </button>
          </div>
        </nav>

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="w-full flex flex-col mt-4 md:hidden border-t border-gray-200 dark:border-zinc-700 pt-3 space-y-3 mb-6">
          {["Home", "Men's", "Women's", "Contact"].map((item) => (
            <a key={item} href="#" className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600">
              {item}
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* 🔹 Sidebar Filters */}
        <aside className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Filters</h2>

          {[
            { label: "Category", value: selectedCategory, set: setSelectedCategory, list: filters.categories || [] },
            { label: "Color", value: selectedColor, set: setSelectedColor, list: filters.colors || [] },
            { label: "Size", value: selectedSize, set: setSelectedSize, list: filters.sizes || [] },
            { label: "Discount", value: selectedDiscount, set: setSelectedDiscount, list: filters.discounts || [] },
          ].map((filter) => (
            <div key={filter.label} className="mb-4">
              <label className="font-medium text-gray-700 block mb-1">{filter.label}</label>
              <select
                value={filter.value || ""}
                onChange={(e) => filter.set(e.target.value)}
                className="w-full border border-gray-200 rounded p-2"
              >
                <option value="">All</option>
                {filter.list.map((v: any, i: number) => (
                  <option key={`${filter.label}-${i}`} value={String(v ?? "")}>
                    {String(v ?? "")}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="mb-4">
            <h3 className="font-medium mb-2">Gender</h3>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full border border-gray-200 rounded p-2 text-sm"
            >
              <option value="">Select Gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Type</h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border border-gray-200 rounded p-2 text-sm"
            >
              <option value="">Select Type</option>
              <option value="casual">Casual</option>
              <option value="sports">Sports</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="font-medium text-gray-700 block mb-1">Price Range (₹)</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-1/2 border border-gray-200 rounded p-2"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-1/2 border border-gray-200 rounded p-2"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedColor("");
              setSelectedSize("");
              setSelectedDiscount("");
              setSelectedType("");
              setSelectedGender("");
              setSelectedCategory("");
              setPriceRange([0, 999999]);
            }}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 rounded p-2"
          >
            Reset Filters
          </button>
        </aside>

        {/* 🔹 Product Grid */}
        <main className="flex-1">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading products...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No products found</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((item) => (
                <Link
                  href={`/product/${item.id}`}
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer block"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-56 mb-3">
                    <Image
                      src={
                        item.img?.startsWith("/upload")
                          ? item.img
                          : `/upload/${item.img}`
                      }
                      alt={item.title || "Product"}
                      fill
                      className="object-contain rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {item.title}
                  </h3>

                  {/* ✅ Description (short preview) */}
                  {item.desc || item.description ? (
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {item.desc || item.description}
                    </p>
                  ) : null}

                  {/* Price Section */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-600 font-bold text-base">
                      ₹{item.offerPrice ?? item.price}
                    </span>
                    {item.offerPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  {/* Extra Details */}
                  {item.color && (
                    <span className="text-xs text-gray-600 block">
                      Color: {item.color}
                    </span>
                  )}
                  {item.size && (
                    <span className="text-xs text-gray-600 block">
                      Size: {item.size}
                    </span>
                  )}
                  {item.type && (
                    <span className="text-xs text-gray-600 block">
                      Type: {item.type}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
