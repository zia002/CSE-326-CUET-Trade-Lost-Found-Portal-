import React from "react";
import { useParams, Link } from "react-router-dom";
import ProductDetailsCard from "../components/ProductDetailsCard";
import LostFoundSection from "../pages/home/LostFoundSection";
import NewArrivalSection from "./home/NewArrivalSection";
import PreOwnedSection from "./home/PreOwnedSection";
import { useFetchProductByIdQuery } from "../redux/features/products/productsApi";
function ProductDetailsPage() {
  const { id } = useParams();
  const { data: product, isLoading, error } = useFetchProductByIdQuery(id);

  const isNewArrival =
    product &&
    ["fashion", "electronics", "digital", "others"].includes(product.category);
  const isPreOwned = product && product.category === "pre-owned";
  const isLostFound = product && ["lost", "found"].includes(product.category);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-blue-700 text-xl">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-xl">
          Product not found or server error
        </p>
      </div>
    );
  }


  return (
    <>
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Page Heading */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
              Product Details
            </h1>
          </div>

          {/* Product Details Card */}
          <ProductDetailsCard product={product} />
        </div>
      </section>

      {/* Related Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
              Explore Related Products
            </h2>
          </div>

          {isNewArrival && <NewArrivalSection />}
          {isPreOwned && <PreOwnedSection />}
          {isLostFound && <LostFoundSection />}

          <div className="mt-10 flex justify-center">
            <Link
              to={
                isNewArrival
                  ? "/new-arrivals"
                  : isPreOwned
                  ? "/pre-owned-products"
                  : "/lost-found-products"
              }
              className="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:bg-blue-700 hover:text-white hover:scale-105 shadow-md"
            >
              Show All Related Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetailsPage;
