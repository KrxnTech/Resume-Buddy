import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const features = [
    { icon: "", title: "ATS Optimizer", desc: "Scan against specific roles and align formatting - keywords and sections for scanning parsers" },
    { icon: "", title: "Recruiter Feedback", desc: "Gain instant professional hiring critiques - seniority fit readiness and confidence ratings" },
    { icon: "", title: "AI Rewrite Studio", desc: "Improve summary - experience and project bullets instantly with inline diff editing" }
  ];

  return (
    <div className="landing-page-wrap">
      {/* Background glow effects */}
      <div className="landing-glow glow-1" />
      <div className="landing-glow glow-2" />

      {/* Main hero panel */}
      <header className="landing-hero">
        <motion.div
          className="app-badge"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="app-badge-dot" />
          Analyzer Buddy <i class="fa-solid fa-shield-cat"></i>
        </motion.div>

        <motion.h1
          className="landing-title"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Optimize Your Resume For <br />
          <span className="gradient-text">ATS &amp; Recruiters</span>
        </motion.h1>

        <motion.p
          className="landing-subtitle"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          An all-in-one resume "Optimization Workspace" Parse resume layouts - detect missing key terms - <b>rewrite bullets professionally</b> using AI
        </motion.p>

        <motion.div
          className="landing-cta-row"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button className="landing-primary-btn" onClick={() => navigate("/upload")}>
            Start Free Scan <span className="arrow">→</span>
          </button>
          <button className="landing-secondary-btn" onClick={() => {
            alert("This is a SaaS project demonstration powered by Groq Llama 3.3. Feel free to run a scan!");
          }}>
            Watch Demo
          </button>
        </motion.div>
      </header>

      {/* Grid of features */}
      <motion.section
        className="landing-features-grid"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        {features.map((feat, i) => (
          <div key={feat.title} className="landing-feature-card">
            <span className="feature-card-icon">{feat.icon}</span>
            <h3 className="feature-card-title">{feat.title}</h3>
            <p className="feature-card-desc">{feat.desc}</p>
          </div>
        ))}
      </motion.section>

      {/* Footer stats row */}
      <motion.footer
        className="landing-stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="stat-cell">
          <strong>98.4%</strong>
          <span>ATS Accuracy</span>
        </div>
        <div className="stat-cell-divider" />
        <div className="stat-cell">
          <strong>&lt; 5s</strong>
          <span>Llama 70B Scan</span>
        </div>
        <div className="stat-cell-divider" />
        <div className="stat-cell">
          <strong>Instant</strong>
          <span>Bullet Edits</span>
        </div>
      </motion.footer>
    </div>
  );
}

export default Landing;
