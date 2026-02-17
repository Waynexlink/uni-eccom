import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/lib/db.js";

// handling uncaught exception
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION , Shutting down ...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// initializing app
import app from "./app.js";

connectDB();

// initializing server
const port = process.env.PORT || 8000;
const environment = process.env.NODE_ENV || "development";

const server = app.listen(port, () => {
  console.log(`server started at ${port} in ${environment}`);
});

// handling unhandled rejection
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION , Shutting down ...");
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
