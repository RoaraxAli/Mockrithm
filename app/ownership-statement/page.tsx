import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OwnershipStatementPage() {
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
          <h1 className="text-4xl font-black tracking-tight mb-2">Ownership Statement</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-zinc-350 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Legal Entity & Brand Disclosure</h2>
            <p>
              The digital platform, web application, software tools, and underlying AI technology operating at <strong className="text-white">https://mockrithm.me</strong> are fully owned, managed, and operated under the legal business entity <strong className="text-white">MOCKRITHM</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">2. Business Ownership & Governance</h2>
            <p>
              MOCKRITHM is a tech SaaS venture founded and legally owned by:
            </p>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-2 text-zinc-400">
              <p><strong className="text-white">Legal Entity Name:</strong> MOCKRITHM</p>
              <p><strong className="text-white">Co-Founders & Principal Owners:</strong> Ahmed & Ali</p>
              <p><strong className="text-white">Operating Location:</strong> Karachi, Pakistan</p>
              <p><strong className="text-white">Official Contact Email:</strong> support@mockrithm.me</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">3. Intellectual Property Rights</h2>
            <p>
              All proprietary code, user interface designs, AI mock interview prompts, evaluation scoring algorithms, domain names, graphics, logos, and digital branding assets associated with Mockrithm are the exclusive intellectual property of MOCKRITHM and its co-founders, Ahmed and Ali.
            </p>
            <p>
              Unauthorized reproduction, reverse engineering, scraping, or redistribution of any portion of the platform without explicit written authorization from MOCKRITHM is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">4. Merchant of Record & Payment Gateway Disclosure</h2>
            <p>
              MOCKRITHM partners with international payment infrastructure provider <strong className="text-white">Paddle</strong> to process subscription purchases and digital credit transactions. Paddle acts as the Merchant of Record for transactions originating on our site, providing secure checkout, global tax compliance, and payment processing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">5. Legal Inquiries & Inquiries</h2>
            <p>
              For legal correspondence, partnership inquiries, or corporate governance matters regarding MOCKRITHM, please contact our legal and founding team directly:
            </p>
            <p className="text-zinc-400">
              MOCKRITHM<br/>
              Founders: Ahmed & Ali<br/>
              Karachi, Pakistan<br/>
              Email: support@mockrithm.me
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
