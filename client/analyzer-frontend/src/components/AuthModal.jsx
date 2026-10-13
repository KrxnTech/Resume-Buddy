import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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
      <div
        className="interview-modal-backdrop"
        onClick={closeAuthModal}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem",
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          style={{
            maxWidth: "440px",
            width: "100%",
            background: "var(--color-bg-primary)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-md)",
            padding: "2rem",
          }}
        >
          {/* Header Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <Lock size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "var(--color-heading)" }}>
                  {isLogin ? "Sign In" : "Create Account"}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "var(--color-text-muted)" }}>
                  {isLogin ? "Access your saved resume analysis reports." : "Join professionals tracking career readiness."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAuthModal}
              style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", padding: "4px" }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--color-bg-secondary)", padding: "3px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={() => switchMode("login")}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "4px",
                background: isLogin ? "var(--color-bg-primary)" : "transparent",
                color: isLogin ? "var(--color-primary)" : "var(--color-text-muted)",
                fontWeight: isLogin ? 600 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: isLogin ? "var(--shadow-sm)" : "none",
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("register")}
              style={{
                padding: "8px",
                border: "none",
                borderRadius: "4px",
                background: !isLogin ? "var(--color-bg-primary)" : "transparent",
                color: !isLogin ? "var(--color-primary)" : "var(--color-text-muted)",
                fontWeight: !isLogin ? 600 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: !isLogin ? "var(--shadow-sm)" : "none",
              }}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {!isLogin && (
              <>
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                  />
                </div>

                <div>
                  <label className="form-label">Target Role</label>
                  <input
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                  />
                </div>
              </>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <div style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "#FEE2E2", color: "var(--color-error)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "#E8F5E9", color: "var(--color-success)", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Demo account helper */}
          <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "var(--color-text-muted)" }}>
            <span>Quick test account:</span>
            <button
              type="button"
              onClick={() => {
                setEmail("alex@example.com");
                setPassword("secret123");
                if (!isLogin) switchMode("login");
              }}
              className="btn-link"
              style={{ color: "var(--color-primary)", fontSize: "0.78rem" }}
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
