import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateQuantity } from "../redux/features/cart/cartSlice";
import { removeFromCart } from "../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

import {
  FaWindowClose,
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import OrderSummary from "./OrderSummery";

const CartModal = ({ products, isOpen, onClose, cartRef }) => {
  const dispatch = useDispatch();

  const handleQuantity = (type, id) => {
    const payload = { type, id };
    dispatch(updateQuantity(payload));
  };

  const handleRemove = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, cartRef, onClose]);

  // Assuming 'products' is an array of items from the cart (from Redux state)

  const orderedProducts = products.map((item) => ({
    productId: item._id || item.id, // use _id if populated, fallback to id
    quantity: item.quantity,
    size: item.size || "N/A", // fallback to "regular" if size missing
    title: item.title,
    imageURL: item.imageURL,
    sellerId: item.postedBy,
  }));

  console.log(orderedProducts);

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-black/50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ transition: "opacity 300ms" }}
    >
      <div
        ref={cartRef}
        className={`fixed right-0 top-0 md:w-1/3 w-full bg-white h-full overflow-y-auto shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transition: "transform 300ms cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h4 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaShoppingCart className="text-blue-600" /> Your Cart
            </h4>
            <button
              className="text-gray-500 hover:text-red-500 text-2xl"
              onClick={onClose}
              aria-label="Close cart"
            >
              <FaWindowClose />
            </button>
          </div>
          <div>
            {products.length === 0 ? (
              <div className="text-gray-500 text-center py-10">
                Your cart is empty
              </div>
            ) : (
              products.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 rounded-lg hover:shadow-md transition-shadow md:p-5 p-3 mb-4"
                >
                  <div className="flex items-center w-full justify-between">
                    {/* Product Info */}
                    <div className="flex items-center">
                      <img
                        src={item.imageURL}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded mr-4"
                      />
                      <div>
                        <h5 className="text-base font-semibold text-gray-800">
                          {item.title}
                        </h5>
                        <p className="text-gray-600 text-sm">
                          ৳{Number(item.price).toFixed(2)}
                          {item.category === "fashion"
                            ? ", Size: " + item.size
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="flex items-center mt-2 md:mt-0">
                      <div className="flex items-center rounded px-2 py-1 bg-white">
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                          onClick={() => handleQuantity("decrement", item.id)}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
                          onClick={() => handleQuantity("increment", item.id)}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>

                      <button
                        className="ml-4 text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        onClick={(e) => handleRemove(e, item.id)}
                      >
                        <FaTrash size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {products.length > 0 && (
            <OrderSummary
              products={products}
              orderedProducts={orderedProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
