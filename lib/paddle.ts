"use client";

export function openPaddleCheckout(transactionId: string): boolean {
  if (typeof window === "undefined") return false;

  const win = window as any;
  const Paddle = win.Paddle;

  if (Paddle) {
    try {
      const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox";
      const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "test_c427f9f3ec0624dfd1794a8446d";

      if (Paddle.Environment && typeof Paddle.Environment.set === "function") {
        Paddle.Environment.set(paddleEnv);
      }
      
      if (Paddle.Initialize && typeof Paddle.Initialize === "function") {
        Paddle.Initialize({
          token: clientToken,
        });
      }

      if (Paddle.Checkout && typeof Paddle.Checkout.open === "function") {
        Paddle.Checkout.open({
          transactionId: transactionId,
        });
        return true;
      }
    } catch (err) {
      console.error("Error opening Paddle checkout overlay:", err);
    }
  } else {
    console.warn("Paddle.js is not loaded on window object yet.");
  }

  return false;
}
