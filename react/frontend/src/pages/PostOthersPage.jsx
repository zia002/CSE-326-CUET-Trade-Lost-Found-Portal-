import React from "react";
import PostProduct from "../components/PostProduct";

const PostOthersPage = () => {
  return (
    <section className="py-20  min-h-screen">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Post a Random Item
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🟢 Have you found something? Help others reclaim their belongings by filling out the details below.
          </p>
        </div>

        {/* PostProduct component for posting a found item */}
        <PostProduct category="others" />
      </div>
    </section>
  );
};

export default PostOthersPage;
