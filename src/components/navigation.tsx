"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { locales, type Locale } from "@/i18n/config";
import { CloseIcon, MenuIcon } from "./icons";

export type NavItem = { href: string; label: string };

function isCurrent(pathname: string, href: string) {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="hidden items-center gap-7 text-[15px] lg:flex">
      {items.map((item) => {
        const current = isCurrent(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`link-underline ${current ? "text-accent-ink" : "text-fg"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/(fr|en)(?=\/|$)/, "");

  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line-2 p-[3px]">
      {locales.map((value) => {
        const active = value === locale;
        return (
          <Link
            key={value}
            href={`/${value}${rest}`}
            hrefLang={value}
            lang={value}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              document.cookie = `sh-lang=${value}; path=/; max-age=31536000; samesite=lax`;
            }}
            className={`flex min-h-8 min-w-11 items-center justify-center rounded-full font-mono text-xs uppercase transition-colors ${
              active ? "bg-fg font-semibold text-bg" : "text-fg-2 hover:text-fg"
            }`}
          >
            {value}
          </Link>
        );
      })}
    </div>
  );
}

type MobileMenuProps = {
  items: NavItem[];
  cta: NavItem;
  labels: { menu: string; close: string; nav: string };
};

export function MobileMenu({ items, cta, labels }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu à chaque navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const lenis = useLenis();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.menu}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line-2 text-fg"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </motion.span>
        </AnimatePresence>
      </button>
      {/* Portail vers <body> : l'en-tête (flou + transformation) emprisonnerait un élément fixe. */}
      {mounted &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ clipPath: "circle(0% at 92% 0%)" }}
            animate={{ clipPath: "circle(150% at 92% 0%)" }}
            exit={{ clipPath: "circle(0% at 92% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto border-t border-line bg-bg"
          >
            <motion.nav
              aria-label={labels.nav}
              className="container-site flex flex-col py-6"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            >
              {items.map((item, index) => (
                <div key={item.href} className="overflow-hidden border-b border-line">
                  <motion.div
                    variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                      className="flex items-baseline gap-4 py-5 font-display text-4xl font-semibold aria-[current=page]:text-accent-ink"
                    >
                      <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={cta.href}
                  onClick={() => setOpen(false)}
                  className="mt-8 flex min-h-13 items-center justify-center rounded-full bg-accent px-6 font-semibold text-on-accent"
                >
                  {cta.label}
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
