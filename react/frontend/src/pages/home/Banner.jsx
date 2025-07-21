import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import backImg from "../../assets/landing.jpg";
import { BiKey } from "react-icons/bi";

const slides = [
  {
    icon: "🛍️",
    title: "Buy Smart",
    description: "Great campus deals at affordable prices.",
    gradient: "from-green-100 to-green-50",
  },
  {
    icon: "📦",
    title: "Sell Easily",
    description: "List your items instantly for others to discover.",
    gradient: "from-blue-100 to-blue-50",
  },
  {
    icon: "💸",
    title: "Smart Bidding",
    description: "Join auctions & grab top picks on a budget.",
    gradient: "from-orange-100 to-orange-50",
  },
  {
    icon: "🔍",
    title: "Lost & Found",
    description: "Report or retrieve lost items around campus.",
    gradient: "from-purple-100 to-purple-50",
  },
];

export default function Banner() {
  return (
    <section
      className="container mx-auto px-6 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${backImg})`,
        minHeight: "500px", // increased min height
        marginTop: "10px",
        borderRadius: "2rem",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-sm z-0" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-20 z-0" />

      {/* Main container aligned with navbar */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-stretch justify-between gap-10 h-full">
        {/* Left Text */}
        <div className="flex-1 flex flex-col justify-center text-center lg:text-left h-full">
          <p className="text-lg font-semibold text-blue-700 uppercase tracking-wider mb-4">
            CUET Trade & Lost-Found Portal
          </p>
          <h1 className="text-6xl sm:text-7xl lg:text-7xl font-extrabold text-blue-900 mb-6 leading-tight">
            Buy, Sell & <br />
            <span className="underline decoration-blue-500 decoration-4 underline-offset-4">
              Discover
            </span>
          </h1>
          <p className="text-gray-700 text-xl leading-relaxed italic mb-10">
            🔍 From found wallets to for-sale tablets — it's all here. Explore,
            trade, and reconnect with your campus community easily.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link
              to="/new-arrivals"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Explore Products
            </Link>
            <Link
              to="/lost-found-products"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-xl font-semibold shadow-lg transition-transform transform hover:scale-105"
            >
              Report Lost/Found
            </Link>
          </div>
        </div>

        {/* Right Carousel */}
        <div className="flex-1 flex justify-center items-center lg:justify-end h-full">
          <div className="w-full max-w-[500px] h-full flex items-center">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              slidesPerView={1}
              spaceBetween={30}
              className="flex-1"
            >
              {slides.map(({ title, icon, description, gradient }, idx) => (
                <SwiperSlide key={idx} className="flex h-full">
                  <div
                    className={`bg-gradient-to-br ${gradient} rounded-[5rem] text-center shadow-xl border border-white/40 backdrop-blur-md flex flex-col items-center justify-center px-8 py-20 w-full h-full self-center gap-5`}
                  >
                    <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-full bg-white/80 text-3xl shadow-inner">
                      {icon}
                    </div>
                    <h4 className="text-3xl font-bold text-blue-900 mb-3">
                      {title}
                    </h4>
                    <p className="text-lg text-gray-700 max-w-xs">
                      {description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
