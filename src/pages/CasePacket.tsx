import { useState } from "react";

function PreviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function PreviewList({ items, empty }: { items: string[]; empty: string }) {
  if (!items.length) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

import { Download, Eye } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import AnalysisBanner from "@/components/AnalysisBanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpenCheck } from "lucide-react";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";
import { buildPacketPdf, slugifyFileName, type PacketData } from "@/lib/packetPdf";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/70 px-6 py-6 first:border-t-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

export default function CasePacket() {
  const { caseRow, evidence, readyEvidence, analysis, user } = useCase();
  const { t } = useI18n();
  const [previewOpen, setPreviewOpen] = useState(false);

  const hasContent = evidence.length > 0;

  const packetTitle = caseRow?.title ?? t("packet.defaultTitle", "Wage Case Summary");

  const buildData = (): PacketData => {
    const data: PacketData = {
      title: packetTitle,
      email: user?.email,
      startedOn: caseRow
        ? `${t("packet.started", "Started")} ${new Date(caseRow.created_at).toLocaleDateString()}`
        : null,
      summary: analysis?.summary ?? null,
      timeline: (analysis?.timeline_events ?? []).map((e) => ({
        date: e.date ?? null,
        label: String(e.title ?? e.event ?? e.description ?? ""),
      })),
      facts: analysis?.extracted_facts ?? [],
      discrepancies: analysis?.possible_discrepancies ?? [],
      evidence: evidence.map((e) => {
        const d = e.extracted_data ?? {};
        const list = (v: unknown) => (Array.isArray(v) ? v.filter(Boolean).map(String) : []);
        const text = (e.extracted_text ?? (typeof d.transcription === "string" ? d.transcription : "")) || "";
        return {
          name: e.file_name,
          meta: `${(e.evidence_type ?? d.evidence_type ?? t("packet.unclassified", "Unclassified")) as string} · ${new Date(
            e.created_at,
          ).toLocaleDateString()} · ${e.processing_status}`,
          error: e.processing_error,
          fields: [
            { label: t("packet.field.dates", "Dates"), values: list(d.dates) },
            { label: t("packet.field.hours", "Hours"), values: list(d.hours) },
            { label: t("packet.field.rates", "Pay rates"), values: list(d.pay_rates) },
            { label: t("packet.field.amounts", "Amounts"), values: list(d.amounts) },
            { label: t("packet.field.entities", "Names mentioned"), values: list(d.entities) },
            { label: t("packet.field.keyFacts", "Key facts"), values: list(d.key_facts) },
            { label: t("packet.field.uncertain", "Uncertain items"), values: list(d.uncertain_items) },
          ],
          text: text ? text.slice(0, 2000) : null,
        };
      }),
      missing: analysis?.missing_evidence ?? [],
      labels: {
        summary: t("packet.section.summary", "Case summary"),
        timeline: t("packet.section.timeline", "Timeline"),
        facts: t("packet.section.facts", "Established facts"),
        discrepancies: t("packet.section.discrepancies", "Possible discrepancies"),
        evidence: t("packet.section.evidence", "Evidence list"),
        missing: t("packet.section.missing", "Missing information"),
        noSummary: t("packet.noSummary", "No summary yet — this appears after your evidence has been reviewed."),
        noTimeline: t("packet.noTimeline", "No timeline events yet."),
        noFacts: t("packet.noFacts", "No facts extracted yet."),
        noDiscrepancies: t("packet.noneIdentified", "None identified yet."),
        noEvidence: t("packet.noEvidenceFiles", "No evidence files yet."),
        noMissing: t("packet.nothingFlagged", "Nothing flagged yet."),
        noDate: t("packet.dateNotStated", "Date not stated"),
        readContent: t("packet.readContent", "Content read from this file:"),
        notProcessed: t("packet.notProcessed", "This file has not been processed yet, so no content could be included."),
        processingError: t("packet.processingError", "Processing error"),
        footer: t(
          "packet.pdfFooter",
          "Generated from your own records. This document is not legal advice.",
        ),
      },
    };
    return data;
  };

  const logDownload = async () => {
    try {
      if (user?.id) await supabase.from("packet_downloads").insert({ user_id: user.id });
    } catch {
      /* counter is best-effort */
    }
  };

  const handleDownload = () => {
    try {
      buildPacketPdf(buildData()).save(slugifyFileName(packetTitle));
      void logDownload();
    } catch {
      toast.error(t("packet.downloadError", "Could not build the PDF. Please try again."));
    }
  };

  const previewData = previewOpen ? buildData() : null;

  return (
    <>
      <PageHeader
        title={t("packet.title", "Case Packet")}
        description={t(
          "packet.description",
          "A short, readable summary you could hand to an advocate, a lawyer, or a labor agency.",
        )}
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="lg" className="rounded-lg" disabled={!hasContent} onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" /> {t("packet.download", "Download PDF")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg"
              disabled={!hasContent}
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" /> {t("packet.preview", "Preview")}
            </Button>
          </div>
        }
      />

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("packet.preview", "Preview")}</DialogTitle>
          </DialogHeader>
          {previewData && (
            <div className="max-h-[70vh] space-y-5 overflow-y-auto rounded-md border border-border bg-card p-6 text-sm">
              <div>
                <p className="font-display text-xl text-foreground">{previewData.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[previewData.email, previewData.startedOn].filter(Boolean).join(" · ")}
                </p>
              </div>

              <PreviewBlock title={previewData.labels.summary}>
                <p className="text-muted-foreground">{previewData.summary || previewData.labels.noSummary}</p>
              </PreviewBlock>

              <PreviewBlock title={previewData.labels.timeline}>
                <PreviewList
                  items={previewData.timeline.map((e) => `${e.date || previewData.labels.noDate} — ${e.label}`)}
                  empty={previewData.labels.noTimeline}
                />
              </PreviewBlock>

              <PreviewBlock title={previewData.labels.facts}>
                <PreviewList items={previewData.facts} empty={previewData.labels.noFacts} />
              </PreviewBlock>

              <PreviewBlock title={previewData.labels.discrepancies}>
                <PreviewList items={previewData.discrepancies} empty={previewData.labels.noDiscrepancies} />
              </PreviewBlock>

              <PreviewBlock title={previewData.labels.evidence}>
                {previewData.evidence.length === 0 ? (
                  <p className="text-muted-foreground">{previewData.labels.noEvidence}</p>
                ) : (
                  <div className="space-y-4">
                    {previewData.evidence.map((e, i) => (
                      <div key={i} className="rounded-lg border border-border/70 p-3">
                        <p className="font-medium text-foreground">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.meta}</p>
                        {e.error && <p className="mt-1 text-xs text-amber-600">{previewData.labels.processingError}: {e.error}</p>}
                        {(e.fields ?? [])
                          .filter((f) => f.values.length)
                          .map((f) => (
                            <p key={f.label} className="mt-1 text-xs text-muted-foreground">
                              <span className="text-foreground">{f.label}:</span> {f.values.join(", ")}
                            </p>
                          ))}
                        {e.text ? (
                          <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{e.text}</p>
                        ) : (
                          !e.fields?.some((f) => f.values.length) && (
                            <p className="mt-2 text-xs text-muted-foreground">{previewData.labels.notProcessed}</p>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </PreviewBlock>

              <PreviewBlock title={previewData.labels.missing}>
                <PreviewList items={previewData.missing} empty={previewData.labels.noMissing} />
              </PreviewBlock>

              <p className="text-xs text-muted-foreground">{previewData.labels.footer}</p>

              <Button className="w-full rounded-lg" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> {t("packet.download", "Download PDF")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>


      <AnalysisBanner />


      {!hasContent ? (
        <EmptyState
          icon={BookOpenCheck}
          title={t("packet.emptyTitle", "Nothing to put in a packet yet")}
          description={t(
            "packet.emptyDescription",
            "Once you've added evidence and it has been reviewed, a packet preview will be built here from your real case information.",
          )}
        />
      ) : (
        <article className="overflow-hidden rounded-2xl border border-border/70 bg-card">
          <header className="bg-primary/8 px-6 py-6">
            <p className="font-display text-2xl text-foreground">{caseRow?.title ?? t("packet.defaultTitle", "Wage Case Summary")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user?.email} · {t("packet.started", "Started")} {caseRow ? new Date(caseRow.created_at).toLocaleDateString() : "—"} · {t("packet.draft", "Draft")}
            </p>
          </header>

          <Section title={t("packet.section.summary", "Case summary")}>
            {analysis?.summary ? (
              <p className="text-sm leading-relaxed text-muted-foreground">{analysis.summary}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("packet.noSummary", "No summary yet — this appears after your evidence has been reviewed.")}
              </p>
            )}
          </Section>

          <Section title={t("packet.section.timeline", "Timeline")}>
            {analysis?.timeline_events?.length ? (
              <ul className="space-y-2">
                {analysis.timeline_events.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-32 shrink-0 text-muted-foreground">{e.date ?? t("packet.dateNotStated", "Date not stated")}</span>
                    <span className="text-foreground">{e.title ?? e.event ?? e.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("packet.noTimeline", "No timeline events yet.")}</p>
            )}
          </Section>

          <Section title={t("packet.section.facts", "Established facts")}>
            {analysis?.extracted_facts?.length ? (
              <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                {analysis.extracted_facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("packet.noFacts", "No facts extracted yet.")}</p>
            )}
          </Section>

          <Section title={t("packet.section.discrepancies", "Possible discrepancies")}>
            {analysis?.possible_discrepancies?.length ? (
              <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                {analysis.possible_discrepancies.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("packet.noneIdentified", "None identified yet.")}</p>
            )}
          </Section>

          <Section title={t("packet.section.evidence", "Evidence list")}>
            <ul className="space-y-2">
              {evidence.map((e) => (
                <li key={e.id} className="flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-foreground">{e.file_name}</span>
                  <span className="text-muted-foreground">
                    {(e.evidence_type ?? t("packet.unclassified", "Unclassified")) as string} · {new Date(e.created_at).toLocaleDateString()} ·{" "}
                    {e.processing_status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("packet.itemsReadCount", "{ready} of {total} items have been read successfully.")
                .replace("{ready}", String(readyEvidence.length))
                .replace("{total}", String(evidence.length))}
            </p>
          </Section>

          <Section title={t("packet.section.missing", "Missing information")}>
            {analysis?.missing_evidence?.length ? (
              <ul className="list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                {analysis.missing_evidence.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{t("packet.nothingFlagged", "Nothing flagged yet.")}</p>
            )}
          </Section>
        </article>
      )}

      <p className="mt-6 rounded-xl border border-border/70 bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        {t(
          "packet.footerNote",
          "Your packet downloads as a PDF built from your own case records. It is not legal advice.",

        )}
      </p>
    </>
  );
}
