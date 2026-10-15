"use client";

import { useSyncExternalStore } from "react";
import { isIntroDone, subscribeIntro } from "@/lib/intro";

/** Courbe d'accélération commune à tout le site (sortie très douce). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

/** true quand l'intro est terminée (ou n'a pas lieu). Côté serveur : false. */
export function useIntroDone() {
  return useSyncExternalStore(subscribeIntro, isIntroDone, () => false);
}

const finePointerQuery = "(hover: hover) and (pointer: fine)";

/** true sur un appareil avec souris (pas sur écran tactile). */
export function useFinePointer() {
  return useSyncExternalStore(
    (callback) => {
      const media = window.matchMedia(finePointerQuery);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia(finePointerQuery).matches,
    () => false,
  );
}
