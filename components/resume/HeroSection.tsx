'use client';
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-white">
          Build Your Perfect Resume
        </h1>
        <p className="text-lg text-slate-300 max-w-prose">
          Choose a modern template or upload your PDF to get started. Optimize your profile with AI‑powered ATS analysis.
        </p>
        <div className="flex gap-4 mb-6">
          <Link
            href="/user/dashboard/resume/templates"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-all uppercase tracking-wider text-xs font-mono backdrop-blur-md border border-white/20"
          >
            <FileText className="size-4" /> Create From Template
          </Link>
          <Link
            href="/user/dashboard/resume/upload"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-all uppercase tracking-wider text-xs font-mono backdrop-blur-md border border-white/20"
          >
            <Plus className="size-4" /> Upload Resume PDF
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
