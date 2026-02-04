import express from "express";
import User from "../models/User.js";
import {
  signUp,
  loginUser,
  logOut,
  getMe,
} from "../controller/authController.js";
import {
  signUpValidator,
  loginValidator,
} from "../validators/authvalidator.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`>>> Auth route handler - ${req.method} ${req.url}`);
  next();
});

router.post("/signup", signUp);
router.post("/login", loginValidator, loginUser);
router.get("/me", requireAuth, getMe);
router.get("/logout", requireAuth, logOut);
// In authRoute.js - Update your test route:
router.post("/test", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("1. Received data:", { name, email, password });

    console.log("2. About to create user...");
    const user = await User.create({ name, email, password });

    console.log("3. User created successfully:", user);

    res.status(200).json({
      status: "success",
      message: `Hello, ${name}! This is a test route.`,
      user,
    });
  } catch (error) {
    console.log("4. ERROR CAUGHT:", error.message);
    console.log("Full error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
      error: error,
    });
  }
});

export default router;
