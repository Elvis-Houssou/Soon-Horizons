"use client";

import { useActionState, useState } from "react";
import { submitContact } from "@/app/[lang]/contact/actions";
import {
  ACCEPTED_FILE_TYPES,
  budgets,
  lands,
  projectTypes,
  timelines,
  type ContactState,
  type FieldName,
} from "@/app/[lang]/contact/options";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/fr";
import { motion, type Variants } from "motion/react";
import { PaperclipIcon } from "./icons";

const successItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

type ContactFormProps = {
  locale: Locale;
  labels: Dictionary["contact"]["form"];
  whatsappHref: string;
};

const fieldClass =
  "min-h-12 w-full rounded-[4px] border border-line-2 bg-field px-3 font-sans text-[15px] tracking-normal normal-case text-fg placeholder:text-muted aria-[invalid=true]:border-danger";
const labelClass = "flex flex-col gap-2 font-mono text-xs uppercase text-muted";

export function ContactForm({ locale, labels, whatsappHref }: ContactFormProps) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, { status: "idle" });
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  if (state.status === "success" && state.id !== dismissedId) {
    return (
      <motion.div
        role="status"
        className="flex min-h-[520px] flex-col items-start justify-center gap-5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.9 } } }}
      >
        {/* Le soleil de la marque se lève pour célébrer l'envoi. */}
        <svg viewBox="0 0 64 64" width="88" height="88" aria-hidden="true" className="text-fg">
          <defs>
            <clipPath id="success-clip">
              <rect x="0" y="0" width="64" height="38" />
            </clipPath>
          </defs>
          <g clipPath="url(#success-clip)">
            <motion.path
              d="M10 38 A22 22 0 0 1 54 38 Z"
              fill="var(--accent)"
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          </g>
          <motion.rect
            x="4"
            y="41"
            width="56"
            height="2.4"
            fill="currentColor"
            style={{ transformBox: "fill-box", originX: 0.5 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />
        </svg>
        <motion.h2
          variants={successItem}
          className="font-display text-[clamp(32px,3.6vw,48px)] leading-[1.05] font-bold"
        >
          {labels.success.title[0]}
          <br />
          {labels.success.title[1]}
        </motion.h2>
        <motion.p variants={successItem} className="max-w-[460px] text-[17px] leading-relaxed text-fg-2">
          {labels.success.text}
        </motion.p>
        <motion.div variants={successItem} className="flex flex-wrap gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-13 items-center rounded-full bg-accent px-6 font-semibold text-on-accent"
          >
            {labels.success.whatsapp}
          </a>
          <button
            type="button"
            onClick={() => setDismissedId(state.id)}
            className="min-h-13 cursor-pointer rounded-full border border-line-2 px-6 hover:border-fg"
          >
            {labels.success.again}
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const errorText = (field: FieldName) => {
    const code = errors[field];
    return code ? labels.errors[code] : null;
  };
  const describe = (field: FieldName) => (errors[field] ? `${field}-error` : undefined);

  return (
    // La clé remonte le formulaire après une erreur pour réafficher les valeurs saisies.
    <form key={state.status === "error" ? state.attempt : 0} action={formAction} noValidate className="flex flex-col gap-7">
      <input type="hidden" name="lang" value={locale} />
      {/* Piège à robots : invisible pour les humains. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-[4px] border border-danger px-4 py-3 text-sm text-fg">
          {labels.errors.generic}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 font-mono text-xs text-muted uppercase">{labels.type}</legend>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map((type) => (
            <label
              key={type}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-2 px-4 text-sm text-fg-2 transition-colors hover:border-fg has-checked:border-accent has-checked:bg-accent has-checked:font-semibold has-checked:text-on-accent has-focus-visible:outline-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="type"
                value={type}
                defaultChecked={(values.type || "house") === type}
                className="sr-only"
              />
              {labels.types[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>
          {labels.country}
          <select name="country" defaultValue={values.country || labels.countries[0]} className={fieldClass}>
            {labels.countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {labels.land}
          <select name="land" defaultValue={values.land || "owned"} className={fieldClass}>
            {lands.map((land) => (
              <option key={land} value={land}>
                {labels.lands[land]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {labels.budget}
          <select name="budget" defaultValue={values.budget || "undefined"} className={fieldClass}>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {labels.budgets[budget]}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {labels.timeline}
          <select name="timeline" defaultValue={values.timeline || "m6to12"} className={fieldClass}>
            {timelines.map((timeline) => (
              <option key={timeline} value={timeline}>
                {labels.timelines[timeline]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={labelClass}>
        {labels.message}
        <textarea
          name="message"
          rows={5}
          required
          minLength={20}
          defaultValue={values.message}
          placeholder={labels.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describe("message")}
          className={`${fieldClass} resize-y py-3 leading-normal normal-case`}
        />
        {errorText("message") && (
          <span id="message-error" className="font-sans text-sm normal-case text-danger">
            {errorText("message")}
          </span>
        )}
      </label>

      <label className="flex flex-wrap items-center justify-between gap-4 rounded-[4px] border border-dashed border-line-2 p-4 text-[15px] text-fg-2">
        <span className="flex items-center gap-3">
          <PaperclipIcon size={18} />
          <span>
            {labels.files} <span className="text-muted">({labels.filesHint})</span>
          </span>
        </span>
        <input
          type="file"
          name="files"
          multiple
          accept={ACCEPTED_FILE_TYPES.join(",")}
          aria-invalid={Boolean(errors.files)}
          aria-describedby={describe("files")}
          className="max-w-full text-[13px] text-muted file:mr-3 file:cursor-pointer file:rounded-full file:border file:border-line-2 file:bg-transparent file:px-3 file:py-1.5 file:text-fg"
        />
        {errorText("files") && (
          <span id="files-error" className="w-full text-sm text-danger">
            {errorText("files")}
          </span>
        )}
      </label>

      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          {labels.name}
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            className={`${fieldClass} normal-case`}
          />
          {errorText("name") && (
            <span id="name-error" className="font-sans text-sm normal-case text-danger">
              {errorText("name")}
            </span>
          )}
        </label>
        <label className={labelClass}>
          {labels.email}
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            className={`${fieldClass} normal-case`}
          />
          {errorText("email") && (
            <span id="email-error" className="font-sans text-sm normal-case text-danger">
              {errorText("email")}
            </span>
          )}
        </label>
        <label className={labelClass}>
          {labels.phone}
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            defaultValue={values.phone}
            placeholder={labels.phonePlaceholder}
            className={`${fieldClass} normal-case`}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="max-w-[380px] text-[13px] text-muted">{labels.privacy}</p>
        <button
          type="submit"
          disabled={pending}
          className="min-h-13 cursor-pointer rounded-full bg-accent px-7 font-semibold text-on-accent transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? labels.sending : labels.submit}
        </button>
      </div>
    </form>
  );
}
