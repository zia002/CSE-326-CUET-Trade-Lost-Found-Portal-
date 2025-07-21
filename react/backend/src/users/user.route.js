const express = require("express");
const router = express.Router();
const User = require("./user.model");
const generateToken = require("../middleware/generateToken");
const verifyToken = require("../middleware/verifyToken");
const Product = require("../products/products.model");

// Sign Up Endpoint
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const cuetEmailRegex =
      /^(u(0[1-9]|[1-9][0-9])(0[1-9]|1[0-2])(0[0-9]{2}|1[0-7][0-9]|180)@student\.cuet\.ac\.bd|.+@cuet\.ac\.bd)$/;

    // 🔒 Check CUET email format
    if (!cuetEmailRegex.test(email)) {
      return res
        .status(400)
        .send({ message: "Only CUET email addresses are allowed" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save();

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(201).send({
      message: "User signed up successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        contactNumber: user.contactNumber,
        address: user.address,
        profession: user.profession,
        createdAt: user.createdAt,
        token,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Sign In Endpoint
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const token = await generateToken(user._id);

    res.cookie("token", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).send({
      message: "User signed in successfully",
      user: {
        id: user._id,
        token: token,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Sign Out Endpoint
router.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "User signed out successfully" });
});

// Get signed-in user profile (protected by JWT token in cookie)
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log("error fetching profile:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Delete User Endpoint
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(200).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User deleted successfully" });
  } catch {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get All Users Endpoint
router.get("/users", async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "id fullName email role contactNumber profileImage address profession createdAt"
      )
      .sort({ createdAt: -1 });
    res.status(200).send(users);
  } catch (error) {
    console.log("error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Update User Role Endpoint
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Edit or Update User Profile Endpoint
router.patch("/edit-profile", verifyToken, async (req, res) => {
  try {
    const { fullName, contactNumber, address, profileImage, profession } =
      req.body;

    const userId = req.user._id; // ✅ From token

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (contactNumber) user.contactNumber = contactNumber;
    if (address) user.address = address;
    if (profileImage) user.profileImage = profileImage;
    if (profession) user.profession = profession;

    await user.save();

    res.status(200).send({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        profileImage: user.profileImage,
        profession: user.profession,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Get User by ID Endpoint
router.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(
      "id fullName email role contactNumber profileImage address profession createdAt"
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log("error fetching user:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/stats", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments({
      category: { $nin: ["lost", "found"] }, // ✅ Exclude lost/found
    });

    const totalBids = await Product.aggregate([
      { $unwind: "$bids" },
      { $count: "count" },
    ]);

    const lostFoundPosts = await Product.countDocuments({
      category: { $in: ["lost", "found"] },
    });

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalBids: totalBids[0]?.count || 0,
      lostFoundPosts,
    });
  } catch (error) {
    console.log("error fetching stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all bids placed by the logged-in user
router.get("/my-bids/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    // 🔒 Ensure the user is accessing their own data
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 🧠 Find products where the user has placed a bid
    const myBids = await Product.find({
      "bids.user": userId,
    })
      .select("title category imageURL bids winningBid createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(myBids);
  } catch (error) {
    console.log("error fetching my bids:", error);
    res.status(500).json({ message: "Failed to load your bids" });
  }
});

module.exports = router;
