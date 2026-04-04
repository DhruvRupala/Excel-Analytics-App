"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import { motion } from "framer-motion"
import { BarChart2, PieChart, Activity } from "lucide-react"

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); setLoading(false); return }
    const result = await signup(formData.name, formData.email, formData.password)
    if (result.success) navigate("/dashboard")
    else setError(result.message)
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <motion.div className="auth-left-panel" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
        <div className="auth-card glass-panel" style={{ padding: "44px 32px", maxWidth: "420px" }}>
          <div className="auth-logo-top">
            <h1 className="gradient-text-glow" style={{ fontSize: "2rem", fontWeight: "bold" }}>ExcelAnalytics</h1>
          </div>

          <div className="auth-header">
            <h2>Create an account</h2>
            <p>Join us to start analyzing your data</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: "20px" }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message">{error}</motion.div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" className="glass-input" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" className="glass-input" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" className="glass-input" value={formData.password} onChange={handleChange} required placeholder="Create a password" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" name="confirmPassword" className="glass-input" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm your password" />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary continue-btn" disabled={loading} style={{ marginTop: "10px" }}>
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <div className="or-separator" style={{ margin: "24px 0" }}>OR</div>

          <div className="social-login-buttons" style={{ flexDirection: "row", gap: "10px", marginBottom: "0" }}>
            <motion.button whileHover={{ y: -2 }} className="social-btn" style={{ flex: 1, padding: "10px", justifyContent: "center" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_of_Apple.svg" alt="Apple" style={{ filter: "invert(1)" }} />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} className="social-btn" style={{ flex: 1, padding: "10px", justifyContent: "center" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            </motion.button>
            <motion.button whileHover={{ y: -2 }} className="social-btn" style={{ flex: 1, padding: "10px", justifyContent: "center" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
            </motion.button>
          </div>

          <div className="auth-footer" style={{ marginTop: "28px" }}>
            <p>Already have an account? <Link to="/signin" style={{ color: "var(--accent-blue)", fontWeight: "bold" }}>Sign in here</Link></p>
          </div>
        </div>
      </motion.div>

      <motion.div className="auth-right-panel" style={{ position: "relative", backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", overflow: "hidden" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(5,5,16,0.85) 0%, rgba(76,132,255,0.15) 100%)", backdropFilter: "blur(2px)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <motion.div initial={{ y: 0 }} animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }} style={{ width: "300px", height: "300px", position: "relative" }}>
            <div className="glass-panel" style={{ position: "absolute", top: "10%", left: "10%", padding: "20px" }}><BarChart2 size={40} color="#4c84ff" /></div>
            <motion.div className="glass-panel" style={{ position: "absolute", top: "50%", right: "0%", padding: "20px" }} animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}><PieChart size={40} color="#8a2be2" /></motion.div>
            <motion.div className="glass-panel" style={{ position: "absolute", bottom: "10%", left: "30%", padding: "20px" }} animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 2 }}><Activity size={40} color="#00e5a0" /></motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup
