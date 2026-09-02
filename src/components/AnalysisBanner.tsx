import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

/** Shows the state of the case analysis and lets the user run/refresh it. Never auto-invokes. */
export default function AnalysisBanner() {
  const {
    readyEvidence,
    analysis,
    analysisStale,
    analysisLanguageStale,
    analyzing,
    analysisError,
    runAnalysis,
  } = useCase();
  const { t } = useI18n();

  // Evidence changed but nothing is readable yet — the review on screen is out of date
  // and can't be refreshed until at least one file finishes processing.
  if (readyEvidence.length === 0) {
    if (!analysis || !analysisStale) return null;
    return (
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-attention/30 bg-attention-soft px-5 py-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-attention" aria-hidden />
        <p className="text-sm leading-relaxed text-attention">
          {t(
            "analysis.staleNoEvidence",
            "Your evidence changed since this review was made, so what's shown below may be out of date. It will refresh once a file finishes processing.",
          )}
        </p>
      </div>
    );
  }

  if (analysis && !analysisStale && !analysisLanguageStale && !analysisError) return null;

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          {analysis
            ? analysisStale
              ? t("analysis.evidenceChanged", "Your evidence has changed")
              : t("analysis.languageChanged", "This review was written in another language")
            : t("analysis.readyToReview", "Ready to review your evidence")}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {analysisError
            ? analysisError
            : analysis
              ? analysisStale
                ? t(
                    "analysis.refreshPrompt",
                    "Refresh the review so your timeline and next steps match what's in your case now.",
                  )
                : t(
                    "analysis.languagePrompt",
                    "Refresh the review to get it written in the language you selected.",
                  )
              : readyEvidence.length > 1
                ? t(
                    "analysis.canBuildFrom.other",
                    "We can now build a timeline and recommendations from {count} processed items.",
                  ).replace("{count}", String(readyEvidence.length))
                : t(
                    "analysis.canBuildFrom.one",
                    "We can now build a timeline and recommendations from {count} processed item.",
                  ).replace("{count}", String(readyEvidence.length))}
        </p>
      </div>
      <Button className="shrink-0 rounded-lg" disabled={analyzing} onClick={() => void runAnalysis()}>
        {analyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("analysis.reviewing", "Reviewing…")}
          </>
        ) : analysis ? (
          t("analysis.refreshReview", "Refresh review")
        ) : (
          t("analysis.reviewMyEvidence", "Review my evidence")
        )}
      </Button>
    </div>
  );
}
