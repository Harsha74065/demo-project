const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow localhost and Vercel frontend
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://demo-project-elru.vercel.app"
      ];
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Increase payload limits (for safety)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Serve uploaded images
app.use("/uploads", express.static("uploads"));

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});

app.use("/api/blogs", require("./routes/blogRoutes"));

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
