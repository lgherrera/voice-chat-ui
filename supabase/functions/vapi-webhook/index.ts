// supabase/functions/vapi-webhook/index.ts
// Receives end-of-call reports from Vapi and stores them in the vapi_calls table.

import { createClient } from "jsr:@supabase/supabase-js@2";

// 🧩 Initialize Supabase client with the Service Role Key (bypasses RLS)
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

// 🔐 Verify Authorization header (Bearer or raw token)
function verifyAuth(req: Request): boolean {
  const header = req.headers.get("authorization") || req.headers.get("Authorization");
  const expected = (Deno.env.get("VAPI_BEARER_TOKEN") || "").trim();

  if (!header || !expected) return false;

  const value = header.trim();
  if (value === expected) return true;              // no prefix
  if (value === `Bearer ${expected}`) return true;  // standard Bearer
  return false;
}

// 🧠 Utility: safely coerce number
function safeInt(n?: number | null): number | null {
  return typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.floor(n)) : null;
}

// 🧠 Utility: compute duration from timestamps if missing
function secondsBetween(a?: string, b?: string): number | null {
  if (!a || !b) return null;
  const dt = (new Date(b).getTime() - new Date(a).getTime()) / 1000;
  return Number.isFinite(dt) ? Math.max(0, Math.round(dt)) : null;
}

// 🚀 Main request handler
Deno.serve(async (req) => {
  try {
    // Only POST allowed
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // 🔑 Authenticate the incoming request
    if (!verifyAuth(req)) {
      console.warn("Unauthorized request (missing or invalid Authorization header)");
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const msg = body?.message;
    if (!msg) {
      console.warn("Missing 'message' in payload");
      return new Response("Bad Request: missing message", { status: 400 });
    }

    // We only care about end-of-call reports
    if (msg.type !== "end-of-call-report") {
      console.log(`Ignored message type: ${msg.type}`);
      return new Response("Ignored (not end-of-call-report)", { status: 202 });
    }

    const callId = msg.call?.id ?? "";
    if (!callId) {
      console.warn("Missing call.id in message");
      return new Response("Bad Request: missing call.id", { status: 400 });
    }

    const assistantId = msg.call?.assistantId ?? null;
    const endedReason = msg.endedReason ?? null;

    // Duration: prefer provided, else compute from timestamps
    const provided = safeInt(msg.call?.durationSec ?? null);
    const computed = secondsBetween(msg.call?.createdAt, msg.call?.endedAt);
    const duration = provided ?? computed ?? null;

    const transcript = msg.transcript ?? null;

    // 🗃️ Upsert into the vapi_calls table
    const { error } = await supabase
      .from("vapi_calls")
      .upsert(
        {
          id: callId,
          assistant_id: assistantId,
          ended_reason: endedReason,
          duration: duration,
          transcript: transcript,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("Database upsert error:", error);
      return new Response("Database error", { status: 500 });
    }

    console.log(`✅ Stored call ${callId} (assistant: ${assistantId})`);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Handler error:", err);
    return new Response("Server error", { status: 500 });
  }
});

