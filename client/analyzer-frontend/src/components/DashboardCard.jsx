import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function DashboardCard({ title, value, subtitle, icon, linkText, to, type = "default" }) {
  const isScore = type === "score";
  const isDecision = type === "decision";

  const colorClass =
    isScore
      ? (parseFloat(value) >= 75 || (typeof value === "string" && value.includes("75")) ? "green" : parseFloat(value) >= 50 ? "yellow" : "red")
      : "";

  return (
    <motion.div
      className={`dashboard-widget-card ${type}`}
      whileHover={{ y: -3, boxShadow: "var(--shadow-lg)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="widget-header">
        <span className="widget-title">{title}</span>
        <span className="widget-icon">{icon}</span>
      </div>

      <div className="widget-content">
        {isScore ? (
          <div className="widget-score-row">
            <span className={`widget-value score-text ${colorClass}`}>{value}</span>
          </div>
        ) : isDecision ? (
          <span className={`decision-pill-flat ${value?.toLowerCase()?.replace(/\s+/g, "") || "consider"}`}>
            {value}
          </span>
        ) : (
          <span className="widget-value">{value}</span>
        )}
        <p className="widget-subtitle">{subtitle}</p>
      </div>

      {to && linkText && (
        <Link to={to} className="widget-action-link">
          {linkText} <span className="arrow">→</span>
        </Link>
      )}
    </motion.div>
  );
}

export default DashboardCard;
