import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (isAuthenticated) {
    navigate("/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await register(name, email, password, title);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page-wrap" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <motion.div
        className="dashboard-widget-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ maxWidth: "460px", width: "100%", padding: "2.5rem 2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "2rem" }}>🚀</span>
          <h2 style={{ fontSize: "1.6rem", margin: "0.5rem 0 0.25rem", color: "var(--clr-text)" }}>Create Account</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--clr-text-2)", margin: 0 }}>
            Join Resume Buddy to unlock persistent audits and full AI features
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--clr-border)",
                color: "var(--clr-text)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase" }}>
              Professional Focus / Role
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Full Stack Engineer"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--clr-border)",
                color: "var(--clr-text)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase" }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--clr-border)",
                color: "var(--clr-text)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase" }}>
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--clr-border)",
                color: "var(--clr-text)",
                fontSize: "0.9rem",
              }}
            />
          </div>

          {errorMsg && (
            <div style={{ padding: "0.7rem", borderRadius: "8px", background: "rgba(255, 75, 75, 0.12)", color: "#ff6b6b", fontSize: "0.85rem" }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="kinetic-cta-btn primary"
            style={{ padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {loading ? "Creating Account..." : "CREATE ACCOUNT →"}
          </button>

          <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--clr-text-2)", marginTop: "0.5rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--clr-accent)", fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <Link to="/" style={{ fontSize: "0.8rem", color: "var(--clr-text-3)", textDecoration: "none" }}>
              ← Back to Homepage
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
