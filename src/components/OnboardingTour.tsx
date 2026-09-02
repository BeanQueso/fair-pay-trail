import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";

interface Step {
  target: string | null;
  titleKey: string;
  titleFallback: string;
  bodyKey: string;
  bodyFallback: string;
}

const STEPS: Step[] = [
  {
    target: null,
    titleKey: "tour.step1.title",
    titleFallback: "Welcome to Fair Pay Trail",
    bodyKey: "tour.step1.body",
    bodyFallback:
      "A short walkthrough of how this works — about a minute. You can skip it and come back to it any time from Settings.",
  },
  {
    target: '[data-tour="nav-home"]',
    titleKey: "tour.home.title",
    titleFallback: "Home is your summary",
    bodyKey: "tour.home.body",
    bodyFallback:
      "Home gathers your case in one place: how many files you've added, what the review found, and the single next thing worth doing.",
  },
  {
    target: '[data-tour="nav-evidence"]',
    titleKey: "tour.step2.title",
    titleFallback: "Start with My Evidence",
    bodyKey: "tour.step2.body",
    bodyFallback:
      "Upload pay stubs, schedules, screenshots or photos. Each file is read for dates, hours, rates and amounts. Nothing is shared with your employer.",
  },
  {
    target: '[data-tour="nav-evidence"]',
    titleKey: "tour.evidenceTools.title",
    titleFallback: "Search and check your files",
    bodyKey: "tour.evidenceTools.body",
    bodyFallback:
      "Search across everything you've uploaded, delete anything added by mistake, and use the info button to see what makes a document strong or weak.",
  },
  {
    target: '[data-tour="nav-timeline"]',
    titleKey: "tour.step3.title",
    titleFallback: "Your Case Timeline",
    bodyKey: "tour.step3.body",
    bodyFallback:
      "Once your files are read, the dates found in them are laid out in order, so you can see where hours and pay stopped matching.",
  },
  {
    target: '[data-tour="nav-wage-estimate"]',
    titleKey: "tour.step4.title",
    titleFallback: "Wage Estimate",
    bodyKey: "tour.step4.body",
    bodyFallback: "Hours, rates and amounts pulled from your own documents are collected here. Nothing is invented — only what your evidence shows.",
  },
  {
    target: '[data-tour="nav-next-steps"]',
    titleKey: "tour.step5.title",
    titleFallback: "Next Steps",
    bodyKey: "tour.step5.body",
    bodyFallback: "One clear thing to do next, plus what's still missing and how to reach a free advocate near you.",
  },
  {
    target: '[data-tour="nav-case-packet"]',
    titleKey: "tour.step6.title",
    titleFallback: "Case Packet",
    bodyKey: "tour.step6.body",
    bodyFallback: "Everything assembled into one document you can review, save, or bring to an advocate.",
  },
  {
    target: '[data-tour="nav-similar-cases"]',
    titleKey: "tour.similar.title",
    titleFallback: "Similar Cases",
    bodyKey: "tour.similar.body",
    bodyFallback:
      "Real wage cases explained in plain language. Search or filter by topic to see how situations like yours were handled.",
  },
  {
    target: '[data-tour="nav-advocates"]',
    titleKey: "tour.advocates.title",
    titleFallback: "Advocates",
    bodyKey: "tour.advocates.body",
    bodyFallback: "A directory of free and pro bono help — legal aid groups, worker centers and labor agencies you can contact directly.",
  },
  {
    target: '[data-tour="nav-settings"]',
    titleKey: "tour.step7.title",
    titleFallback: "Settings",
    bodyKey: "tour.step7.body",
    bodyFallback: "Change the app's language, or replay this walkthrough whenever you like.",
  },
  {
    target: null,
    titleKey: "tour.privacy.title",
    titleFallback: "Your records stay yours",
    bodyKey: "tour.privacy.body",
    bodyFallback:
      "Only you can see your files and your review. This app doesn't give legal advice — it organizes what you already have so a person or agency can act on it.",
  },
];


