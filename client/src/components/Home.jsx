import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BarChart3, PieChart, ShieldCheck, Zap, ArrowRight, BrainCircuit, Activity } from "lucide-react"
import Navbar from "./Navbar"
import Footer from "./Footer"

const Home = () => {
  const features = [
    { icon: <BarChart3 size={28} />, title: "Advanced Analytics", desc: "Get detailed statistical insights from your Excel data in seconds.", color: "#4c84ff" },
    { icon: <PieChart size={28} />, title: "Interactive Charts", desc: "Visualize your data with beautiful, interactive graphs and plots.", color: "#8a2be2" },
    { icon: <BrainCircuit size={28} />, title: "AI Insights", desc: "Let our AI discover hidden patterns in your spreadsheets.", color: "#00e5a0" },
    { icon: <ShieldCheck size={28} />, title: "Secure Storage", desc: "Your data is safely stored with enterprise-grade encryption.", color: "#ffb84d" },
    { icon: <Zap size={28} />, title: "Fast Processing", desc: "Lightning-fast parsing of massive Excel files.", color: "#ff5c5c" },
    { icon: <Activity size={28} />, title: "Real-time Tracking", desc: "Monitor your dashboard usage and analytics history.", color: "#4dabf7" }
  ]

  return (
    <div className="home-container">
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* HERO */}
        <section className="hero-section" style={{ position: "relative", overflow: "hidden" }}>
          {/* Glow orb */}
          <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(76,132,255,0.12) 0%, rgba(138,43,226,0.06) 40%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

          <motion.div
            style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ display: "inline-block", padding: "8px 20px", borderRadius: "20px", background: "rgba(76, 132, 255, 0.08)", border: "1px solid rgba(76, 132, 255, 0.15)", color: "#4c84ff", marginBottom: "28px", fontWeight: "600", fontSize: "0.9rem" }}
            >
              🚀 The Next Generation of Analytics
            </motion.div>

            <h1 className="hero-title">
              Transform Your{" "}
              <span className="gradient-text-glow">Excel Data</span>
              {" "}Into Action
            </h1>

            <p className="hero-subtitle">
              Upload, analyze, and visualize your spreadsheets with AI-driven insights, interactive charts, and enterprise-grade security.
            </p>

            <div className="hero-buttons">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="btn btn-primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
                  Get Started Free <ArrowRight size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signin" className="btn btn-secondary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
                  Sign In
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: "80px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "16px", color: "var(--text-primary)" }}
              >
                Everything you need to succeed
              </motion.h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Powerful features designed for modern data teams.</p>
            </div>

            <div className="features-grid">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div style={{ background: `${feature.color}12`, width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "14px", marginBottom: "20px", color: feature.color }}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "100px 20px", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel"
            style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px", background: "linear-gradient(135deg, rgba(76,132,255,0.08), rgba(138,43,226,0.08))", borderColor: "rgba(76,132,255,0.12)" }}
          >
            <h2 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "20px", color: "var(--text-primary)" }}>
              Ready to supercharge your data?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", marginBottom: "36px" }}>
              Join thousands of analysts pushing the boundaries of what's possible.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: "inline-block" }}>
              <Link to="/signup" className="btn btn-primary" style={{ padding: "16px 36px", fontSize: "1.1rem" }}>
                Create Free Account
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
