"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Crown, ArrowRight, Calendar, Landmark, ReceiptText } from "lucide-react";
import Link from "next/link";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id") || "N/A";
  const amount = searchParams.get("amount") || "10.00";
  const currency = searchParams.get("currency") || "USD";
  const error = searchParams.get("error") || "";

  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, []);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-mona-sans">
      {/* Glow backgrounds */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl border border-zinc-900 bg-zinc-950/40 p-6 md:p-10 rounded-3xl shadow-2xl relative backdrop-blur-xl z-10"
      >
        {isSuccess ? (
          <>
            {/* Success Header */}
            <div className="text-center">
              <div className="size-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Crown className="size-8 fill-white text-white animate-pulse" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ delay: 0.3, repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  className="absolute -inset-1 border border-white/5 rounded-full pointer-events-none"
                />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-900/80 px-3.5 py-1.5 rounded-full">
                Payment Completed
              </span>

              <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
                Welcome to Premium
              </h1>
              <p className="text-zinc-450 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                Your Stripe transaction has been processed and verified successfully. Premium features are now unlocked.
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="mt-8 border border-zinc-900 bg-zinc-950/20 rounded-2xl p-5 md:p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-350 flex items-center gap-1.5 border-b border-zinc-900 pb-3">
                <ReceiptText className="size-4 text-zinc-400" /> Transaction Receipt
              </h3>

              <div className="grid grid-cols-2 gap-y-3 text-[11px] leading-relaxed">
                <span className="text-zinc-500">Session ID:</span>
                <span className="text-white font-mono text-right truncate pl-4" title={sessionId}>{sessionId}</span>

                <span className="text-zinc-500">Payment Channel:</span>
                <span className="text-white text-right flex items-center justify-end gap-1">
                  <Landmark className="size-3 text-zinc-400" /> Stripe Test Mode
                </span>

                <span className="text-zinc-500">Date:</span>
                <span className="text-white text-right flex items-center justify-end gap-1">
                  <Calendar className="size-3 text-zinc-400" /> {dateStr || "Loading..."}
                </span>

                <span className="text-zinc-500 border-t border-zinc-900/60 pt-2.5 mt-1 font-bold">Total Charged:</span>
                <span className="text-white text-right border-t border-zinc-900/60 pt-2.5 mt-1 font-extrabold text-sm">
                  {amount} {currency}
                </span>
              </div>
            </div>

            {/* Return Action */}
            <div className="mt-8">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (window.self !== window.top) {
                      window.parent.location.href = "/";
                    } else {
                      router.push("/");
                    }
                  }
                }}
                className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Go to Dashboard <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Failure Header */}
            <div className="text-center">
              <div className="size-16 bg-red-950/10 border border-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="size-8 text-red-500 animate-bounce" />
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/30 px-3.5 py-1.5 rounded-full border border-red-900/20">
                Payment Failed
              </span>

              <h1 className="text-3xl font-black text-white mt-4 tracking-tight">
                Transaction Refused
              </h1>
              <p className="text-zinc-450 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
                The payment signature verification failed or was cancelled by the gateway.
              </p>
              {error && (
                <p className="mt-2 text-[10px] font-mono text-red-400/80 bg-red-950/20 p-2 rounded-lg border border-red-900/10 max-w-xs mx-auto">
                  Reason: {error}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (window.self !== window.top) {
                      window.parent.location.href = "/";
                    } else {
                      router.push("/");
                    }
                  }
                }}
                className="w-1/2 py-3 rounded-xl border border-zinc-850 hover:bg-zinc-900 text-zinc-400 text-xs font-bold text-center transition-all cursor-pointer"
              >
                Go Home
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if (window.self !== window.top) {
                      window.parent.location.href = "/";
                    } else {
                      router.push("/");
                    }
                  }
                }}
                className="w-1/2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                Try Upgrade Again <ArrowRight className="size-4" />
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="text-zinc-450 text-xs">Loading transaction details...</div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
