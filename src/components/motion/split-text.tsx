"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ElementType } from "react";
import { EASE_OUT, useIntroDone } from "./hooks";

type Segment = { text: string; className?: string };
/** Une ligne : un texte simple, ou des morceaux dont certains ont un style (ex. mot en couleur). */
export type SplitLine = string | Segment[];

type SplitTextProps = {
  lines: SplitLine[];
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** "view" : quand le texte entre à l'écran. "mount" : dès l'affichage (après l'intro). */
  trigger?: "view" | "mount";
};

/**
 * Découpe une ligne en mots. Un mot peut contenir plusieurs morceaux de styles différents
 * (ex. « durable, » où la virgule n'est pas en couleur) : on ne coupe qu'aux espaces.
 */
function toWords(line: Segment[]): Segment[][] {
  const words: Segment[][] = [];
  let current: Segment[] | null = null;
  let afterSpace = true;
  for (const segment of line) {
    for (const token of segment.text.match(/\S+|\s+/g) ?? []) {
      if (/^\s+$/.test(token)) {
        afterSpace = true;
        continue;
      }
      if (afterSpace || !current) {
        current = [];
        words.push(current);
        afterSpace = false;
      }
      current.push({ text: token, className: segment.className });
    }
  }
  return words;
}

const word: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.05, ease: EASE_OUT } },
};

/** Titre révélé mot par mot, chaque mot remontant derrière un masque. */
export function SplitText({ lines, as: Tag = "h2", className = "", delay = 0, stagger = 0.06, trigger = "view" }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const introDone = useIntroDone();
  const visible = trigger === "mount" ? introDone : inView && introDone;

  const segments = lines.map((line) => (typeof line === "string" ? [{ text: line }] : line));
  const fullText = segments.map((line) => line.map((s) => s.text).join("")).join(" ");
  const wordsPerLine = segments.map(toWords);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{fullText}</span>
      <motion.span
        aria-hidden="true"
        className="block"
        initial="hidden"
        animate={visible ? "show" : "hidden"}
        variants={{ show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {wordsPerLine.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((pieces, wordIndex) => (
              <span key={wordIndex} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <motion.span variants={word} className="inline-block origin-bottom-left">
                  {pieces.map((piece, pieceIndex) => (
                    <span key={pieceIndex} className={piece.className}>
                      {piece.text}
                    </span>
                  ))}
                </motion.span>
                {wordIndex < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
