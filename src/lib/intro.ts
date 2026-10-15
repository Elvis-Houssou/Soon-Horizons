/**
 * Intro animée : jouée une seule fois par session, jamais si l'utilisateur
 * demande moins d'animations. Le script posé dans <head> ajoute html[data-intro]
 * avant le rendu, ce qui affiche l'overlay sans flash pour les visiteurs suivants.
 */
export const INTRO_STORAGE_KEY = "sh-intro";
export const INTRO_DONE_EVENT = "sh-intro-done";

export const introInitScript = `(function(){try{if(!sessionStorage.getItem("${INTRO_STORAGE_KEY}")&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.setAttribute("data-intro","")}catch(e){}})()`;

export function isIntroDone() {
  return !document.documentElement.hasAttribute("data-intro");
}

export function subscribeIntro(callback: () => void) {
  window.addEventListener(INTRO_DONE_EVENT, callback);
  return () => window.removeEventListener(INTRO_DONE_EVENT, callback);
}

export function finishIntro() {
  try {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    // Stockage indisponible : l'intro sera rejouée à la prochaine visite, sans gravité.
  }
  document.documentElement.removeAttribute("data-intro");
  window.dispatchEvent(new Event(INTRO_DONE_EVENT));
}
