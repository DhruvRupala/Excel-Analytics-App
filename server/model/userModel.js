const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto") // Import crypto for token generation
const File = require("./fileModel") // Import the File model
const fs = require("fs") // Import file system module
const path = require("path") // Import path module

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex")

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

  return resetToken
}

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save()
}

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  delete user.resetPasswordToken
  delete user.resetPasswordExpire
  return user
}

// Pre-remove hook to delete all associated files when a user is deleted
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  console.log(`Pre-remove hook: Deleting files for user ${this._id}`)
  try {
    const userFiles = await File.find({ uploadedBy: this._id })
    for (const file of userFiles) {
      if (fs.existsSync(file.filePath)) {
        fs.unlinkSync(file.filePath)
        console.log(`Deleted physical file: ${file.filePath}`)
      } else {
        console.warn(`Physical file not found at: ${file.filePath} for user ${this._id}, skipping physical deletion.`)
      }
      await File.deleteOne({ _id: file._id }) // Delete the file record from DB
    }
    console.log(`All files for user ${this._id} deleted successfully.`)
    next()
  } catch (error) {
    console.error(`Error deleting files for user ${this._id}:`, error)
    next(error) // Pass the error to the next middleware
  }
})

module.exports = mongoose.model("User", userSchema)
