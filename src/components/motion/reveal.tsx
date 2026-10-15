"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, useIntroDone } from "./hooks";

type Variant = "up" | "fade" | "clip" | "scale" | "left" | "right" | "blur";

const variants: Record<Variant, Variants> = {
  up: { hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  clip: {
    hidden: { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
    show: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
  },
  scale: { hidden: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -56 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 56 }, show: { opacity: 1, x: 0 } },
  blur: { hidden: { opacity: 0, filter: "blur(14px)", y: 24 }, show: { opacity: 1, filter: "blur(0px)", y: 0 } },
};

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  dl: motion.dl,
  p: motion.p,
  span: motion.span,
  figure: motion.figure,
  header: motion.header,
};
type Tag = keyof typeof tags;

type RevealProps = {
  children: ReactNode;
  as?: Tag;
  variant?: Variant;
  delay?: number;
  duration?: number;
  className?: string;
  /** "view" : à l'entrée dans l'écran. "mount" : dès l'affichage, après l'intro. */
  trigger?: "view" | "mount";
};

/** Fait apparaître un bloc (fondu, montée, rideau, flou…) quand il entre à l'écran. */
export function Reveal({ children, as = "div", variant = "up", delay = 0, duration = 1.1, className, trigger = "view" }: RevealProps) {
  const Component = tags[as] as typeof motion.div;
  const introDone = useIntroDone();
  const v = variants[variant];
  const show = { ...v.show, transition: { duration, delay, ease: EASE_OUT } } as Variants[string];

  return trigger === "mount" ? (
    <Component className={className} initial="hidden" animate={introDone ? "show" : "hidden"} variants={{ hidden: v.hidden, show }}>
      {children}
    </Component>
  ) : (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: v.hidden, show }}
    >
      {children}
    </Component>
  );
}

type StaggerProps = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  stagger?: number;
  delay?: number;
};

/** Conteneur dont les enfants <StaggerItem> apparaissent les uns après les autres. */
export function Stagger({ children, as = "div", className, stagger = 0.09, delay = 0 }: StaggerProps) {
  const Component = tags[as] as typeof motion.div;
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  as = "div",
  className,
  variant = "up",
}: {
  children: ReactNode;
  as?: Tag;
  className?: string;
  variant?: Variant;
}) {
  const Component = tags[as] as typeof motion.div;
  const v = variants[variant];
  return (
    <Component
      className={className}
      variants={{ hidden: v.hidden, show: { ...v.show, transition: { duration: 1, ease: EASE_OUT } } as Variants[string] }}
    >
      {children}
    </Component>
  );
}
