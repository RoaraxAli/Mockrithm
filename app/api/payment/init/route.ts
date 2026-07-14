import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body for plan/tier and billing interval
    const body = await request.json().catch(() => ({}));
    const plan = body.plan || body.tier || "premium";
    const billingInterval = body.billingInterval || "monthly";

    // Set and validate unit amount to prevent client pricing manipulation
    let amountCents = 1500; // default premium monthly ($15.00)
    if (plan === "pro") {
      amountCents = billingInterval === "annual" ? 28800 : 3000;
      if (body.amount === 240 || body.amount === 25) {
        amountCents = body.amount * 100;
      }
    } else {
      amountCents = billingInterval === "annual" ? 14400 : 1500;
      if (body.amount === 10 || body.amount === 14.99) {
        amountCents = Math.round(body.amount * 100);
      }
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: "Stripe Secret Key not configured" }, { status: 500 });
    }

    // Initialize Stripe
    const stripe = new Stripe(secretKey);

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan === "pro" ? "Mockrithm Pro Tier Upgrade" : "Mockrithm Premium Tier Upgrade",
              description: plan === "pro"
                ? "Full unrestricted access to systems design simulations, telemetry sharing, custom resume matching, and advanced ATS tools."
                : "Premium upgrade for ATS resume templates, unlimited real-time interviews, and advanced analytics.",
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: user.id,
        plan: plan,
        billingInterval: billingInterval,
      },
      success_url: `${origin}/api/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create Stripe checkout session URL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, checkoutUrl: session.url });
  } catch (error: any) {
    console.error("Error in Stripe payment init:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
