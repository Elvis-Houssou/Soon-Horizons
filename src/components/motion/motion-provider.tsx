"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "./hooks";

/**
 * Défilement fluide (Lenis) + réglages communs de Motion.
 * reducedMotion="user" : si l'appareil demande moins d'animations, les mouvements
 * (translations, échelles) sont coupés et seuls les fondus restent. Lenis fait de même.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.9, ease: EASE_OUT }}>
      <ReactLenis root options={{ lerp: 0.085, anchors: { offset: -80 } }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
