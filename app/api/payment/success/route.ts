import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId =
      searchParams.get("_ptxn") ||
      searchParams.get("session_id") ||
      searchParams.get("transaction_id") ||
      searchParams.get("checkout_id") ||
      searchParams.get("txn") ||
      searchParams.get("pdl_txn");

    let provider = searchParams.get("provider");
    let plan = searchParams.get("plan") || "pro";
    let billingInterval = searchParams.get("billingInterval") || "monthly";

    const origin = new URL(request.url).origin;
    const acceptHeader = request.headers.get("accept") || "";
    const isJsonRequest = acceptHeader.includes("application/json");

    if (!sessionId) {
      if (isJsonRequest) {
        return NextResponse.json({ success: false, error: "Missing session_id or _ptxn parameter" }, { status: 400 });
      }
      return NextResponse.redirect(`${origin}/payment/success?status=failure&error=missing_transaction_id`, 303);
    }

    // Auto-detect provider if sessionId starts with txn_ (Paddle Billing v2)
    if (sessionId.startsWith("txn_")) {
      provider = "paddle";
    }

    // -------------------------------------------------------------
    // 💳 STRIPE PAYMENTS SUCCESS VERIFICATION
    // -------------------------------------------------------------
    if (provider === "stripe" || sessionId.startsWith("cs_")) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey) {
        console.error("STRIPE_SECRET_KEY is not configured.");
        if (isJsonRequest) return NextResponse.json({ error: "Stripe Secret Key not configured" }, { status: 500 });
        return NextResponse.redirect(`${origin}/payment/success?status=failure&error=stripe_key_missing`, 303);
      }

      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid" || session.status !== "complete") {
        if (isJsonRequest) return NextResponse.json({ success: false, error: "Payment not completed" }, { status: 400 });
        return NextResponse.redirect(`${origin}/payment/success?status=failure&error=payment_not_completed`, 303);
      }

      const userId = session.metadata?.userId;
      if (!userId) {
        if (isJsonRequest) return NextResponse.json({ success: false, error: "Missing user metadata" }, { status: 400 });
        return NextResponse.redirect(`${origin}/payment/success?status=failure&error=missing_user_metadata`, 303);
      }

      const stripePlan = session.metadata?.plan || plan;
      const stripeInterval = session.metadata?.billingInterval || billingInterval;

      await db.collection("users").doc(userId).set(
        {
          tier: stripePlan,
          billingInterval: stripeInterval,
          premiumUpdatedAt: new Date(),
          subscriptionUpdatedAt: new Date(),
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || "N/A",
          paymentProvider: "stripe",
        },
        { merge: true }
      );

      const amount = (session.amount_total ? session.amount_total / 100 : 15.00).toFixed(2);
      const currency = (session.currency || "USD").toUpperCase();

      if (isJsonRequest) {
        return NextResponse.json({ success: true, sessionId, plan: stripePlan, amount, currency, provider: "stripe" });
      }

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
    let isTransactionPaid = false;
    let transactionStatus = "unknown";
    let calculatedAmount = plan === "pro" ? (billingInterval === "annual" ? "288.00" : "30.00") : (billingInterval === "annual" ? "144.00" : "15.00");

    if (apiKey && apiKey.startsWith("pdl_")) {
      try {
        const res = await fetch(`${apiBase}/transactions/${sessionId}`, {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          const txn = data.data || {};
          transactionStatus = (txn.status || "").toLowerCase();
          userId = txn.custom_data?.userId || "";

          // Strict payment verification: status must be 'completed' or 'paid'
          if (transactionStatus === "completed" || transactionStatus === "paid") {
            isTransactionPaid = true;
          }

          if (txn.custom_data?.plan) {
            plan = txn.custom_data.plan;
          }
          if (txn.custom_data?.billingInterval) {
            billingInterval = txn.custom_data.billingInterval;
          }
          if (txn.details?.totals?.grand_total) {
            const rawTotal = txn.details.totals.grand_total;
            const numVal = typeof rawTotal === "number" ? rawTotal : parseFloat(rawTotal) || 0;
            calculatedAmount = numVal >= 100 ? (numVal / 100).toFixed(2) : numVal.toFixed(2);
          } else {
            calculatedAmount = plan.toLowerCase() === "pro" ? (billingInterval === "annual" ? "288.00" : "30.00") : (billingInterval === "annual" ? "144.00" : "15.00");
          }
        } else {
          console.warn("Paddle Transaction lookup returned non-200:", res.status);
        }
      } catch (e) {
        console.error("Warning: could not verify Paddle transaction via API:", e);
      }
    }

    // ONLY provision tier in database if payment is strictly verified as completed/paid
    if (userId && isTransactionPaid) {
      await db.collection("users").doc(userId).set(
        {
          tier: plan,
          billingInterval: billingInterval,
          premiumUpdatedAt: new Date(),
          subscriptionUpdatedAt: new Date(),
          paddleTransactionId: sessionId,
          paymentProvider: "paddle",
        },
        { merge: true }
      );
    }

    if (!isTransactionPaid) {
      const errMsg = `Transaction status is '${transactionStatus}'. Payment has not been completed.`;
      if (isJsonRequest) {
        return NextResponse.json({
          success: false,
          error: errMsg,
          status: transactionStatus,
        }, { status: 400 });
      }
      return NextResponse.redirect(
        `${origin}/payment/success?status=failure&error=${encodeURIComponent(errMsg)}`,
        303
      );
    }

    if (isJsonRequest) {
      return NextResponse.json({
        success: true,
        sessionId,
        plan,
        amount: calculatedAmount,
        currency: "USD",
        provider: "paddle",
      });
    }

    return NextResponse.redirect(
      `${origin}/payment/success?status=success&session_id=${encodeURIComponent(sessionId)}&amount=${calculatedAmount}&currency=USD&plan=${encodeURIComponent(plan)}&provider=paddle`,
      303
    );
  } catch (error: any) {
    console.error("Error in payment success redirect:", error);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/payment/success?status=failure&error=${encodeURIComponent(error.message || "internal_error")}`, 303);
  }
}
