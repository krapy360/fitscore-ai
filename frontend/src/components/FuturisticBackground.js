import { useEffect, useRef } from "react";

export default function FuturisticBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const points = Array.from({ length: 70 }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00018,
      p: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const tick = (t) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Soft nebula glow
      const g = ctx.createRadialGradient(w * 0.6, h * 0.35, 0, w * 0.6, h * 0.35, Math.max(w, h) * 0.75);
      g.addColorStop(0, "rgba(120, 50, 255, 0.18)");
      g.addColorStop(0.45, "rgba(0, 255, 210, 0.10)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Particles + subtle connections
      for (const p of points) {
        p.x += p.vx;
        p.y += p.vy;
        p.p += 0.004;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05) p.y = -0.05;
      }

      // Lines
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i];
          const b = points[j];
          const dx = (a.x - b.x) * w;
          const dy = (a.y - b.y) * h;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            const alpha = (1 - d / 160) * 0.08;
            ctx.strokeStyle = `rgba(120, 245, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of points) {
        const x = p.x * w;
        const y = p.y * h;
        const pulse = 0.6 + 0.4 * Math.sin(p.p + t * 0.0012);
        const r = p.r * pulse;
        ctx.fillStyle = "rgba(210, 250, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = window.requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="bg" aria-hidden>
      <canvas ref={canvasRef} className="bg__canvas" />
      <div className="bg__grid" />
      <div className="bg__noise" />
      <div className="bg__vignette" />
    </div>
  );
}

