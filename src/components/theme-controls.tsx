"use client";

import { useSyncExternalStore } from "react";
import { readPreference, resolveTheme, setPreference, subscribe, type ThemePreference } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

function usePreference(): ThemePreference {
  // Côté serveur, on ne connaît pas le réglage de l'appareil : "system" est la valeur neutre.
  return useSyncExternalStore(subscribe, readPreference, () => "system");
}

type ToggleLabels = { toLight: string; toDark: string };

/** Bouton soleil/lune de l'en-tête : bascule vers le thème opposé au thème affiché. */
export function ThemeToggle({ labels }: { labels: ToggleLabels }) {
  const theme = useSyncExternalStore(
    subscribe,
    () => resolveTheme(readPreference()),
    () => null,
  );

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = resolveTheme(readPreference()) === "dark" ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> } };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduce) {
      setPreference(next);
      return;
    }

    // Le nouveau thème se dévoile en cercle à partir du bouton.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-vt");
    const transition = doc.startViewTransition(() => setPreference(next));
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.catch(() => {}).finally(() => root.classList.remove("theme-vt"));
  };

  // Les icônes sont affichées par CSS selon le thème effectif (pas de flash à l'hydratation).
  const label = theme === "dark" ? labels.toLight : theme === "light" ? labels.toDark : `${labels.toLight} / ${labels.toDark}`;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-line-2 text-fg transition-colors hover:border-fg"
    >
      <span className="when-dark transition-transform duration-700 hover:rotate-90">
        <SunIcon size={18} />
      </span>
      <span className="when-light transition-transform duration-700 hover:-rotate-12">
        <MoonIcon size={18} />
      </span>
    </button>
  );
}

type PreferenceLabels = { label: string; auto: string; light: string; dark: string };

/** Choix explicite Auto / Clair / Sombre (pied de page) : "Auto" revient au réglage de l'appareil. */
export function ThemePreferencePicker({ labels }: { labels: PreferenceLabels }) {
  const preference = usePreference();
  const options: { value: ThemePreference; label: string }[] = [
    { value: "system", label: labels.auto },
    { value: "light", label: labels.light },
    { value: "dark", label: labels.dark },
  ];

  return (
    <div role="radiogroup" aria-label={labels.label} className="inline-flex rounded-full border border-line-2 p-1">
      {options.map((option) => {
        const checked = preference === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => setPreference(option.value)}
            className={`min-h-9 cursor-pointer rounded-full px-3.5 font-mono text-xs transition-colors ${
              checked ? "bg-fg text-bg" : "text-fg-2 hover:text-fg"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
