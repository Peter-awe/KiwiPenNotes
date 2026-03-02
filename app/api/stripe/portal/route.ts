// ============================================================
// POST /api/stripe/portal — Create Stripe Customer Portal session
// No body needed — customerId is looked up from authenticated user
// Returns: { url: string }
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { verifyAuth } from "@/lib/server-auth";
import { createClient } from "@supabase/supabase-js";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
}

export async function POST(req: NextRequest) {
  try {
    // Verify caller identity — reject unauthenticated requests
    const auth = await verifyAuth(req);
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Look up the user's Stripe customer ID from DB (don't trust client)
    const supabase = getAdminSupabase();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", auth.userId)
      .single();

    const customerId = profile?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const origin = req.headers.get("origin") || "https://kiwipennotes.com";

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${origin}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe portal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
