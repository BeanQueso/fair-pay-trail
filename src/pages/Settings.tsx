import { BarChart3, Check, Globe, LogOut, RotateCcw, UserRound } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCase } from "@/context/CaseProvider";
import { LANGUAGES, useI18n, type LanguageCode } from "@/lib/i18n";
import { markTourUnseen } from "@/components/OnboardingTour";

export default function Settings() {
  const { user, signOut, evidence, readyEvidence, analysis } = useCase();
  const { language, setLanguage, t } = useI18n();

  const choose = (code: LanguageCode) => {
    setLanguage(code);
    toast.success(t("settings.saved"));
  };

  const timelineDates = (analysis?.timeline_events ?? [])
    .map((e) => (e.date ? Date.parse(String(e.date)) : NaN))
    .filter((n) => !Number.isNaN(n));
  const spanDays =
    timelineDates.length > 1
      ? Math.round((Math.max(...timelineDates) - Math.min(...timelineDates)) / 86_400_000)
      : 0;

  const metrics = [
    { label: t("settings.impact.files"), value: evidence.length },
    { label: t("settings.impact.processed"), value: readyEvidence.length },
    { label: t("settings.impact.facts"), value: analysis?.extracted_facts?.length ?? 0 },
    { label: t("settings.impact.events"), value: analysis?.timeline_events?.length ?? 0 },
    { label: t("settings.impact.issues"), value: analysis?.possible_discrepancies?.length ?? 0 },
    { label: t("settings.impact.gaps"), value: analysis?.missing_evidence?.length ?? 0 },
    { label: t("settings.impact.span"), value: spanDays },
  ];

  const lastReview = analysis?.generated_at
    ? new Date(analysis.generated_at).toLocaleDateString(language, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : t("settings.impact.never");

  return (
    <>
      <PageHeader title={t("settings.title")} description={t("settings.description")} />

      <section className="surface-card mb-8">
        <div className="flex items-center gap-3">
          <span className="icon-badge h-9 w-9">
            <BarChart3 className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-xl text-foreground">{t("settings.impact")}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("settings.impactHelp")}</p>

        {evidence.length === 0 ? (
          <p className="mt-5 text-sm text-muted-foreground">{t("settings.impact.empty")}</p>
        ) : (
          <>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                  <dt className="text-xs leading-snug text-muted-foreground">{m.label}</dt>
                  <dd className="mt-1 font-display text-2xl text-foreground">{m.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              {t("settings.impact.lastReview")}: <span className="text-foreground">{lastReview}</span>
            </p>
          </>
        )}
      </section>

      <section className="surface-card mb-8">
        <div className="flex items-center gap-3">
          <span className="icon-badge h-9 w-9">
            <Globe className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-xl text-foreground">{t("settings.language")}</h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("settings.languageHelp")}</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <button
                key={l.code}
                onClick={() => choose(l.code)}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors duration-300 ease-out",
                  active
                    ? "border-primary bg-primary/8"
                    : "border-border bg-background/60 hover:border-primary/40 hover:bg-accent/40",
                )}
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground">{l.native}</span>
                  <span className="block text-xs text-muted-foreground">{l.label}</span>
                </span>
                {active && <Check className="h-4 w-4 text-primary" aria-hidden />}
              </button>
            );
          })}
        </div>
      </section>

      <section className="surface-card">
        <div className="flex items-center gap-3">
          <span className="icon-badge h-9 w-9">
            <UserRound className="h-4 w-4" aria-hidden />
          </span>
          <h2 className="text-xl text-foreground">{t("settings.account")}</h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("settings.signedInAs")} <span className="font-medium text-foreground">{user?.email}</span>
        </p>

        <div className="mt-6 space-y-4 border-t border-border/60 pt-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("settings.replayTour")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("settings.replayTourHelp")}</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-lg bg-card"
              onClick={() => {
                if (user) markTourUnseen(user.id);
                else markTourUnseen("anon");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> {t("settings.replayTour")}
            </Button>
          </div>

          <div className="flex justify-start">
            <Button variant="ghost" className="rounded-lg text-muted-foreground" onClick={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> {t("action.signOut")}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
