import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{ background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          {/* Brand Info */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <span className="brand-dot" />
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-heading)", letterSpacing: "-0.3px" }}>
                Resume Buddy
              </span>
            </div>
            <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.55, margin: "0 0 1rem" }}>
              AI-powered career intelligence platform designed for software engineers and technical professionals.
            </p>
            <div style={{ fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
              Minimalist SaaS Architecture
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
              Product
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>
                <Link to="/upload" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Analyze Resume
                </Link>
              </li>
              <li>
                <Link to="/features" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Features Suite
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Analysis Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/interview" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Mock Interview Arena
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
              Resources
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>
                <Link to="/help" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Help &amp; FAQ
                </Link>
              </li>
              <li>
                <Link to="/help" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  ATS Guidelines
                </Link>
              </li>
              <li>
                <Link to="/dashboard/roadmap" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Career Roadmap
                </Link>
              </li>
              <li>
                <Link to="/dashboard/export" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Standardized PDF Export
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-heading)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1rem" }}>
              Platform
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <li>
                <Link to="/about" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
                  Account Settings
                </Link>
              </li>
              <li>
                <span style={{ fontSize: "0.88rem", color: "var(--color-text-muted)" }}>
                  Privacy &amp; In-Memory Data
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          <div>
            © {new Date().getFullYear()} Resume Buddy. Career Intelligence Platform.
          </div>
          <div>
            Inspired by clean, minimalist financial SaaS engineering.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
