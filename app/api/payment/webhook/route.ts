import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey) {
    console.error("[Stripe Webhook] STRIPE_SECRET_KEY is not configured.");
    return NextResponse.json({ error: "Secret key missing" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey);

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    // Verify webhook signature strictly
    if (!webhookSecret) {
      console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
    }

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`[Stripe Webhook] Received event: ${event.type}`);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      if (!userId) {
        console.error("[Stripe Webhook] Missing userId in session metadata:", session.id);
        return NextResponse.json({ error: "Missing metadata user ID" }, { status: 400 });
      }

      console.log(`[Stripe Webhook] Provisioning premium for user: ${userId}, Session ID: ${session.id}`);

      // Perform secure backend Firestore update
      await db.collection("users").doc(userId).set(
        {
          tier: "premium",
          premiumUpdatedAt: new Date(),
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || "N/A",
        },
        { merge: true }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook] Endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
