import mongoose from "mongoose";
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    console.log(uri);
    await mongoose.connect(uri);
    console.log(`MongoDB Connected on:${uri}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
