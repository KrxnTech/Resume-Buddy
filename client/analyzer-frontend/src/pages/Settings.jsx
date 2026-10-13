import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

function Settings() {
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
      setToastMsg("Profile changes saved successfully.");
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingBottom: "3rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "2rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
          <Link to="/dashboard" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Dashboard</Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 500 }}>Settings</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--color-heading)", margin: "0 0 0.4rem" }}>
          Account &amp; System Preferences
        </h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.92rem", margin: 0, maxWidth: "720px", lineHeight: 1.5 }}>
          Manage your profile details, session authentication, and theme preferences.
        </p>
      </div>

      {/* Account Profile Card */}
      <div className="card" style={{ padding: "1.75rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--color-info)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
              <User size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-heading)", margin: 0 }}>
                User Profile
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                {isAuthenticated ? "Authenticated account information." : "Guest mode. Sign in to sync your scans across devices."}
              </p>
            </div>
          </div>

          {isAuthenticated ? (
            <span className="badge badge-success">
              ● {user?.role || "Active Member"}
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => openAuthModal("login")}
            >
              Sign In / Register
            </button>
          )}
        </div>

        {isAuthenticated && user ? (
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label">Target Role / Focus</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Software Engineer"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  disabled
                  className="form-input"
                  value={user.email}
                  style={{ background: "var(--color-bg-secondary)", cursor: "not-allowed" }}
                />
              </div>

              <div>
                <label className="form-label">Account Security</label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "40px", padding: "0 0.85rem", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-success)" }} />
                  <span>Encrypted JWT Session</span>
                </div>
              </div>
            </div>

            {toastMsg && (
              <div style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", background: "#E8F5E9", color: "var(--color-success)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} /> {toastMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="btn btn-secondary"
                style={{ color: "var(--color-error)" }}
              >
                Sign Out
              </button>
            </div>
          </form>
        ) : (
          <div style={{ padding: "1.5rem", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-sm)", border: "1px dashed var(--color-border)", textAlign: "center" }}>
            <p style={{ margin: "0 0 1rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
              You are currently using Resume Buddy in Guest Mode. Sign in to save past scans, track improvements, and manage multiple resumes.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openAuthModal("register")}
            >
              Create Account <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
