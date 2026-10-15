"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ViewTransition } from "react";
import type { VisualKind } from "@/content/projects";
import { EASE_OUT } from "./motion/hooks";
import { ProjectVisual } from "./project-visual";

export type ProjectCardData = {
  slug: string;
  href: string;
  number: string;
  name: string;
  place: string;
  category: string;
  status: string;
  year: number;
  surface: string;
  media: string[];
  visual: VisualKind;
  visualLabel: string;
};

type ProjectCardProps = {
  project: ProjectCardData;
  aspect?: "portrait" | "landscape";
  placeholderLabel: string;
  /** Libellé affiché dans le curseur au survol (ex. « Voir »). */
  cursorLabel: string;
  index?: number;
};

export function ProjectCard({ project, aspect = "landscape", placeholderLabel, cursorLabel, index = 0 }: ProjectCardProps) {
  const delay = (index % 3) * 0.12;

  return (
    <Link href={project.href} data-cursor={cursorLabel} className="group flex flex-col gap-3.5">
      <motion.div
        className="relative overflow-hidden rounded-[4px]"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.3, delay, ease: EASE_OUT }}
      >
        {/* Même nom que le visuel de la fiche : l'image se transforme pendant la navigation. */}
        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div className={aspect === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]"}>
            <motion.div
              className="h-full w-full"
              initial={{ scale: 1.3 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, delay, ease: EASE_OUT }}
            >
              <ProjectVisual
                kind={project.visual}
                label={project.visualLabel}
                className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </motion.div>
          </div>
        </ViewTransition>
        <span className="absolute top-3 left-3 rounded-[2px] bg-glass px-2 py-1 font-mono text-[11.5px] text-fg uppercase backdrop-blur-sm">
          {project.status}
        </span>
        <span className="absolute right-3 bottom-3 rounded-[2px] bg-glass px-2 py-1 font-mono text-[11px] text-fg-2 uppercase backdrop-blur-sm">
          {placeholderLabel}
        </span>
        {/* Trait sable qui se dessine sous l'image au survol. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-3.5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1, delay: delay + 0.25, ease: EASE_OUT }}
      >
        <div className="flex justify-between gap-3 font-mono text-xs text-muted uppercase">
          <span>
            {project.number} — {project.category}
          </span>
          <span>
            {project.year} · {project.surface}
          </span>
        </div>
        <h3 className="flex items-center gap-3 font-display text-[26px] leading-[1.1] font-semibold">
          <span className="transition-colors duration-500 group-hover:text-accent-ink">{project.name}</span>
          <span
            aria-hidden="true"
            className="-translate-x-3 text-accent-ink opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </h3>
        <p className="-mt-1.5 text-[15px] text-muted">{project.place}</p>
        {project.media.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {project.media.map((label) => (
              <li key={label} className="rounded-[2px] border border-line px-2 py-1 font-mono text-[11.5px] text-fg-2 uppercase">
                {label}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </Link>
  );
}
