import React from "react";
import Banner from "./Banner";
import HeroSection from "./HeroSection";
import NewArrivalSection from "./NewArrivalSection";
import LostFoundSection from "./LostFoundSection";
import PreOwnedSection from "./PreOwnedSection";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Banner />
      <HeroSection />
      <section className="py-10 ">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              🆕 Discover the latest additions from your campus community — from
              digital essentials to trendy fashion items.
            </p>
          </div>

          {/* Product Grid */}
          <NewArrivalSection />

          {/* View All Button */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/new-arrivals"
              className="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:bg-blue-700 hover:text-white hover:scale-105 shadow-md"
            >
              Show All New Arrivals
            </Link>
          </div>
        </div>
      </section>
      <section className="py-10 ">
        <div className="container mx-auto px-6">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
              Pre-Owned Deals
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              ♻️ Reuse, save, and shop smart with quality second-hand items
              listed by your campus community.
            </p>
          </div>

          {/* Product Grid */}
          <PreOwnedSection />

          {/* View All Button */}
          <div className="mt-10 flex justify-center">
            <Link
              to="/pre-owned-products"
              className="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:bg-blue-700 hover:text-white hover:scale-105 shadow-md"
            >
              Show All Pre-Owned Products
            </Link>
          </div>
        </div>
      </section>

    <section className="py-10 ">

      <div className="container mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
            Lost & Found
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🔍 Help your community recover valuable items or report ones you’ve found around campus.
          </p>
        </div>

        {/* Product Grid */}
        <LostFoundSection />

        {/* View All Button */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/lost-found-products"
            className="px-6 py-3 bg-white text-blue-700 border border-blue-700 rounded-full text-lg font-semibold transition-all duration-300 transform hover:bg-blue-700 hover:text-white hover:scale-105 shadow-md"
          >
            Show All Lost & Found Products
          </Link>
        </div>
      </div>
      
    </section>
    </>
  );
}

export default Home;
