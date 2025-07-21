import React, { useState } from "react";
import { useFetchProductsQuery } from "../redux/features/products/productsApi";
import ProductCards from "../components/ProductCards";
import SearchBar from "../components/SearchBar";
import { Link } from "react-router-dom";

function LostFoundProductsPage() {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();

  const LOST_COUNT = 4;
  const FOUND_COUNT = 4;

  const [visibleLost, setVisibleLost] = useState(LOST_COUNT);
  const [visibleFound, setVisibleFound] = useState(FOUND_COUNT);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (isLoading) return <div className="text-center mt-20">Loading...</div>;
  if (isError)
    return (
      <div className="text-center mt-20 text-red-500">
        Failed to load products.
      </div>
    );

  const lostFoundCategories = [
    { value: "lost", label: "Lost Items" },
    { value: "found", label: "Found Items" },
  ];

  const handleViewMoreLost = () => setVisibleLost((prev) => prev + LOST_COUNT);
  const handleViewMoreFound = () =>
    setVisibleFound((prev) => prev + FOUND_COUNT);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
    setVisibleLost(LOST_COUNT);
    setVisibleFound(FOUND_COUNT);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleLost(LOST_COUNT);
    setVisibleFound(FOUND_COUNT);
  };

  const filterItems = (category) => {
    let filtered = products.filter((p) => p.category === category);

    if (selectedCategory && selectedCategory !== category) return [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    return filtered;
  };

  const lostItems = filterItems("lost");
  const foundItems = filterItems("found");

  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Lost & Found Items
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🧭 Reconnect with your belongings — report or recover lost items
            around campus.
          </p>
        </div>

        {/* Search Bar and Post Button */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 mb-10">
          <SearchBar
            categories={lostFoundCategories}
            placeholder="Have you lost or found something?"
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
          />
          <Link
            to="/post-lost-found"
            className="inline-block px-6 py-3 bg-blue-700 text-white font-medium rounded-full shadow-md hover:bg-blue-800 transition duration-200"
          >
            Post Lost/Found Item
          </Link>
        </div>

        {/* LOST Section */}
        {lostItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              🚨 Lost Items
            </h2>
            <ProductCards
              products={lostItems.slice(0, visibleLost)}
              categories={["lost"]}
            />

            {visibleLost < lostItems.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleViewMoreLost}
                  className="px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  View More Lost Items
                </button>
              </div>
            )}
          </div>
        )}

        {/* FOUND Section */}
        {foundItems.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              🟢 Found Items
            </h2>
            <ProductCards
              products={foundItems.slice(0, visibleFound)}
              categories={["found"]}
            />

            {visibleFound < foundItems.length && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleViewMoreFound}
                  className="px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  View More Found Items
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default LostFoundProductsPage;
