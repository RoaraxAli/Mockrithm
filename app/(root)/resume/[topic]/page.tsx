import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { RESUME_LANDING_LIST } from "@/lib/resumeData";

interface TopicPageProps {
  params: Promise<{
    topic: string;
  }>;
}

// Generate dynamic metadata for SEO compliance
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const config = RESUME_LANDING_LIST[resolvedParams.topic];

  if (!config) {
    return {
      title: "Not Found | Mockrithm Resume",
      description: "Niche page not found."
    };
  }

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
  };
}

export default async function ResumeTopicPage({ params }: TopicPageProps) {
  const resolvedParams = await params;
  const config = RESUME_LANDING_LIST[resolvedParams.topic];

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#07131e] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Navigation Header */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <Link
          href="/resume"
          className="text-xs font-semibold uppercase tracking-wider text-white/50 hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="size-3" />
          Back to Hub
        </Link>

        <span
          className="text-2xl md:text-3xl tracking-tight text-white select-none cursor-pointer"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Mockrithm<sup className="text-[10px] align-super">®</sup>
        </span>

        <button
          className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-lg border-none outline-none cursor-pointer"
          onClick={() => { window.location.href = "https://accounts.mockrithm.me/sign-up"; }}
        >
          Begin Journey
        </button>
      </nav>

      {/* Hero Block */}
      <main className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto w-full z-10">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
          Specialized Configuration // {config.slug.replace("-", " ")}
        </span>

        <h1
          className="text-5xl sm:text-7xl md:text-[5rem] leading-[1] tracking-[-2px] font-normal text-white mt-4 animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {config.heroTitle}
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed animate-fade-rise-delay">
          {config.heroSubtitle}
        </p>

        <div className="mt-10 animate-fade-rise-delay-2">
          <button
            onClick={() => { window.location.href = "https://accounts.mockrithm.me/sign-up"; }}
            className="liquid-glass rounded-full px-14 py-4.5 text-base text-white font-medium hover:scale-[1.03] transition-all duration-300 shadow-xl border-none outline-none cursor-pointer flex items-center gap-2"
          >
            {config.primaryCTA}
            <ArrowRight className="size-4" />
          </button>
        </div>
      </main>

      {/* Niche Features Showcase */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-8 py-20 border-t border-white/5 relative z-10 bg-black/20">
        <h2
          className="text-3xl md:text-4xl text-center mb-12 font-normal"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {config.featureTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {config.features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <CheckCircle2 className="size-6 text-white/60 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification / Quality Badging */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20 border-t border-white/5 relative z-10 w-full">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Verified Compliance</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-white/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Greenhouse Compliant
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Workday Parser Compliant
          </div>
          <div className="flex items-center gap-2">
            <Award className="size-4" />
            100% Structural Standard
          </div>
        </div>
      </section>

      {/* Local Footer */}
      <footer className="w-full bg-black/40 border-t border-white/5 mt-auto py-8 text-center text-xs text-white/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Mockrithm Inc. Niche resume builders and templates are subject to verification rules.</p>
          <div className="flex gap-4">
            <Link href="https://mockrithm.me/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="https://mockrithm.me/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
