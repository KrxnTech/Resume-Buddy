import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";

function Settings() {
  const { theme, setTheme, isDark } = useTheme();
  const { user, isAuthenticated, updateProfile, logout, openAuthModal } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setTitle(user.title || "");
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      await updateProfile({ name, title });
      setToastMsg("Profile changes saved successfully!");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>Account &amp; System Settings</h3>
        <p>Manage your user account credentials, membership profile, interface theme mode, and workspace preferences.</p>
      </div>

      {/* Account Profile Card */}
      <div className="dashboard-widget-card" style={{ width: "100%", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--clr-text)" }}>User Profile &amp; Authentication</h4>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--clr-text-2)" }}>
              {isAuthenticated
                ? "Your active member profile and synchronized account details."
                : "Sign in to save scan histories, track ATS scores, and sync rewrites across devices."}
            </p>
          </div>

          {isAuthenticated ? (
            <span
              style={{
                fontSize: "0.75rem",
                padding: "0.3rem 0.75rem",
                borderRadius: "20px",
                background: "rgba(230, 254, 83, 0.15)",
                border: "1px solid var(--clr-accent)",
                color: "var(--clr-accent)",
                fontWeight: 600,
              }}
            >
              ● {user?.role || "Pro Member"}
            </span>
          ) : (
            <button
              type="button"
              className="kinetic-cta-btn mini primary"
              onClick={() => openAuthModal("login")}
            >
              SIGN IN / REGISTER
            </button>
          )}
        </div>

        {isAuthenticated && user ? (
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
              {/* Full Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "8px",
                    color: "var(--clr-text)",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Professional Title */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Professional Role / Focus
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Software Engineer"
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "8px",
                    color: "var(--clr-text)",
                    fontSize: "0.85rem",
                  }}
                />
              </div>

              {/* Email (Read only) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--clr-border)",
                    borderRadius: "8px",
                    color: "var(--clr-text-3)",
                    fontSize: "0.85rem",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              {/* Account Status */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Session Security
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 0.85rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-border)", borderRadius: "8px", fontSize: "0.85rem", color: "var(--clr-text-2)" }}>
                  <span>🔒 JWT Protected • 256-bit Encrypted</span>
                </div>
              </div>
            </div>

            {toastMsg && (
              <div style={{ padding: "0.6rem 1rem", borderRadius: "8px", background: "rgba(39, 201, 63, 0.12)", color: "var(--clr-green)", fontSize: "0.85rem" }}>
                ✓ {toastMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={saving}
                className="landing-primary-btn"
                style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem" }}
              >
                {saving ? "Saving Changes..." : "Save Profile Changes"}
              </button>

              <button
                type="button"
                onClick={logout}
                style={{
                  padding: "0.6rem 1.25rem",
                  fontSize: "0.85rem",
                  background: "transparent",
                  border: "1px solid rgba(255, 75, 75, 0.4)",
                  color: "#ff6b6b",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px dashed var(--clr-border)", textAlign: "center" }}>
            <p style={{ margin: "0 0 1rem 0", color: "var(--clr-text-2)", fontSize: "0.9rem" }}>
              You are currently using Resume Buddy in Guest Mode. Create an account or sign in to persist your resume scans and accepted rewrites.
            </p>
            <button
              type="button"
              className="kinetic-cta-btn primary"
              onClick={() => openAuthModal("register")}
              style={{ display: "inline-block" }}
            >
              CREATE ACCOUNT NOW →
            </button>
          </div>
        )}
      </div>

      {/* Theme & Appearance Section */}
      <div className="dashboard-widget-card" style={{ width: "100%", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h4 style={{ margin: "0 0 0.25rem 0", color: "var(--clr-text)" }}>Theme &amp; Appearance</h4>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--clr-text-2)" }}>Choose between Dark Mode (deep contrast) and Light Mode (clean &amp; crisp).</p>
          </div>
          <ThemeToggle showLabel={true} />
        </div>

        <div className="theme-selection-grid">
          {/* Dark Mode Card */}
          <div
            className={`theme-option-card ${isDark ? "active" : ""}`}
            onClick={() => setTheme("dark")}
            role="button"
            tabIndex={0}
          >
            <div className="theme-card-icon-wrap">🌙</div>
            <div className="theme-card-content">
              <div className="theme-card-title">Dark Mode</div>
              <p className="theme-card-desc">Deep slate black with vibrant electric blue accents.</p>
            </div>
            <div className="theme-card-radio">
              {isDark && <div className="theme-card-radio-inner" />}
            </div>
          </div>

          {/* Light Mode Card */}
          <div
            className={`theme-option-card ${!isDark ? "active" : ""}`}
            onClick={() => setTheme("light")}
            role="button"
            tabIndex={0}
          >
            <div className="theme-card-icon-wrap">☀️</div>
            <div className="theme-card-content">
              <div className="theme-card-title">Light Mode</div>
              <p className="theme-card-desc">Clean white surfaces with high contrast text.</p>
            </div>
            <div className="theme-card-radio">
              {!isDark && <div className="theme-card-radio-inner" />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
