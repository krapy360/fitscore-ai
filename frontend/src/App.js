import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import "./App.css";
import FuturisticBackground from "./components/FuturisticBackground";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import ResultCard from "./components/ResultCard";
import TiltCard from "./components/TiltCard";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const parallaxY1 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -120]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -220]);

  const hasInput = useMemo(() => {
    return Boolean(resumeFile || (resumeText && resumeText.trim().length > 0));
  }, [resumeFile, resumeText]);

  useEffect(() => {
    const root = document.documentElement;

    const set = (x, y) => {
      root.style.setProperty("--mx", `${x}px`);
      root.style.setProperty("--my", `${y}px`);
    };

    const onMove = (e) => set(e.clientX, e.clientY);
    const onTouch = (e) => {
      const t = e.touches?.[0];
      if (t) set(t.clientX, t.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    // initialize near top-center so it doesn't look "dead" until first move
    set(window.innerWidth * 0.55, window.innerHeight * 0.25);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const analyzeFit = async () => {
    if (!hasInput) {
      alert("Please upload a resume file or paste resume text");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (resumeFile) {
      formData.append("resume", resumeFile);
    } else {
      formData.append(
        "resume",
        new Blob([resumeText], { type: "text/plain" }),
        "resume.txt"
      );
    }

    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(
        "https://fitscore-ai.onrender.com/upload-analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uiRoot">
      <FuturisticBackground />
      <div className="cursorLight" aria-hidden />
      <div className="crt" aria-hidden>
        <div className="crt__scanlines" />
        <div className="crt__sweep" />
      </div>

      <div className="uiFrame">
        <Header />

        <motion.main
          className="deck"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.section
            className="pane pane--left"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <TiltCard className="tiltWrap">
              <div className="paneHeader">
                <div>
                  <div className="paneKicker">INPUT DECK</div>
                  <div className="paneTitle">Upload intel</div>
                </div>
                <div className="statusPill" data-state={loading ? "busy" : "idle"}>
                  <span className="statusDot" aria-hidden />
                  {loading ? "Analyzing" : "Ready"}
                </div>
              </div>

              <UploadCard
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onAnalyze={analyzeFit}
                loading={loading}
              />
            </TiltCard>
          </motion.section>

          <motion.section
            className="pane pane--right"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <TiltCard className="tiltWrap">
              <div className="paneHeader">
                <div>
                  <div className="paneKicker">OUTPUT</div>
                  <div className="paneTitle">Fit intelligence</div>
                </div>
                <div className="metaLine">
                  <span className="metaLabel">Endpoint</span>
                  <span className="metaValue">/upload-analyze</span>
                </div>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!result && !loading && (
                  <motion.div
                    key="empty"
                    className="emptyState"
                    initial={{ opacity: 0, y: 16, rotateX: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <div className="emptyTitle">No scan yet</div>
                    <div className="emptyBody">
                      Drop a resume + job description on the left, then run the
                      analyzer. Your result will materialize here.
                    </div>
                    <div className="emptyGrid" aria-hidden>
                      <div className="emptyCell" />
                      <div className="emptyCell" />
                      <div className="emptyCell" />
                      <div className="emptyCell" />
                    </div>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    key="loading"
                    className="loadingState"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="loadingTitle">Running inference</div>
                    <div className="loadingSub">
                      Parsing resume, extracting signals, scoring match…
                    </div>
                    <div className="loadingBar" aria-hidden>
                      <div className="loadingBar__fill" />
                    </div>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.985 }}
                    transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <ResultCard result={result} />
                  </motion.div>
                )}
              </AnimatePresence>
            </TiltCard>
          </motion.section>
        </motion.main>

        <section className="brutalStrip">
          <motion.div className="brutalStrip__layer" style={{ y: parallaxY2 }} aria-hidden />
          <motion.div className="brutalStrip__content" style={{ y: parallaxY1 }}>
            <div className="brutalGrid">
              <div className="brutalTile">
                <div className="brutalTile__k">SIGNAL</div>
                <div className="brutalTile__v">Resume → Skills map</div>
              </div>
              <div className="brutalTile">
                <div className="brutalTile__k">MATCH</div>
                <div className="brutalTile__v">Role alignment vectors</div>
              </div>
              <div className="brutalTile">
                <div className="brutalTile__k">OUTPUT</div>
                <div className="brutalTile__v">Actionable edits</div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="parallaxScene">
          <motion.div
            className="scenePanel"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
          >
            <div className="sceneTitle">BRUTALIST SCI‑FI INTERFACE</div>
            <div className="sceneBody">
              Heavy geometry. Hard edges. Soft light. This is a UI that feels like
              hardware.
            </div>
            <div className="sceneFooter">
              <span className="sceneTag">Parallax</span>
              <span className="sceneTag">Tilt</span>
              <span className="sceneTag">Cursor light</span>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

export default App;
