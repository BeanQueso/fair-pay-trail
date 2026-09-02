import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  ACCEPTED_MIME_TYPES,
  EVIDENCE_BUCKET,
  MAX_FILE_BYTES,
  buildStoragePath,
  friendlyError,
  supabase,
  type CaseAnalysis,
  type CaseRow,
  type EvidenceRow,
} from "@/lib/supabase";
import { LANGUAGES, useI18n } from "@/lib/i18n";

const LANGUAGE_NAMES: Record<string, string> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l.label]),
);

interface CaseContextValue {
  session: Session | null;
  user: User | null;
  authLoading: boolean;
  signOut: () => Promise<void>;

  caseRow: CaseRow | null;
  evidence: EvidenceRow[];
  loading: boolean;
  loadError: string | null;
  refresh: () => Promise<void>;

  uploading: boolean;
  uploadEvidence: (files: File[], evidenceType?: string | null) => Promise<{ ok: number; errors: string[] }>;
  retryProcessing: (evidenceId: string) => Promise<void>;
  deleteEvidence: (evidenceId: string) => Promise<void>;

  analysis: CaseAnalysis | null;
  analysisStale: boolean;
  /** The review on file was written in a different language than the one selected. */
  analysisLanguageStale: boolean;
  analyzing: boolean;
  analysisError: string | null;
  runAnalysis: () => Promise<void>;
  readyEvidence: EvidenceRow[];
}

const CaseContext = createContext<CaseContextValue | null>(null);

function signatureOf(evidence: EvidenceRow[]) {
  return evidence
    .filter((e) => e.processing_status === "ready")
    .map((e) => `${e.id}:${e.updated_at}`)
    .sort()
    .join("|");
}

/** The evidence table requires a type, so fall back to a sensible guess from the file itself. */
export function inferEvidenceType(file: File): string {
  const name = file.name.toLowerCase();
  if (/pay ?stub|paystub|payslip|pay ?check|earnings/.test(name)) return "pay_stub";
  if (/schedule|roster|shift/.test(name)) return "schedule";
  if (/timesheet|time ?card|punch|clock/.test(name)) return "timesheet";
  if (/bank|deposit|statement/.test(name)) return "bank_record";
  if (/text|sms|message|chat|email|whatsapp/.test(name)) return "message";
  if (/contract|offer|agreement|handbook|policy/.test(name)) return "employment_document";
  if (file.type.startsWith("image/")) return "photo";
  return "other";
}


