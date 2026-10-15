import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/server";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return (
    <div className="container-site flex min-h-[60svh] flex-col items-start justify-center gap-6 py-24">
      <p className="eyebrow">404</p>
      <h1 className="font-display text-[clamp(44px,6vw,88px)] leading-[0.95] font-bold">{t.notFound.title}</h1>
      <p className="text-lg text-fg-2">{t.notFound.text}</p>
      <Link
        href={`/${locale}`}
        className="inline-flex min-h-13 items-center rounded-full bg-accent px-6 font-semibold text-on-accent"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
