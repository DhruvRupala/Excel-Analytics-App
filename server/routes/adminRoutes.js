const express = require("express")
const router = express.Router()
const { protect, admin } = require("../middleware/userMiddleware")
const User = require("../model/userModel")
const ActivityLog = require("../model/activityLogModel")

// @route   GET /api/admin/stats
// @desc    Get global statistics (total users, total logs)
// @access  Private/Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalLogs = await ActivityLog.countDocuments()
    
    // Aggregation for recent trend or activity summary
    const recentLogs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20).populate("user", "name email")

    res.json({
      totalUsers,
      totalLogs,
      recentLogs
    })
  } catch (error) {
    console.error("Error fetching admin stats", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/admin/logs
// @desc    Get all activity logs with pagination
// @access  Private/Admin
router.get("/logs", protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const logs = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await ActivityLog.countDocuments()

    res.json({
      logs,
      page,
      pages: Math.ceil(total / limit),
      total
    })
  } catch (error) {
    console.error("Error fetching activity logs", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error("Error fetching users", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
