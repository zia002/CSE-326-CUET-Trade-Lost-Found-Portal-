// routes/cart.routes.js
const express = require("express");
const router = express.Router();
const Cart = require("./cart.model");
const verifyToken = require("../middleware/verifyToken");

// 🔁 Add item to cart
router.post("/add", verifyToken, async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity = 1, price, size = "regular" } = req.body;

  // console.log("Adding item to cart:", {
  //   userId,
  //   productId,
  //   quantity,
  //   price,
  //   size,
  // });

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price, size });
    }

    await cart.save();
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// 🔁 Get cart items
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    res.status(200).send(cart || { user: userId, items: [] });
  } catch (err) {
    res.status(500).send({ message: "Server error", error: err.message });
  }
});

// 🔁 Remove item
// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { product: req.params.productId } } },
    { new: true }
  );
  res.status(200).json(cart);
});

// PATCH /api/cart/update
router.patch("/update", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (item) item.quantity = quantity;

  await cart.save();
  res.status(200).json(cart);
});

// DELETE /api/cart/clear
router.delete("/clear", verifyToken, async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] },
    { new: true }
  );
  res.status(200).json(cart);
});

module.exports = router;
