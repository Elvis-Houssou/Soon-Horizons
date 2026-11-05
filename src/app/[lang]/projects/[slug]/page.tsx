import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";
import { Magnetic } from "@/components/motion/chrome";
import { PageTransition } from "@/components/motion/page-transition";
import { HeroScrollOut, Parallax } from "@/components/motion/parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ProjectMedia } from "@/components/project-media";
import { ProjectVisual } from "@/components/project-visual";
import { getNextProject, getProject, projectMedia, projects } from "@/content/projects";
import { whatsappLink } from "@/content/site";
import { team } from "@/content/team";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatMonth, formatSurface } from "@/lib/format";
import { projectPlace } from "@/lib/project-view";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const locale = await getLocale();
  return {
    title: project.name,
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { fr: `/fr/projects/${slug}`, en: `/en/projects/${slug}` },
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const locale = await getLocale();
  const t = await getDictionary(locale);
  const next = getNextProject(project.slug);
  const place = projectPlace(project, locale);

  const facts = [
    { label: t.project.location, value: place },
    { label: t.project.period, value: project.period },
    { label: t.project.surface, value: formatSurface(project.surface, locale) },
    ...project.facts.map((fact) => ({ label: fact.label[locale], value: fact.value[locale] })),
    { label: t.project.status, value: t.statuses[project.status], highlight: true },
  ];

  const tabs = projectMedia(project).map((key) => ({
    key,
    label: t.media[key],
    count:
      key === "renders" ? project.renders.length
      : key === "construction" ? project.construction.length
      : key === "plans" ? project.plans.length
      : 1,
  }));

  return (
    <PageTransition>
      <article>
        {/* Hero : même nom de transition que la carte, l'image s'y transforme. */}
        <section className="relative h-[min(calc(92svh-var(--header-h)),780px)] min-h-[500px] overflow-hidden">
          <Parallax speed={-60} className="absolute -inset-y-16 inset-x-0">
            <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
              <div className="h-full w-full">
                <ProjectVisual kind={project.visual} label={`${t.visualPlaceholder} — ${project.name}`} />
              </div>
            </ViewTransition>
          </Parallax>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
          <HeroScrollOut className="absolute inset-x-0 bottom-0">
            <div className="container-site pb-10 sm:pb-14">
              <Reveal trigger="mount" variant="left" delay={0.2}>
                <nav aria-label={t.project.breadcrumbLabel} className="mb-4 font-mono text-[13px] tracking-[0.1em] text-fg-2 uppercase">
                  <Link href={`/${locale}/projects`} className="link-underline hover:text-fg">
                    {t.project.breadcrumb}
                  </Link>{" "}
                  / {project.number} — {t.categories[project.category]}
                </nav>
              </Reveal>
              <SplitText
                as="h1"
                trigger="mount"
                delay={0.3}
                stagger={0.09}
                lines={[project.name]}
                className="font-display text-[clamp(52px,9.5vw,150px)] leading-[0.9] font-bold tracking-[-0.02em]"
              />
              <Reveal trigger="mount" delay={0.8}>
                <p className="mt-4 text-lg text-fg-2">
                  {place} · {t.statuses[project.status]} · {project.year}
                </p>
              </Reveal>
            </div>
          </HeroScrollOut>
        </section>

        <div className="container-site">
          {/* Fiche technique + concept */}
          <section className="grid gap-16 py-[clamp(72px,9vw,128px)] lg:grid-cols-2">
            <div>
              <Reveal variant="left">
                <h2 className="eyebrow mb-5">{t.project.facts}</h2>
              </Reveal>
              <Stagger as="dl" className="grid grid-cols-2 border-t border-line" stagger={0.07}>
                {facts.map((fact) => (
                  <StaggerItem key={fact.label} className="border-b border-line py-4.5 pr-4">
                    <dt className="font-mono text-xs text-muted uppercase">{fact.label}</dt>
                    <dd className={`mt-1.5 text-[17px] ${"highlight" in fact && fact.highlight ? "text-accent-ink" : ""}`}>
                      {fact.value}
                    </dd>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <div>
              <Reveal variant="left">
                <h2 className="eyebrow mb-5">{t.project.concept}</h2>
              </Reveal>
              <SplitText
                as="p"
                stagger={0.035}
                lines={[project.concept.lead[locale]]}
                className="font-display text-[clamp(24px,2.5vw,36px)] leading-[1.25] font-medium"
              />
              <Reveal delay={0.3}>
                <p className="mt-6 text-[17px] leading-[1.7] text-fg-2">{project.concept.body[locale]}</p>
                {project.status !== "approved" && <p className="mt-4 font-mono text-xs text-muted uppercase">{t.project.placeholder}</p>}
              </Reveal>
            </div>
          </section>

          {/* Médiathèque */}
          <Reveal className="pb-[clamp(72px,9vw,128px)]">
            <ProjectMedia
              tabs={tabs}
              visual={project.visual}
              renders={project.renders.map((r) => ({ visual: r.visual, caption: r.caption[locale] }))}
              construction={project.construction.map((step) => ({
                date: formatMonth(step.date, locale),
                label: step.label[locale],
                progress: step.progress,
              }))}
              plans={project.plans.map((plan) => ({ kind: plan.kind, caption: plan.caption[locale] }))}
              labels={{
                region: t.project.mediaLabel,
                tablist: t.project.mediaTabs,
                placeholder: t.visualPlaceholder,
                plansNote: t.project.plansNote,
                plansPreview: t.project.plansPreview,
                before: t.project.before,
                after: t.project.after,
                compare: t.project.compare,
              }}
            />
          </Reveal>

          {/* Équipe de conception : noms et rôles uniquement, jamais de coordonnées. */}
          {project.team.length > 0 && 
            <Stagger as="section" className="grid gap-8 border-t border-line py-14 md:grid-cols-3">
              <StaggerItem variant="left">
                <h2 className="eyebrow">{t.project.team}</h2>
              </StaggerItem>
              {project.team.map((id) => (
                <StaggerItem key={id} className="flex flex-col gap-1">
                  <span className="font-display text-[24px] font-semibold">{team[id].name}</span>
                  <span className="text-[15px] text-muted">{team[id].role[locale]}</span>
                </StaggerItem>
              ))}
              <StaggerItem className="flex flex-col gap-1">
                <span className="font-display text-[24px] font-semibold">Soon Horizons</span>
                <span className="text-[15px] text-muted">{t.project.coordination}</span>
              </StaggerItem>
            </Stagger> 
          }

          {/* Appel à l'action */}
          <Reveal variant="clip" duration={1.4} className="mb-16">
            <section className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[4px] bg-accent p-[clamp(28px,5vw,72px)] text-on-accent">
              <div>
                <SplitText lines={[t.project.ctaTitle]} className="font-display text-[clamp(32px,4vw,60px)] leading-none font-bold" />
                <p className="mt-3 text-[17px]">{t.project.ctaText}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex min-h-13 items-center rounded-full bg-on-accent px-7 font-semibold text-[#edeae4] transition-opacity hover:opacity-85"
                  >
                    {t.project.ctaDescribe}
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href={whatsappLink(`${t.project.whatsappMessage} ${project.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-13 items-center gap-2.5 rounded-full border border-on-accent px-7"
                  >
                    <WhatsAppIcon size={18} /> WhatsApp
                  </a>
                </Magnetic>
              </div>
            </section>
          </Reveal>

          {/* Navigation entre projets */}
          <Stagger as="div" className="grid gap-4 pb-24 sm:grid-cols-2">
            <StaggerItem>
              <Link
                href={`/${locale}/projects`}
                className="group flex h-full flex-col gap-1.5 rounded-[4px] border border-line p-8 transition-colors duration-500 hover:border-fg"
              >
                <span className="font-mono text-xs text-muted uppercase">
                  <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1.5">←</span> {t.project.allProjects}
                </span>
                <span className="font-display text-2xl font-semibold">Index</span>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link
                href={`/${locale}/projects/${next.slug}`}
                data-cursor={t.motion.view}
                className="group relative flex h-full flex-col items-end gap-1.5 overflow-hidden rounded-[4px] border border-line p-8 text-right transition-colors duration-500 hover:border-accent"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-accent/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />
                <span className="relative flex items-center gap-2 font-mono text-xs text-muted uppercase">
                  {t.project.next}
                  <ArrowRightIcon size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
                <span className="relative font-display text-2xl font-semibold">
                  {next.number} — {next.name}
                </span>
              </Link>
            </StaggerItem>
          </Stagger>
        </div>
      </article>
    </PageTransition>
  );
}
