const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    logger.warn("Access token missing");
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logger.error("Invalid token: " + err.message);
      return res.status(403).json({ message: "Invalid token" });
    }

    logger.info("Token verified successfully for user ID: " + user.id);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
