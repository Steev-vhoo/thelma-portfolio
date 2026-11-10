"use client";
import { useMemo, useState, type CSSProperties } from "react";

const COLORS = ["rgba(167,139,250,.38)", "rgba(59,130,246,.38)", "rgba(226,195,95,.42)", "rgba(124,58,237,.38)"];

// Floating bubbles you can pop — a little nod to Thelma's bubbly personality.
export default function Bubbles({ count = 16 }: { count?: number }) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 999 + n) + 1) / 2); // deterministic → no hydration mismatch
        return {
          size: 18 + Math.round(r(1) * 70),
          left: Math.round(r(2) * 100),
          d: 14 + Math.round(r(3) * 16),
          delay: -Math.round(r(4) * 30),
          sway: Math.round((r(5) - 0.5) * 120),
          c: COLORS[i % COLORS.length],
        };
      }),
    [count],
  );
  const [popped, setPopped] = useState<Record<number, number>>({});
  const total = Object.values(popped).reduce((a, b) => a + b, 0);

  const pop = (i: number) => {
    setPopped((p) => ({ ...p, [i]: (p[i] ?? 0) + 1 }));
  };

  return (
    <>
      <div className="bubbles" aria-hidden>
        {bubbles.map((b, i) => (
          <Bubble key={`${i}-${popped[i] ?? 0}`} b={popped[i] ? { ...b, delay: 0 } : b} onPop={() => pop(i)} />
        ))}
      </div>
      <p className="pop-count" aria-hidden>
        {total === 0 ? "psst… the bubbles pop" : `${total} bubble${total === 1 ? "" : "s"} popped ✦`}
      </p>
    </>
  );
}

function Bubble({ b, onPop }: { b: { size: number; left: number; d: number; delay: number; sway: number; c: string }; onPop: () => void }) {
  const [isPopped, setIsPopped] = useState(false);
  return (
    <span
      className="bubble-path"
      style={{ width: b.size, height: b.size, left: `${b.left}%`, "--d": `${b.d}s`, "--delay": `${b.delay}s`, "--sway": `${b.sway}px` } as CSSProperties}
    >
      <button
        tabIndex={-1}
        className={`bubble ${isPopped ? "is-popped" : ""}`}
        style={{ "--c": b.c } as CSSProperties}
        onPointerDown={() => {
          if (isPopped) return;
          setIsPopped(true);
          setTimeout(onPop, 350);
        }}
      />
    </span>
  );
}
