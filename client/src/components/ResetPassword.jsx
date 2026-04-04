"use client"

import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setMessage(""); setError("")
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); setLoading(false); return }
    try {
      const response = await fetch(`http://localhost:5000/api/users/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.password }),
      })
      const data = await response.json()
      if (response.ok) {
        setMessage("Password reset successfully! Redirecting...")
        setTimeout(() => navigate("/signin"), 2000)
      } else {
        setError(data.message || "Failed to reset password")
      }
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
          <h1 className="gradient-text-glow" style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "12px" }}>Reset Password</h1>
          <p style={{ color: "var(--text-secondary)" }}>Create a new password for your account</p>
        </div>

        {message && <div className="message success">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input type="password" id="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} required placeholder="Enter new password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" className="glass-input" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm new password" />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary continue-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <div className="auth-footer" style={{ marginTop: "28px" }}>
          <p>Back to <Link to="/signin" style={{ color: "var(--accent-blue)", fontWeight: "bold" }}>Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  )
}

export default ResetPassword
