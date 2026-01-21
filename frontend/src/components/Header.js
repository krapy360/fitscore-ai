import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="topbar">
      <motion.div
        className="brand"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="brandMark" aria-hidden>
          <span className="brandMark__core" />
          <span className="brandMark__ring" />
        </div>
        <div className="brandText">
          <div className="brandName">FitScore</div>
          <div className="brandTag">AI Resume → Job Fit Analyzer</div>
        </div>
      </motion.div>

      <div className="topbarRight">
        <div className="chip">
          <span className="chip__k">Mode</span>
          <span className="chip__v">Neon</span>
        </div>
        <a
          className="chip chip--link"
          href="https://fitscore-ai.onrender.com/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="chip__k">API</span>
          <span className="chip__v">Online</span>
        </a>
      </div>
    </header>
  );
}
