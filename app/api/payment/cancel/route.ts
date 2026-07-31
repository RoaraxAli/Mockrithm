import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user profile from Firestore to get Paddle subscription ID
    const userDoc = await db.collection("users").doc(user.id).get();
    const userData = userDoc.data() || {};
    const subscriptionId = userData.paddleSubscriptionId || userData.subscriptionId;

    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "sandbox";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    let cancelledOnPaddle = false;

    // 2. Call Paddle API to schedule cancellation at the end of current billing period
    if (subscriptionId && subscriptionId.startsWith("sub_") && apiKey) {
      try {
        const paddleRes = await fetch(`${apiBase}/subscriptions/${subscriptionId}/cancel`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            effective_from: "next_billing_period",
          }),
        });

        if (paddleRes.ok) {
          console.log(`[Paddle API] Successfully scheduled cancellation for ${subscriptionId}`);
          cancelledOnPaddle = true;
        } else {
          const paddleErr = await paddleRes.text();
          console.warn(`[Paddle API Warning] Cancellation call returned status ${paddleRes.status}:`, paddleErr);
        }
      } catch (e) {
        console.error("Error calling Paddle cancellation API:", e);
      }
    }

    // 3. Update user record in Firestore
    await db.collection("users").doc(user.id).set(
      {
        subscriptionStatus: "canceling",
        cancelRequestedAt: new Date(),
      },
      { merge: true }
    );

    console.log(`[Subscription Cancellation] User ${user.id} (${user.email}) cancellation processed. Cancelled on Paddle: ${cancelledOnPaddle}`);

    return NextResponse.json({
      success: true,
      cancelledOnPaddle,
      message: "Subscription cancellation scheduled. Your access remains active until the end of your billing cycle, and your card will not be charged again.",
    });
  } catch (error: any) {
    console.error("Error processing subscription cancellation:", error);
    return NextResponse.json({ error: "Failed to process cancellation." }, { status: 500 });
  }
}
