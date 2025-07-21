import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChooseDeliveryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { products, orderedProducts, totalPrice } = location.state || {
    products: [],
    orderedProducts: [],
    totalPrice: 0,
  };

  const handleDeliveryOption = (deliveryOption) => {
    navigate("/order-confirmation", {
      state: { products, orderedProducts, totalPrice, deliveryOption },
    });
  };

  return (
    <section className="py-20 min-h-screen ">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">
            Choose Delivery Option
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            🚚 Select how you'd like to receive your order.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md rounded-xl p-6 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            🛒 Order Summary
          </h2>

          {products.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-200 py-2"
            >
              <div className="text-gray-700">
                {item.title} <span className="text-sm">(Size: {item.size})</span>
              </div>
              <div className="text-blue-800 font-medium">
                {item.quantity} X ৳{item.price}

              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-300 text-lg font-bold text-blue-900">
            <span>Total:</span>
            <span>৳{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <button
            onClick={() => handleDeliveryOption("home_delivery")}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Home Delivery
          </button>
          <button
            onClick={() => handleDeliveryOption("collect_from_seller")}
            className="px-6 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Collect from Seller
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChooseDeliveryPage;






// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const ChooseDeliveryPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Retrieve the passed products and totalPrice from the previous page/modal
//   const { products, orderedProducts, totalPrice } = location.state;

//   console.log(orderedProducts, totalPrice);

//   const handleDeliveryOption = (deliveryOption) => {
//     // When the user selects the delivery option, navigate to the final order page or confirmation page
//     navigate("/order-confirmation", {
//       state: { products, orderedProducts, totalPrice, deliveryOption },
//     });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">
//         Choose Delivery Option
//       </h2>

//       {/* Display the products, sizes, and the total price */}
//       <div className="mb-4">
//         <h3 className="text-gray-700">Products in your order:</h3>
//         {products.map((item, index) => (
//           <div key={index} className="flex justify-between items-center mb-2">
//             <div>
//               {item.title} (Size: {item.size})
//             </div>
//             <div>৳{(item.price * item.quantity).toFixed(2)}</div>
//           </div>
//         ))}
//         <hr className="my-2" />
//         {/* <h3 className="text-gray-800">Total Price: ৳{totalPrice.toFixed(2)}</h3> */}
//       </div>

//       {/* Delivery options */}
//       <div className="flex flex-col gap-4">
//         <button
//           onClick={() => handleDeliveryOption("home_delivery")}
//           className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Home Delivery
//         </button>
//         <button
//           onClick={() => handleDeliveryOption("collect_from_seller")}
//           className="p-3 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Collect from Seller
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChooseDeliveryPage;
