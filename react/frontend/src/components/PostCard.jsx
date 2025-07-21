import React from "react";

const PostCard = ({ iconSrc, heading, description }) => {
  return (
    <div className="group bg-white w-80 p-8 rounded-xl text-center shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-blue-500/20 hover:-translate-y-1 flex flex-col items-center space-y-5 overflow-hidden relative">
      {/* Gradient background overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Image with smooth hover effect */}
      <div className="relative z-10 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
        <img
          src={iconSrc}
          alt="Icon"
          className="w-16 h-16 object-contain transition-all duration-500 group-hover:rotate-6 group-hover:scale-110"
        />
      </div>

      {/* Heading with subtle hover effect */}
      <h2 className="relative z-10 text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
        {heading}
      </h2>

      {/* Description with improved readability */}
      <p className="relative z-10 text-gray-600 leading-relaxed mb-2">
        {description}
      </p>

      {/* Decorative element that appears on hover */}
      <div className="relative z-10 w-16 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default PostCard;
