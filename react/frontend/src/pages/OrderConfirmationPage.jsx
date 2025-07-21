import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBaseURL } from "../utils/baseURL";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  if (!location.state) {
    return (
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            ❌ No order details found.
          </h2>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-all"
          >
            🛒 Go to Cart
          </button>
        </div>
      </section>
    );
  }

  const { products, orderedProducts, totalPrice, deliveryOption } =
    location.state;
  const deliveryCharge = deliveryOption === "home_delivery" ? 50 : 0;
  const finalTotalPrice = totalPrice + deliveryCharge;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${getBaseURL()}/api/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setUser(data);
      else alert("⚠️ Failed to load user data. Please log in.");
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleConfirmOrder = () => {
    setIsSubmitting(true);

    fetch(`${getBaseURL()}/api/orders/create-order`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: orderedProducts,
        deliveryOption,
        amount: finalTotalPrice,
        shippingAddress:
          deliveryOption === "home_delivery" ? user?.address : "",
        status: "processing",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("🎉 Order Confirmed! Thank you for your purchase.");
        navigate("/order-success", { state: { orderId: data.orderId } });
      })
      .catch((error) => {
        alert("❌ Something went wrong, please try again.");
        console.error("Order error:", error);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <section className="py-20 min-h-screen ">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
            Order Confirmation
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            🧾 Review your items and confirm to place your order.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            📦 Your Order
          </h2>

          {products.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center  py-2 text-gray-700"
            >
              <div>
                {item.title} (x{item.quantity}){" "}
                {item.size ? (
                  <span className="text-sm text-gray-500">
                    (Size: {item.size})
                  </span>
                ) : null}
              </div>
              <div>
                {item.quantity} X ৳{item.price}
              </div>
            </div>
          ))}

          <div className="mt-4 border-t pt-4 text-lg font-medium text-blue-900">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>

            {deliveryOption === "home_delivery" && (
              <div className="flex justify-between mb-2 text-green-700">
                <span>🚚 Delivery Charge:</span>
                <span>৳{deliveryCharge}</span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold border-t">
              <span>Total:</span>
              <span>৳{finalTotalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 text-gray-600">
            🏠 Delivery Option:{" "}
            <span className="capitalize font-semibold text-gray-800">
              {deliveryOption.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "✅ Confirm Order"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
