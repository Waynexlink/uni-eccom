import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access", 401),
    );
  }

  //the actual authorization
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.userId).select("-password");

  if (!currentUser) {
    return next(new AppError("Not authorized,or invalid token", 401));
  }

  req.userId = currentUser._id;

  next();
});
