import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

function AuthModal() {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("Software Engineer");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        setSuccessMsg("Welcome back! Signed in successfully.");
      } else {
        await register(name, email, password, title);
        setSuccessMsg("Account created successfully! Welcome to Resume Buddy.");
      }
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setAuthModalMode(mode);
  };

  return (
    <AnimatePresence>
      <div className="interview-modal-backdrop" onClick={closeAuthModal} style={{ zIndex: 9999 }}>
        <motion.div
          className="interview-modal-box auth-modal-container"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.2 }}
          style={{ maxWidth: "460px", width: "92%", padding: "2rem" }}
        >
          {/* Header Row */}
          <div className="modal-top-row" style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--clr-accent-dim, rgba(230, 254, 83, 0.15))",
                  border: "1px solid var(--clr-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                }}
              >
                🔐
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--clr-text)" }}>
                  {isLogin ? "Sign In to Resume Buddy" : "Create Member Account"}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--clr-text-2)" }}>
                  {isLogin
                    ? "Access your saved resumes, audit scores, and rewrites."
                    : "Join professionals elevating their career with AI intelligence."}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="modal-close-icon"
              onClick={closeAuthModal}
              aria-label="Close Modal"
              style={{ background: "none", border: "none", color: "var(--clr-text-2)", fontSize: "1.2rem", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "4px",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              border: "1px solid var(--clr-border)",
            }}
          >
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{
                padding: "0.6rem 0",
                border: "none",
                borderRadius: "8px",
                background: isLogin ? "var(--clr-accent)" : "transparent",
                color: isLogin ? "#000" : "var(--clr-text-2)",
                fontWeight: isLogin ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              style={{
                padding: "0.6rem 0",
                border: "none",
                borderRadius: "8px",
                background: !isLogin ? "var(--clr-accent)" : "transparent",
                color: !isLogin ? "#000" : "var(--clr-text-2)",
                fontWeight: !isLogin ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {!isLogin && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    style={{
                      padding: "0.7rem 0.9rem",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--clr-border)",
                      color: "var(--clr-text)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Professional Title / Focus
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    style={{
                      padding: "0.7rem 0.9rem",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid var(--clr-border)",
                      color: "var(--clr-text)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  padding: "0.7rem 0.9rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--clr-border)",
                  color: "var(--clr-text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
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
                  padding: "0.7rem 0.9rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--clr-border)",
                  color: "var(--clr-text)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
              <span style={{ fontSize: "0.72rem", color: "var(--clr-text-3)" }}>
                Minimum 6 characters.
              </span>
            </div>

            {errorMsg && (
              <div
                style={{
                  padding: "0.7rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(255, 75, 75, 0.12)",
                  border: "1px solid rgba(255, 75, 75, 0.4)",
                  color: "#ff6b6b",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div
                style={{
                  padding: "0.7rem 1rem",
                  borderRadius: "8px",
                  background: "rgba(39, 201, 63, 0.12)",
                  border: "1px solid rgba(39, 201, 63, 0.4)",
                  color: "var(--clr-green, #4ade80)",
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>✓</span>
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="kinetic-cta-btn primary"
              style={{
                width: "100%",
                padding: "0.85rem",
                marginTop: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" style={{ width: "18px", height: "18px" }} />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>{isLogin ? "SIGN IN →" : "CREATE ACCOUNT →"}</>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px dashed var(--clr-border)",
              fontSize: "0.75rem",
              color: "var(--clr-text-3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>💡 Quick test account:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("alex@example.com");
                setPassword("secret123");
                if (!isLogin) switchMode("login");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--clr-accent)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.75rem",
                textDecoration: "underline",
              }}
            >
              Fill Demo Login
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default AuthModal;
