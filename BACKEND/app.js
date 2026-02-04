import express from "express";

import { globalErrorHandler } from "./src/controller/errorController.js";
import cors from "cors";

//importing routes
import authRoute from "./src/routes/authRoute.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js URL
    credentials: true,
  }),
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`\n>>> Incoming ${req.method} request to: ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

//user authentication
app.use("/api/auth", authRoute);
app.use(globalErrorHandler);
export default app;
