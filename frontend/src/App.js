import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./App.css";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const hasInput = useMemo(() => {
    return Boolean(resumeFile && jobDescription.trim().length > 0);
  }, [resumeFile, jobDescription]);

  const analyzeFit = async () => {
    if (!hasInput) {
      alert("Please upload a resume file and paste a job description.");
      return;
    }

    setLoading(true);
    setResult("");

    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {
      const apiBase =
        process.env.REACT_APP_API_BASE?.replace(/\/+$/, "") ||
        "http://localhost:5000";

      const response = await fetch(`${apiBase}/upload-analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.analysis || data.error || "No analysis returned.");
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appShell">
      <Header />

      <motion.div
        className="container"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <UploadCard
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyze={analyzeFit}
          loading={loading}
        />

        <div className="panel">
          <div className="panelHeader">
            <div className="panelTitle">Insights</div>
            {result && !loading && (
              <button
                className="btn btnSecondary"
                type="button"
                onClick={() => navigator.clipboard?.writeText(result)}
              >
                Copy
              </button>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!result && !loading && (
              <motion.div
                key="empty"
                className="muted"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                Upload a resume + paste a job description, then click Analyze.
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                className="muted"
                initial={prefersReducedMotion ? false : { opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Analyzing…
              </motion.div>
            )}

            {result && !loading && (
              <motion.pre
                key="result"
                className="result"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {result}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
