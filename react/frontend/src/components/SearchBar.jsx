import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function SearchBar({ categories = [], placeholder = "What are you looking for?", onSearch, onCategoryChange }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center flex-grow bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm"
    >
      {categories.length > 0 && (
        <>
          <select
            className="px-4 py-4 text-lg text-gray-700 bg-transparent focus:outline-none"
            defaultValue=""
            onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <div className="h-6 border-l border-gray-300 mx-2"></div>
        </>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-8 py-4 text-lg placeholder-gray-600 focus:outline-none"
      />

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-5 h-7 rounded-full text-lg font-semibold flex items-center gap-1 mr-2 cursor-pointer"
      >
        <FaSearch className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}

export default SearchBar;
