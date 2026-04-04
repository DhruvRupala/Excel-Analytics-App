const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")
const { protect } = require("../middleware/userMiddleware")
const sendEmail = require("../utils/sendEmail") // Import the email utility
const crypto = require("crypto") // Import crypto for token validation
const { logActivity, createNotification } = require("../utils/logger")

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password",
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Update last login
    await user.updateLastLogin()

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    })
  }
})

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated. Please contact support.",
      })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    // Update last login
    await user.updateLastLogin()

    // Generate token
    const token = generateToken(user._id)

    // Log the activity
    await logActivity(user._id, "login", "User logged in via email")

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      message: "Server error during login",
      error: error.message,
    })
  }
})

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ message: "Please provide an email address" })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      // Send success message even if user not found to prevent email enumeration
      return res
        .status(200)
        .json({ message: "If an account with that email exists, a password reset link has been sent." })
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false }) // Save user with new token and expiry

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      <p>This link is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `

    try {
      await sendEmail({
        email: user.email,
        subject: "Excel Analytics App Password Reset Request",
        message,
      })

      res.status(200).json({ message: "Password reset email sent successfully." })
    } catch (error) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save({ validateBeforeSave: false })
      console.error("Email sending error:", error)
      return res.status(500).json({ message: "Email could not be sent. Please try again later." })
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    res.status(500).json({ message: "Server error during password reset request." })
  }
})

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
router.put("/reset-password/:token", async (req, res) => {
  const { token } = req.params
  const { newPassword } = req.body

  // Hash the incoming token to compare with the stored hashed token
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long." })
  }

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." })
    }

    // Set new password
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save() // Mongoose pre-save hook will hash the new password

    res.status(200).json({ message: "Password reset successfully." })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ message: "Server error during password reset." })
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    })
  } catch (error) {
    console.error("Profile fetch error:", error)
    res.status(500).json({
      message: "Server error fetching profile",
      error: error.message,
    })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        message: "Please provide name and email",
      })
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already taken by another user",
      })
    }

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    res.status(500).json({
      message: "Server error updating profile",
      error: error.message,
    })
  }
})

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide current password and new password",
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      })
    }

    // Find user with password
    const user = await User.findById(req.user.id).select("+password")
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Current password is incorrect",
      })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Password change error:", error)
    res.status(500).json({
      message: "Server error changing password",
      error: error.message,
    })
  }
})

// @desc    Delete user account and all associated data
// @route   DELETE /api/users/delete-account
// @access  Private
router.delete("/delete-account", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    // The pre-deleteOne hook in userModel will handle deleting associated files
    await user.deleteOne()

    res.status(200).json({ message: "Account and all associated data deleted successfully." })
  } catch (error) {
    console.error("Account deletion error:", error)
    res.status(500).json({ message: "Server error during account deletion.", error: error.message })
  }
})

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get("/", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      })
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 })

    res.json({
      count: users.length,
      users,
    })
  } catch (error) {
    console.error("Users fetch error:", error)
    res.status(500).json({
      message: "Server error fetching users",
      error: error.message,
    })
  }
})

module.exports = router
