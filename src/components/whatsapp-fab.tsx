import { whatsappLink } from "@/content/site";
import { getDictionary } from "@/i18n/server";
import { WhatsAppIcon } from "./icons";
import { Magnetic } from "./motion/chrome";
import { Reveal } from "./motion/reveal";

export async function WhatsAppFab() {
  const t = await getDictionary();
  return (
    <Reveal trigger="mount" variant="scale" delay={2} className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      <Magnetic strength={0.45}>
        <a
          href={whatsappLink(t.contact.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.whatsappFab}
          title={t.whatsappFab}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_8px_24px_rgb(0_0_0/0.25)] sm:h-15 sm:w-15"
        >
          {/* Halo qui pulse doucement pour attirer l'œil sans gêner. */}
          <span aria-hidden="true" className="halo absolute inset-0 rounded-full bg-accent" />
          <WhatsAppIcon size={26} strokeWidth={1.8} className="relative transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110" />
        </a>
      </Magnetic>
    </Reveal>
  );
}
