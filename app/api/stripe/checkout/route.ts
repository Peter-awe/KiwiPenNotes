// ============================================================
// POST /api/stripe/checkout — Create a Stripe Checkout Session
// Body: { plan: "plus_monthly" | "plus_yearly" | "pro_monthly" | "pro_yearly" }
// Returns: { url: string } — redirect URL for Stripe Checkout
//
// ⚠️ One-time payment mode — no subscription, no auto-renewal.
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { verifyAuth } from "@/lib/server-auth";

// Plan config: amount in cents, currency, display name, tier
interface PlanConfig {
  amount: number;
  currency: string;
  name: string;
  tier: string;
  period: string;
}

const PLAN_CONFIG: Record<string, PlanConfig> = {
  plus_monthly: {
    amount: 199,
    currency: "cad",
    name: "KiwiPenNotes Plus — 1 Month",
    tier: "plus",
    period: "monthly",
  },
  plus_yearly: {
    amount: 1999,
    currency: "cad",
    name: "KiwiPenNotes Plus — 1 Year",
    tier: "plus",
    period: "yearly",
  },
  pro_monthly: {
    amount: 999,
    currency: "usd",
    name: "KiwiPenNotes Pro Max — 1 Month",
    tier: "pro",
    period: "monthly",
  },
  pro_yearly: {
    amount: 9999,
    currency: "usd",
    name: "KiwiPenNotes Pro Max — 1 Year",
    tier: "pro",
    period: "yearly",
  },
};

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

    const { userId, email } = auth;

    const { plan } = await req.json();

    const config = plan ? PLAN_CONFIG[plan] : undefined;

    if (!config) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Find or create customer
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    let customerId: string;
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    // Create one-time payment checkout session
    const origin = req.headers.get("origin") || "https://kiwipennotes.com";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: config.currency,
            product_data: { name: config.name },
            unit_amount: config.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/settings?payment=success`,
      cancel_url: `${origin}/#pricing`,
      metadata: {
        supabase_user_id: userId,
        tier: config.tier,
        period: config.period,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: userId,
          tier: config.tier,
          period: config.period,
        },
      },
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message:
            "✅ 一次性付款，绝不隐形续费 · One-time payment, no auto-renewal.",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
