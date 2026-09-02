import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Compass, FolderPlus, Handshake, Plus, ScrollText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import AnalysisBanner from "@/components/AnalysisBanner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

export default function NextSteps() {
  const { t } = useI18n();
  const { analysis } = useCase();
  const recommended = analysis?.recommended_next_step;
  const missing = analysis?.missing_evidence ?? [];

  const options = [
    {
      label: t("nextSteps.continueCollecting", "Continue collecting evidence"),
      detail: t("nextSteps.continueCollectingDetail", "Add schedules, texts, or photos."),
      icon: FolderPlus,
      to: "/evidence",
    },
    {
      label: t("nextSteps.generatePacket", "Generate case packet"),
      detail: t("nextSteps.generatePacketDetail", "To export a summary of your case."),
      icon: ScrollText,
      to: "/case-packet",
    },
    {
      label: t("nextSteps.findAdvocate", "Find an advocate"),
      detail: t("nextSteps.findAdvocateDetail", "Free legal aid, workers' centers and clinics near you."),
      icon: Handshake,
      to: "/advocates",
    },
    {
      label: t("nextSteps.learnFiling", "Learn about filing a wage claim"),
      detail: t("nextSteps.learnFilingDetail", "What the process looks like, step by step."),
      icon: BookOpen,
      to: null,
    },
  ];

  return (
    <>
      <PageHeader
        title={t("nextSteps.title", "Next Steps")}
        description={t("nextSteps.description", "The single next thing that would help your case most.")}
      />

      <AnalysisBanner />

      {recommended ? (
        <section className="surface-card mb-8 border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {t("nextSteps.recommendedNextStep", "Recommended next step")}
          </p>
          <h2 className="mt-3 text-2xl leading-snug text-foreground">{recommended}</h2>
          <Button asChild size="lg" className="mt-6 rounded-lg">
            <Link to="/evidence">
              {t("nextSteps.addEvidence", "Add evidence")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      ) : (
        <div className="mb-8">
          <EmptyState
            icon={Compass}
            title={t("nextSteps.noRecommendationYet", "No recommendation yet")}
            description={t(
              "nextSteps.noRecommendationDescription",
              "Recommendations will appear here once your evidence has been processed and reviewed.",
            )}
            action={
              <Button asChild size="lg" className="rounded-lg">
                <Link to="/evidence">
                  <Plus className="mr-2 h-4 w-4" /> {t("nextSteps.addEvidenceButton", "Add Evidence")}
                </Link>
              </Button>
            }
          />
        </div>
      )}

      {missing.length > 0 && (
        <section className="surface-card mb-8">
          <h2 className="text-xl text-foreground">{t("nextSteps.infoThatWouldHelp", "Information that would help")}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
            {missing.map((m, i) => (
              <li key={i} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3 text-foreground">
                {m}
              </li>
            ))}
          </ul>
        </section>
      )}

      <h2 className="mb-4 text-xl text-foreground">{t("nextSteps.orPickSomethingElse", "Or pick something else")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map(({ label, detail, icon: Icon, to }) => {
          const inner = (
            <>
              <span className="icon-badge mb-4">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
              {!to && <p className="mt-3 text-xs font-medium text-primary/80">{t("nextSteps.comingSoon", "Coming soon")}</p>}
            </>
          );
          return to ? (
            <Link key={label} to={to} className="surface-card text-left hover:border-primary/30 hover:bg-accent/40">
              {inner}
            </Link>
          ) : (
            <button
              key={label}
              onClick={() =>
                toast(t("nextSteps.notAvailableYet", "Not available yet"), {
                  description: t("nextSteps.notAvailableDescription", `${label} is coming in a later version.`),
                })
              }
              className="surface-card text-left hover:border-primary/30 hover:bg-accent/40"
            >
              {inner}
            </button>
          );
        })}
      </div>
    </>
  );
}
