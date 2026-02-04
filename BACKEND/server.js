import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/lib/db.js";

//handling uncaught exception
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION , Shutting down ...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

//intializing app
import app from "./app.js";

connectDB();

//intializing server

const port = 8000 || process.env.PORT;
const environment = process.env.NODE_ENV || development;
const server = app.listen(port, () => {
  console.log(`server started at ${port} in ${environment}`);
});

//handling uncaughtrejection
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION , Shutting down ...");
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
