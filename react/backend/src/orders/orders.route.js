const express = require("express");
const router = express.Router();
const Order = require("./orders.model");
const verifyToken = require("../middleware/verifyToken");

router.post("/create-order", verifyToken, async (req, res) => {
  const { products, deliveryOption, amount, shippingAddress, status } =
    req.body;

  // Get the authenticated user's ID from token
  const userId = req.user._id;

  // Validate required fields
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Products are required." });
  }

  if (!amount) {
    return res
      .status(400)
      .json({ message: "Total price and amount are required." });
  }

  try {
    // Create a new order
    const order = new Order({
      userId,
      products,
      deliveryOption,
      amount,
      shippingAddress:
        deliveryOption === "home_delivery" ? shippingAddress : "",
      status,
      orderId: `ORDER-${Date.now()}`,
    });

    await order.save();

    res.status(200).json({
      message: "Order created successfully",
      orderId: order.orderId,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
});

// Fetch all orders for the logged-in user
router.get("/user-orders", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.log("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
});

// Fetch all orders for the logged-in user
router.get("/user-orders", verifyToken, async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch orders belonging to the logged-in user
    const orders = await Order.find({ userId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.log("Error fetching orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
});

// Fetch orders for a seller (using sellerId)
router.get("/seller-orders", verifyToken, async (req, res) => {
  const userId = req.user._id; // Get the seller's ID

  try {
    // Fetch orders where the seller is involved (sellerId in products array)
    const orders = await Order.find({
      "products.sellerId": userId, // Filter orders by sellerId in products
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this seller." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    console.log("error fetching seller orders:", err);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
});

// Update order status (shipped, canceled)
router.patch("/update-order/:orderId", verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body; // new status (shipped, canceled)

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully." });
  } catch (err) {
    console.error("Error updating order status:", err);
    res
      .status(500)
      .json({ message: "Error updating order status", error: err.message });
  }
});

module.exports = router;
