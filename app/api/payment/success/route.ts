import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id") || searchParams.get("transaction_id") || searchParams.get("checkout_id");
    const provider = searchParams.get("provider");
    const plan = searchParams.get("plan") || "premium";
    const billingInterval = searchParams.get("billingInterval") || "monthly";

    const origin = new URL(request.url).origin;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    // -------------------------------------------------------------
    // 💳 STRIPE PAYMENTS SUCCESS VERIFICATION
    // -------------------------------------------------------------
    if (provider === "stripe" || sessionId.startsWith("cs_")) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        console.error("STRIPE_SECRET_KEY is not configured.");
        return NextResponse.json({ error: "Stripe Secret Key not configured" }, { status: 500 });
      }

      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid" || session.status !== "complete") {
        return NextResponse.redirect(`${origin}/payment/success?status=failure&error=payment_not_completed`, 303);
      }

      const userId = session.metadata?.userId;
      if (!userId) {
        return NextResponse.redirect(`${origin}/payment/success?status=failure&error=missing_user_metadata`, 303);
      }

      const stripePlan = session.metadata?.plan || plan;
      const stripeInterval = session.metadata?.billingInterval || billingInterval;

      await db.collection("users").doc(userId).set(
        {
          tier: stripePlan,
          billingInterval: stripeInterval,
          premiumUpdatedAt: new Date(),
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || "N/A",
          paymentProvider: "stripe",
        },
        { merge: true }
      );

      const amount = (session.amount_total ? session.amount_total / 100 : 15.00).toFixed(2);
      const currency = (session.currency || "USD").toUpperCase();

      return NextResponse.redirect(
        `${origin}/payment/success?status=success&session_id=${sessionId}&amount=${amount}&currency=${currency}&plan=${stripePlan}&provider=stripe`,
        303
      );
    }

    // -------------------------------------------------------------
    // ⚓ PADDLE PAYMENTS SUCCESS VERIFICATION
    // -------------------------------------------------------------
    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "sandbox";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    let userId = "";

    if (apiKey && apiKey.startsWith("pdl_") && !sessionId.startsWith("PAD-")) {
      try {
        const res = await fetch(`${apiBase}/transactions/${sessionId}`, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          userId = data.data?.custom_data?.userId || "";
        }
      } catch (e) {
        console.error("Warning: could not verify Paddle transaction via API:", e);
      }
    }

    if (userId) {
      await db.collection("users").doc(userId).set(
        {
          tier: plan,
          billingInterval: billingInterval,
          premiumUpdatedAt: new Date(),
          paddleTransactionId: sessionId,
          paymentProvider: "paddle",
        },
        { merge: true }
      );
    }

    const amount = (plan === "pro" ? (billingInterval === "annual" ? "288.00" : "30.00") : (billingInterval === "annual" ? "144.00" : "15.00"));

    return NextResponse.redirect(
      `${origin}/payment/success?status=success&session_id=${encodeURIComponent(sessionId)}&amount=${amount}&currency=USD&plan=${plan}&provider=paddle`,
      303
    );
  } catch (error: any) {
    console.error("Error in payment success redirect:", error);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/payment/success?status=failure&error=${encodeURIComponent(error.message || "internal_error")}`, 303);
  }
}
