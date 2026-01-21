export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="glassCard glassCard--result">
      <div className="resultHeader">
        <div>
          <div className="resultKicker">FITSCAN</div>
          <div className="resultTitle">Result feed</div>
        </div>
        <button
          className="chip chip--button"
          type="button"
          onClick={() => navigator.clipboard?.writeText(result)}
          title="Copy to clipboard"
        >
          <span className="chip__k">Copy</span>
          <span className="chip__v">TXT</span>
        </button>
      </div>
      <pre className="resultPre">{result}</pre>
    </div>
  );
}
