export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="panelTitle">Insights</div>
      </div>
      <pre className="result">{result}</pre>
    </div>
  );
}
