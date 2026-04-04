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

// ---------------------------------------------------------------------------
// CORS Configuration — Production-Ready
// ---------------------------------------------------------------------------
// Whitelist of allowed origins (never use "*" with credentials)
const allowedOrigins = [
  "http://localhost:3000",                  // Local CRA dev server
  "http://localhost:5173",                  // Vite dev server (if ever used)
  "https://rdexcel.vercel.app",             // Production frontend (hardcoded fallback)
  process.env.CLIENT_URL                    // Production frontend from env var
    ? process.env.CLIENT_URL.replace(/\/+$/, "")
    : null,
].filter(Boolean) // Remove undefined/null/duplicate entries

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`)
      callback(new Error(`Origin ${origin} not allowed by CORS`))
    }
  },
  credentials: true,                        // Allow cookies & Authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Disposition"],   // Useful for file downloads
  maxAge: 86400,                             // Cache preflight for 24 hours
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Explicitly handle preflight (OPTIONS) for all routes
app.options("*", cors(corsOptions))

// ---------------------------------------------------------------------------
// Request logger (helpful for debugging CORS issues in production)
// ---------------------------------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} — Origin: ${req.headers.origin || "N/A"}`)
    next()
  })
}

// ---------------------------------------------------------------------------
// Body parsers
// ---------------------------------------------------------------------------
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// ---------------------------------------------------------------------------
// Database connection
// ---------------------------------------------------------------------------
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/excel-analytics")
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  })

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
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
    allowedOrigins: allowedOrigins, // Helpful for debugging
  })
})

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use((error, req, res, next) => {
  // Handle CORS errors specifically
  if (error.message && error.message.includes("not allowed by CORS")) {
    return res.status(403).json({
      message: "CORS Error: Your origin is not allowed to access this resource.",
    })
  }

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

// ---------------------------------------------------------------------------
// Start server — bind to 0.0.0.0 for Render
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`)
})

module.exports = app
