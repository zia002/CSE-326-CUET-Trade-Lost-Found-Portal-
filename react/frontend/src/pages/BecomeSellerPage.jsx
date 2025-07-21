import React from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";

const iconSrcs = {
  fashion: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  electronics: "https://cdn-icons-png.flaticon.com/512/833/833314.png",
  digital: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
  others: "https://cdn-icons-png.flaticon.com/512/1170/1170627.png",
  preowned: "https://cdn-icons-png.flaticon.com/512/4341/4341025.png",
};

const headings = {
  fashion: "👗 Sell New Fashion",
  electronics: "💻 Sell New Tech",
  digital: "🔗 Subscriptions", // Changed from "CUET Subs"
  others: "📦 Sell Other Items",
  preowned: "🔄 Sell Pre-Owned",
};

const descriptions = {
  fashion: "List brand-new clothes with original tags.",
  electronics: "Sell sealed gadgets at lowest prices.",
  digital: "Sell Netflix, YouTube, GPT accounts.", // Explicit examples
  others: "Post items not in other categories.",
  preowned: "Sell used items (mention condition).",
};

const BecomeSellerPage = () => {
  return (
    <section className="py-20 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Page Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Sell a Product
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose how you’d like to list your item on{" "}
            <span className=""> CUET Trade & Lost-Found Portal </span>.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link to="/post-fashion">
            <PostCard
              iconSrc={iconSrcs.fashion}
              heading={headings.fashion}
              description={descriptions.fashion}
            />
          </Link>

          <Link to="/post-electronics">
            <PostCard
              iconSrc={iconSrcs.electronics}
              heading={headings.electronics}
              description={descriptions.electronics}
            />
          </Link>

          <Link to="/post-digital">
            <PostCard
              iconSrc={iconSrcs.digital}
              heading={headings.digital}
              description={descriptions.digital}
            />
          </Link>

          <Link to="/post-others">
            <PostCard
              iconSrc={iconSrcs.others}
              heading={headings.others}
              description={descriptions.others}
            />
          </Link>

          <Link to="/post-pre-owned">
            <PostCard
              iconSrc={iconSrcs.preowned}
              heading={headings.preowned}
              description={descriptions.preowned}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BecomeSellerPage;
