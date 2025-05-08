import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config/config.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
      error: true,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeToken = jwt.verify(token, JWT_SECRET);
    req.user = decodeToken;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Invalid Token",
      error: true,
    });
  }
};
