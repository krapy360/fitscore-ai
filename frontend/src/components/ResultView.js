import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ResultView({ text }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      return;
    }

    let frame;
    let index = 0;
    const len = text.length;

    const step = () => {
      // reveal a few characters per frame for long responses
      const chunkSize = len > 1200 ? 8 : 4;
      index = Math.min(len, index + chunkSize);
      setDisplayed(text.slice(0, index));
      if (index < len) {
        frame = window.requestAnimationFrame(step);
      }
    };

    frame = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [text]);

  if (!text) return null;

  return (
    <div className="result">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        className="resultMarkdown"
        components={{
          h1: ({ node, children, ...props }) => <h2 {...props}>{children}</h2>,
          h2: ({ node, children, ...props }) => <h3 {...props}>{children}</h3>,
          h3: ({ node, children, ...props }) => <h4 {...props}>{children}</h4>,
        }}
      >
        {displayed}
      </ReactMarkdown>
    </div>
  );
}

