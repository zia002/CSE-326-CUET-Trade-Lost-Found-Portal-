import React from "react";
import PostProduct from "../components/PostProduct";

const PostLostPage = () => {
  return (
    <section className="py-20  min-h-screen">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Post a Lost Item
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🧭 Help others recover your lost belongings by filling out the form below. Be sure to include detailed information and contact.
          </p>
        </div>

        {/* PostProduct component for posting a lost item */}
        <PostProduct category="lost" />
      </div>
    </section>
  );
};

export default PostLostPage;
