const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.user = {
      _id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
