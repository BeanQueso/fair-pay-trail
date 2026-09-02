import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  FileText,
  FolderOpen,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import InfoTip from "@/components/InfoTip";
import EmptyState from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";
import { ACCEPT_ATTRIBUTE, rateLimitMessage, type EvidenceRow } from "@/lib/supabase";

function isScannedPdfError(message: string | null | undefined) {
  return !!message && message.includes("SCANNED_PDF_NOT_SUPPORTED");
}

function ExtractedList({ label, values }: { label: string; values?: unknown[] }) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs leading-relaxed text-muted-foreground">
        {values.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Evidence() {
  const { t } = useI18n();
  const { evidence, loading, loadError, uploading, uploadEvidence, retryProcessing, deleteEvidence } = useCase();
  const [dragging, setDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function errorText(item: EvidenceRow) {
    if (isScannedPdfError(item.processing_error)) {
      return t(
        "evidence.scannedPdfError",
        "This PDF looks like scanned pages rather than text. Please upload the relevant pages as JPEG, PNG, or WebP images instead.",
      );
    }
    const limited = rateLimitMessage(item.processing_error);
    if (limited) return limited;
    return item.processing_error ?? t("evidence.genericReadError", "We couldn't read this file.");
  }


  const q = query.trim().toLowerCase();
  const items = useMemo(
    () =>
      evidence.filter(
        (e) =>
          !q ||
          [e.file_name, e.evidence_type ?? "", e.extracted_text ?? "", e.processing_status].some((f) =>
            f.toLowerCase().includes(q),
          ),
      ),
    [evidence, q],
  );

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || uploading) return;
    const files = Array.from(fileList);
    const { ok, errors } = await uploadEvidence(files);
    if (ok > 0) {
      toast.success(
        ok > 1 ? t("evidence.filesUploadedPlural", `${ok} files uploaded`) : t("evidence.fileUploaded", `${ok} file uploaded`),
        {
          description: t("evidence.uploadedDescription", "We're reading them now — this can take a moment."),
        },
      );
    }
    errors.forEach((message) => toast.error(t("evidence.uploadProblem", "Upload problem"), { description: message }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteEvidence(id);
      toast.success(t("evidence.evidenceRemoved", "Evidence removed"));
    } catch (error) {
      toast.error(t("evidence.couldNotRemove", "Couldn't remove that item"), {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <PageHeader
        title={t("evidence.title", "My Evidence")}
        description={t("evidence.description", "Everything you've added to your case, and what we found in it.")}
      />

      {loadError && (
        <p className="mb-6 rounded-xl bg-attention-soft px-4 py-3 text-sm text-attention" role="alert">
          {loadError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "mb-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors duration-300 ease-out",
          dragging ? "border-primary bg-primary/8" : "border-border bg-card hover:border-primary/40",
        )}
      >
        <span className="icon-badge mb-4 h-12 w-12">
          <UploadCloud className="h-6 w-6" aria-hidden />
        </span>
        <p className="font-display text-xl text-foreground">{t("evidence.dropFilesHere", "Drop files here")}</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t(
            "evidence.fileTypesHint",
            "PDF, JPEG, PNG, WebP or plain text, up to 10 MB each. Your files stay private to your account.",
          )}
        </p>
        <Button className="mt-6 rounded-lg" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("evidence.uploading", "Uploading…")}
            </>
          ) : (
            t("evidence.chooseFiles", "Choose files")
          )}
        </Button>
      </div>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl text-foreground">{t("evidence.yourEvidence", "Your evidence")}</h2>
            <InfoTip label={t("evidence.infoTipLabel", "What makes evidence strong or weak")}>
              <p className="text-sm font-semibold text-foreground">{t("evidence.strongEvidence", "Strong evidence")}</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                <li>{t("evidence.strong1", "Shows a clear date or pay period")}</li>
                <li>{t("evidence.strong2", "Comes from your employer (pay stubs, posted schedules, time exports)")}</li>
                <li>{t("evidence.strong3", "Is readable end to end — no cut-off edges or blur")}</li>
                <li>{t("evidence.strong4", "Can be matched to money you actually received (bank deposits)")}</li>
                <li>{t("evidence.strong5", "Is the original file or a full screenshot, not a crop")}</li>
              </ul>
              <p className="mt-3 text-sm font-semibold text-foreground">{t("evidence.weakEvidence", "Weak evidence")}</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                <li>{t("evidence.weak1", "No date, or a date you can't tie to a shift")}</li>
                <li>{t("evidence.weak2", "Blurry photos, partial screenshots, cropped message threads")}</li>
                <li>{t("evidence.weak3", "Memories or summaries with nothing to back them up")}</li>
              </ul>
            </InfoTip>
          </div>
          {evidence.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("evidence.searchPlaceholder", "Search file names or text")}
                aria-label={t("evidence.searchAriaLabel", "Search your evidence")}
                className="rounded-lg pl-9"
              />
            </div>
          )}
        </div>

        {loading && evidence.length === 0 ? (
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-6">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={q ? t("evidence.noMatches", "No matches") : t("evidence.nothingHereYet", "Nothing here yet")}
            description={
              q
                ? t(
                    "evidence.noMatchesDescription",
                    `Nothing matches "${query.trim()}". Try a shorter word, or clear the search.`,
                  )
                : t(
                    "evidence.nothingHereDescription",
                    "Add your first pay stub, schedule, message or photo above. You can always add more later — nothing has to be perfect.",
                  )
            }
          />
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const data = item.extracted_data ?? {};
              const open = expanded === item.id;
              return (
                <article key={item.id} className="surface-card">
                  <div className="flex items-start justify-between gap-3">
                    <span className="icon-badge h-9 w-9">
                      <FileText className="h-4 w-4" aria-hidden />
                    </span>
                    <StatusPill status={item.processing_status} />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-foreground">{item.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(item.evidence_type ?? data.evidence_type ?? t("evidence.unclassified", "Unclassified")) as string} ·{" "}
                    {new Date(item.created_at).toLocaleString()}
                    {item.file_size ? ` · ${(item.file_size / 1024).toFixed(0)} KB` : ""}
                  </p>

                  {(item.processing_status === "uploaded" || item.processing_status === "processing") && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                      {t("evidence.readingFile", "We're reading this file. You can keep working — it'll update itself.")}
                    </p>
                  )}

                  {item.processing_status === "failed" && (
                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-attention-soft px-4 py-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-attention" aria-hidden />
                      <div>
                        <p className="text-sm leading-relaxed text-attention">{errorText(item)}</p>
                        {!isScannedPdfError(item.processing_error) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 rounded-lg bg-card"
                            onClick={() => void retryProcessing(item.id)}
                          >
                            <RefreshCw className="mr-2 h-3.5 w-3.5" /> {t("evidence.tryAgain", "Try reading it again")}
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {item.processing_status === "ready" && (
                    <div className="mt-4">
                      <button
                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                        onClick={() => setExpanded(open ? null : item.id)}
                      >
                        {open ? t("evidence.hideWhatWeRead", "Hide what we read") : t("evidence.seeWhatWeRead", "See what we read")}
                      </button>
                      {open && (
                        <div className="mt-4 space-y-4 rounded-xl border border-border/70 bg-background/60 px-4 py-4">
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {t(
                              "evidence.autoReadDisclaimer",
                              "Your original file is unchanged and remains the source of truth. Everything below is an automated reading of it and may contain mistakes.",
                            )}
                          </p>
                          <ExtractedList label={t("evidence.keyFacts", "Key facts")} values={data.key_facts} />
                          <ExtractedList label={t("evidence.dates", "Dates")} values={data.dates} />
                          <ExtractedList label={t("evidence.amounts", "Amounts")} values={data.amounts} />
                          <ExtractedList label={t("evidence.hours", "Hours")} values={data.hours} />
                          <ExtractedList label={t("evidence.payRates", "Pay rates")} values={data.pay_rates} />
                          <ExtractedList label={t("evidence.peopleAndPlaces", "People and places")} values={data.entities} />
                          <ExtractedList label={t("evidence.unclearItems", "Unclear items")} values={data.uncertain_items} />
                          {(item.extracted_text || data.transcription) && (
                            <div>
                              <p className="text-xs font-semibold text-foreground">{t("evidence.transcription", "Transcription")}</p>
                              <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                {item.extracted_text ?? data.transcription}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 border-t border-border/60 pt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-muted-foreground"
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item.id)}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      {deletingId === item.id ? t("evidence.removing", "Removing…") : t("evidence.remove", "Remove")}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
