import type { Locale } from "@/i18n/config";

const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };

export function formatSurface(value: number, locale: Locale) {
  return `${new Intl.NumberFormat(intlLocale[locale]).format(value)} m²`;
}

/** "2024-03" → "mars 2024" / "Mar 2024". */
export function formatMonth(yearMonth: string, locale: Locale) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], { month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

export function plural(count: number, forms: { one: string; other: string }) {
  return `${count} ${count > 1 ? forms.other : forms.one}`;
}
