"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Fragment, useRef } from "react";
import { LogoMark } from "../logo";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Bandeau de mots qui défile en continu. Il accélère, s'incline et change de sens
 * selon la vitesse et la direction du défilement de la page.
 */
export function Marquee({ items, baseVelocity = 3 }: { items: string[]; baseVelocity?: number }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2500, 2500], reduce ? [0, 0] : [10, -10]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    move += direction.current * move * Math.abs(factor);
    baseX.set(baseX.get() + move);
  });

  const sequence = (
    <span className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <Fragment key={item}>
          <span className={`px-[0.35em] ${index % 2 === 1 ? "text-outline" : ""}`}>{item}</span>
          <LogoMark size={64} cut="var(--bg)" className="mx-[0.2em] h-[0.55em] w-[0.55em] shrink-0 text-fg" />
        </Fragment>
      ))}
    </span>
  );

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-6 select-none">
      <motion.div
        style={{ x, skewX }}
        className="flex w-max font-display text-[clamp(56px,9vw,148px)] leading-none font-bold whitespace-nowrap uppercase"
      >
        {sequence}
        {sequence}
        {sequence}
        {sequence}
      </motion.div>
    </div>
  );
}
