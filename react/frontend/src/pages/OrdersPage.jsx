import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBaseURL } from "../utils/baseURL";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

const fetchOrders = async () => {
  try {
    const res = await fetch(`${getBaseURL()}/api/orders/user-orders`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      // 🔽 Sort by date (latest first)
      const sortedOrders = data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } else {
      alert("Failed to fetch orders.");
    }
  } catch (err) {
    console.error("⚠️ Error fetching orders:", err);
  } finally {
    setIsLoading(false);
  }
};


  const cancelOrder = async (orderId) => {
    try {
      const res = await fetch(`${getBaseURL()}/api/orders/cancel-order/${orderId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Order canceled successfully.");
        setOrders(orders.filter((order) => order.orderId !== orderId));
      } else {
        alert(data.message || "❌ Failed to cancel order.");
      }
    } catch (err) {
      console.error("⚠️ Error canceling order:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section className="py-20 min-h-screen ">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-12">
          🧾 Your Orders
        </h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-6 mb-8 border-l-4 border-blue-600"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Order #{order.orderId}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    order.status === "processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <p className="text-gray-600 mb-1">
                💰 Amount: <span className="text-blue-900 font-medium">৳{order.amount}</span>
              </p>
              <p className="text-gray-600 mb-4">
                🚚 Delivery Option:{" "}
                <span className="capitalize text-gray-800">
                  {order.deliveryOption.replace("_", " ")}
                </span>
              </p>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">📦 Products:</h3>
                {order.products.map((product, productIndex) => (
                  <div key={productIndex} className="flex items-center gap-4 mb-3">
                    <img
                      src={product.imageURL || "/images/default-product.png"}
                      alt={product.title}
                      className="w-16 h-16 rounded-md object-cover border"
                    />
                    <div className="text-gray-700 text-sm">
                      <p className="font-semibold">{product.title}</p>
                      <p>Quantity: {product.quantity}</p>
                      {product.size && <p>Size: {product.size}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {order.status === "processing" && (
                <div className="mt-6 text-right">
                  <button
                    onClick={() => cancelOrder(order.orderId)}
                    className="px-6 py-2 border-2 border-red-600 text-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    ❌ Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">
            <p>📭 You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              🛍️ Start Shopping
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;
