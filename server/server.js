const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Import routes
const userRoutes = require("./routes/userRoutes")
const fileRoutes = require("./routes/fileRoutes")
const aiRoutes = require("./routes/aiRoutes")
const adminRoutes = require("./routes/adminRoutes")
const notificationRoutes = require("./routes/notificationRoutes")

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: true, // Allow dynamically any requesting origin
    credentials: true,
  }),
)

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/excel-analytics")
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Routes
app.use("/api/users", userRoutes)
app.use("/api/files", fileRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/notifications", notificationRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Excel Analytics API is running",
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Force binding to 0.0.0.0 to satisfy Render reverse proxy requirements
const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
