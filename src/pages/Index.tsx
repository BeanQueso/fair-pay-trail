import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, FolderOpen, Plus, ShieldAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import AnalysisBanner from "@/components/AnalysisBanner";
import GlobalImpact from "@/components/GlobalImpact";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

const Index = () => {
  const { user, evidence, readyEvidence, analysis, loading, loadError } = useCase();
  const { t } = useI18n();
  const processing = evidence.filter(
    (e) => e.processing_status === "uploaded" || e.processing_status === "processing",
  ).length;
  const failed = evidence.filter((e) => e.processing_status === "failed").length;
  const safetyFlags = analysis?.safety_flags ?? [];

  return (
    <>
      <PageHeader
        title={t("home.title", "Home")}
        description={t("home.signedInAs", "Signed in as {email}").replace("{email}", user?.email ?? "")}
      />

      {loadError && (
        <p className="mb-6 rounded-xl bg-attention-soft px-4 py-3 text-sm text-attention" role="alert">
          {loadError}
        </p>
      )}

      {evidence.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={t("home.empty.title", "Your case is empty")}
          description={t(
            "home.empty.description",
            "You haven't added any evidence yet. Start with a pay stub, a schedule, a screenshot of a message — whatever you have. Nothing has to be perfect.",
          )}
          action={
            <Button asChild size="lg" className="rounded-lg">
              <Link to="/evidence">
                <Plus className="mr-2 h-4 w-4" /> {t("home.addEvidence", "Add Evidence")}
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <AnalysisBanner />

          {/* One consolidated summary block so the page opens with the whole picture. */}
          <section className="surface-card mb-8 bg-gradient-to-br from-primary/8 via-card to-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
              {t("home.summary.eyebrow", "Where your case stands")}
            </p>

            <p className="mt-3 text-base leading-relaxed text-foreground">
              {analysis?.summary
                ? analysis.summary
                : readyEvidence.length > 0
                  ? t(
                      "home.summary.readyNoAnalysis",
                      "Your files have been read. Run a review to turn them into a timeline and recommendations.",
                    )
                  : t(
                      "home.summary.processing",
                      "Your files are still being read. A summary of your case will appear here once they're done.",
                    )}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: t("home.stat.itemsAdded", "Items added"), value: `${evidence.length}` },
                { label: t("home.stat.readAndUsable", "Read and usable"), value: `${readyEvidence.length}` },
                { label: t("home.stat.stillProcessing", "Still processing"), value: `${processing}` },
                { label: t("home.stat.couldntBeRead", "Couldn't be read"), value: `${failed}` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                  <dt className="text-xs leading-snug text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>

            {analysis?.recommended_next_step && (
              <div className="mt-6 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/80">
                  {t("home.doThisNext", "Do this next")}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">{analysis.recommended_next_step}</p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-lg">
                <Link to="/evidence">
                  <Plus className="mr-2 h-4 w-4" /> {t("home.addEvidence", "Add Evidence")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-lg bg-card">
                <Link to="/next-steps">
                  {t("home.continueMyCase", "Continue My Case")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              {failed > 0 && (
                <Button asChild size="lg" variant="ghost" className="rounded-lg text-attention">
                  <Link to="/evidence">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {failed === 1
                      ? t("home.filesNeedAttention.one", "{count} file needs attention").replace(
                          "{count}",
                          String(failed),
                        )
                      : t("home.filesNeedAttention.other", "{count} files need attention").replace(
                          "{count}",
                          String(failed),
                        )}
                  </Link>
                </Button>
              )}
            </div>
          </section>


          {safetyFlags.length > 0 && (
            <section className="mb-8 rounded-2xl border border-attention/30 bg-attention-soft px-5 py-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-attention">
                <ShieldAlert className="h-4 w-4" aria-hidden /> {t("home.safety.title", "Worth being aware of")}
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-relaxed text-attention">
                {safetyFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-attention/80">
                {t(
                  "home.safety.disclaimer",
                  "These are things to look into — not legal conclusions about your case.",
                )}
              </p>
            </section>
          )}

          {analysis?.missing_evidence && analysis.missing_evidence.length > 0 && (
            <section className="surface-card">
              <h2 className="text-xl text-foreground">{t("home.missing.title", "What's still missing")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(
                  "home.missing.description",
                  "These gaps are normal. Adding any one of them makes your story easier to follow.",
                )}
              </p>
              <ul className="mt-5 space-y-3">
                {analysis.missing_evidence.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-sm"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-attention-soft text-attention">
                      <Plus className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!analysis && !loading && readyEvidence.length === 0 && evidence.length > 0 && (
            <p className="rounded-xl border border-border/70 bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              {t(
                "home.processingNotice",
                "Once your files finish processing, we'll build a timeline and recommendations from them.",
              )}
            </p>
          )}
        </>
      )}

      <GlobalImpact />
    </>
  );
};

export default Index;
