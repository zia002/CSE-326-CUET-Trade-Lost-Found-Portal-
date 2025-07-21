import React from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const iconSrcs = {
  lost: "https://png.pngtree.com/png-clipart/20231116/original/pngtree-lost-rubber-stamp-confused-photo-png-image_13586483.png",
  found:
    "https://png.pngtree.com/png-clipart/20231116/original/pngtree-found-rubber-stamp-photo-png-image_13591794.png",
};

const headings = {
  lost: "Lost an Item?",
  found: "Found an Item?",
};

const descriptions = {
  lost: "Report any items you’ve lost on campus and help us reunite them with their rightful owner!",
  found: "Found something? Let others know and help them reclaim their lost belongings.",
};

const PostLostFoundPage = () => {
  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Page Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Lost & Found — Reconnect with Your Belongings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Have you lost or found something? Use this page to report missing
            items or claim found items from around campus. Let’s work together
            to help you reconnect!
          </p>
        </div>

        {/* Lost and Found Options */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Lost Item Section */}
          <Link to="/post-lost">
            <PostCard
              iconSrc={iconSrcs.lost}
              heading={headings.lost}
              description={descriptions.lost}
            />
          </Link>

          {/* Found Item Section */}
          <Link to="/post-found">
            <PostCard
              iconSrc={iconSrcs.found}
              heading={headings.found}
              description={descriptions.found}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PostLostFoundPage;
