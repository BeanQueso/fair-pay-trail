import { useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpenCheck,
  CalendarRange,
  Calculator,
  FolderOpen,
  Handshake,
  Home,
  LogOut,
  Menu,
  Compass,
  Scale,
  Settings as SettingsIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCase } from "@/context/CaseProvider";
import { useI18n } from "@/lib/i18n";
import logoAsset from "@/assets/logo.png.asset.json";

const navItems = [
  { to: "/", labelKey: "nav.home", tour: "nav-home", icon: Home },
  { to: "/evidence", labelKey: "nav.evidence", tour: "nav-evidence", icon: FolderOpen },
  { to: "/timeline", labelKey: "nav.timeline", tour: "nav-timeline", icon: CalendarRange },
  { to: "/wage-estimate", labelKey: "nav.wage", tour: "nav-wage-estimate", icon: Calculator },
  { to: "/next-steps", labelKey: "nav.nextSteps", tour: "nav-next-steps", icon: Compass },
  { to: "/case-packet", labelKey: "nav.packet", tour: "nav-case-packet", icon: BookOpenCheck },
  { to: "/similar-cases", labelKey: "nav.similar", tour: "nav-similar-cases", icon: Scale },
  { to: "/advocates", labelKey: "nav.advocates", tour: "nav-advocates", icon: Handshake },
  { to: "/settings", labelKey: "nav.settings", tour: "nav-settings", icon: SettingsIcon },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useI18n();
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {navItems.map(({ to, labelKey, tour, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          data-tour={tour}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60",
            )
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300 ease-out",
                  isActive ? "bg-primary/15 text-primary" : "bg-foreground/5 text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {t(labelKey)}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}


function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useCase();
  const { t } = useI18n();
  return (
    <div className="flex h-full flex-col gap-8 px-5 py-8">
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        aria-label="Fair Pay Trail — go to Home"
        className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors duration-300 ease-out hover:bg-sidebar-accent/50"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/12">
          <img src={logoAsset.url} alt="Fair Pay Trail logo" className="h-8 w-8 object-contain" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-lg text-foreground">Fair Pay Trail</p>
          <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
        </div>
      </NavLink>

      <NavList onNavigate={onNavigate} />

      <div className="mt-auto space-y-3">
        <div className="rounded-xl border border-border/70 bg-background/60 p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">{t("app.disclaimer")}</p>
        </div>
        {user && (
          <div className="flex items-center justify-between gap-2 px-1">
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <Button variant="ghost" size="sm" className="rounded-lg" onClick={() => void signOut()}>
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> {t("action.signOut")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();
  const match = navItems.find((n) => n.to === location.pathname);
  const current = match ? t(match.labelKey) : "Fair Pay Trail";


  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarInner />
      </aside>

      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-display text-base">{current}</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 rounded-lg"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-10 lg:py-16">{children}</div>
      </main>
    </div>
  );
}
