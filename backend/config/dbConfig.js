import mongoose from "mongoose";

const connectDB = async () => {
  let URI = process.env.MONGO_URI;

  console.log("MongoDB URI:", URI); // Log the MongoDB URI for debugging
  if (!URI || URI == undefined) {
    throw new Error("MongoDB URI is not defined in the environment variables.");
  }
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
