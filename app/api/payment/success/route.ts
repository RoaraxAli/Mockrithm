import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY is not configured in environment.");
      return NextResponse.json({ error: "Stripe Secret Key not configured" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);

    // Retrieve Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid" || session.status !== "complete") {
      const origin = new URL(request.url).origin;
      return NextResponse.redirect(`${origin}/payment/success?status=failure&error=payment_not_completed`, 303);
    }

    const userId = session.metadata?.userId;
    if (!userId) {
      console.error("No userId found in Stripe checkout session metadata:", session);
      const origin = new URL(request.url).origin;
      return NextResponse.redirect(`${origin}/payment/success?status=failure&error=missing_user_metadata`, 303);
    }

    console.log(`User ${userId} checkout session validated via redirect.`);

    const plan = session.metadata?.plan || "premium";
    const billingInterval = session.metadata?.billingInterval || "monthly";

    // Perform secure backend Firestore update to upgrade user immediately
    await db.collection("users").doc(userId).set(
      {
        tier: plan,
        billingInterval: billingInterval,
        premiumUpdatedAt: new Date(),
        stripeSessionId: session.id,
        stripePaymentIntentId: (session.payment_intent as string) || "N/A",
      },
      { merge: true }
    );

    // Redirect back to client dashboard success page
    const origin = new URL(request.url).origin;
    const amount = (session.amount_total ? session.amount_total / 100 : 10.00).toFixed(2);
    const currency = (session.currency || "USD").toUpperCase();

    return NextResponse.redirect(
      `${origin}/payment/success?status=success&session_id=${sessionId}&amount=${amount}&currency=${currency}&plan=${plan}`,
      303
    );
  } catch (error: any) {
    console.error("Error in Stripe payment success redirect:", error);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/payment/success?status=failure&error=${encodeURIComponent(error.message || "internal_error")}`, 303);
  }
}
