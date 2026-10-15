import Link from "next/link";
import { HeroScene } from "@/components/home/hero-scene";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { Magnetic } from "@/components/motion/chrome";
import { CountUp } from "@/components/motion/count-up";
import { Marquee } from "@/components/motion/marquee";
import { PageTransition } from "@/components/motion/page-transition";
import { HeroScrollOut, Parallax } from "@/components/motion/parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { site, whatsappLink } from "@/content/site";
import { getDictionary, getLocale } from "@/i18n/server";
import { projectPlace, toCardData } from "@/lib/project-view";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const featured = projects[0];
  const recent = projects.slice(0, 3);
  const bookingHref = site.bookingUrl ?? `/${locale}/contact`;

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative h-[min(calc(100svh-var(--header-h)),860px)] min-h-[600px] overflow-hidden">
        <HeroScene label={`${t.visualPlaceholder} — ${featured.name}`} className="absolute inset-0 max-lg:bottom-[38%] lg:translate-x-[20%]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/90 from-10% via-bg/40 via-40% to-transparent to-60% max-lg:hidden"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 via-40% to-transparent" />

        <HeroScrollOut className="absolute inset-x-0 bottom-0">
          <div className="container-site flex flex-wrap items-end justify-between gap-8 pb-12 sm:pb-16">
            <div className="max-w-[860px]">
              <Reveal trigger="mount" variant="blur" delay={0.2}>
                <p className="mb-5 font-mono text-[13px] tracking-[0.1em] text-accent-ink uppercase">{t.home.kicker}</p>
              </Reveal>
              <SplitText
                as="h1"
                trigger="mount"
                delay={0.35}
                stagger={0.08}
                lines={t.home.title}
                className="font-display text-[clamp(44px,7.4vw,118px)] leading-[0.95] font-bold tracking-[-0.015em]"
              />
              <Reveal trigger="mount" delay={0.95}>
                <p className="mt-6 max-w-[520px] text-lg leading-relaxed text-fg-2">{t.home.intro}</p>
              </Reveal>
            </div>
            <Reveal trigger="mount" variant="right" delay={1.15}>
              <Link
                href={`/${locale}/projects/${featured.slug}`}
                data-cursor={t.motion.view}
                className="group flex min-w-[250px] flex-col gap-1 rounded-[4px] border border-line-2 bg-glass px-5 py-4 backdrop-blur-md transition-colors duration-500 hover:border-accent"
              >
                <span className="font-mono text-xs text-muted uppercase">
                  {featured.number} — {t.home.featured}
                </span>
                <span className="font-display text-xl font-semibold">{featured.name}</span>
                <span className="flex items-center gap-2 text-sm text-fg-2">
                  {projectPlace(featured, locale)}
                  <ArrowRightIcon size={16} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
              </Link>
            </Reveal>
          </div>
        </HeroScrollOut>

        {/* Invitation à défiler. */}
        <Reveal trigger="mount" variant="fade" delay={1.6} className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted uppercase">{t.motion.scroll}</span>
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue absolute inset-0 bg-fg" />
          </span>
        </Reveal>
      </section>

      {/* Le studio */}
      <section id="studio" className="container-site grid gap-12 py-[clamp(80px,11vw,160px)] lg:grid-cols-3">
        <Reveal variant="left">
          <p className="eyebrow">{t.home.studioEyebrow}</p>
        </Reveal>
        <div className="min-w-0 lg:col-span-2">
          <SplitText
            as="p"
            stagger={0.025}
            lines={[
              [
                { text: t.home.studioStatement.before },
                { text: t.home.studioStatement.highlight, className: "text-accent-ink" },
                { text: t.home.studioStatement.after },
              ],
            ]}
            className="font-display text-[clamp(26px,3.2vw,46px)] leading-[1.2] font-medium"
          />
          <Stagger as="dl" className="mt-16 grid grid-cols-2 gap-8 border-t border-line pt-8 md:grid-cols-4" stagger={0.12}>
            {t.home.stats.map((stat) => (
              <StaggerItem key={stat.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="font-display text-[clamp(28px,3vw,42px)] font-semibold whitespace-nowrap">
                  <CountUp value={stat.value} locale={locale} />
                </dd>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Bandeau défilant */}
      <Marquee items={t.motion.marquee} />

      {/* Projets récents */}
      <section className="container-site py-[clamp(80px,11vw,160px)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal variant="left">
              <p className="eyebrow mb-3">{t.home.projectsEyebrow}</p>
            </Reveal>
            <SplitText lines={[t.home.projectsTitle]} className="font-display text-[clamp(36px,4.6vw,68px)] leading-none font-bold" />
          </div>
          <Reveal variant="fade" delay={0.3}>
            <Link
              href={`/${locale}/projects`}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-[15px] transition-colors duration-500 hover:border-fg"
            >
              {t.home.allProjects}
              <ArrowRightIcon size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((project, index) => (
            <Parallax key={project.slug} speed={index === 1 ? 50 : 0}>
              <ProjectCard
                project={toCardData(project, locale, t)}
                aspect="portrait"
                placeholderLabel={t.visualPlaceholder}
                cursorLabel={t.motion.view}
                index={index}
              />
            </Parallax>
          ))}
        </div>
      </section>

      {/* Démarche (bande contrastée) */}
      <section id="services" className="relative overflow-hidden bg-inv-bg text-inv-fg">
        <Parallax speed={120} className="pointer-events-none absolute -top-40 -right-40 opacity-[0.07]">
          <LogoMark size={640} cut="var(--inv-bg)" className="text-inv-fg" />
        </Parallax>
        <div className="container-site relative py-[clamp(80px,11vw,160px)]">
          <Reveal variant="left">
            <p className="mb-3 font-mono text-[13px] tracking-[0.1em] text-inv-muted uppercase">{t.home.processEyebrow}</p>
          </Reveal>
          <SplitText
            lines={[t.home.processTitle]}
            className="mb-20 max-w-[920px] font-display text-[clamp(34px,4.6vw,68px)] leading-none font-bold"
          />
          <ProcessTimeline steps={t.home.process} />
        </div>
      </section>

      {/* À distance */}
      <section className="container-site grid items-center gap-12 py-[clamp(80px,11vw,160px)] lg:grid-cols-2">
        <div>
          <Reveal variant="left">
            <p className="eyebrow mb-3">{t.home.remoteEyebrow}</p>
          </Reveal>
          <SplitText lines={[t.home.remoteTitle]} className="font-display text-[clamp(32px,3.8vw,56px)] leading-[1.05] font-bold" />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-fg-2">{t.home.remoteText}</p>
          </Reveal>
        </div>
        <Stagger as="ul" className="border-t border-line" stagger={0.14}>
          {t.home.remoteItems.map((item) => (
            <StaggerItem
              as="li"
              variant="right"
              key={item.label}
              className="group flex justify-between gap-4 border-b border-line py-6 text-lg transition-colors"
            >
              <span className="transition-transform duration-500 group-hover:translate-x-2">{item.label}</span>
              <span className="font-mono text-[13px] text-muted uppercase">{item.detail}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Appel à l'action */}
      <section className="container-site pb-[clamp(80px,10vw,140px)]">
        <Reveal variant="scale" duration={1.3}>
          <div className="relative flex flex-wrap items-end justify-between gap-8 overflow-hidden rounded-[4px] border border-line bg-surface p-[clamp(28px,6vw,88px)]">
            <Parallax speed={-90} className="pointer-events-none absolute -right-24 -bottom-48 opacity-90 max-sm:hidden">
              <svg viewBox="0 0 400 200" width="520" aria-hidden="true">
                <path d="M0 200 A200 200 0 0 1 400 200 Z" fill="var(--accent)" opacity="0.18" />
                <rect x="0" y="80" width="400" height="6" fill="var(--surface)" />
                <rect x="0" y="120" width="400" height="6" fill="var(--surface)" />
              </svg>
            </Parallax>
            <SplitText
              stagger={0.1}
              lines={[t.home.ctaTitle[0], [{ text: t.home.ctaTitle[1], className: "text-accent-ink" }]]}
              className="relative font-display text-[clamp(40px,6.4vw,104px)] leading-[0.95] font-bold"
            />
            <Stagger className="relative flex flex-wrap gap-3" delay={0.4}>
              <StaggerItem>
                <Magnetic>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex min-h-13 items-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-opacity hover:opacity-85"
                  >
                    {t.home.ctaDescribe}
                  </Link>
                </Magnetic>
              </StaggerItem>
              <StaggerItem>
                <Magnetic>
                  <a
                    href={whatsappLink(t.contact.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-13 items-center gap-2.5 rounded-full border border-line-2 px-7 transition-colors duration-500 hover:border-fg"
                  >
                    <WhatsAppIcon size={18} /> WhatsApp
                  </a>
                </Magnetic>
              </StaggerItem>
              <StaggerItem>
                <Magnetic>
                  <a
                    href={bookingHref}
                    className="inline-flex min-h-13 items-center rounded-full border border-line-2 px-7 transition-colors duration-500 hover:border-fg"
                  >
                    {t.home.ctaBook}
                  </a>
                </Magnetic>
              </StaggerItem>
            </Stagger>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
