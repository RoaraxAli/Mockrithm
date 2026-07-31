"use client";

export async function openPaddleCheckout(transactionId: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const win = window as any;

  // 1. Ensure Paddle.js SDK is loaded on window
  if (!win.Paddle) {
    try {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById("paddle-v2-script");
        if (existingScript) {
          if (win.Paddle) {
            resolve();
            return;
          }
          existingScript.addEventListener("load", () => resolve());
          existingScript.addEventListener("error", (e) => reject(e));
          // Safety timeout in case load event already fired
          setTimeout(() => resolve(), 1000);
          return;
        }

        const script = document.createElement("script");
        script.id = "paddle-v2-script";
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    } catch (err) {
      console.error("Failed to load Paddle.js script dynamically:", err);
    }
  }

  const Paddle = win.Paddle;

  if (Paddle) {
    try {
      const paddleEnv = (process.env.NEXT_PUBLIC_PADDLE_ENV || "sandbox").toLowerCase();
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
        console.log("Opening Paddle Checkout Overlay for Transaction:", transactionId);
        Paddle.Checkout.open({
          transactionId: transactionId,
          settings: {
            displayMode: "overlay",
            theme: "dark",
          },
        });
        return true;
      }
    } catch (err) {
      console.error("Error opening Paddle checkout overlay:", err);
    }
  } else {
    console.error("Paddle.js SDK is not available after script loading.");
  }

  return false;
}
