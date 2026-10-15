"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { EASE_OUT } from "../motion/hooks";

type Step = { duration: string; title: string; text: string };

/** Frise de la démarche : la ligne sable se trace au défilement et allume chaque étape. */
export function ProcessTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });
  const [active, setActive] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(value <= 0.02 ? -1 : Math.min(steps.length - 1, Math.floor(value * steps.length + 0.2)));
  });

  return (
    <ol ref={ref} className="relative grid sm:grid-cols-2 lg:grid-cols-4">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-inv-fg/25" />
      <motion.span aria-hidden="true" style={{ scaleX }} className="absolute inset-x-0 -top-px h-[3px] origin-left bg-accent" />
      {steps.map((step, index) => {
        const on = active >= index;
        return (
          <motion.li
            key={step.title}
            className="relative flex flex-col gap-3 pt-10 pr-6 pb-2"
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: index * 0.12, ease: EASE_OUT }}
          >
            <span
              aria-hidden="true"
              className={`absolute -top-[8px] left-0 h-4 w-4 rounded-full border transition-all duration-700 ${
                on ? "scale-125 border-accent bg-accent" : "border-inv-fg/50 bg-inv-bg"
              }`}
            />
            <span className={`font-mono text-[13px] uppercase transition-colors duration-700 ${on ? "text-inv-fg" : "text-inv-muted"}`}>
              {String(index + 1).padStart(2, "0")} · {step.duration}
            </span>
            <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
            <p className="text-[15px] leading-relaxed text-inv-fg-2">{step.text}</p>
          </motion.li>
        );
      })}
    </ol>
  );
}
