"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage(""); setError("")
    try {
      const response = await fetch((process.env.NODE_ENV === "production" ? "https://excel-analytics-app-e3f6.onrender.com" : "http://localhost:5000") + "/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await response.json()
      if (response.ok) setMessage(data.message || "Password reset link sent to your email!")
      else setError(data.message || "Failed to send reset link")
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ justifyContent: "center", alignItems: "center" }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="glass-panel" style={{ padding: "48px 36px", maxWidth: "440px", width: "100%", margin: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 className="gradient-text-glow" style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "12px" }}>Forgot Password</h1>
          <p style={{ color: "var(--text-secondary)" }}>Enter your email to receive a password reset link</p>
        </div>

        {message && <div className="message success">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary continue-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="auth-footer" style={{ marginTop: "28px" }}>
          <p>Remember your password? <Link to="/signin" style={{ color: "var(--accent-blue)", fontWeight: "bold" }}>Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
