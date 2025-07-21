import React, { useEffect, useState } from "react";
import { getBaseURL } from "../utils/baseURL";
import { Link } from "react-router-dom";
import { FiAward, FiTrash2, FiDollarSign, FiLoader, FiAlertTriangle } from "react-icons/fi";

const MyBidsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      } else {
        setError("Failed to load user data. Please log in.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Error fetching user data.");
    }
  };

  const fetchMyBids = async () => {
    if (!user?._id) return;

    try {
      const res = await fetch(`${getBaseURL()}/api/auth/my-bids/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
        setError(null);
      } else {
        setError(data.message || "Failed to fetch bids");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch your bids");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyBids();
    }
  }, [user]);

  const handleRemoveBid = async (productId) => {
    try {
      const res = await fetch(
        `${getBaseURL()}/api/products/remove-bid/${productId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? {
                  ...product,
                  bids: product.bids.filter((b) => b.user !== user._id),
                }
              : product
          )
        );
      } else {
        alert(data.message || "Failed to remove bid");
      }
    } catch (err) {
      console.error("Error removing bid:", err);
      alert("Failed to remove your bid");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Bids</h1>
        <p className="text-gray-600 mt-1">View and manage your placed bids</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">You haven't placed any bids yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const myBid = product.bids.find((b) => b.user === user._id);
            const isWinner = product.winningBid?.user === myBid?.user;

            return (
              <div
                key={product._id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden border ${
                  isWinner ? "border-green-300" : "border-gray-200"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {product.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Category: {product.category}
                      </p>
                    </div>
                    {isWinner && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FiAward className="mr-1" /> Winner
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Your Bid</p>
                      <p className="font-bold text-blue-600">
                        ৳{myBid?.biddingPrice || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleRemoveBid(product._id)}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        myBid
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!myBid}
                    >
                      <FiTrash2 className="mr-2" />
                      {myBid ? "Remove Bid" : "No Bid"}
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBidsPage;