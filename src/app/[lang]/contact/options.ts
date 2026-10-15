// Options du formulaire de contact (partagées entre le formulaire et la Server Action).
export const projectTypes = ["house", "building", "office", "hospitality", "public", "renovation", "other"] as const;
export const lands = ["owned", "searching", "existing"] as const;
export const budgets = ["undefined", "b1", "b2", "b3", "b4", "b5"] as const;
export const timelines = ["lt6", "m6to12", "gt12", "unknown"] as const;

export const MAX_FILES = 3;
export const MAX_FILE_SIZE = 3 * 1024 * 1024;
export const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export type ErrorCode = "required" | "email" | "message" | "files";
export type FieldName =
  | "type"
  | "country"
  | "land"
  | "budget"
  | "timeline"
  | "message"
  | "name"
  | "email"
  | "phone"
  | "files";

export type ContactState =
  | { status: "idle" }
  | { status: "error"; errors: Partial<Record<FieldName, ErrorCode>>; values: Record<string, string>; attempt: number }
  | { status: "success"; id: string };
