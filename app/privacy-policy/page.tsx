import React from "react";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-black tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Last Updated: June 12, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-sm text-zinc-350 leading-relaxed font-medium">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">1. Introduction</h2>
            <p>
              Welcome to Mockrithm ("we," "our," or "us"). We are committed to protecting your personal data and your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (https://mockrithm.me) and use our AI-powered mock interview services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">2. Information We Collect</h2>
            <p>
              To provide our mock interview evaluations and resume analysis services, we collect the following types of information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-white">Account Information:</strong> Personal identifiers such as your name, email address, and profile details provided during Clerk authentication.
              </li>
              <li>
                <strong className="text-white">Resume Data:</strong> Any documents or files you upload to our platform to analyze your career history and match you with mock interview sessions.
              </li>
              <li>
                <strong className="text-white">Audio & Voice Records:</strong> Voice recordings and transcripts generated during your conversational AI mock interviews, used exclusively to provide score feedback and analytical performance reports.
              </li>
              <li>
                <strong className="text-white">Usage Data:</strong> Technical analytics including IP addresses, browser types, session timings, and page interaction logs to help us improve the AI engine.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">3. How We Use Your Information</h2>
            <p>
              We process your personal information for purposes based on legitimate business interests, the fulfillment of our services with you, and compliance with our legal obligations. Specifically, we use your data to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Create and maintain your user profile and database records in Firestore.</li>
              <li>Deliver real-time voice-driven AI evaluations and feedback reports.</li>
              <li>Provide customer support, reply to your inquiries, and resolve service issues.</li>
              <li>Analyze platform traffic to optimize site performance and fix system bugs.</li>
              <li>Process transactions securely through our payment integration partners (Safepay).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal data. We only share information with your consent or in the following limited circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-white">Third-Party Service Providers:</strong> We share necessary data with trusted vendors that perform services for us, such as Clerk (Authentication), Vapi/OpenAI/ElevenLabs (AI Voice Engine & Processing), and Safepay (Payment Processing).
              </li>
              <li>
                <strong className="text-white">Legal Obligations:</strong> We may disclose your information where we are legally required to do so to comply with applicable laws, governmental requests, or judicial proceedings.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">5. Data Security and Retention</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures to protect your personal information. Your account settings and data are stored securely. We retain your personal data only as long as necessary to provide you with Mockrithm services or as required by law. You can request the deletion of your account and personal data at any time by contacting us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">6. Your Rights</h2>
            <p>
              Depending on your location, you have rights regarding access to, correction of, or deletion of your personal data. You can update your profile details at any time inside your dashboard. To make a data request or delete your records, please contact our support team at <a href="mailto:mockrithm@gmail.com" className="text-white underline font-bold">mockrithm@gmail.com</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">7. Contact & Support</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please reach out to us:
            </p>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-6 mt-4 space-y-2 text-zinc-400">
              <p><strong className="text-white">Email:</strong> mockrithm@gmail.com</p>
              <p><strong className="text-white">Phone:</strong> +03001477141714</p>
              <p><strong className="text-white">Address:</strong> Office 402, 4th Floor, Safa Gold Mall, F-7 Markaz, Islamabad, Pakistan</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
