import React from "react";

const cards = [
  {
    id: 1,
    icon: "🛍️",
    title: "Buy Smart",
    description: "Great campus deals at affordable prices.",
    glow: "shadow-[0_0_25px_rgba(34,197,94,0.3)]", // green glow
    border: "border-green-400",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    id: 2,
    icon: "📦",
    title: "Sell Easily",
    description: "List your items instantly for others to discover.",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.3)]", // blue glow
    border: "border-blue-400",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    id: 3,
    icon: "💸",
    title: "Smart Bidding",
    description: "Join auctions & grab top picks on a budget.",
    glow: "shadow-[0_0_25px_rgba(250,204,21,0.3)]", // yellow glow
    border: "border-yellow-400",
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    id: 4,
    icon: "🔍",
    title: "Lost & Found",
    description: "Report or retrieve lost items around campus.",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.3)]", // purple glow
    border: "border-purple-400",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
];

function HeroSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`
                p-6 rounded-2xl ${card.bg} border ${card.border} 
                text-center ${card.glow}
                transition-all transform hover:-translate-y-3 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]
                duration-300
              `}
            >
              <div
                className={`w-16 h-16 mb-4 flex items-center justify-center rounded-full ${card.iconBg} text-2xl mx-auto shadow-inner`}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
