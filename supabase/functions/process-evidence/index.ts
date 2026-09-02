import { createClient } from "@supabase/supabase-js";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface EvidenceRow {
  id: string;
  user_id: string;
  case_id: string;
  file_name: string;
  mime_type: string | null;
  storage_path: string;
  evidence_type: string | null;
  processing_status: string;
  extracted_text: string | null;
  extracted_data: Record<string, unknown> | null;
  processing_error: string | null;
}

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

  if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  let body: { evidenceId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const evidenceId = body.evidenceId;
  if (!evidenceId || typeof evidenceId !== "string") {
    return new Response(JSON.stringify({ error: "evidenceId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: row, error: fetchError } = await admin
    .from("evidence")
    .select("*")
    .eq("id", evidenceId)
    .single();

  if (fetchError || !row) {
    return new Response(JSON.stringify({ error: "Evidence not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }

  const evidence = row as EvidenceRow;

  await admin
    .from("evidence")
    .update({ processing_status: "processing", processing_error: null })
    .eq("id", evidenceId);

  try {
    const { data: fileData, error: downloadError } = await admin.storage
      .from("evidence")
      .download(evidence.storage_path);

    if (downloadError || !fileData) {
      throw new Error(`Could not download file: ${downloadError?.message ?? "unknown"}`);
    }

    const bytes = new Uint8Array(await fileData.arrayBuffer());
    const mimeType = evidence.mime_type ?? "application/octet-stream";

    let extractedText = "";
    let extractedData: Record<string, unknown> = {};

    if (mimeType === "text/plain") {
      extractedText = new TextDecoder().decode(bytes);
      extractedData = { evidence_type: evidence.evidence_type ?? "other" };
    } else {
      const base64 = encodeBase64(bytes);
      const dataUri = `data:${mimeType};base64,${base64}`;

      const prompt = `You are reading a document uploaded by a worker who is documenting a possible wage or pay issue. Please extract the following and return ONLY a JSON object with these keys (use empty arrays/strings when nothing is found):
- "evidence_type": best guess from "pay_stub", "schedule", "timesheet", "bank_record", "message", "employment_document", "photo", "other"
- "transcription": the full text you can read from the document
- "dates": array of date strings found
- "amounts": array of money amounts found
- "hours": array of hours or time durations found
- "pay_rates": array of pay rates found
- "entities": array of people, employers, or places mentioned
- "key_facts": array of important factual statements
- "uncertain_items": array of anything unclear or unreadable

Return only the JSON object, no markdown, no explanation.`;

      const aiRes = await fetch(AI_GATEWAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": LOVABLE_API_KEY,
        },
        body: JSON.stringify({
          model: "google/gemini-3.6-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: dataUri } },
              ],
            },
          ],
          max_tokens: 2048,
        }),
      });

      if (!aiRes.ok) {
        const text = await aiRes.text();
        throw new Error(`AI reader failed (${aiRes.status}): ${text.slice(0, 200)}`);
      }

      const aiJson = await aiRes.json();
      const raw = aiJson.choices?.[0]?.message?.content ?? "";
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

      try {
        const parsed = JSON.parse(cleaned);
        extractedText = parsed.transcription ?? raw;
        extractedData = parsed;
      } catch {
        extractedText = raw;
        extractedData = { evidence_type: evidence.evidence_type ?? "other", transcription: raw };
      }
    }

    await admin
      .from("evidence")
      .update({
        processing_status: "ready",
        extracted_text: extractedText.slice(0, 50000),
        extracted_data: extractedData,
        processing_error: null,
      })
      .eq("id", evidenceId);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await admin
      .from("evidence")
      .update({ processing_status: "failed", processing_error: message.slice(0, 1000) })
      .eq("id", evidenceId);

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
    });
  }
}

function encodeBase64(bytes: Uint8Array): string {
  const chunkSize = 0x8000;
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    chunks.push(String.fromCharCode(...chunk));
  }
  return btoa(chunks.join(""));
}
