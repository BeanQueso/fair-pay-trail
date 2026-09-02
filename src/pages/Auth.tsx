import { useState } from "react";
import logoAsset from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyError, supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function Auth() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setNotice(t("auth.confirmEmailNotice", "Check your inbox to confirm your email, then sign in."));
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(friendlyError(err, t("auth.genericError", "We couldn't complete that. Please try again.")));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary/12">
            <img src={logoAsset.url} alt={t("auth.logoAlt", "Fair Pay Trail logo")} className="h-9 w-9 object-contain" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-xl text-foreground">{t("auth.brandName", "Fair Pay Trail")}</p>
            <p className="text-xs text-muted-foreground">{t("auth.tagline", "Your case, clearly documented")}</p>
          </div>
        </div>

        <div className="surface-card">
          <h1 className="text-2xl text-foreground">
            {mode === "signup" ? t("auth.createAccount", "Create your account") : t("auth.welcomeBack", "Welcome back")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {mode === "signup"
              ? t("auth.privacyNote", "Your records stay private to you. Nothing is shared with your employer.")
              : t("auth.signInNote", "Sign in to pick up where you left off.")}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email", "Email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password", "Password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg"
              />
              {mode === "signup" && <p className="text-xs text-muted-foreground">{t("auth.minChars", "At least 8 characters.")}</p>}
            </div>

            {error && (
              <p className="rounded-lg bg-attention-soft px-3 py-2 text-sm text-attention" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="rounded-lg bg-calm-soft px-3 py-2 text-sm text-calm" role="status">
                {notice}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full rounded-lg" disabled={busy}>
              {busy ? t("auth.busy", "Just a moment…") : mode === "signup" ? t("auth.createAccountButton", "Create account") : t("auth.signInButton", "Sign in")}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signup" ? t("auth.alreadyHaveAccount", "Already have an account?") : t("auth.newHere", "New here?")}{" "}
            <button
              type="button"
              className="font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => {
                setMode(mode === "signup" ? "login" : "signup");
                setError(null);
                setNotice(null);
              }}
            >
              {mode === "signup" ? t("auth.signInButton", "Sign in") : t("auth.createOne", "Create one")}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {t("auth.legalNote", "Nothing here is legal advice. This is a place to gather what happened, in your own words.")}
        </p>
      </div>
    </main>
  );
}
