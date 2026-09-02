const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get("origin") || "*";

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  let body: { caseText?: string; language?: string; languageName?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const caseText = body.caseText ?? "";
  const languageName = body.languageName ?? "English";

  if (!caseText.trim()) {
    return new Response(JSON.stringify({ error: "caseText is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const languageDirective =
    languageName === "English"
      ? ""
      : `Write every piece of text you output in ${languageName}. Keep dates, names and amounts as they appear. Keep the same JSON keys in English.`;

  const prompt = `You are helping a worker understand a possible wage or pay issue. Below is text extracted from their evidence files.

${languageDirective}

Please read the evidence and return ONLY a JSON object with these keys:
- "summary": a 2-4 sentence plain-English summary of what the evidence suggests
- "extracted_facts": an array of important factual statements
- "timeline_events": an array of objects, each with "date" (ISO date string or null), "title" (short), "event" (what happened), "description" (1-2 sentences), and "source" (which file it came from)
- "possible_discrepancies": an array of things that look inconsistent or worth checking
- "missing_evidence": an array of evidence gaps that would strengthen the case
- "recommended_next_step": one concrete sentence telling the worker what to do next
- "safety_flags": an array of any safety, retaliation, or urgency concerns you notice (empty if none)

Return only the JSON object, no markdown, no explanation.

EVIDENCE:

${caseText.slice(0, 20000)}`;

  try {
    const aiRes = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "openai/gpt-5.4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096,
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      throw new Error(`Case analysis failed (${aiRes.status}): ${text.slice(0, 200)}`);
    }

    const aiJson = await aiRes.json();
    const raw = aiJson.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

    let result: Record<string, unknown>;
    try {
      result = JSON.parse(cleaned);
    } catch {
      result = {
        summary: raw.slice(0, 1000),
        extracted_facts: [],
        timeline_events: [],
        possible_discrepancies: [],
        missing_evidence: [],
        recommended_next_step: "",
        safety_flags: [],
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }
}