const PAD = 8;

function storageKey(userId: string) {
  return `fpt.tour.seen.${userId}`;
}

export const TOUR_REPLAY_EVENT = "fpt:tour-replay";

export function markTourUnseen(userId: string) {
  try {
    window.localStorage.removeItem(storageKey(userId));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(TOUR_REPLAY_EVENT));
}

export default function OnboardingTour() {
  const { user } = useCase();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!user) return;
    let seen = true;
    try {
      seen = window.localStorage.getItem(storageKey(user.id)) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      setIndex(0);
      setOpen(true);
    }
  }, [user]);

  useEffect(() => {
    const onReplay = () => {
      setIndex(0);
      setOpen(true);
    };
    window.addEventListener(TOUR_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(TOUR_REPLAY_EVENT, onReplay);
  }, []);

  const finish = useCallback(() => {
    setOpen(false);
    if (user) {
      try {
        window.localStorage.setItem(storageKey(user.id), "1");
      } catch {
        /* ignore */
      }
    }
  }, [user]);

  const step = STEPS[index];

  const measure = useCallback(() => {
    if (!open || !step?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(step.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [open, step]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, finish]);

  if (!open || !step) return null;

  const isLast = index === STEPS.length - 1;
  const cardWidth = 340;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let cardStyle: React.CSSProperties;
  let arrowStyle: React.CSSProperties | null = null;

  if (rect) {
    const roomRight = viewportW - rect.right;
    if (roomRight > cardWidth + 40) {
      const top = Math.min(Math.max(rect.top - 12, 16), viewportH - 220);
      cardStyle = { top, left: rect.right + 22, width: cardWidth };
      arrowStyle = {
        top: Math.min(Math.max(rect.top + rect.height / 2 - top, 18), 160),
        left: -6,
      };
    } else {
      const top = Math.min(rect.bottom + 22, viewportH - 240);
      const left = Math.min(Math.max(rect.left, 16), viewportW - cardWidth - 16);
      cardStyle = { top, left, width: Math.min(cardWidth, viewportW - 32) };
      arrowStyle = { top: -6, left: Math.min(Math.max(rect.left + rect.width / 2 - left, 18), cardWidth - 30) };
    }
  } else {
    cardStyle = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: Math.min(cardWidth + 40, viewportW - 32),
    };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t("tour.ariaLabel", "App walkthrough")}>
      <button
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/45 backdrop-blur-[1px]"
        aria-label={t("tour.skipAriaLabel", "Skip walkthrough")}
        onClick={finish}
      />

      {rect && (
        <div
          className="pointer-events-none absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background transition-all duration-300 ease-out"
          style={{
            top: rect.top - PAD / 2,
            left: rect.left - PAD / 2,
            width: rect.width + PAD,
            height: rect.height + PAD,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.001)",
            background: "hsl(var(--background) / 0.12)",
          }}
          aria-hidden
        />
      )}

      <div
        className="absolute rounded-2xl border border-border bg-card p-5 shadow-2xl transition-all duration-300 ease-out"
        style={cardStyle}
      >
        {arrowStyle && (
          <span
            className="absolute h-3 w-3 rotate-45 border-b border-l border-border bg-card"
            style={arrowStyle}
            aria-hidden
          />
        )}
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {t("tour.stepCounter", "Step {n} of {total}")
              .replace("{n}", String(index + 1))
              .replace("{total}", String(STEPS.length))}
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl leading-snug text-foreground">{t(step.titleKey, step.titleFallback)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(step.bodyKey, step.bodyFallback)}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={finish}
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("tour.skip", "Skip")}
          </button>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <Button variant="outline" size="sm" className="rounded-lg bg-card" onClick={() => setIndex(index - 1)}>
                {t("tour.back", "Back")}
              </Button>
            )}
            <Button size="sm" className="rounded-lg" onClick={() => (isLast ? finish() : setIndex(index + 1))}>
              {isLast ? t("tour.getStarted", "Get started") : t("tour.next", "Next")}
              {!isLast && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
