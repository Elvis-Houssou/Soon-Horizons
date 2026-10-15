import Link from "next/link";
import { site, whatsappLink } from "@/content/site";
import { getDictionary, getLocale } from "@/i18n/server";
import { BigWordmark } from "./motion/big-wordmark";
import { LanguageSwitcher } from "./navigation";
import { Wordmark } from "./logo";
import { ThemePreferencePicker } from "./theme-controls";

const COPYRIGHT_YEAR = 2026;

export async function SiteFooter() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-10 py-12 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href={`/${locale}`} className="text-lg text-fg">
            <Wordmark />
          </Link>
          <p>{t.meta.tagline}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="mb-1 font-mono text-xs uppercase text-fg">{t.footer.contact}</h2>
          <a href={`mailto:${site.email}`} className="hover:text-fg">
            {site.email}
          </a>
          <a href={whatsappLink(t.contact.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
            {site.phoneDisplay} (WhatsApp)
          </a>
          <p>{t.footer.base}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="mb-1 font-mono text-xs uppercase text-fg">{t.footer.follow}</h2>
          {site.socials.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              {social.label}
            </a>
          ))}
        </div>
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-fg">{t.theme.label}</span>
            <ThemePreferencePicker labels={t.theme} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase text-fg">{t.language.label}</span>
            <LanguageSwitcher locale={locale} label={t.language.label} />
          </div>
        </div>
      </div>
      <div className="container-site">
        <BigWordmark />
      </div>
      <div className="container-site border-t border-line py-6 text-xs text-muted">
        © {COPYRIGHT_YEAR} {site.name}. {t.footer.rights}
      </div>
    </footer>
  );
}
