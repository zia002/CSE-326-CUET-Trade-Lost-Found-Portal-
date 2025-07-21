function SortDropdown({ onSortChange }) {
  return (
    <div className="relative">
      <select
        defaultValue=""
        onChange={(e) => onSortChange && onSortChange(e.target.value)}
        className="bg-white mx-2 px-4 py-3 border border-gray-300 rounded-full text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-indigo-50 transition-colors"
      >
        <option value="" disabled>
          Sort by
        </option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
    </div>
  );
}

export default SortDropdown;
