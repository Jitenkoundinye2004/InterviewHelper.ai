
// export {protect};
// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized: missing token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized: bad token format" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT verify failed:", err);
      return res.status(401).json({ message: "Token invalid or expired" });
    }

    // attach minimal user info for controllers; adjust to your user model
    req.user = { _id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
};
