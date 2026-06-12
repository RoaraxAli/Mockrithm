import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount = 10 } = await request.json().catch(() => ({}));
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
              name: "Mockrithm Premium Tier",
              description: "Lifetime premium upgrade for ATS resume templates, unlimited real-time interviews, and advanced analytics.",
            },
            unit_amount: Math.round(parseFloat(amount.toString()) * 100), // e.g. 10 * 100 = 1000 cents ($10.00)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: user.id,
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
