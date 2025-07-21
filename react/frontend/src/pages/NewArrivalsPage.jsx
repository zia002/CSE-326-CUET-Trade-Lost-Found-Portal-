import React, { useState } from "react";
import { useFetchProductsQuery } from "../redux/features/products/productsApi";
import ProductCards from "../components/ProductCards";
import SearchBar from "../components/SearchBar";
import SortDropdown from "../components/SortDropdown";

// Category config
const categories = [
  { key: "fashion", label: "👗 Fashion & Lifestyle" },
  { key: "electronics", label: "📱 Electronics & Accessories" },
  { key: "digital", label: "💻 Digital Services" },
  { key: "others", label: "🧰 Other Essentials" },
];

function NewArrivalsPage() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();

  const [visibleCounts, setVisibleCounts] = useState({
    fashion: 4,
    electronics: 4,
    digital: 4,
    others: 4,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const newArrivalCategories = [
    { value: "fashion", label: "Fashion & Lifestyle" },
    { value: "electronics", label: "Electronics & Accessories" },
    { value: "digital", label: "Digital Services" },
    { value: "others", label: "Other Essentials" },
  ];

  const handleViewMore = (key) => {
    setVisibleCounts((prev) => ({
      ...prev,
      [key]: prev[key] + 4,
    }));
  };

  const getFilteredSortedProducts = (categoryKey) => {
    let filtered = products.filter((p) => p.category === categoryKey);

    if (selectedCategory && selectedCategory !== categoryKey) return [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    if (sortBy === "priceLowToHigh") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "priceHighToLow") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered.slice(0, visibleCounts[categoryKey]);
  };

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (isError) return <div className="text-center mt-20 text-red-500">Failed to load products.</div>;

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            All New Arrivals
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🎉 Discover the newest additions from your campus — gadgets,
            fashion, services, and more!
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 mb-10">
          <SearchBar
            categories={newArrivalCategories}
            onSearch={(query) => setSearchQuery(query)}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
          />
          <SortDropdown onSortChange={(sort) => setSortBy(sort)} />
        </div>

        {/* Render Each Category */}
        {categories.map(({ key, label }) => {
          const displayProducts = getFilteredSortedProducts(key);

          if (displayProducts.length === 0) return null;

          return (
            <div key={key} className="mb-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{label}</h2>
              <ProductCards products={displayProducts} categories={[key]} />

              {visibleCounts[key] <
                products.filter((p) => p.category === key).length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => handleViewMore(key)}
                    className="px-6 py-3 border-2 border-blue-700 text-blue-700 font-semibold rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    View More
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default NewArrivalsPage;
