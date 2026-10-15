"use server";

import { z } from "zod";
import {
  ACCEPTED_FILE_TYPES,
  budgets,
  lands,
  MAX_FILE_SIZE,
  MAX_FILES,
  projectTypes,
  timelines,
  type ContactState,
  type ErrorCode,
  type FieldName,
} from "./options";

const schema = z.object({
  type: z.enum(projectTypes, { error: "required" }),
  country: z.string().trim().min(1, { error: "required" }).max(80),
  land: z.enum(lands, { error: "required" }),
  budget: z.enum(budgets, { error: "required" }),
  timeline: z.enum(timelines, { error: "required" }),
  message: z.string().trim().min(20, { error: "message" }).max(4000, { error: "message" }),
  name: z.string().trim().min(2, { error: "required" }).max(120),
  email: z.email({ error: "email" }),
  phone: z.string().trim().max(40).optional(),
  lang: z.enum(["fr", "en"]),
});

export async function submitContact(previous: ContactState, formData: FormData): Promise<ContactState> {
  // Champ piège invisible : rempli uniquement par les robots.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", id: crypto.randomUUID() };
  }

  const raw = Object.fromEntries(
    ["type", "country", "land", "budget", "timeline", "message", "name", "email", "phone", "lang"].map((key) => [
      key,
      String(formData.get(key) ?? ""),
    ]),
  );

  const files = formData.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  const filesValid =
    files.length <= MAX_FILES && files.every((file) => file.size <= MAX_FILE_SIZE && ACCEPTED_FILE_TYPES.includes(file.type));

  const parsed = schema.safeParse(raw);

  if (!parsed.success || !filesValid) {
    const errors: Partial<Record<FieldName, ErrorCode>> = {};
    for (const issue of parsed.success ? [] : parsed.error.issues) {
      const field = issue.path[0] as FieldName;
      if (!errors[field]) errors[field] = (issue.message as ErrorCode) ?? "required";
    }
    if (!filesValid) errors.files = "files";
    const attempt = previous.status === "error" ? previous.attempt + 1 : 1;
    return { status: "error", errors, values: raw, attempt };
  }

  const request = parsed.data;

  // TODO(feuille de route) : envoyer la demande par email (Resend) avec les pièces jointes.
  console.info("[contact] Nouvelle demande de projet", {
    ...request,
    files: files.map((file) => ({ name: file.name, size: file.size, type: file.type })),
  });

  return { status: "success", id: crypto.randomUUID() };
}
