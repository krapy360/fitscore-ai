export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <div className="result-card">
      <h2>FitScore Result</h2>
      <pre>{result}</pre>
    </div>
  );
}
