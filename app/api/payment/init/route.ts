import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";
import Stripe from "stripe";

// Cache created price IDs in memory to avoid repeated API creation calls
const priceCache: Record<string, string> = {};

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

    // Set unit amount in cents ($15.00 or $30.00 default)
    let amountCents = 1500;
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

    // Check active Payment Gateway Provider setting from Firestore or environment
    let activeProvider = process.env.PAYMENT_PROVIDER || "paddle";
    try {
      const settingsDoc = await db.collection("system_settings").doc("payment").get();
      if (settingsDoc.exists && settingsDoc.data()?.provider) {
        activeProvider = settingsDoc.data()?.provider;
      }
    } catch (e) {
      console.warn("Could not read payment settings doc, falling back to default:", e);
    }

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    // -------------------------------------------------------------
    // 💳 STRIPE PAYMENTS PROVIDER ROUTE
    // -------------------------------------------------------------
    if (activeProvider === "stripe") {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret) {
        return NextResponse.json({ error: "Stripe Secret Key not configured in .env" }, { status: 500 });
      }

      const stripe = new Stripe(stripeSecret);
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
          provider: "stripe",
        },
        success_url: `${origin}/api/payment/success?session_id={CHECKOUT_SESSION_ID}&provider=stripe`,
        cancel_url: `${origin}/payment/cancel`,
      });

      if (!session.url) {
        return NextResponse.json({ error: "Failed to create Stripe checkout session URL" }, { status: 500 });
      }

      return NextResponse.json({ success: true, checkoutUrl: session.url, provider: "stripe" });
    }

    // -------------------------------------------------------------
    // ⚓ PADDLE PAYMENTS PROVIDER ROUTE
    // -------------------------------------------------------------
    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "sandbox";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
    const paddleBuyDomain = paddleEnv === "sandbox" ? "https://sandbox-buy.paddle.com" : "https://buy.paddle.com";

    // Check environment variables for custom price IDs
    let priceId = "";
    if (plan === "pro") {
      priceId = billingInterval === "annual"
        ? (process.env.PADDLE_PRICE_PRO_ANNUAL || "")
        : (process.env.PADDLE_PRICE_PRO_MONTHLY || "");
    } else {
      priceId = billingInterval === "annual"
        ? (process.env.PADDLE_PRICE_PREMIUM_ANNUAL || "")
        : (process.env.PADDLE_PRICE_PREMIUM_MONTHLY || "");
    }

    if (!apiKey || !apiKey.startsWith("pdl_")) {
      return NextResponse.json(
        { error: "Paddle API Key (PADDLE_API_KEY) is not configured in .env" },
        { status: 500 }
      );
    }

    const authHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    const cacheKey = `${plan}_${billingInterval}_${amountCents}`;

    // 1. Check if priceId is cached
    if (!priceId && priceCache[cacheKey]) {
      priceId = priceCache[cacheKey];
    }

    // 2. Fetch existing active prices from Paddle API if priceId not set
    if (!priceId) {
      try {
        const pricesRes = await fetch(`${apiBase}/prices?status=active`, { headers: authHeaders });
        if (pricesRes.ok) {
          const pricesData = await pricesRes.json();
          const existingPrices: any[] = pricesData.data || [];
          const match = existingPrices.find(
            (p: any) =>
              p.unit_price?.amount === amountCents.toString() &&
              p.unit_price?.currency_code === "USD"
          );
          if (match) {
            priceId = match.id;
            priceCache[cacheKey] = priceId;
          }
        }
      } catch (e) {
        console.error("Warning: Paddle price list error:", e);
      }
    }

    // 3. If no matching price exists in Paddle catalog, create Product & Price dynamically
    if (!priceId) {
      try {
        const prodRes = await fetch(`${apiBase}/products`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: plan === "pro" ? "Mockrithm Pro Membership" : "Mockrithm Premium Membership",
            tax_category: "standard",
            description: `Access to Mockrithm ${plan.toUpperCase()} tier tools`,
          }),
        });

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          const productId = prodData.data?.id;

          if (productId) {
            const priceRes = await fetch(`${apiBase}/prices`, {
              method: "POST",
              headers: authHeaders,
              body: JSON.stringify({
                product_id: productId,
                description: `${plan.toUpperCase()} ${billingInterval}`,
                unit_price: {
                  amount: amountCents.toString(),
                  currency_code: "USD",
                },
                billing_cycle: {
                  interval: billingInterval === "annual" ? "year" : "month",
                  frequency: 1,
                },
              }),
            });

            if (priceRes.ok) {
              const priceData = await priceRes.json();
              priceId = priceData.data?.id;
              if (priceId) {
                priceCache[cacheKey] = priceId;
              }
            } else {
              const priceErr = await priceRes.text();
              console.error("Paddle Price creation API error:", priceErr);
            }
          }
        } else {
          const prodErr = await prodRes.text();
          console.error("Paddle Product creation API error:", prodErr);
        }
      } catch (e) {
        console.error("Dynamic Paddle product/price creation error:", e);
      }
    }

    // 4. Create Transaction on Paddle API (v2)
    if (priceId) {
      try {
        const txnRes = await fetch(`${apiBase}/transactions`, {
          method: "POST",
          headers: authHeaders,
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
              provider: "paddle",
            },
          }),
        });

        const txnData = await txnRes.json();
        console.log("Paddle Transaction Response:", txnData.data?.id, "Checkout URL:", txnData.data?.checkout?.url);

        // A) If Paddle API returned a direct checkout URL in checkout.url
        if (txnRes.ok && txnData.data?.checkout?.url) {
          return NextResponse.json({ success: true, checkoutUrl: txnData.data.checkout.url, provider: "paddle" });
        }

        // B) If transaction ID (txn_...) was generated successfully, use official Paddle v2 transaction checkout URL
        if (txnRes.ok && txnData.data?.id) {
          const hostedCheckoutUrl = `${paddleBuyDomain}/checkout/build?_ptxn=${txnData.data.id}`;
          return NextResponse.json({ success: true, checkoutUrl: hostedCheckoutUrl, provider: "paddle" });
        }

        if (!txnRes.ok) {
          console.error("Paddle Transaction API Error Response:", txnData);
        }
      } catch (err: any) {
        console.error("Paddle transaction API request failed:", err);
      }
    }

    // C) Direct Hosted Checkout URL fallback using official Paddle v2 price_id parameter format
    if (priceId) {
      const hostedCheckoutUrl = `${paddleBuyDomain}/checkout/build?_price_id=${priceId}`;
      return NextResponse.json({ success: true, checkoutUrl: hostedCheckoutUrl, provider: "paddle" });
    }

    return NextResponse.json(
      { error: "Could not create Paddle checkout session. Please check your Paddle API keys and Sandbox configuration." },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error in payment init:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
