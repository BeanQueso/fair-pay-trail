import { supabase } from "@/integrations/supabase/client";

export { supabase };

export const EVIDENCE_BUCKET = "evidence";

export type ProcessingStatus = "uploaded" | "processing" | "ready" | "failed";

export interface EvidenceRow {
  id: string;
  user_id: string;
  case_id: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  storage_path: string;
  evidence_type: string | null;
  processing_status: ProcessingStatus;
  extracted_text: string | null;
  extracted_data: ExtractedData | null;
  processing_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExtractedData {
  evidence_type?: string;
  transcription?: string;
  dates?: string[];
  amounts?: (string | number)[];
  hours?: (string | number)[];
  pay_rates?: (string | number)[];
  entities?: string[];
  key_facts?: string[];
  uncertain_items?: string[];
  [key: string]: unknown;
}

export interface TimelineEventItem {
  date?: string | null;
  title?: string | null;
  event?: string | null;
  description?: string | null;
  source?: string | null;
  [key: string]: unknown;
}

export interface CaseAnalysis {
  summary?: string;
  extracted_facts?: string[];
  timeline_events?: TimelineEventItem[];
  possible_discrepancies?: string[];
  missing_evidence?: string[];
  recommended_next_step?: string;
  safety_flags?: string[];
  /** Client-side bookkeeping so we know when the analysis is stale. */
  generated_at?: string;
  evidence_signature?: string;
  /** Language the review was written in, so we can offer to re-run it after a language switch. */
  language?: string;
}

export interface CaseRow {
  id: string;
  user_id: string;
  title: string | null;
  status: string | null;
  latest_analysis: CaseAnalysis | null;
  created_at: string;
  updated_at: string;
}

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
];

export const ACCEPT_ATTRIBUTE = ".pdf,.jpg,.jpeg,.png,.webp,.txt";

/** Storage bucket limit for the MVP. */
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Detect AI rate-limit errors and turn them into a calm "try again in Xs" sentence. */
export function rateLimitMessage(raw: unknown): string | null {
  const text = typeof raw === "string" ? raw : raw && typeof raw === "object" && "message" in raw ? String((raw as { message: unknown }).message) : "";
  if (!text) return null;
  if (!/429|rate[ _-]?limit|tokens per minute|TPM/i.test(text)) return null;
  const match = text.match(/try again in\s+([\d.]+)\s*(ms|s|m)?/i);
  let seconds: number | null = null;
  if (match) {
    const value = Number(match[1]);
    const unit = (match[2] ?? "s").toLowerCase();
    seconds = unit === "ms" ? value / 1000 : unit === "m" ? value * 60 : value;
  }
  const wait = seconds !== null ? Math.max(1, Math.ceil(seconds)) : null;
  return wait
    ? `The AI reader is busy right now. Please try again in ${wait} second${wait === 1 ? "" : "s"}.`
    : "The AI reader is busy right now. Please wait a moment and try again.";
}

/** Turn a raw error into a calm, user-facing sentence (details stay in the console). */
export function friendlyError(error: unknown, fallback: string): string {
  if (import.meta.env.DEV) console.error(fallback, error);
  const message =
    typeof error === "string"
      ? error
      : error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : "";
  const limited = rateLimitMessage(message);
  if (limited) return limited;
  if (!message) return fallback;
  if (/row-level security|permission|not authorized|denied/i.test(message)) {
    return "That request was refused by the server's security rules. Please sign in again, or report this if it keeps happening.";
  }
  if (/jwt|token|session/i.test(message)) return "Your session expired. Please sign in again.";
  if (/network|fetch/i.test(message)) return "We couldn't reach the server. Check your connection and try again.";
  return message.length > 200 ? fallback : message;
}


export function buildStoragePath(userId: string, caseId: string, fileName: string) {
  const ext = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")).toLowerCase() : "";
  const unique =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${userId}/${caseId}/${unique}${ext}`;
}
