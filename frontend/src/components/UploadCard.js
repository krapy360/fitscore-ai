export default function UploadCard({
  resumeFile,
  setResumeFile,
  jobDescription,
  setJobDescription,
  onAnalyze,
  loading,
}) {
  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Upload</div>
        <div className="badge">{loading ? "Analyzing…" : "Ready"}</div>
      </div>

      <div className="field">
        <label className="label">Resume (PDF / DOCX / TXT)</label>
        <input
          className="input"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setResumeFile(e.target.files[0] || null)}
        />
        {resumeFile && <div className="hint">Selected: {resumeFile.name}</div>}
      </div>

      <div className="field">
        <label className="label">Job description</label>
        <textarea
          className="textarea"
          rows={10}
          placeholder="Paste job description here…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className="hint">Required (backend uses it for the fit analysis).</div>
      </div>

      <button className="btn" onClick={onAnalyze} disabled={loading}>
        Analyze
      </button>
    </div>
  );
}
