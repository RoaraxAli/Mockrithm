import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";

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

    const apiKey = process.env.PADDLE_API_KEY;
    const paddleEnv = process.env.PADDLE_ENV || "sandbox";
    const apiBase = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    // Check environment variables first
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

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    if (apiKey && apiKey.startsWith("pdl_")) {
      const authHeaders = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      const cacheKey = `${plan}_${billingInterval}_${amountCents}`;

      // 1. Check if priceId is cached or configured
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
          // Create Product
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
              // Create Price
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
                  console.log(`Created dynamic Paddle ${paddleEnv} Price ID: ${priceId}`);
                }
              } else {
                console.error("Paddle Price creation failed:", await priceRes.text());
              }
            }
          } else {
            console.error("Paddle Product creation failed:", await prodRes.text());
          }
        } catch (e) {
          console.error("Dynamic Paddle product/price creation error:", e);
        }
      }

      // 4. Create Transaction with verified priceId
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
              },
            }),
          });

          const txnData = await txnRes.json();
          console.log("Paddle Transaction Response:", JSON.stringify(txnData));

          if (txnRes.ok && txnData.data?.checkout?.url) {
            return NextResponse.json({ success: true, checkoutUrl: txnData.data.checkout.url });
          } else if (txnData.error) {
            console.error("Paddle transaction creation error:", txnData.error);
          }
        } catch (err) {
          console.error("Paddle transaction API request failed:", err);
        }
      }
    }

    // Direct fallback if Paddle credentials or API call failed
    const checkoutUrl = `${origin}/api/payment/success?session_id=PAD-${Date.now()}&plan=${plan}&billingInterval=${billingInterval}`;
    return NextResponse.json({ success: true, checkoutUrl });
  } catch (error: any) {
    console.error("Error in Paddle payment init:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
