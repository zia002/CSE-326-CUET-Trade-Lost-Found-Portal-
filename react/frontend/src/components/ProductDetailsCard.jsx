import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/features/cart/cartSlice";
import { useGetSignedInUserQuery } from "../redux/features/auth/authApi";
import { getBaseURL } from "../utils/baseURL";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiAward,
  FiDollarSign,
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiLoader,
  FiShoppingCart,
  FiZap,
} from "react-icons/fi";

const ProductDetailsCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: user } = useGetSignedInUserQuery();
  const [product, setProduct] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidUsers, setBidUsers] = useState({});
  const [isWinner, setIsWinner] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningPrice, setWinningPrice] = useState(null);
  const [selectedSize, setSelectedSize] = useState("regular");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          if (data.winningBid?.user === user?._id) {
            setIsWinner(true);
          }
          setWinner(data.winningBid?.user);
          setWinningPrice(data.winningBid?.biddingPrice);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id, user?._id]);

  useEffect(() => {
    if (!product?.expiresAt || product.category !== "pre-owned") return;

    const updateCountdown = () => {
      const targetTime = new Date(product.expiresAt);
      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCountdown("Auction expired");
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [product?.expiresAt, product?.category]);

  useEffect(() => {
    if (!product?.bids?.length) return;

    const fetchBidUsers = async () => {
      const uniqueUserIds = [...new Set(product.bids.map((b) => b.user))];
      const results = {};

      await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            const res = await fetch(`${getBaseURL()}/api/auth/users/${userId}`);
            const data = await res.json();
            if (res.ok) results[userId] = data;
          } catch (err) {
            console.error(`Failed to fetch user ${userId}`, err);
          }
        })
      );
      setBidUsers(results);
    };
    fetchBidUsers();
  }, [product?.bids]);

  const handleAddToCart = async () => {
    if (!user) return alert("Please log in to add items to your cart.");

    setIsAddingToCart(true);
    try {
      const price = isWinner ? winningPrice : product.price;

      const res = await fetch(`${getBaseURL()}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          price: price,
          size: selectedSize,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(addToCart({ ...product, id: product._id }));
        alert("Added to cart successfully!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Network error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    const quantity = 1;
    const totalPrice =
      (winner === user?._id ? winningPrice : product.price) * quantity;

    const orderedProduct = {
      productId: product._id,
      quantity,
      size: selectedSize,
      title: product.title,
      imageURL: product.imageURL,
      sellerId: product.postedBy,
      price: winner === user?._id ? winningPrice : product.price,
    };

    navigate("/choose-delivery", {
      state: {
        products: [orderedProduct],
        orderedProducts: [orderedProduct],
        totalPrice,
      },
    });
  };

  const handlePlaceBid = async () => {
    if (!user) return alert("You must log in to place a bid.");
    if (countdown === "Auction expired") return;
    if (!bidAmount || Number(bidAmount) <= 0)
      return alert("Please enter a valid bid amount.");

    setIsPlacingBid(true);
    try {
      const res = await fetch(
        `${getBaseURL()}/api/products/place-bid/${product._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ biddingPrice: Number(bidAmount) }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Bid placed successfully!");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setIsPlacingBid(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  const category = product.category || "";
  const isForSale = ["fashion", "electronics", "digital", "others"].includes(
    category
  );
  const isPreOwned = category === "pre-owned";
  const isLostFound = ["lost", "found"].includes(category);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      delivered: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      processing: "bg-blue-100 text-blue-800",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image Section */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageURL || "/placeholder-product.jpg"}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Auction Status */}
            {isPreOwned && (
              <div className="mt-6">
                <div
                  className={`flex items-center p-4 rounded-lg ${
                    countdown === "Auction expired"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  <FiClock className="mr-2" />
                  <span className="font-medium">
                    {countdown === "Auction expired"
                      ? "Auction has ended"
                      : `Ends in: ${countdown}`}
                  </span>
                </div>

                {isWinner && (
                  <div className="mt-4 flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
                    <FiAward className="mr-2" />
                    <span className="font-medium">
                      You are the highest bidder!
                    </span>
                  </div>
                )}

                {winningPrice && (
                  <div className="mt-4 flex items-center p-4 bg-gray-50 text-gray-700 rounded-lg">
                    <span className="font-medium">
                      Highest Bid: ৳ {winningPrice}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              {(isForSale || (winner !== null && winner === user?._id)) && (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium transition ${
                      isAddingToCart
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <FiShoppingCart className="mr-2" />
                        Add to Cart
                        {isWinner && (
                          <span className="ml-2 text-yellow-300">
                            (৳ {winningPrice})
                          </span>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
                  >
                    <FiZap className="mr-2" />
                    Buy Now
                    {isWinner && (
                      <span className="ml-2 text-yellow-300">
                        (৳ {winningPrice})
                      </span>
                    )}
                  </button>
                </>
              )}

              {isPreOwned && (
                <div className="space-y-4">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter your bid amount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    disabled={countdown === "Auction expired" || isWinner}
                  />
                  <button
                    onClick={handlePlaceBid}
                    disabled={
                      countdown === "Auction expired" ||
                      isPlacingBid ||
                      isWinner
                    }
                    className={`w-full flex items-center justify-center py-3 px-6 rounded-lg font-medium ${
                      countdown === "Auction expired" || isWinner
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : isPlacingBid
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {countdown === "Auction expired" ? (
                      "Bidding Closed"
                    ) : isWinner ? (
                      "You Won This Auction"
                    ) : isPlacingBid ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Placing Bid...
                      </>
                    ) : (
                      "Place Bid"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:w-1/2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full uppercase font-semibold tracking-wide">
                {category}
              </span>
              {product.status && getStatusBadge(product.status)}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {product.price && (
              <div className="flex items-center mb-6">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-gray-900">
                    ৳ {product.price}
                    {product.perWhich && (
                      <span className="text-sm text-gray-500 ml-1">
                        / {product.perWhich}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {product.features?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Features
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isLostFound && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
                {product.location && (
                  <div className="mt-4 flex items-center">
                    <FiMapPin className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{product.location}</span>
                  </div>
                )}
              </div>
            )}

            {product.availableSizes?.length > 0 &&
              product.category === "fashion" && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Available Sizes
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm transition ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {isLostFound ? "Reporter" : "Seller"} Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FiUser className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">
                      {product.postedBy?.fullName || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FiPhone className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{product.contact || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FiMail className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">
                      {product.postedBy?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid History */}
      {isPreOwned && product.bids?.length > 0 && (
        <div className="mt-12 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Bid History
            </h2>
            <div className="divide-y divide-gray-200">
              {product.bids
                .slice()
                .reverse()
                .map((bid, i) => (
                  <div
                    key={i}
                    className="py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <FiUser className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {bidUsers[bid.user]?.fullName || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {bidUsers[bid.user]?.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold text-blue-600">
                        ৳ {bid.biddingPrice}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsCard;
