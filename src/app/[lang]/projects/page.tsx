import type { Metadata } from "next";
import Link from "next/link";
import { Magnetic } from "@/components/motion/chrome";
import { PageTransition } from "@/components/motion/page-transition";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { ProjectFilters } from "@/components/project-filters";
import { categories, mediaKinds, projectMedia, projects, statuses } from "@/content/projects";
import { getDictionary, getLocale } from "@/i18n/server";
import { toCardData } from "@/lib/project-view";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.projects.title,
    description: t.projects.intro,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: { fr: "/fr/projects", en: "/en/projects" },
    },
  };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);

  const items = projects.map((project) => ({
    ...toCardData(project, locale, t),
    categoryKey: project.category,
    statusKey: project.status,
    mediaKeys: projectMedia(project),
  }));

  return (
    <PageTransition>
      <div className="container-site pt-[clamp(48px,7vw,96px)] pb-[clamp(72px,9vw,120px)]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal trigger="mount" variant="left">
              <p className="eyebrow mb-3">{t.projects.eyebrow}</p>
            </Reveal>
            <div className="flex items-start gap-4">
              <SplitText
                as="h1"
                trigger="mount"
                delay={0.1}
                lines={[t.projects.title]}
                className="font-display text-[clamp(56px,9vw,148px)] leading-[0.9] font-bold tracking-[-0.02em]"
              />
              <Reveal trigger="mount" variant="fade" delay={0.7}>
                <sup className="font-mono text-[clamp(14px,1.4vw,20px)] text-accent-ink">({String(projects.length).padStart(2, "0")})</sup>
              </Reveal>
            </div>
          </div>
          <Reveal trigger="mount" delay={0.35}>
            <p className="max-w-[420px] leading-relaxed text-fg-2">{t.projects.intro}</p>
          </Reveal>
        </div>

        <ProjectFilters
          projects={items}
          categories={categories
            .filter((key) => projects.some((p) => p.category === key))
            .map((value) => ({ value, label: t.categories[value] }))}
          statuses={statuses.map((value) => ({ value, label: t.statuses[value] }))}
          media={mediaKinds
            .filter((key) => key !== "beforeAfter")
            .map((value) => ({ value, label: value === "construction" ? t.media.constructionLong : t.media[value] }))}
          labels={{
            ...t.projects.filters,
            countOne: t.projects.count.one,
            countOther: t.projects.count.other,
            placeholderNotice: t.projects.placeholderNotice,
            visualPlaceholder: t.visualPlaceholder,
            view: t.motion.view,
          }}
        />

        <Reveal variant="scale" className="mt-24">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-[4px] border border-line bg-surface p-8 sm:p-12">
            <SplitText as="p" lines={[t.projects.similarTitle]} className="font-display text-[clamp(26px,3vw,44px)] font-semibold" />
            <Magnetic>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex min-h-13 items-center rounded-full bg-accent px-7 font-semibold text-on-accent transition-opacity hover:opacity-85"
              >
                {t.projects.similarCta}
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </PageTransition>
  );
}
