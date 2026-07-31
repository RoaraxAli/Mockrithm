import { NextResponse } from "next/server";
import { db } from "@/firebase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET_KEY;

  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature") || "";

    // Verify Paddle Webhook Signature strictly if secret is provided
    if (webhookSecret && signatureHeader) {
      const parts = signatureHeader.split(";").reduce((acc, part) => {
        const [k, v] = part.split("=");
        if (k && v) acc[k.trim()] = v.trim();
        return acc;
      }, {} as Record<string, string>);

      const ts = parts["ts"];
      const h1 = parts["h1"];

      if (ts && h1) {
        const hmac = crypto.createHmac("sha256", webhookSecret);
        hmac.update(`${ts}:${rawBody}`);
        const expectedH1 = hmac.digest("hex");

        if (expectedH1 !== h1) {
          console.error("[Paddle Webhook] Signature verification failed");
          return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
      }
    }

    const payload = JSON.parse(rawBody || "{}");
    const eventType = payload.event_type || payload.type || "";
    const data = payload.data || {};

    console.log(`[Paddle Webhook] Received event: ${eventType}`);

    // Handle completed transactions or subscriptions
    if (
      eventType === "transaction.completed" ||
      eventType === "subscription.created" ||
      eventType === "subscription.updated" ||
      eventType === "payment_succeeded"
    ) {
      const customData = data.custom_data || {};
      const userId = customData.userId || data.user_id;

      if (!userId) {
        console.error("[Paddle Webhook] Missing userId in custom_data:", data.id);
        return NextResponse.json({ received: true, warning: "Missing userId in custom_data" });
      }

      const plan = customData.plan || "premium";
      const billingInterval = customData.billingInterval || "monthly";

      console.log(`[Paddle Webhook] Provisioning ${plan} for user: ${userId}, Transaction ID: ${data.id}`);

      // Perform secure backend Firestore update
      await db.collection("users").doc(userId).set(
        {
          tier: plan,
          billingInterval: billingInterval,
          premiumUpdatedAt: new Date(),
          subscriptionUpdatedAt: new Date(),
          subscriptionStatus: "active",
          paddleTransactionId: data.id || "N/A",
          paddleCustomerId: data.customer_id || "N/A",
          paddleSubscriptionId: data.subscription_id || data.id || "N/A",
        },
        { merge: true }
      );
    } else if (eventType === "subscription.canceled") {
      const customData = data.custom_data || {};
      const userId = customData.userId || data.user_id;

      if (userId) {
        console.log(`[Paddle Webhook] Revoking access for canceled subscription of user: ${userId}`);
        await db.collection("users").doc(userId).set(
          {
            tier: "free",
            subscriptionStatus: "canceled",
            subscriptionCanceledAt: new Date(),
          },
          { merge: true }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Paddle Webhook] Endpoint error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
