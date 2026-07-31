import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans pt-32 pb-20 px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute inset-0 premium-grid-dot" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2">Cancellation & Refund Policy</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-zinc-350 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Overview</h2>
            <p>
              At Mockrithm, we strive to deliver the highest quality conversational AI mock interview and evaluation services. Since our platform delivers digital goods (interview credits and automated scoring feedback) instantly upon checkout, we have established a fair refund and cancellation policy to protect both our customers and our operational infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">2. Cancellation Policy</h2>
            <p>
              You may cancel your Mockrithm account or monthly subscription plans at any time:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Subscribers can cancel their renewals directly inside the Account Settings/Billing page.</li>
              <li>Upon cancellation of a subscription, your access to premium features will continue until the end of your current billing cycle. No further automatic renewals or charges will occur.</li>
              <li>Unused interview credits accumulated under a subscription do not roll over or hold cash values upon deletion/cancellation of your account.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">3. Refund Policy</h2>
            <p>
              Due to the immediate consumption of digital tokens (AI processing, text-to-speech tokens, and server capacity), refunds are subject to the following rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-white">Eligible Refund Requests:</strong> You are entitled to a full refund within <strong className="text-white">7 days</strong> of your purchase date, provided that you have **not used any interview credits** from the purchased bundle.
              </li>
              <li>
                <strong className="text-white">Technical Issues:</strong> If a technical bug on our platform prevents your mock interview from finishing successfully, or if there is a verified system failure, we will either restore your spent credit or issue a partial/full refund.
              </li>
              <li>
                <strong className="text-white">Ineligible for Refunds:</strong> We cannot issue refunds for completed mock interviews where the AI evaluation report has already been generated and processed.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">4. Return Policy</h2>
            <p>
              Because Mockrithm sells intangibly delivered software-as-a-service (SaaS) and digital products, there is **no physical return of goods** required or accepted. Any approved refund request will deactivate the corresponding digital package or credit balance automatically.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">5. How to Request a Refund</h2>
            <p>
              To claim a refund or dispute a charge, please email our support team at <a href="mailto:support@mockrithm.me" className="text-white underline font-bold">support@mockrithm.me</a>.
            </p>
            <p>
              Your email must include:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-400">
              <li>Your Mockrithm Account Email</li>
              <li>Paddle Transaction ID / Session Reference</li>
              <li>Date of Purchase</li>
              <li>Reason for the Refund Request</li>
            </ul>
            <p className="mt-2">
              Our billing department will inspect the request and respond within 24–48 hours. If approved, refunds are processed back to your original payment method (Bank Card or Account) within 5–10 business days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">6. Contact & Support Details</h2>
            <p>
              For further questions regarding refunds, cancellations, or billing issues, please contact our billing department:
            </p>
            <p className="text-zinc-400">
              MOCKRITHM<br/>
              Karachi, Pakistan<br/>
              Email: support@mockrithm.me
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
