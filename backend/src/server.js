import express from "express";
import "dotenv/config";
import connectDB from "../config/dbConfig.js";
import authRoutes from "../routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();




app.get("/", (req, res) => {
  res.json({
    message: "Backend is running"
  });
});

app.use("/api/user", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});