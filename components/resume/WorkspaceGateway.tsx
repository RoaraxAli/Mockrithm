"use client";

import { motion } from "framer-motion";
import { UploadCloud, LayoutTemplate, FileText, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function WorkspaceGateway() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full py-6 md:py-10">
        <h2 className="text-sm md:text-4xl font-black text-white max-w-2xl mx-auto px-2 mb-5">
          Choose Your Path
        </h2>
        <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto px-2 mb-5">
          Would you like to upload your text or name your industry to start?
        </p>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl px-2">
        {/* Path 1: Upload PDF */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push("/user/dashboard/resume/upload")}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
          <div className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-white/20 backdrop-blur-xl transition-all duration-300 overflow-hidden">
            <div className="size-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
              <UploadCloud className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Import PDF <ArrowRight className="size-5 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Upload your existing resume. Our AI will instantly parse your work history, skills, and education into the workspace.
            </p>
            <ul className="space-y-2">
              {["Instant AI Data Extraction", "Automated ATS Formatting", "Keep existing content"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="size-1.5 rounded-full bg-white" /> {feature}
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
          onClick={() => router.push("/user/dashboard/resume/templates")}
          className="group relative cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl" />
          <div className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-white/20 backdrop-blur-xl transition-all duration-300 overflow-hidden">
            <div className="size-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-6">
              <LayoutTemplate className="size-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Pick Template <ArrowRight className="size-5 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Start with a blank canvas using one of our premium, highly-optimized ATS templates designed by industry experts.
            </p>
            <ul className="space-y-2">
              {["6 Premium Designs", "Guided Form Builder", "Real-time HTML Preview"].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="size-1.5 rounded-full bg-white" /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
