import React from "react";

export default function OwnershipStatementPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans py-24 px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute inset-0 premium-grid-dot" />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-white/[0.01] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="border-b border-zinc-900 pb-8">
          <h1 className="text-4xl font-black tracking-tight mb-2">Ownership & Business Statement</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Published: June 12, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-zinc-350 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Platform Ownership</h2>
            <p>
              The website, domain name (https://mockrithm.me), branding, assets, software systems, and AI evaluation services are fully owned, operated, and maintained by <strong className="text-white">Mockrithm Inc.</strong>, a registered company established under the laws of Pakistan.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">2. Registration and Office Details</h2>
            <p>
              In compliance with local laws, financial regulations, and ecommerce transparency standards, we disclose the following legal and physical registration details:
            </p>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 space-y-2 text-zinc-400">
              <p><strong className="text-white">Legal Entity Name:</strong> Mockrithm Inc.</p>
              <p><strong className="text-white">Registered Business Location:</strong> Islamabad, Pakistan</p>
              <p><strong className="text-white">Corporate Head Office:</strong> Office 402, 4th Floor, Safa Gold Mall, F-7 Markaz, Islamabad, Pakistan</p>
              <p><strong className="text-white">Business Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM (PKT)</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">3. Intellectual Property</h2>
            <p>
              Unless otherwise indicated, the Site and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by Mockrithm Inc. and are protected by copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">4. Contact Information</h2>
            <p>
              If you have any questions, legal inquiries, or partnership proposals, please reach out to our administration office:
            </p>
            <p className="text-zinc-400">
              Mockrithm Inc.<br/>
              Office 402, 4th Floor, Safa Gold Mall, F-7 Markaz, Islamabad, Pakistan<br/>
              Phone: +03001477141714<br/>
              Email: mockrithm@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
