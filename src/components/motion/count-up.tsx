"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

/** "32 000 m²" → 0 → 32 000 m² quand le chiffre entre à l'écran. */
export function CountUp({ value, locale, className }: { value: string; locale: Locale; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const match = value.match(/^([\d\s,.  ]+)(.*)$/);
  const target = match ? Number(match[1].replace(/\D/g, "")) : NaN;
  const suffix = match ? match[2] : "";
  const format = (n: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB").format(n);

  const [display, setDisplay] = useState(() => (Number.isNaN(target) ? value : `0${suffix}`));

  useEffect(() => {
    if (!inView || Number.isNaN(target) || reduce) return;
    const controls = animate(0, target, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(`${format(Math.round(latest))}${suffix}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="tabular-nums">
        {/* Animations réduites : la valeur finale s'affiche directement. */}
        {reduce ? value : display}
      </span>
    </span>
  );
}
