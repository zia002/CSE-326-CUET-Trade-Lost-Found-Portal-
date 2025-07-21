import React, { useState } from "react";
import { useFetchProductsQuery } from "../redux/features/products/productsApi";
import ProductCards from "../components/ProductCards";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";

const ITEMS_PER_PAGE = 8;

function PreOwnedProductsPage() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();
  const preOwnedProducts = products.filter((p) => p.category === "pre-owned");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load products.
      </div>
    );

  // Filtered + sorted products
  const filteredProducts = preOwnedProducts
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLowToHigh") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHighToLow") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <section className="py-20  min-h-screen">
      <div className="container mx-auto px-6">
        {/* Page Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            All Pre-Owned Products
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            ♻️ Buy smart, buy second-hand. These campus deals are gently used,
            budget-friendly, and ready for a second chance!
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 mb-10">
          <SearchBar categories={[]} onSearch={handleSearch} />
          <SortDropdown onSortChange={handleSortChange} />
        </div>

        {/* Product Grid */}
        <ProductCards products={paginatedProducts} categories={["pre-owned"]} />

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-full border border-blue-600 font-semibold transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white hover:scale-105"
            }`}
          >
            ← Previous
          </button>

          <span className="text-blue-800 font-semibold text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-full border border-blue-600 font-semibold transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-blue-700 hover:bg-blue-700 hover:text-white hover:scale-105"
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}

export default PreOwnedProductsPage;
