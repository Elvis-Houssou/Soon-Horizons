import type { ProjectCardData } from "@/components/project-card";
import { projectMedia, type Project } from "@/content/projects";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { formatSurface } from "./format";

export function projectPlace(project: Project, locale: Locale) {
  return `${project.city[locale]}, ${project.country[locale]}`;
}

/** Données d'une carte projet, déjà traduites (utilisables dans un composant client). */
export function toCardData(project: Project, locale: Locale, t: Dictionary): ProjectCardData {
  return {
    slug: project.slug,
    href: `/${locale}/projects/${project.slug}`,
    number: project.number,
    name: project.name,
    place: projectPlace(project, locale),
    category: t.categories[project.category],
    status: t.statuses[project.status],
    year: project.year,
    surface: formatSurface(project.surface, locale),
    media: projectMedia(project).map((key) => t.media[key]),
    visual: project.visual,
    visualLabel: `${t.visualPlaceholder} — ${project.name}`,
  };
}
