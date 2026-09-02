import { useMemo, useState } from "react";
import { ExternalLink, ListFilter, Scale, Search, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { similarCases, caseTopics } from "@/data/cases";
import { useI18n } from "@/lib/i18n";

export default function SimilarCases() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  const toggleTopic = (t: string) =>
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return similarCases.filter((c) => {
      const matchesTopic = topics.length === 0 || topics.some((t) => c.topics.includes(t));
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.court.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.relevance.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [query, topics]);

  return (
    <>
      <PageHeader
        title={t("similar.title", "Similar Cases")}
        description={t("similar.description", "Twelve court decisions that shape how claims like yours are judged.")}
      />

      <p className="mb-8 rounded-xl border border-border/70 bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
        {t("similar.referenceNote", "Reference only — these summaries are background reading, not legal advice.")}
      </p>

      <div className="mb-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("similar.searchPlaceholder", "Search cases by name, court, or topic")}
              aria-label={t("similar.searchAriaLabel", "Search similar cases")}
              className="rounded-lg pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0 justify-between rounded-lg sm:w-auto">
                <span className="flex items-center">
                  <ListFilter className="mr-2 h-4 w-4" aria-hidden /> {t("similar.filter", "Filter")}
                </span>
                {topics.length > 0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                    {topics.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 w-64 overflow-y-auto">
              <DropdownMenuLabel>{t("similar.filterByTopic", "Filter by topic")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {caseTopics.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={topics.includes(t)}
                  onCheckedChange={() => toggleTopic(t)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {topics.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => toggleTopic(t)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/12 px-3 py-1.5 text-xs font-medium text-primary transition-colors duration-300 ease-out hover:bg-primary/20"
              >
                {t} <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
            <button
              onClick={() => setTopics([])}
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
            >
              {t("similar.clearAll", "Clear all")}
            </button>
          </div>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {t("similar.showingCount", "Showing {shown} of {total} cases")
          .replace("{shown}", String(results.length))
          .replace("{total}", String(similarCases.length))}
      </p>

      <div className="space-y-4">
        {results.map((c) => (
          <article key={c.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="flex flex-wrap items-start gap-3 border-b border-border/60 px-5 py-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Scale className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg leading-snug text-foreground">{c.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {c.court} · {c.year}
                </p>
              </div>
              <a
                href={c.link}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors duration-300 ease-out hover:bg-foreground/5 hover:text-foreground"
              >
                {t("similar.readTheCase", "Read the case")} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex flex-wrap gap-2">
                {c.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t("similar.whatHappened", "What happened")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.summary}</p>
              </div>

              <div className="rounded-xl border border-border/70 bg-background/60 px-4 py-3">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                  {t("similar.whatItMeans", "What it means for you")}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{c.relevance}</p>
              </div>
            </div>
          </article>
        ))}

        {results.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border/70 px-5 py-10 text-center text-sm text-muted-foreground">
            {t("similar.noMatches", "No cases match that search.")}
          </p>
        )}
      </div>
    </>
  );
}
