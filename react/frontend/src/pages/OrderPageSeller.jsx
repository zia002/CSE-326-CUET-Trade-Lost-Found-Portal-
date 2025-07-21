import React, { useEffect, useState } from "react";
import { getBaseURL } from "../utils/baseURL";
import {
  FiTruck,
  FiPackage,
  FiUser,
  FiMail,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";

const OrdersPageSeller = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${getBaseURL()}/api/orders/seller-orders`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          const ordersWithBuyerInfo = await Promise.all(
            data.orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🔽 sort by date
              .map(async (order) => {
                try {
                  const buyerRes = await fetch(
                    `${getBaseURL()}/api/auth/users/${order.userId}`,
                    { credentials: "include" }
                  );
                  const buyerData = await buyerRes.json();
                  return { ...order, buyerInfo: buyerData };
                } catch (error) {
                  console.error("Error fetching buyer info:", error);
                  return { ...order, buyerInfo: null };
                }
              })
          );
          setOrders(ordersWithBuyerInfo);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingStatus(orderId);
    try {
      const res = await fetch(
        `${getBaseURL()}/api/orders/update-order/${orderId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order.orderId === orderId ? { ...order, status } : order
          )
        );
      } else {
        alert(data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Something went wrong");
    } finally {
      setUpdatingStatus(null);
    }
  };

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

  if (isLoading) {
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
            <FiAlertCircle className="text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manage Orders
        </h1>
        <p className="text-gray-600 mt-1">
          View and manage all customer orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order #{order.orderId}
                    </h2>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-blue-600">
                      ৳{order.amount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Delivery Information */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      {order.deliveryOption === "home_delivery" ? (
                        <FiTruck className="text-blue-500 mr-2" />
                      ) : (
                        <FiPackage className="text-blue-500 mr-2" />
                      )}
                      <h3 className="font-medium">
                        {order.deliveryOption === "home_delivery"
                          ? "Home Delivery"
                          : "Pickup"}
                      </h3>
                    </div>
                    {order.deliveryOption === "home_delivery" && (
                      <p className="text-gray-600 text-sm">
                        {order.shippingAddress}
                      </p>
                    )}
                  </div>

                  {/* Buyer Information */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <FiUser className="text-blue-500 mr-2" />
                      <h3 className="font-medium">Buyer Information</h3>
                    </div>
                    {order.buyerInfo ? (
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center">
                          <FiUser className="text-gray-400 mr-2" />
                          {order.buyerInfo.fullName || "N/A"}
                        </p>
                        <p className="flex items-center">
                          <FiMail className="text-gray-400 mr-2" />
                          {order.buyerInfo.email || "N/A"}
                        </p>
                        <p className="flex items-center">
                          <FiPhone className="text-gray-400 mr-2" />
                          {order.buyerInfo.contactNumber || "N/A"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Buyer information not available
                      </p>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Products</h3>
                  <div className="space-y-4">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 border rounded-lg"
                      >
                        <img
                          src={product.imageURL || "/placeholder-product.jpg"}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{product.title}</p>
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Size: {product.size}</span>
                            <span>Qty: {product.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {order.status !== "delivered" &&
                  order.status !== "canceled" ? (
                    <>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.orderId, "delivered")
                        }
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                        disabled={updatingStatus === order.orderId}
                      >
                        {updatingStatus === order.orderId ? (
                          <>
                            <FiLoader className="animate-spin mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="mr-2" />
                            Mark as Delivered
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(order.orderId, "canceled")
                        }
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        disabled={updatingStatus === order.orderId}
                      >
                        <FiXCircle className="mr-2" />
                        Cancel Order
                      </button>
                    </>
                  ) : (
                    <p
                      className={`text-sm font-medium ${
                        order.status === "delivered"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Order has been {order.status}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPageSeller;
