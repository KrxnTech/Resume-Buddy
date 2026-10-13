import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1.5rem" }}>
      <div className="card" style={{ maxWidth: "420px", width: "100%", padding: "2.5rem 2rem", background: "var(--color-bg-primary)" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: "var(--color-primary)" }}>
            <Lock size={22} />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.35rem" }}>
            Sign In to Resume Buddy
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", margin: 0 }}>
            Enter your credentials to access your saved resume evaluations.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
            />
          </div>

          {errorMsg && (
            <div style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "#FEE2E2", color: "var(--color-error)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
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
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>

          <div style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--color-text-muted)", marginTop: "0.75rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>
              Create Account
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <Link to="/" style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", textDecoration: "none" }}>
              ← Back to Homepage
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
