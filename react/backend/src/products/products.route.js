const express = require("express");
const Product = require("./products.model");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Create Product (must be authenticated)
router.post("/create-product", verifyToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { contact, endsIn, category } = req.body;

    // Function to convert "2d 4h 5m" → actual Date
    const parseEndsInToDate = (endsInStr) => {
      const matches = endsInStr?.match(/\d+[dhms]/g) || [];
      const msMap = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
      let totalMs = 0;

      for (const part of matches) {
        const unit = part.slice(-1);
        const value = parseInt(part.slice(0, -1), 10);
        totalMs += value * (msMap[unit] || 0);
      }

      return new Date(Date.now() + totalMs);
    };

    let expiresAt = undefined;
    if (category === "pre-owned" && endsIn) {
      expiresAt = parseEndsInToDate(endsIn);
    }

    const newProduct = new Product({
      ...req.body,
      postedBy: _id,
      contact: contact || req.user.contactNumber,
      expiresAt,
    });

    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// ✅ Combined Get All Products + Filtering
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (
      req.query.postedBy &&
      mongoose.Types.ObjectId.isValid(req.query.postedBy)
    ) {
      filter.postedBy = new mongoose.Types.ObjectId(req.query.postedBy);
    }

    const products = await Product.find(filter)
      .populate("postedBy", "fullName email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.log("error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "postedBy",
      "email fullName profileImage contactNumber"
    );
    if (!product) return res.status(404).send({ message: "Product not found" });
    res.status(200).send(product);
  } catch (error) {
    console.log("error fetching product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// PATCH /update-product/:id
router.patch("/update-product/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    price,
    perWhich,
    description,
    availableSizes,
    features,
    location,
    endsIn,
    imageURL,
  } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    product.title = title || product.title;
    product.price = price ?? product.price;
    product.perWhich = perWhich ?? product.perWhich;
    product.description = description || product.description;
    product.availableSizes = availableSizes || product.availableSizes;
    product.features = features || product.features;
    product.location = location || product.location;
    product.imageURL = imageURL || product.imageURL;

    // ✅ Handle `endsIn` and recalculate `expiresAt` if category is pre-owned
    if (product.category === "pre-owned" && endsIn) {
      const parseEndsInToDate = (str) => {
        const units = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
        return new Date(
          Date.now() +
            [...str.matchAll(/(\d+)([dhms])/g)].reduce(
              (acc, [, num, unit]) => acc + num * (units[unit] || 0),
              0
            )
        );
      };

      product.expiresAt = parseEndsInToDate(endsIn);
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Delete product (only postedBy or admin)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { _id: userId, role } = req.user;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });
    if (role !== "admin" && product.postedBy.toString() !== userId) {
      return res.status(403).send({ message: "Unauthorized" });
    }

    await product.deleteOne();
    res.status(200).send({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// 🔒 Place a bid on pre-owned product (replace previous bid if exists)
router.post("/place-bid/:id", verifyToken, async (req, res) => {
  try {
    const { biddingPrice } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });
    if (product.category !== "pre-owned")
      return res.status(400).send({ message: "Not a pre-owned item" });

    // Check if the auction has expired
    if (product.expiresAt && new Date() > new Date(product.expiresAt)) {
      return res.status(403).send({ message: "Auction expired" });
    }

    if (!biddingPrice || biddingPrice <= 0) {
      return res.status(400).send({ message: "Invalid bidding amount" });
    }

    // Find the existing bid of the user
    const existingBidIndex = product.bids.findIndex(
      (bid) => bid.user.toString() === req.user._id.toString()
    );

    if (existingBidIndex !== -1) {
      // User already placed a bid, replace it with the new bid
      product.bids[existingBidIndex].biddingPrice = biddingPrice;
    } else {
      // No previous bid, add a new one
      product.bids.push({
        user: req.user._id.toString(),
        biddingPrice,
      });
    }

    // Save the updated product with the new bid
    await product.save();
    res.status(200).send({ message: "Bid placed", product });
  } catch (error) {
    console.error("Bid error:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// 🔒 Remove a user's bid on a pre-owned product
router.post("/remove-bid/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send({ message: "Product not found" });
    if (product.category !== "pre-owned")
      return res.status(400).send({ message: "Not a pre-owned item" });

    // Check if the auction has expired
    if (product.expiresAt && new Date() > new Date(product.expiresAt)) {
      return res
        .status(403)
        .send({ message: "Auction expired, can't remove bid" });
    }

    // Find the index of the user's bid
    const bidIndex = product.bids.findIndex(
      (bid) => bid.user.toString() === req.user._id.toString()
    );

    if (bidIndex === -1) {
      return res.status(404).send({ message: "Bid not found for this user" });
    }

    // Remove the bid
    product.bids.splice(bidIndex, 1);

    // Save the updated product
    await product.save();

    res.status(200).send({ message: "Bid removed successfully", product });
  } catch (error) {
    console.error("Error removing bid:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// set winning bid after auction ends// PATCH /api/products/select-winner/:id
router.patch("/select-winner/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { winningBid } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check if requester is the owner
    if (product.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to select winner" });
    }

    // Save the winning bid
    product.winningBid = winningBid;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.error("Error selecting winner:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// remove winning bid
router.patch("/remove-winner/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to modify this product" });
    }

    product.winningBid = undefined;
    await product.save();

    res.status(200).json(product);
  } catch (err) {
    console.error("Error removing winner:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
