// ============================================================
// GET /auth/callback — Handle OAuth / magic-link callback
// Exchanges the ?code= param for a Supabase session, then
// redirects the user to /record.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Hardcoded fallback — Cloudflare Workers may not expose NEXT_PUBLIC_* at runtime
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ggczwqlopjiyuhbnnpgs.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnY3p3cWxvcGppeXVoYm5ucGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzE2OTMsImV4cCI6MjA4ODAwNzY5M30.c_3xGQd_wH4LKpwvGNddl-YXMNkFDib734ZYV5FccYc";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    // No code — redirect to login
    return NextResponse.redirect(`${origin}/login`);
  }

  const res = NextResponse.redirect(`${origin}/record`);

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  return res;
}
