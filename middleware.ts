import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Hardcoded fallback — same values as lib/supabase.ts
// NEXT_PUBLIC_* vars may not be available at runtime on Cloudflare Workers
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ggczwqlopjiyuhbnnpgs.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnY3p3cWxvcGppeXVoYm5ucGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MzE2OTMsImV4cCI6MjA4ODAwNzY5M30.c_3xGQd_wH4LKpwvGNddl-YXMNkFDib734ZYV5FccYc";

const PROTECTED_ROUTES = ["/settings", "/library"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if route needs protection
  const isProtected = PROTECTED_ROUTES.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (!isProtected) return res;

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

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/settings/:path*", "/library/:path*"],
};
