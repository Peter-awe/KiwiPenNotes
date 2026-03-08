// ============================================================
// GET /api/health — Debug endpoint to diagnose Worker runtime
// Returns: env var availability + timing of Supabase/Stripe calls
// ============================================================

import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    runtime: typeof globalThis.process !== "undefined" ? "node-like" : "edge",
  };

  // 1. Check env vars availability (keys only, not values!)
  const envChecks = [
    "SUPABASE_SERVICE_ROLE_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "DEEPSEEK_API_KEY",
    "STRIPE_PRICE_PRO_MONTHLY",
    "STRIPE_PRICE_PRO_YEARLY",
    "STRIPE_PRICE_PLUS_MONTHLY",
    "STRIPE_PRICE_PLUS_YEARLY",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "RESEND_API_KEY",
  ];
  results.env = {};
  for (const key of envChecks) {
    const val = process.env[key];
    (results.env as Record<string, string>)[key] = val
      ? `set (${val.length} chars, starts: ${val.substring(0, 6)}...)`
      : "NOT SET";
  }

  // 2. Test Supabase connection (simple query)
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    "https://ggczwqlopjiyuhbnnpgs.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseKey) {
    const t0 = Date.now();
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/user_profiles?select=count&limit=1`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      results.supabase = {
        status: res.status,
        ok: res.ok,
        ms: Date.now() - t0,
      };
    } catch (err: unknown) {
      results.supabase = {
        error: err instanceof Error ? err.message : String(err),
        ms: Date.now() - t0,
      };
    }
  } else {
    results.supabase = { error: "SUPABASE_SERVICE_ROLE_KEY not set" };
  }

  // 3. Test Stripe connection (list customers, limit 1)
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    const t0 = Date.now();
    try {
      const res = await fetch(
        "https://api.stripe.com/v1/customers?limit=1",
        {
          headers: {
            Authorization: `Basic ${btoa(stripeKey + ":")}`,
          },
          signal: AbortSignal.timeout(5000),
        }
      );
      results.stripe = {
        status: res.status,
        ok: res.ok,
        ms: Date.now() - t0,
      };
    } catch (err: unknown) {
      results.stripe = {
        error: err instanceof Error ? err.message : String(err),
        ms: Date.now() - t0,
      };
    }
  } else {
    results.stripe = { error: "STRIPE_SECRET_KEY not set" };
  }

  results.totalMs = Date.now() - start;

  return NextResponse.json(results, {
    headers: { "Cache-Control": "no-store" },
  });
}
