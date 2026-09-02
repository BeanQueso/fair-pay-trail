import { useMemo, useState } from "react";
import { ExternalLink, Handshake, Phone, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { advocateKinds, advocates } from "@/data/advocates";
import { useI18n } from "@/lib/i18n";

export default function Advocates() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      advocates.filter((a) => {
        const matchesKind = !kind || a.kind === kind;
        const haystack = [a.name, a.region, a.states.join(" "), a.languages.join(" "), a.services.join(" ")]
          .join(" ")
          .toLowerCase();
        return matchesKind && (!q || haystack.includes(q));
      }),
    [q, kind],
  );

  return (
    <>
      <PageHeader
        title={t("advocates.title", "Find an Advocate")}
        description={t("advocates.description", "Free legal help with unpaid wages.")}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("advocates.searchPlaceholder", "Search by state, city, or language (e.g. TX, Boston, Spanish)")}
            aria-label={t("advocates.searchAriaLabel", "Search advocates")}
            className="rounded-lg pl-9"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setKind(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 ease-out",
            !kind ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40",
          )}
        >
          {t("advocates.all", "All")}
        </button>
        {advocateKinds.map((k) => (
          <button
            key={k}
            onClick={() => setKind(kind === k ? null : k)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-300 ease-out",
              kind === k
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={Handshake}
          title={t("advocates.noMatchesTitle", "No matches")}
          description={t(
            "advocates.noMatchesDescription",
            "Nothing matches that search. Try a state abbreviation, a city, or clear the filters — the nationwide organisations can refer you anywhere in the U.S.",
          )}
        />
      ) : (
        <div className="space-y-4">
          {results.map((a) => (
            <article key={a.id} className="surface-card">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{a.kind}</span>
                <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                  {a.region}
                </span>
                <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground">
                  {a.cost}
                </span>
              </div>
              <h2 className="mt-3 text-lg text-foreground">{a.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.services.join(" · ")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("advocates.languages", "Languages")}: {a.languages.join(", ")}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {a.phone && (
                  <Button asChild variant="outline" size="sm" className="rounded-lg bg-card">
                    <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`}>
                      <Phone className="mr-2 h-3.5 w-3.5" /> {a.phone}
                    </a>
                  </Button>
                )}
                <Button asChild size="sm" className="rounded-lg">
                  <a href={a.website} target="_blank" rel="noopener noreferrer">
                    {t("advocates.visitSite", "Visit site")} <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-8 rounded-xl border border-border/70 bg-card px-5 py-4 text-xs leading-relaxed text-muted-foreground">
        {t(
          "advocates.footerNote",
          "This is a reference list, not a referral or endorsement, and it isn't legal advice. Contact details change — confirm them with the organisation before you rely on them. Many offices have income limits or focus on specific industries.",
        )}
      </p>
    </>
  );
}
