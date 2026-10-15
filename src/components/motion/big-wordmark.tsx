"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "./hooks";

const WORDS = ["SOON", "HORIZONS"];

/** Logotype géant du pied de page : les lettres remontent de l'horizon, le soleil se lève derrière. */
export function BigWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const sunY = useTransform(scrollYProgress, [0, 1], ["70%", "8%"]);

  return (
    <div ref={ref} aria-hidden="true" className="relative overflow-hidden select-none">
      <motion.div
        style={{ y: sunY }}
        className="pointer-events-none absolute left-1/2 top-0 aspect-square w-[42vw] -translate-x-1/2 rounded-full bg-accent opacity-25 blur-[2px]"
      />
      <motion.p
        className="relative flex flex-wrap justify-center gap-x-[0.25em] font-display text-[clamp(52px,12.6vw,232px)] leading-[0.82] tracking-[-0.02em]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ show: { transition: { staggerChildren: 0.045 } } }}
      >
        {WORDS.map((word, wordIndex) => (
          <span key={word} className={`flex ${wordIndex === 0 ? "font-bold" : "font-medium"}`}>
            {word.split("").map((letter, index) => {
              return (
                <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "105%", rotate: 8 },
                      show: { y: "0%", rotate: 0, transition: { duration: 1.2, ease: EASE_OUT } },
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </motion.p>
    </div>
  );
}
