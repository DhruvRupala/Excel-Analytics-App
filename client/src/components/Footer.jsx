import { Link } from "react-router-dom"
import { BarChart2, Github, Twitter, Linkedin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="footer" style={{ 
      position: "relative",
      marginTop: "4rem",
      background: "linear-gradient(to bottom, rgba(14, 18, 25, 0), rgba(11, 23, 41, 0.6))",
      borderTop: "1px solid rgba(56, 189, 248, 0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      zIndex: 10
    }}>
      {/* Decorative top glow */}
      <div style={{
        position: "absolute",
        top: 0,
        left: "20%",
        right: "20%",
        height: "1px",
        background: "linear-gradient(90deg, transparent, var(--accent-blue), transparent)",
        opacity: 0.5,
        boxShadow: "0 0 15px 1px var(--accent-blue)"
      }}></div>

      <div className="footer-container" style={{ paddingTop: "60px", paddingBottom: "30px", position: "relative" }}>
        
        {/* Abstract background shapes */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "-5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }}></div>

        <div className="footer-content" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "50px", position: "relative", zIndex: 1 }}>
          <div style={{ paddingRight: "40px" }}>
            <h3 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ 
                padding: "8px", 
                background: "rgba(56, 189, 248, 0.1)", 
                borderRadius: "12px",
                border: "1px solid rgba(56, 189, 248, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <BarChart2 size={24} color="var(--accent-blue)" />
              </div>
              <span className="gradient-text" style={{ letterSpacing: "-0.5px" }}>ExcelAnalytics</span>
            </h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: "0.95rem" }}>
              Deploying enterprise-grade analytics and beautiful cosmic visualization for your data teams globally. Experience the future of data.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
              {/* Social placeholders for a premium feel */}
              <a href="/" style={{ color: "var(--text-secondary)", padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s" }} onMouseOver={(e) => Object.assign(e.currentTarget.style, {color: "var(--accent-blue)", background: "rgba(56, 189, 248, 0.1)", borderColor: "rgba(56, 189, 248, 0.3)"})} onMouseOut={(e) => Object.assign(e.currentTarget.style, {color: "var(--text-secondary)", background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)"})}><Github size={18} /></a>
              <a href="/" style={{ color: "var(--text-secondary)", padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s" }} onMouseOver={(e) => Object.assign(e.currentTarget.style, {color: "var(--accent-blue)", background: "rgba(56, 189, 248, 0.1)", borderColor: "rgba(56, 189, 248, 0.3)"})} onMouseOut={(e) => Object.assign(e.currentTarget.style, {color: "var(--text-secondary)", background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)"})}><Twitter size={18} /></a>
              <a href="/" style={{ color: "var(--text-secondary)", padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s" }} onMouseOver={(e) => Object.assign(e.currentTarget.style, {color: "var(--accent-blue)", background: "rgba(56, 189, 248, 0.1)", borderColor: "rgba(56, 189, 248, 0.3)"})} onMouseOut={(e) => Object.assign(e.currentTarget.style, {color: "var(--text-secondary)", background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)"})}><Linkedin size={18} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", display: "inline-block" }}>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/features" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Features</Link></li>
              <li><Link to="/pricing" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Pricing</Link></li>
              <li><Link to="/security" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Security</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", display: "inline-block" }}>Resources</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/documentation" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Documentation</Link></li>
              <li><Link to="/blog" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Blog</Link></li>
              <li><Link to="/support" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Help Center</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "10px", display: "inline-block" }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/about" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>About</Link></li>
              <li><Link to="/careers" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Careers</Link></li>
              <li><Link to="/contact" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}>Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          justifyContent: "space-between", 
          alignItems: "center", 
          fontSize: "0.9rem", 
          gap: "16px", 
          padding: "24px 0 0 0",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          color: "rgba(255, 255, 255, 0.5)"
        }}>
          <p style={{ margin: 0, letterSpacing: "0.5px" }}>&copy; {new Date().getFullYear()} ExcelAnalytics. All rights reserved.</p>
          <p style={{ 
            margin: 0, 
            color: "var(--accent-blue)", 
            fontWeight: 500,
            textShadow: "0 0 10px rgba(56, 189, 248, 0.3)",
            letterSpacing: "0.5px"
          }}>
            Developed by Dhruv Rupala
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
