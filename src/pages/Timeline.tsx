import { CalendarRange, Paperclip } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import AnalysisBanner from "@/components/AnalysisBanner";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

export default function Timeline() {
  const { analysis } = useCase();
  const { t } = useI18n();
  const events = analysis?.timeline_events ?? [];

  return (
    <>
      <PageHeader
        title={t("timeline.title", "Case Timeline")}
        description={t(
          "timeline.description",
          "Built from the evidence you've added — where the hours and the pay stopped matching.",
        )}
      />

      <AnalysisBanner />

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title={t("timeline.empty.title", "No timeline yet")}
          description={t(
            "timeline.empty.description",
            "Your timeline will appear here once your evidence has been processed and reviewed.",
          )}
        />
      ) : (
        <ol className="relative space-y-6 border-l border-border pl-6 sm:pl-8">
          {events.map((event, i) => {
            const title = event.title ?? event.event ?? t("timeline.event.fallbackTitle", "Event");
            const detail = event.description ?? (event.event && event.title ? event.event : null);
            return (
              <li key={i} className="relative">
                <span
                  className="absolute -left-[35px] top-5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background sm:-left-[43px]"
                  aria-hidden
                />
                <article className="surface-card">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {event.date ? event.date : t("timeline.event.dateNotStated", "Date not stated in the evidence")}
                  </p>
                  <h2 className="mt-2 text-lg text-foreground">{title}</h2>
                  {detail && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{detail}</p>}
                  {event.source && (
                    <p className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background/60 px-2 py-1 text-xs text-muted-foreground">
                      <Paperclip className="h-3 w-3" aria-hidden /> {event.source}
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}

      {analysis?.possible_discrepancies && analysis.possible_discrepancies.length > 0 && (
        <section className="surface-card mt-8">
          <h2 className="text-xl text-foreground">{t("timeline.discrepancies.title", "Possible discrepancies")}</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted-foreground">
            {analysis.possible_discrepancies.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
