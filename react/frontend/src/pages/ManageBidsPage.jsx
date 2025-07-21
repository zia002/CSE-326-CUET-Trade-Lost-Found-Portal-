import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBaseURL } from "../utils/baseURL";

const ManageBidsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [biddersInfo, setBiddersInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectingBid, setSelectingBid] = useState(false);
  const [removingWinner, setRemovingWinner] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${getBaseURL()}/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          if (data.bids?.length) {
            const userFetches = await Promise.all(
              data.bids.map((bid) =>
                fetch(`${getBaseURL()}/api/auth/users/${bid.user}`)
                  .then((res) => res.json())
                  .then((user) => ({ [bid.user]: user }))
                  .catch(() => ({
                    [bid.user]: { fullName: "Unknown", email: "N/A" },
                  }))
              )
            );
            const userMap = Object.assign({}, ...userFetches);
            setBiddersInfo(userMap);
          }
        } else {
          alert(data.message || "Failed to load product");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSelectWinner = async (bid) => {
    if (
      !window.confirm(
        "Are you sure you want to select this as the winning bid?"
      )
    )
      return;
    setSelectingBid(true);

    try {
      const res = await fetch(
        `${getBaseURL()}/api/products/select-winner/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ winningBid: bid }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Winning bid selected!");
        setProduct(data);
      } else {
        alert(data.message || "Failed to select winning bid");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSelectingBid(false);
    }
  };

  const handleRemoveWinner = async () => {
    if (!window.confirm("Are you sure you want to remove the selected winner?"))
      return;
    setRemovingWinner(true);

    try {
      const res = await fetch(
        `${getBaseURL()}/api/products/remove-winner/${id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Winner removed.");
        setProduct(data);
      } else {
        alert(data.message || "Failed to remove winner");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingWinner(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  if (!product)
    return (
      <div className="text-center mt-20 text-red-500">Product not found.</div>
    );

  return (
    <section className="py-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 pt-6">
          Manage Bids for:{" "}
          <span className="text-gray-900">{product.title}</span>
        </h1>

        {product.winningBid ? (
          <div className="p-5 border border-green-500 rounded-xl bg-green-50 mb-8">
            <h2 className="font-semibold text-green-700 text-lg mb-2">
              🏆 Winning Bid Selected
            </h2>
            <p className="text-gray-800">
              <strong>Name:</strong>{" "}
              {biddersInfo[product.winningBid.user]?.fullName || "Unknown"} (
              {biddersInfo[product.winningBid.user]?.email || "N/A"})
            </p>
            <p className="text-gray-800 mt-1">
              <strong>Price:</strong> ৳{product.winningBid.biddingPrice}
            </p>
            <button
              onClick={handleRemoveWinner}
              disabled={removingWinner}
              className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition"
            >
              {removingWinner ? "Removing..." : "Remove Winner"}
            </button>
          </div>
        ) : (
          <p className="text-yellow-600 text-sm mb-4">
            ⚠️ No winning bid has been selected yet.
          </p>
        )}

        {product.bids.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No bids placed yet.
          </p>
        ) : (
          <ul className="space-y-4 pb-8">
            {product.bids.map((bid, index) => {
              const user = biddersInfo[bid.user] || {};
              const isWinner = product.winningBid?.user === bid.user;

              return (
                <li
                  key={index}
                  className={`p-5 rounded-xl flex justify-between items-center shadow-sm border ${
                    isWinner
                      ? "bg-green-100 border-green-400"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.fullName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email || "N/A"}
                    </p>
                    <p className="text-blue-700 mt-1 font-bold text-lg">
                      ৳{bid.biddingPrice}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-full text-white font-medium transition ${
                      isWinner
                        ? "bg-green-600 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    onClick={() => handleSelectWinner(bid)}
                    disabled={!!product.winningBid || selectingBid}
                  >
                    {isWinner
                      ? "Selected"
                      : selectingBid
                      ? "Selecting..."
                      : "Select as Winner"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ManageBidsPage;
