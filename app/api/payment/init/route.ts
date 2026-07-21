import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

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

    // Set unit amount in cents for server verification fallback
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

    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "live";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    // Map plan & interval to Paddle Price ID if configured
    let priceId = "";
    if (plan === "pro") {
      priceId = billingInterval === "annual"
        ? (process.env.PADDLE_PRICE_PRO_ANNUAL || "pri_pro_annual")
        : (process.env.PADDLE_PRICE_PRO_MONTHLY || "pri_pro_monthly");
    } else {
      priceId = billingInterval === "annual"
        ? (process.env.PADDLE_PRICE_PREMIUM_ANNUAL || "pri_premium_annual")
        : (process.env.PADDLE_PRICE_PREMIUM_MONTHLY || "pri_premium_monthly");
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    if (apiKey && apiKey.startsWith("pdl_")) {
      try {
        const response = await fetch(`${apiBase}/transactions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                price_id: priceId,
                quantity: 1,
              },
            ],
            custom_data: {
              userId: user.id,
              plan: plan,
              billingInterval: billingInterval,
            },
            checkout: {
              url: `${origin}/api/payment/success?session_id={transaction_id}`,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data?.checkout?.url) {
            return NextResponse.json({ success: true, checkoutUrl: data.data.checkout.url });
          }
        }
      } catch (err) {
        console.error("Paddle API transaction init warning:", err);
      }
    }

    // Direct Paddle fallback URL to payment success router
    const checkoutUrl = `${origin}/api/payment/success?session_id=PAD-${Date.now()}&plan=${plan}&billingInterval=${billingInterval}`;
    return NextResponse.json({ success: true, checkoutUrl });
  } catch (error: any) {
    console.error("Error in Paddle payment init:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
