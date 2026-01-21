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
    <div className="glassCard">
      <div className="formGrid">
        <div className="field">
          <div className="fieldLabelRow">
            <div className="fieldLabel">Resume signal</div>
            <div className="fieldHint">PDF / DOCX / TXT</div>
          </div>

          <label className="fileDrop">
            <input
              className="fileDrop__input"
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <div className="fileDrop__body">
              <div className="fileDrop__title">
                {resumeFile ? resumeFile.name : "Drop a file or click to upload"}
              </div>
              <div className="fileDrop__sub">
                {resumeFile ? "File locked-in" : "Or paste text below"}
              </div>
            </div>
          </label>

          <textarea
            className="neoTextarea"
            rows={7}
            placeholder="Paste resume text here…"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>

        <div className="field">
          <div className="fieldLabelRow">
            <div className="fieldLabel">Job description</div>
            <div className="fieldHint">What you’re applying for</div>
          </div>
          <textarea
            className="neoTextarea"
            rows={9}
            placeholder="Paste job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="actionsRow">
        <button className="neoButton" onClick={onAnalyze} disabled={loading}>
          <span className="neoButton__glow" aria-hidden />
          <span className="neoButton__label">
            {loading ? "Analyzing…" : "Analyze Fit"}
          </span>
          <span className="neoButton__icon" aria-hidden>
            ↗
          </span>
        </button>

        <div className="microCopy">
          Tip: the analyzer works best when the job description includes
          responsibilities + required skills.
        </div>
      </div>
    </div>
  );
}
