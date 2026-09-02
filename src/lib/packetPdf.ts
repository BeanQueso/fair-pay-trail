import jsPDF from "jspdf";

type Nullable<T> = T | null | undefined;

export interface PacketData {
  title: string;
  email?: Nullable<string>;
  startedOn?: Nullable<string>;
  summary?: Nullable<string>;
  timeline: { date?: Nullable<string>; label: string }[];
  facts: string[];
  discrepancies: string[];
  evidence: {
    name: string;
    meta: string;
    error?: Nullable<string>;
    fields?: { label: string; values: string[] }[];
    text?: Nullable<string>;
  }[];
  missing: string[];
  labels: Record<string, string>;
}

const MARGIN = 48;
const LINE = 15;

export function buildPacketPdf(data: PacketData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - MARGIN * 2;
  let y = MARGIN;

  const ensureSpace = (needed = LINE) => {
    if (y + needed > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const write = (text: string, size: number, style: "normal" | "bold" = "normal", color = "#1f2933") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(size + 4);
      doc.text(line, MARGIN, y);
      y += size + 4;
    });
  };

  const heading = (text: string) => {
    ensureSpace(34);
    y += 14;
    write(text.toUpperCase(), 10, "bold", "#6b7280");
    y += 2;
    doc.setDrawColor("#d8dbe0");
    doc.line(MARGIN, y - 8, pageWidth - MARGIN, y - 8);
  };

  const bullets = (items: string[], emptyText: string) => {
    if (!items.length) {
      write(emptyText, 10, "normal", "#6b7280");
      return;
    }
    items.forEach((item) => write(`•  ${item}`, 10, "normal", "#374151"));
  };

  write(data.title, 20, "bold", "#111827");
  const metaBits = [data.email, data.startedOn].filter(Boolean) as string[];
  if (metaBits.length) write(metaBits.join("  ·  "), 10, "normal", "#6b7280");

  heading(data.labels.summary);
  write(data.summary || data.labels.noSummary, 10, "normal", "#374151");

  heading(data.labels.timeline);
  bullets(
    data.timeline.map((e) => `${e.date || data.labels.noDate} — ${e.label}`),
    data.labels.noTimeline,
  );

  heading(data.labels.facts);
  bullets(data.facts, data.labels.noFacts);

  heading(data.labels.discrepancies);
  bullets(data.discrepancies, data.labels.noDiscrepancies);

  heading(data.labels.evidence);
  if (!data.evidence.length) {
    write(data.labels.noEvidence, 10, "normal", "#6b7280");
  } else {
    data.evidence.forEach((e) => {
      y += 6;
      write(e.name, 11, "bold", "#111827");
      write(e.meta, 9, "normal", "#6b7280");
      if (e.error) write(`${data.labels.processingError}: ${e.error}`, 9, "normal", "#b45309");
      (e.fields ?? []).forEach((f) => {
        if (f.values.length) write(`${f.label}: ${f.values.join(", ")}`, 9, "normal", "#374151");
      });
      if (e.text) {
        write(data.labels.readContent, 9, "bold", "#6b7280");
        write(e.text, 9, "normal", "#374151");
      } else if (!e.fields?.some((f) => f.values.length)) {
        write(data.labels.notProcessed, 9, "normal", "#6b7280");
      }
    });
  }

  heading(data.labels.missing);
  bullets(data.missing, data.labels.noMissing);

  y += 18;
  write(data.labels.footer, 8, "normal", "#9ca3af");

  return doc;
}

export function slugifyFileName(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "case-packet"}-${new Date().toISOString().slice(0, 10)}.pdf`;
}
