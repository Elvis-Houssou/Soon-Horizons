"use client";

import { animate, AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { MediaKey, VisualKind } from "@/content/projects";
import { EASE_OUT } from "./motion/hooks";
import { PlanDrawing } from "./plan-drawing";
import { ProjectVisual } from "./project-visual";

type ProjectMediaProps = {
  tabs: { key: MediaKey; label: string; count: number }[];
  renders: { visual: VisualKind; caption: string }[];
  construction: { date: string; label: string; progress: number }[];
  plans: { kind: "plan" | "section"; caption: string }[];
  visual: VisualKind;
  labels: {
    region: string;
    tablist: string;
    placeholder: string;
    plansNote: string;
    plansPreview: string;
    before: string;
    after: string;
    compare: string;
  };
};

const item = {
  hidden: { opacity: 0, y: 40, clipPath: "inset(0% 0% 100% 0%)" },
  show: { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1, ease: EASE_OUT } },
};

export function ProjectMedia({ tabs, renders, construction, plans, visual, labels }: ProjectMediaProps) {
  const [active, setActive] = useState<MediaKey>(tabs[0]?.key ?? "renders");
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (tabs.length === 0) return null;

  // Navigation clavier du motif "tabs" (flèches, Début, Fin).
  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-label={labels.region}>
      <div role="tablist" aria-label={labels.tablist} className="mb-10 flex flex-wrap gap-2 border-b border-line">
        {tabs.map((tab, index) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`relative min-h-13 cursor-pointer px-4 text-base transition-colors duration-300 sm:px-5 ${
                selected ? "font-semibold text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {tab.label} <span className="font-mono text-xs text-muted">{String(tab.count).padStart(2, "0")}</span>
              {selected && (
                <motion.span
                  layoutId={`${baseId}-underline`}
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          role="tabpanel"
          id={`${baseId}-panel-${active}`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          {active === "renders" && (
            <motion.div
              className="grid gap-4 md:grid-cols-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              variants={{ show: { transition: { staggerChildren: 0.15 } } }}
            >
              {renders.map((render, index) => (
                <motion.figure key={render.caption} variants={item} className={index === 0 ? "md:col-span-2" : ""}>
                  <div className={`group overflow-hidden rounded-[4px] ${index === 0 ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
                    <ProjectVisual
                      kind={render.visual}
                      label={`${labels.placeholder} — ${render.caption}`}
                      className="transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <figcaption className="mt-2.5 font-mono text-xs text-muted uppercase">
                    {String(index + 1).padStart(2, "0")} — {render.caption}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          )}

          {active === "construction" && (
            <motion.ol
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            >
              {construction.map((step, index) => (
                <motion.li key={step.date} variants={item} className="flex flex-col gap-2.5">
                  <div className="aspect-square overflow-hidden rounded-[4px]">
                    <ConstructionVisual progress={step.progress} delay={0.3 + index * 0.12} label={`${labels.placeholder} — ${step.label}`} />
                  </div>
                  <div className="flex justify-between gap-2 font-mono text-xs text-accent-ink uppercase">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{step.date}</span>
                  </div>
                  <p>{step.label}</p>
                </motion.li>
              ))}
            </motion.ol>
          )}

          {active === "plans" && (
            <>
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.15 } } }}
              >
                {plans.map((plan) => (
                  <motion.figure
                    key={plan.caption}
                    variants={item}
                    className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line"
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    <PlanDrawing kind={plan.kind} label={plan.caption} />
                    <figcaption className="absolute bottom-2.5 left-3 font-mono text-[11.5px] text-[#3d3a35] uppercase">
                      {plan.caption} · {labels.plansPreview}
                    </figcaption>
                  </motion.figure>
                ))}
              </motion.div>
              <p className="mt-4 text-sm text-muted">{labels.plansNote}</p>
            </>
          )}

          {active === "beforeAfter" && <BeforeAfter visual={visual} labels={labels} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/** Le bâtiment « pousse » jusqu'à son état d'avancement. */
function ConstructionVisual({ progress, label, delay }: { progress: number; label: string; delay: number }) {
  const height = Math.max(8, Math.round(110 * progress));
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="block h-full w-full">
      <rect width="200" height="200" fill="var(--img-sky)" />
      <rect x="0" y="150" width="200" height="50" fill="var(--img-ground)" />
      <motion.rect
        x="30"
        width="140"
        fill="var(--img-b2)"
        stroke="var(--img-stroke)"
        initial={{ y: 150, height: 0 }}
        animate={{ y: 150 - height, height }}
        transition={{ duration: 1.4, delay, ease: EASE_OUT }}
      />
      <motion.line
        x1="30"
        y1="150"
        x2="30"
        y2="40"
        stroke="var(--accent)"
        strokeOpacity="0.8"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay }}
      />
      <motion.line
        x1="170"
        y1="150"
        x2="170"
        y2="40"
        stroke="var(--accent)"
        strokeOpacity="0.8"
        strokeDasharray="3 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: delay + 0.1 }}
      />
    </svg>
  );
}

function BeforeAfter({ visual, labels }: { visual: VisualKind; labels: ProjectMediaProps["labels"] }) {
  const [position, setPosition] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  // Petit balayage automatique pour montrer que la comparaison est interactive.
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(50, [50, 78, 22, 50], {
      duration: 2.6,
      delay: 0.4,
      ease: "easeInOut",
      onUpdate: (value) => {
        if (!touched.current) setPosition(value);
      },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <div ref={ref}>
      <div className="relative aspect-[21/9] overflow-hidden rounded-[4px] bg-[#2b2620]">
        {/* "Après" : photo réelle (simulée par une version teintée du rendu en attendant les vraies photos). */}
        <div className="absolute inset-0 sepia saturate-[0.6]">
          <ProjectVisual kind={visual} />
        </div>
        <span className="absolute top-3 right-3 rounded-[2px] bg-glass px-2 py-1 font-mono text-xs text-fg uppercase">
          {labels.after}
        </span>
        {/* "Avant" : rendu 3D, découpé selon la position du curseur. */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <ProjectVisual kind={visual} />
          <span className="absolute top-3 left-3 rounded-[2px] bg-glass px-2 py-1 font-mono text-xs text-fg uppercase">
            {labels.before}
          </span>
        </div>
        <div aria-hidden="true" className="absolute inset-y-0 w-0.5 bg-accent" style={{ left: `calc(${position}% - 1px)` }}>
          <span className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent font-mono text-sm text-on-accent">
            ⟷
          </span>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-4 font-mono text-xs text-muted uppercase">
        {labels.before}
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(position)}
          onChange={(event) => {
            touched.current = true;
            setPosition(Number(event.target.value));
          }}
          aria-label={labels.compare}
          className="min-h-11 flex-1 accent-[var(--accent)]"
        />
        {labels.after}
      </label>
    </div>
  );
}
