import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
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
          <h1 className="text-4xl font-black tracking-tight mb-2">Terms & Conditions</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-zinc-350 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong className="text-white">MOCKRITHM</strong> ("Company," "we," "us," or "our"), concerning your access to and use of the Mockrithm website (https://mockrithm.me) as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>
            <p>
              By accessing the Site, you acknowledge that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these terms, you are expressly prohibited from using the Site and must discontinue use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">2. Company Details</h2>
            <p>
              In compliance with local laws and payment gateway transparency guidelines, our official corporate details are listed below:
            </p>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-2 text-zinc-400">
              <p><strong className="text-white">Legal Business Name:</strong> MOCKRITHM</p>
              <p><strong className="text-white">Registered Location:</strong> Karachi, Pakistan</p>
              <p><strong className="text-white">Contact Email:</strong> support@mockrithm.me</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">3. Description of Services</h2>
            <p>
              Mockrithm is an online software platform that provides conversational AI mock interviews, vocal analysis, resume building, and evaluation scoring. Users can upload their resumes, configure desired interview parameters, and participate in voice-driven evaluations conducted by our custom AI agent. Feedback reports and stats are provided through their account dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">4. User Registration & Security</h2>
            <p>
              You may be required to register an account with Clerk authentication to access our dashboard features. You agree to keep your password confidential and will be responsible for all use of your account and credentials. We reserve the right to remove, reclaim, or change a username you select if we deem it inappropriate or misleading.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">5. Fees and Payments</h2>
            <p>
              We accept payments for subscription credits and premium tiers through our integrated checkout gateway (Paddle). You agree to provide current, complete, and accurate purchase and account information for all transactions. You further agree to promptly update account and payment information (including email and card details) so that we can complete your transactions and contact you as needed.
            </p>
            <p>
              Sales tax will be added to the price of purchases as deemed required by local regulatory authorities. All prices and plans are subject to change.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">6. Prohibited Activities</h2>
            <p>
              You may not access or use the Site for any purpose other than that for which we make the platform available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Prohibited activities include hacking, data scraping, reproducing AI prompts, violating intellectual property, or attempting to bypass checkout steps.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">7. Limitation of Liability</h2>
            <p>
              In no event will MOCKRITHM or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the Site or our AI voice engine.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">8. Governing Law</h2>
            <p>
              These Terms and Conditions and your use of the Site are governed by and construed in accordance with the laws of Pakistan. Any legal actions or proceedings arising out of these Terms shall be resolved in the competent courts located in Karachi, Pakistan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">9. Contact Information</h2>
            <p>
              In order to resolve a complaint regarding the Site or to receive further information regarding use of our services, please contact us at:
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
