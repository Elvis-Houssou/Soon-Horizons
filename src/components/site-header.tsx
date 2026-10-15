import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/server";
import { Logo } from "./logo";
import { HeaderShell, Magnetic } from "./motion/chrome";
import { LanguageSwitcher, MobileMenu, NavLinks } from "./navigation";
import { ThemeToggle } from "./theme-controls";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  const items = [
    { href: `/${locale}/projects`, label: t.nav.projects },
    { href: `/${locale}#services`, label: t.nav.services },
    { href: `/${locale}#studio`, label: t.nav.about },
    { href: `/${locale}/contact`, label: t.nav.contact },
  ];
  const cta = { href: `/${locale}/contact`, label: t.nav.start };

  return (
    <HeaderShell className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-glass backdrop-blur-md">
      <div className="container-site flex h-full items-center justify-between gap-4">
        <Link href={`/${locale}`} aria-label={`Soon Horizons — ${t.nav.home}`} className="shrink-0">
          <Logo cut="var(--bg)" />
        </Link>
        <div className="flex items-center gap-3 lg:gap-7">
          <NavLinks items={items} label={t.nav.main} />
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} label={t.language.label} />
          </div>
          <ThemeToggle labels={t.theme} />
          <div className="hidden md:block">
            <Magnetic>
              <Link
                href={cta.href}
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-on-accent transition-opacity hover:opacity-85"
              >
                {cta.label}
              </Link>
            </Magnetic>
          </div>
          <MobileMenu items={items} cta={cta} labels={{ menu: t.nav.menu, close: t.nav.close, nav: t.nav.main }} />
        </div>
      </div>
    </HeaderShell>
  );
}
