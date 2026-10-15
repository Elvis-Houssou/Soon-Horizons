import type { Localized } from "@/i18n/config";

/**
 * Concepteurs crédités sur les fiches projet.
 * Nom et rôle UNIQUEMENT : jamais de coordonnées, liens ou nom de cabinet (voir CLAUDE.md).
 */
export type TeamMember = {
  id: string;
  name: string;
  role: Localized;
};

export const team = {
  "mo-kassi": {
    id: "mo-kassi",
    // Personnage fictif en attendant le vrai nom de l'architecte.
    name: "Marc-Olivier Kassi",
    role: { fr: "Architecte, conception", en: "Architect, design" },
  },
} satisfies Record<string, TeamMember>;

export type TeamMemberId = keyof typeof team;
