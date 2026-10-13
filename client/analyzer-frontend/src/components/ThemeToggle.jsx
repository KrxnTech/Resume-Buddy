import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

function ThemeToggle({ className = "", compact = false, showLabel = false }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${compact ? "compact" : ""} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
    >
      <div className="theme-toggle-track">
        <motion.div
          className="theme-toggle-thumb"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            justifyContent: isDark ? "flex-start" : "flex-end",
          }}
        >
          {isDark ? (
            <span className="theme-icon moon-icon" role="img" aria-label="Moon">
              🌙
            </span>
          ) : (
            <span className="theme-icon sun-icon" role="img" aria-label="Sun">
              ☀️
            </span>
          )}
        </motion.div>
      </div>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}

export default ThemeToggle;
