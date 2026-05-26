"use client";

import { motion } from "framer-motion";
import { UploadCloud, LayoutTemplate, FileText, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkspaceGateway() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 bg-cyan-950/50 border border-cyan-500/30 rounded-2xl mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <Sparkles className="size-8 text-cyan-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Choose Your Path
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Create a standout resume tailored for ATS success. Import your existing data or start fresh with a premium template.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Path 1: Upload PDF */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push("/user/onboarding/upload")}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
          <div className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden">
            <div className="size-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center mb-6">
              <UploadCloud className="size-7 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Import PDF <ArrowRight className="size-5 text-cyan-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Upload your existing resume. Our AI will instantly parse your work history, skills, and education into the workspace.
            </p>
            <ul className="space-y-2">
              {["Instant AI Data Extraction", "Automated ATS Formatting", "Keep existing content"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="size-1.5 rounded-full bg-cyan-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Path 2: Pick Template */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => router.push("/user/onboarding/templates")}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
          <div className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden">
            <div className="size-14 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mb-6">
              <LayoutTemplate className="size-7 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Pick Template <ArrowRight className="size-5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Start with a blank canvas using one of our premium, highly-optimized ATS templates designed by industry experts.
            </p>
            <ul className="space-y-2">
              {["6 Premium Designs", "Guided Form Builder", "Real-time HTML Preview"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="size-1.5 rounded-full bg-indigo-500" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
