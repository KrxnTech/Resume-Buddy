import { useState } from "react";
import { motion } from "framer-motion";

function Settings() {
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [temperature, setTemperature] = useState(0.3);

  return (
    <motion.div
      className="page-detail-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header-desc">
        <h3>System Settings</h3>
        <p>Manage API key profiles, LLM model selection, temperature settings, and dashboard display toggles.</p>
      </div>

      <div className="dashboard-widget-card" style={{ width: "100%" }}>
        <h4 style={{ margin: "0 0 1.25rem 0", color: "var(--clr-text)" }}>Analysis Models &amp; Prompts</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Model selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Active Groq Model
            </label>
            <select
              style={{ padding: "0.6rem 0.85rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--clr-border)", borderRadius: "8px", color: "var(--clr-text)", fontSize: "0.85rem" }}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Default)</option>
              <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
              <option value="gemma2-9b-it">gemma2-9b-it</option>
            </select>
          </div>

          {/* Temperature */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--clr-text-2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Generation Temperature
              </label>
              <span style={{ fontSize: "0.85rem", color: "var(--clr-accent-2)" }}>{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              style={{ width: "100%", accentColor: "var(--clr-accent)" }}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
          </div>

          {/* Save button */}
          <button className="landing-primary-btn" onClick={() => alert("Settings saved locally!")} style={{ padding: "0.6rem 1.5rem", fontSize: "0.85rem", alignSelf: "flex-start", marginTop: "1rem" }}>
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Settings;
