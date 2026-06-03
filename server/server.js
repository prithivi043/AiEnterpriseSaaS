const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ==============================
// CORS
// ==============================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-enterprise-saa-s-q69v.vercel.app",
    ],
    credentials: true,
  }),
);

// ==============================
// Middleware
// ==============================
app.use(express.json());

// ==============================
// MongoDB Connection
// ==============================
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
}

// Connect DB before every request (safe for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ==============================
// Health Check
// ==============================
app.get("/", (req, res) => {
  res.json({
    message: "Eaura AI Backend Running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: isConnected ? "connected" : "disconnected",
  });
});

// ==============================
// Routes
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/tasks", taskRoutes);

// ==============================
// Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==============================
// Export App for Vercel
// ==============================
module.exports = app;
