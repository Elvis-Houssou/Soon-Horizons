"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useId, useState } from "react";
import type { CategoryKey, MediaKey, StatusKey } from "@/content/projects";
import { EASE_OUT } from "./motion/hooks";
import { ProjectCard, type ProjectCardData } from "./project-card";

export type FilterableProject = ProjectCardData & {
  categoryKey: CategoryKey;
  statusKey: StatusKey;
  mediaKeys: MediaKey[];
};

type Option<K extends string> = { value: K; label: string };

type ProjectFiltersProps = {
  projects: FilterableProject[];
  categories: Option<CategoryKey>[];
  statuses: Option<StatusKey>[];
  media: Option<MediaKey>[];
  labels: {
    category: string;
    status: string;
    media: string;
    all: string;
    allMedia: string;
    reset: string;
    empty: string;
    countOne: string;
    countOther: string;
    placeholderNotice: string;
    visualPlaceholder: string;
    view: string;
  };
};

function FilterGroup<K extends string>({
  legend,
  allLabel,
  options,
  value,
  onChange,
  accent = false,
}: {
  legend: string;
  allLabel: string;
  options: Option<K>[];
  value: K | "all";
  onChange: (value: K | "all") => void;
  accent?: boolean;
}) {
  const pillId = useId();
  const all: Option<K | "all">[] = [{ value: "all", label: allLabel }, ...options];
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="float-left mr-2 w-24 font-mono text-xs text-muted uppercase">{legend}</legend>
      {all.map((option) => {
        const pressed = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(option.value)}
            className={`relative min-h-10 cursor-pointer rounded-full border px-4 text-sm transition-colors duration-300 ${
              pressed
                ? `border-transparent font-semibold ${accent ? "text-on-accent" : "text-bg"}`
                : "border-line-2 text-fg-2 hover:border-fg hover:text-fg"
            }`}
          >
            {/* La pastille glisse d'une option à l'autre. */}
            {pressed && (
              <motion.span
                layoutId={pillId}
                className={`absolute inset-0 rounded-full ${accent ? "bg-accent" : "bg-fg"}`}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </fieldset>
  );
}

export function ProjectFilters({ projects, categories, statuses, media, labels }: ProjectFiltersProps) {
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const [status, setStatus] = useState<StatusKey | "all">("all");
  const [medium, setMedium] = useState<MediaKey | "all">("all");

  const shown = projects.filter(
    (p) =>
      (category === "all" || p.categoryKey === category) &&
      (status === "all" || p.statusKey === status) &&
      (medium === "all" || p.mediaKeys.includes(medium)),
  );

  const reset = () => {
    setCategory("all");
    setStatus("all");
    setMedium("all");
  };

  return (
    <>
      <motion.div
        className="mb-10 flex flex-col gap-4 border-y border-line py-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }}
      >
        <LayoutGroup id="filters-category">
          <FilterGroup legend={labels.category} allLabel={labels.all} options={categories} value={category} onChange={setCategory} />
        </LayoutGroup>
        <LayoutGroup id="filters-status">
          <FilterGroup legend={labels.status} allLabel={labels.all} options={statuses} value={status} onChange={setStatus} />
        </LayoutGroup>
        <LayoutGroup id="filters-media">
          <FilterGroup
            legend={labels.media}
            allLabel={labels.allMedia}
            options={media}
            value={medium}
            onChange={setMedium}
            accent
          />
        </LayoutGroup>
      </motion.div>

      <div className="mb-6 flex flex-wrap justify-between gap-4 font-mono text-[13px] text-muted uppercase">
        <p aria-live="polite" className="flex items-baseline gap-1.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shown.length}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="inline-block text-fg tabular-nums"
            >
              {shown.length}
            </motion.span>
          </AnimatePresence>
          {shown.length > 1 ? labels.countOther : labels.countOne}
        </p>
        <p>{labels.placeholderNotice}</p>
      </div>

      <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((project, index) => (
            <motion.div
              key={project.href}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              <ProjectCard
                project={project}
                placeholderLabel={labels.visualPlaceholder}
                cursorLabel={labels.view}
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {shown.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center text-[17px] text-muted"
          >
            <p>{labels.empty}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 min-h-11 cursor-pointer rounded-full border border-line-2 px-5 text-fg hover:border-fg"
            >
              {labels.reset}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
