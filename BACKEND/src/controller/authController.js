import User from "../models/User.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const signUp = catchAsync(async (req, res, next) => {
  //check if user already exist in the database
  console.log("=== SIGNUP START ===");
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("About to call next with error - missing fields");
    const error = new AppError("Please provide name, email and password", 400);
    console.log("Error object:", error);
    return next(error);
  }

  const userExist = await User.findOne({ email });
  console.log("User exists check result:", userExist);

  if (userExist) {
    console.log("About to call next with error - user exists");
    const error = new AppError("this email is already registered", 400);
    console.log("Error object:", error);
    console.log("Calling next now...");
    return next(error);
  }
  //if the user does not exist then create a new user

  const user = await User.create({ name, email, password });
  console.log(`this is the user ${user}`);

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("incorrect email or password", 401));

  //check if password is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect)
    return next(new AppError("incorrect email or password", 401));

  const token = generateToken(user._id, user.role);

  //success message

  res.status(200).json({
    // 200 for login, not 201
    status: "success",
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.userId).select("-password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const logOut = catchAsync(async (req, res, next) => {
  // With JWT, logout is handled client-side by deleting token
  // But you can implement token blacklisting here if needed

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
