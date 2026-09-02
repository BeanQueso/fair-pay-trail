import { Calculator, Info } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import InfoTip from "@/components/InfoTip";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

function collect(values: unknown[][]) {
  return values.flat().filter(Boolean).map(String);
}

export default function WageEstimate() {
  const { readyEvidence } = useCase();
  const { t } = useI18n();

  const hours = collect(readyEvidence.map((e) => e.extracted_data?.hours ?? []));
  const rates = collect(readyEvidence.map((e) => e.extracted_data?.pay_rates ?? []));
  const amounts = collect(readyEvidence.map((e) => e.extracted_data?.amounts ?? []));
  const hasFigures = hours.length + rates.length + amounts.length > 0;

  return (
    <>
      <PageHeader
        title={t("wage.title", "Wage Estimate")}
        description={t("wage.description", "What your records say about hours, rates and payments.")}
        action={
          <InfoTip label={t("wage.infoLabel", "How this page gets its figures")}>
            <p className="text-sm font-semibold text-foreground">
              {t("wage.info.title", "These figures only appear after processing")}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              <li>
                {t(
                  "wage.info.step1",
                  "Upload files on My Evidence and wait until each one shows as processed — that's when hours, rates and amounts are read out of them.",
                )}
              </li>
              <li>
                {t(
                  "wage.info.step2",
                  'Press "Review my evidence" on Case Timeline, Next Steps or Case Packet to build the timeline, facts and recommendations.',
                )}
              </li>
              <li>
                {t(
                  "wage.info.step3",
                  "Re-run that review after you add or delete evidence, otherwise the pages and your PDF stay out of date.",
                )}
              </li>
            </ul>
          </InfoTip>
        }
      />

      <EmptyState
        icon={Calculator}
        title={t("wage.empty.title", "No wage estimate yet")}
        description={t(
          "wage.empty.description",
          "Your wage estimate will appear once enough verified pay and work information is available. We won't show a total until it can be calculated from your own records.",
        )}
      />

      {hasFigures && (
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("wage.group.hours", "Hours found in your evidence"), values: hours },
            { label: t("wage.group.rates", "Pay rates found"), values: rates },
            { label: t("wage.group.amounts", "Amounts found"), values: amounts },
          ]
            .filter((g) => g.values.length > 0)
            .map((g) => (
              <article key={g.label} className="surface-card">
                <p className="text-sm text-muted-foreground">{g.label}</p>
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {g.values.slice(0, 12).map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              </article>
            ))}
        </section>
      )}

      <div className="mt-8 flex items-start gap-3 rounded-xl border border-border/70 bg-card px-5 py-4">
        <span className="icon-badge h-8 w-8">
          <Info className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t(
            "wage.disclaimer",
            "These figures are read directly from your uploaded files and may contain mistakes. They are not added up into a total owed — only a person or an agency reviewing your records can decide what you're formally owed.",
          )}
        </p>
      </div>
    </>
  );
}
