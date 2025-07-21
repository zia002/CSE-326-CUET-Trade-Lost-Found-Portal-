const { Schema, model, Types } = require("mongoose");

const cartSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true }, // Added price field
        size: { type: String, default: "regular" },
      },
    ],
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema);
module.exports = Cart;
