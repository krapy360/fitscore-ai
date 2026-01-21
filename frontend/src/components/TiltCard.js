import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function TiltCard({ className = "", children }) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const handlers = useMemo(() => {
    if (prefersReducedMotion) return {};

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      // Brutalist: low-amplitude tilt, hard-ish snap, visible glare
      const rx = (0.5 - py) * 7.5;
      const ry = (px - 0.5) * 9;

      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      el.style.setProperty("--tiltOn", "1");
    };

    const onLeave = () => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
      el.style.setProperty("--tiltOn", "0");
    };

    return { onPointerMove: onMove, onPointerLeave: onLeave };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--gx", `50%`);
    el.style.setProperty("--gy", `35%`);
    el.style.setProperty("--tiltOn", "0");
  }, []);

  return (
    <div
      ref={ref}
      className={`tiltCard ${className}`.trim()}
      {...handlers}
    >
      <div className="tiltCard__inner">{children}</div>
      <div className="tiltCard__glare" aria-hidden />
    </div>
  );
}

