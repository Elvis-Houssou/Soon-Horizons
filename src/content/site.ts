/**
 * Coordonnées de la marque — le SEUL canal de contact du site.
 * Valeurs provisoires (fictives) : à remplacer avant la mise en ligne.
 */
export const site = {
  name: "Soon Horizons",
  url: "https://soonhorizons.com",
  email: "contact@soonhorizons.com",
  phoneDisplay: "+225 07 00 00 00 00",
  phoneE164: "+2250700000000",
  /** Numéro WhatsApp Business, chiffres uniquement (format wa.me). */
  whatsapp: "2250700000000",
  /** Lien Cal.com / Calendly. Tant qu'il est vide, le bouton mène au formulaire. */
  bookingUrl: null as string | null,
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/soonhorizons" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/soonhorizons" },
    { label: "Pinterest", href: "https://www.pinterest.com/soonhorizons" },
  ],
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