export function CaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [caseRow, setCaseRow] = useState<CaseRow | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const ensuringCase = useRef<Promise<CaseRow> | null>(null);
  const analyzingRef = useRef(false);

  const user = session?.user ?? null;
  const { language } = useI18n();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadAll = useCallback(async () => {
    if (!user) {
      setCaseRow(null);
      setEvidence([]);
      return;
    }
    setLoading(true);
    setLoadError(null);
    try {
      const { data: cases, error: caseError } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1);
      if (caseError) throw caseError;
      const found = (cases?.[0] as CaseRow | undefined) ?? null;
      setCaseRow(found);

      if (found) {
        const { data: rows, error: evError } = await supabase
          .from("evidence")
          .select("*")
          .eq("case_id", found.id)
          .order("created_at", { ascending: false });
        if (evError) throw evError;
        setEvidence((rows ?? []) as EvidenceRow[]);
      } else {
        setEvidence([]);
      }
    } catch (error) {
      setLoadError(friendlyError(error, "We couldn't load your case right now."));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  /** Poll while anything is uploaded/processing; stops at ready/failed. */
  useEffect(() => {
    const pending = evidence.some((e) => e.processing_status === "uploaded" || e.processing_status === "processing");
    if (!pending || !caseRow) return;
    let cancelled = false;
    let ticks = 0;
    const timer = setInterval(async () => {
      ticks += 1;
      if (ticks > 60) {
        clearInterval(timer);
        return;
      }
      const { data, error } = await supabase
        .from("evidence")
        .select("*")
        .eq("case_id", caseRow.id)
        .order("created_at", { ascending: false });
      if (!cancelled && !error && data) setEvidence(data as EvidenceRow[]);
    }, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [evidence, caseRow]);

  const ensureCase = useCallback(async (): Promise<CaseRow> => {
    if (!user) throw new Error("You need to be signed in.");
    if (caseRow) return caseRow;
    if (ensuringCase.current) return ensuringCase.current;

    const promise = (async () => {
      const { data: existing, error: findError } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1);
      if (findError) throw findError;
      if (existing?.[0]) {
        const row = existing[0] as CaseRow;
        setCaseRow(row);
        return row;
      }
      const { data: created, error: insertError } = await supabase
        .from("cases")
        .insert({ user_id: user.id, title: "My wage case", status: "active" })
        .select("*")
        .single();
      if (insertError) throw insertError;
      const row = created as CaseRow;
      setCaseRow(row);
      return row;
    })();

    ensuringCase.current = promise;
    try {
      return await promise;
    } finally {
      ensuringCase.current = null;
    }
  }, [user, caseRow]);

  const invokeProcessing = useCallback(async (evidenceId: string) => {
    const { error } = await supabase.functions.invoke("process-evidence", { body: { evidenceId } });
    if (error) throw error;
  }, []);

  const uploadEvidence = useCallback(
    async (files: File[], evidenceType?: string | null) => {
      const errors: string[] = [];
      let ok = 0;
      if (!user) return { ok, errors: ["You need to be signed in to add evidence."] };
      setUploading(true);
      try {
        const activeCase = await ensureCase();
        for (const file of files) {
          if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
            errors.push(`${file.name}: that file type isn't supported yet (PDF, JPEG, PNG, WebP or plain text).`);
            continue;
          }
          if (file.size > MAX_FILE_BYTES) {
            errors.push(`${file.name}: this file is larger than the 10 MB limit.`);
            continue;
          }
          const storagePath = buildStoragePath(user.id, activeCase.id, file.name);
          const { error: uploadError } = await supabase.storage
            .from(EVIDENCE_BUCKET)
            .upload(storagePath, file, { contentType: file.type, upsert: false });
          if (uploadError) {
            errors.push(`${file.name}: ${friendlyError(uploadError, "the upload didn't finish.")}`);
            continue;
          }

          const { data: inserted, error: insertError } = await supabase
            .from("evidence")
            .insert({
              user_id: user.id,
              case_id: activeCase.id,
              file_name: file.name,
              mime_type: file.type,
              file_size: file.size,
              storage_path: storagePath,
              evidence_type: evidenceType || inferEvidenceType(file),
              processing_status: "uploaded",
            })
            .select("*")
            .single();

          if (insertError || !inserted) {
            await supabase.storage.from(EVIDENCE_BUCKET).remove([storagePath]);
            errors.push(`${file.name}: ${friendlyError(insertError, "we couldn't save this file to your case.")}`);
            continue;
          }

          const row = inserted as EvidenceRow;
          setEvidence((prev) => [row, ...prev]);
          ok += 1;

          try {
            await invokeProcessing(row.id);
          } catch (error) {
            errors.push(`${file.name}: ${friendlyError(error, "we couldn't start reading this file.")}`);
          }
        }
      } catch (error) {
        errors.push(friendlyError(error, "We couldn't start your case."));
      } finally {
        setUploading(false);
        await loadAll();
      }
      return { ok, errors };
    },
    [user, ensureCase, invokeProcessing, loadAll],
  );

  const retryProcessing = useCallback(
    async (evidenceId: string) => {
      setEvidence((prev) =>
        prev.map((e) =>
          e.id === evidenceId ? { ...e, processing_status: "processing", processing_error: null } : e,
        ),
      );
      try {
        await invokeProcessing(evidenceId);
      } catch (error) {
        setEvidence((prev) =>
          prev.map((e) =>
            e.id === evidenceId
              ? {
                  ...e,
                  processing_status: "failed",
                  processing_error: friendlyError(error, "Processing could not be started."),
                }
              : e,
          ),
        );
      } finally {
        await loadAll();
      }
    },
    [invokeProcessing, loadAll],
  );

  const deleteEvidence = useCallback(
    async (evidenceId: string) => {
      const target = evidence.find((e) => e.id === evidenceId);
      if (!target) return;
      const { error } = await supabase.from("evidence").delete().eq("id", evidenceId);
      if (error) throw new Error(friendlyError(error, "We couldn't remove that item."));
      await supabase.storage.from(EVIDENCE_BUCKET).remove([target.storage_path]);
      setEvidence((prev) => prev.filter((e) => e.id !== evidenceId));

      // If that was the last piece of evidence, the old review no longer describes
      // anything — clear it so the timeline, packet and next steps go back to empty.
      const remaining = evidence.filter((e) => e.id !== evidenceId);
      if (remaining.length === 0 && caseRow?.latest_analysis) {
        const { data: cleared } = await supabase
          .from("cases")
          .update({ latest_analysis: null })
          .eq("id", caseRow.id)
          .select("*")
          .single();
        if (cleared) setCaseRow(cleared as CaseRow);
      }
      await loadAll();
    },
    [evidence, caseRow, loadAll],
  );

  const readyEvidence = useMemo(
    () => evidence.filter((e) => e.processing_status === "ready"),
    [evidence],
  );

  const analysis = caseRow?.latest_analysis ?? null;

  /** True whenever the review on file no longer matches the evidence on file. */
  const analysisStale = useMemo(() => {
    if (!analysis) return readyEvidence.length > 0;
    return analysis.evidence_signature !== signatureOf(evidence);
  }, [analysis, evidence, readyEvidence.length]);

  /** The saved review is in another language than the one the user is reading in. */
  const analysisLanguageStale = useMemo(
    () => Boolean(analysis) && (analysis?.language ?? "en") !== language,
    [analysis, language],
  );

  const runAnalysis = useCallback(async () => {
    if (analyzingRef.current) return;
    if (!caseRow || readyEvidence.length === 0) return;
    analyzingRef.current = true;
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const caseText = readyEvidence
        .map((e, i) => {
          const type = e.evidence_type ?? e.extracted_data?.evidence_type ?? "unknown type";
          const text = e.extracted_text ?? e.extracted_data?.transcription ?? "";
          return `--- EVIDENCE ${i + 1} ---\nFile: ${e.file_name}\nType: ${type}\nUploaded: ${new Date(
            e.created_at,
          ).toISOString()}\n\n${text}`;
        })
        .join("\n\n");

      const languageName = LANGUAGE_NAMES[language] ?? "English";
      const languageDirective =
        language === "en"
          ? ""
          : `IMPORTANT: Write every piece of text you output (summary, facts, timeline titles and descriptions, discrepancies, missing evidence, next step, safety flags) in ${languageName}. Keep dates, names and amounts as they appear. Keep the same JSON keys in English.\n\n`;

      const { data, error } = await supabase.functions.invoke("analyze-case", {
        body: { caseText: `${languageDirective}${caseText}`, language, languageName },
      });
      if (error) throw error;
      const result = (data ?? {}) as CaseAnalysis;
      const payload: CaseAnalysis = {
        ...result,
        generated_at: new Date().toISOString(),
        evidence_signature: signatureOf(evidence),
        language,
      };
      const { data: updated, error: updateError } = await supabase
        .from("cases")
        .update({ latest_analysis: payload })
        .eq("id", caseRow.id)
        .select("*")
        .single();
      if (updateError) throw updateError;
      setCaseRow(updated as CaseRow);
    } catch (error) {
      setAnalysisError(friendlyError(error, "We couldn't analyse your case just now. Your evidence is safe."));
    } finally {
      analyzingRef.current = false;
      setAnalyzing(false);
    }
  }, [caseRow, readyEvidence, evidence, language]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCaseRow(null);
    setEvidence([]);
  }, []);

  const value: CaseContextValue = {
    session,
    user,
    authLoading,
    signOut,
    caseRow,
    evidence,
    loading,
    loadError,
    refresh: loadAll,
    uploading,
    uploadEvidence,
    retryProcessing,
    deleteEvidence,
    analysis,
    analysisStale,
    analysisLanguageStale,
    analyzing,
    analysisError,
    runAnalysis,
    readyEvidence,
  };

  return <CaseContext.Provider value={value}>{children}</CaseContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used inside CaseProvider");
  return ctx;
}
