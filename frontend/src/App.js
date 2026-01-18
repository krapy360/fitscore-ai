import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeFit = async () => {
    if (!resumeFile && !resume) {
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
        new Blob([resume], { type: "text/plain" }),
        "resume.txt"
      );
    }

    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch("https://fitscore-ai.onrender.com/upload-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>FitScore</h1>
        <p>AI-powered Resume to Job Fit Analyzer</p>
      </header>

      <div className="card">
        <h3>Resume</h3>

        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />

        <p className="hint">or paste resume text</p>

        <textarea
          rows="8"
          placeholder="Paste resume text here"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        <h3>Job Description</h3>

        <textarea
          rows="8"
          placeholder="Paste job description here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <button onClick={analyzeFit} disabled={loading}>
          {loading ? "Analyzing…" : "Analyze Fit"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <h3>FitScore Result</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
