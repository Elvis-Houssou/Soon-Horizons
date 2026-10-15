"use client";

import { stagger, useAnimate } from "motion/react";
import { useEffect } from "react";
import { finishIntro } from "@/lib/intro";
import { EASE_IN_OUT, EASE_OUT } from "./hooks";

const WORD = "SOON HORIZONS";

/** Rideau d'ouverture : l'horizon se trace, le soleil se lève, puis le site se découvre. */
export function Intro({ tagline }: { tagline: string }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!document.documentElement.hasAttribute("data-intro")) return;
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      finishIntro();
    };
    // Filet de sécurité : le site ne reste jamais bloqué derrière l'intro.
    const safety = window.setTimeout(end, 5000);

    (async () => {
      try {
        await animate(".intro-line", { scaleX: [0, 1] }, { duration: 0.7, ease: EASE_IN_OUT });
        await animate(".intro-sun", { y: ["105%", "0%"] }, { duration: 0.8, ease: EASE_OUT });
        animate(".intro-cut", { scaleX: [0, 1] }, { duration: 0.55, delay: stagger(0.1), ease: EASE_IN_OUT });
        animate(".intro-tagline", { opacity: [0, 1], y: [12, 0] }, { duration: 0.6, delay: 0.35 });
        await animate(".intro-letter", { y: ["115%", "0%"] }, { duration: 0.75, delay: stagger(0.035), ease: EASE_OUT });
        await animate(
          scope.current,
          { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] },
          { duration: 0.95, delay: 0.3, ease: EASE_IN_OUT },
        );
      } finally {
        window.clearTimeout(safety);
        end();
      }
    })();

    return () => window.clearTimeout(safety);
  }, [animate, scope]);

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="intro-overlay fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 bg-bg text-fg"
    >
      <svg viewBox="0 0 64 64" width="132" height="132" className="overflow-visible">
        <defs>
          <clipPath id="intro-clip">
            <rect x="0" y="0" width="64" height="38" />
          </clipPath>
        </defs>
        <g clipPath="url(#intro-clip)">
          <path className="intro-sun" d="M10 38 A22 22 0 0 1 54 38 Z" fill="var(--accent)" style={{ transform: "translateY(105%)", transformBox: "fill-box" }} />
        </g>
        <rect className="intro-cut" x="8" y="25.5" width="48" height="2.6" fill="var(--bg)" style={{ transform: "scaleX(0)", transformBox: "fill-box", transformOrigin: "left" }} />
        <rect className="intro-cut" x="8" y="31.5" width="48" height="2.6" fill="var(--bg)" style={{ transform: "scaleX(0)", transformBox: "fill-box", transformOrigin: "left" }} />
        <rect className="intro-line" x="0" y="41" width="64" height="1.6" fill="currentColor" style={{ transform: "scaleX(0)", transformBox: "fill-box", transformOrigin: "center" }} />
      </svg>
      <p className="flex font-display text-[clamp(28px,5vw,56px)] tracking-[0.08em]">
        {WORD.split("").map((letter, index) => (
          <span key={index} className="inline-block overflow-hidden">
            <span
              className={`intro-letter inline-block ${index < 4 ? "font-bold" : "font-medium"}`}
              style={{ transform: "translateY(115%)" }}
            >
              {letter === " " ? " " : letter}
            </span>
          </span>
        ))}
      </p>
      <p className="intro-tagline font-mono text-xs tracking-[0.2em] text-muted uppercase opacity-0">{tagline}</p>
    </div>
  );
}
