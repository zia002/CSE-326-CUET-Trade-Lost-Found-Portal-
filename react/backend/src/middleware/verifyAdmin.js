const verifyAdmin = (req, res, next) => {
  try {
    // Check if the user has admin role
    if (req.role !== "admin") {
      return res.status(403).send({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    res.status(500).send({ message: "Internal server error" });
  }
}

module.exports = verifyAdmin;