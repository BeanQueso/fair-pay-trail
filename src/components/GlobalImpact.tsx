import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

/**
 * Worldwide impact numbers, aggregated across every case by the backend
 * `global_impact_stats` function (see supabase/global_impact_stats.sql).
 * No per-user rows are exposed — only counts.
 */
export interface GlobalStats {
  workers: number;
  evidence_files: number;
  timeline_events: number;
  discrepancies_flagged: number;
  packets_built: number;
  countries?: number | null;
}

export default function GlobalImpact() {
  const { t, language } = useI18n();
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data, error } = await supabase.rpc("global_impact_stats");
      if (cancelled) return;
      if (error || !data) {
        if (import.meta.env.DEV) console.warn("global_impact_stats unavailable", error);
        return;
      }
      const row = (Array.isArray(data) ? data[0] : data) as GlobalStats | undefined;
      if (row) setStats(row);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show until the backend reports real aggregates.
  if (!stats) return null;

  const fmt = (n: number) => new Intl.NumberFormat(language).format(Math.max(0, Number(n) || 0));

  const items = [
    { label: t("global.workers"), value: fmt(stats.workers) },
    { label: t("global.files"), value: fmt(stats.evidence_files) },
    { label: t("global.events"), value: fmt(stats.timeline_events) },
    { label: t("global.issues"), value: fmt(stats.discrepancies_flagged) },
    { label: t("global.packets"), value: fmt(stats.packets_built) },
  ];

  return (
    <section className="surface-card mt-8">
      <div className="flex items-center gap-3">
        <span className="icon-badge h-9 w-9">
          <Globe2 className="h-4 w-4" aria-hidden />
        </span>
        <h2 className="text-xl text-foreground">{t("global.title")}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("global.help")}</p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div key={m.label} className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
            <dt className="text-xs leading-snug text-muted-foreground">{m.label}</dt>
            <dd className="mt-1 font-display text-2xl text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-muted-foreground">{t("global.privacy")}</p>
    </section>
  );
}
