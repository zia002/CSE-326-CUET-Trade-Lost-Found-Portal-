const mongoose = require("mongoose");

// cash on delivery order schema

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          required: true,
          default: "N/A",
        },
        title: {
          type: String,
        },
        imageURL: {
          type: String,
        },
        sellerId: {
          type: String,
        },
      },
    ],

    amount: {
      type: Number,
      required: true,
      // if deliveryOption is "home_delivery", there will be an additional delivery charge 50 tk
    },

    deliveryOption: {
      type: String,
      required: true,
    },

    shippingAddress: {
      // Optional, can be used for home delivery
      // automatically populated if deliveryOption is "home_delivery"
      // from user.model.js ->   address: {type: String,default: "",},
    },
    status: {
      type: String,
      default: "processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
