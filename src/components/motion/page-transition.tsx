import { ViewTransition, type ReactNode } from "react";

/**
 * Transition entre pages (View Transitions natives, React 19.3 / Next 16) :
 * l'ancienne page s'efface vers le haut avec un flou, la nouvelle monte derrière un rideau.
 * À placer dans chaque page.tsx (les layouts persistent et ne déclenchent pas l'animation).
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
