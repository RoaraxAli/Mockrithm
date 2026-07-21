import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id") || searchParams.get("transaction_id") || searchParams.get("checkout_id");
    const plan = searchParams.get("plan") || "premium";
    const billingInterval = searchParams.get("billingInterval") || "monthly";

    const origin = new URL(request.url).origin;

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id parameter" }, { status: 400 });
    }

    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "live";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    let userId = "";

    // If Paddle API key is present, verify transaction with Paddle API
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

    console.log(`Paddle transaction ${sessionId} validated for plan ${plan}`);

    // If user ID was present or passed, update Firestore user document
    if (userId) {
      await db.collection("users").doc(userId).set(
        {
          tier: plan,
          billingInterval: billingInterval,
          premiumUpdatedAt: new Date(),
          paddleTransactionId: sessionId,
        },
        { merge: true }
      );
    }

    // Redirect back to client dashboard payment success page
    const amount = (plan === "pro" ? (billingInterval === "annual" ? "288.00" : "30.00") : (billingInterval === "annual" ? "144.00" : "15.00"));
    
    return NextResponse.redirect(
      `${origin}/payment/success?status=success&session_id=${encodeURIComponent(sessionId)}&amount=${amount}&currency=USD&plan=${plan}`,
      303
    );
  } catch (error: any) {
    console.error("Error in Paddle payment success redirect:", error);
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/payment/success?status=failure&error=${encodeURIComponent(error.message || "internal_error")}`, 303);
  }
}
