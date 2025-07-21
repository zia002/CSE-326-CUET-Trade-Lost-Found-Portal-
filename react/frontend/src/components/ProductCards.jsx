import React from "react";
import { Link } from "react-router-dom";

function getTimeLeft(expiresAt) {
  if (!expiresAt) return null;

  const now = new Date();
  const target = new Date(expiresAt);
  const diff = target - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function ProductCards({ products, categories }) {
  const finalProducts = products.filter((p) => categories.includes(p.category));

  return (
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {finalProducts.map((product) => (
          <div
            key={product._id}
            className={`bg-gray-50 rounded-2xl overflow-hidden group relative
  shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-200
  hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:border-blue-200
  transition-all duration-300 transform hover:-translate-y-1`}
          >
            <Link to={`/products/${product._id}`} className="block">
              {/* Image & badges */}
              <div className="relative">
                <img
                  src={product.imageURL}
                  alt={product.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                  {product.category === "pre-owned"
                    ? "Pre-Owned"
                    : product.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-600 font-medium line-clamp-2">
                  {product.description || "No description available."}
                </p>

                {/* Price Section */}
                {product.price && (
                  <p className="text-green-600 font-bold mt-2 text-base md:text-lg">
                    ৳ {product.price}
                    {product.category === "pre-owned" && (
                      <span className="text-gray-500 text-sm font-medium ml-1">
                        (Asking Price)
                      </span>
                    )}
                    {product.perWhich && product.category !== "pre-owned" && (
                      <span className="text-gray-500 text-sm font-medium ml-1">
                        per {product.perWhich}
                      </span>
                    )}
                  </p>
                )}

                {/* Ends In */}
                {product.category === "pre-owned" && product.expiresAt && (
                  <p className="text-red-600 font-semibold text-sm mt-1">
                    {getTimeLeft(product.expiresAt) === "Expired" ? (
                      <span className="text-red-500 font-bold">
                        ⚠️ Auction Ended
                      </span>
                    ) : (
                      <>
                        Ends in:{" "}
                        <span className="font-bold">
                          {getTimeLeft(product.expiresAt)}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCards;
