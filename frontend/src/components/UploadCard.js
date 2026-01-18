export default function UploadCard({
  resumeFile,
  setResumeFile,
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  onAnalyze,
  loading,
}) {
  return (
    <div className="card">
      <h2>Resume</h2>

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setResumeFile(e.target.files[0])}
      />

      <p className="hint">or paste resume text</p>

      <textarea
        placeholder="Paste resume text here"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <h2>Job Description</h2>

      <textarea
        placeholder="Paste job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button onClick={onAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Fit"}
      </button>
    </div>
  );
}
