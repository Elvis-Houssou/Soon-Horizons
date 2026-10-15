import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/contact-form";
import { MailIcon, PhoneIcon, VideoIcon, WhatsAppIcon } from "@/components/icons";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { site, whatsappLink } from "@/content/site";
import { getDictionary, getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.contact,
    description: t.contact.intro,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact" },
    },
  };
}

function Channel({
  href,
  icon,
  title,
  detail,
  action,
  external = false,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  detail: string;
  action: string;
  external?: boolean;
}) {
  return (
    <StaggerItem as="li" variant="left" className="border-b border-line">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group relative flex items-center justify-between gap-4 overflow-hidden py-5"
      >
        {/* Fond qui se déploie au survol. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-accent/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
        <span className="relative flex items-center gap-3.5 transition-transform duration-500 group-hover:translate-x-3">
          <span className="text-accent-ink transition-transform duration-500 group-hover:scale-110">{icon}</span>
          <span>
            <span className="block text-[17px]">{title}</span>
            <span className="text-sm text-muted">{detail}</span>
          </span>
        </span>
        <span className="relative shrink-0 pr-2 font-mono text-xs text-muted uppercase transition-colors group-hover:text-fg">
          {action} <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </span>
      </a>
    </StaggerItem>
  );
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const c = t.contact.channels;
  const whatsappHref = whatsappLink(t.contact.whatsappMessage);

  return (
    <PageTransition>
      <div className="container-site flex flex-wrap gap-16 pt-[clamp(48px,7vw,96px)] pb-24">
        <aside className="flex min-w-0 flex-[1_1_360px] flex-col gap-10">
          <div>
            <Reveal trigger="mount" variant="left">
              <p className="eyebrow mb-3">{t.contact.eyebrow}</p>
            </Reveal>
            <SplitText
              as="h1"
              trigger="mount"
              delay={0.15}
              stagger={0.09}
              lines={[t.contact.title[0], [{ text: `${t.contact.title[1]} ` }, { text: t.contact.title[2], className: "text-accent-ink" }]]}
              className="font-display text-[clamp(44px,5vw,76px)] leading-[0.95] font-bold"
            />
            <Reveal trigger="mount" delay={0.6}>
              <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed text-fg-2">{t.contact.intro}</p>
            </Reveal>
          </div>
          <Stagger as="ul" className="border-t border-line" stagger={0.1} delay={0.3}>
            <Channel
              href={whatsappHref}
              external
              icon={<WhatsAppIcon size={22} />}
              title={c.whatsapp}
              detail={site.phoneDisplay}
              action={c.whatsappAction}
            />
            <Channel href={`mailto:${site.email}`} icon={<MailIcon size={22} />} title={c.email} detail={site.email} action={c.emailAction} />
            <Channel
              href={site.bookingUrl ?? "#formulaire"}
              external={Boolean(site.bookingUrl)}
              icon={<VideoIcon size={22} />}
              title={c.visio}
              detail={c.visioDetail}
              action={c.visioAction}
            />
            <Channel href={`tel:${site.phoneE164}`} icon={<PhoneIcon size={22} />} title={c.phone} detail={c.phoneDetail} action={c.phoneAction} />
          </Stagger>
          <Reveal variant="fade" delay={0.4}>
            <p className="font-mono text-xs text-muted uppercase">{t.contact.placeholderNotice}</p>
          </Reveal>
        </aside>

        <Reveal trigger="mount" variant="up" delay={0.45} duration={1.3} className="relative min-w-0 flex-[999_1_560px]">
          <section
            id="formulaire"
            aria-label={t.contact.form.label}
            className="rounded-[4px] border border-line bg-surface p-[clamp(20px,4vw,48px)]"
          >
            <ContactForm locale={locale} labels={t.contact.form} whatsappHref={whatsappHref} />
          </section>
        </Reveal>
      </div>
    </PageTransition>
  );
}
