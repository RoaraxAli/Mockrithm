"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, XCircle, AlertCircle, FileText, 
  ArrowRight, Activity, Zap, ShieldAlert, Award, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResumeDocument } from "@/types/resume";

export default function AtsScoreDashboard({ resume }: { resume: ResumeDocument }) {
  const { atsAnalysis, parsedData } = resume;

  if (!atsAnalysis) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <AlertCircle className="size-8" />
          <p className="font-mono text-sm tracking-wider uppercase">ATS Analysis data is pending or unavailable.</p>
        </div>
      </div>
    );
  }

  const { atsScore, missingKeywords, strengths, weaknesses, improvementSuggestions } = atsAnalysis;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 font-mona-sans animate-fadeIn">
      
      {/* Header Dashboard Status */}
      <div className="w-full backdrop-blur-md bg-slate-950/40 border border-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
        
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-[0.2em] text-slate-500 uppercase">ANALYSIS REPORT</span>
          <h2 className="text-xl font-bold font-mono tracking-wide text-white flex items-center gap-2">
            <Activity className="size-5 text-cyan-400" />
            ATS MATCH METRICS
          </h2>
        </div>

        <div className="flex flex-col items-end gap-1 font-mono">
          <span className="text-[9px] tracking-widest text-slate-500 uppercase">Target Document</span>
          <span className="text-xs font-bold text-slate-300">{resume.fileName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Radial */}
        <div className="p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center gap-5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
          <h4 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">ATS SCORE</h4>
          
          <div className="relative size-36 flex items-center justify-center">
            <svg className="size-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(6,182,212,0.15)]" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-900/60"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={cn(
                  "transition-all duration-1000 ease-out",
                  atsScore >= 80 ? "stroke-emerald-400" : atsScore >= 60 ? "stroke-cyan-400" : "stroke-rose-400"
                )}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-3xl font-mono font-black text-white">
              {atsScore}%
            </div>
          </div>
          
          <div className="flex flex-col gap-2.5 items-center">
            <span className={cn(
              "text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded border shadow-md",
              atsScore >= 80 
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400" 
                : atsScore >= 60 
                ? "bg-cyan-950/20 border-cyan-500/30 text-cyan-400" 
                : "bg-rose-950/20 border-rose-500/30 text-rose-400"
            )}>
              {atsScore >= 80 ? "OPTIMAL HARMONY" : atsScore >= 60 ? "COMPATIBLE PROSPECT" : "SYSTEM DEGRADED"}
            </span>
          </div>
        </div>

        {/* Missing Keywords & Stats */}
        <div className="md:col-span-2 p-6 backdrop-blur-xl bg-slate-950/70 border border-slate-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800" />
          <h4 className="text-[10px] font-mono font-bold text-slate-300 tracking-widest flex items-center gap-1.5 uppercase border-b border-slate-900 pb-2">
            <Zap className="size-4 text-cyan-400" /> VITAL METRICS
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
            {/* Missing Keywords */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
                <ShieldAlert className="size-4 shrink-0" />
                MISSING KEYWORDS ({missingKeywords.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-950 border border-rose-500/20 text-rose-400 rounded">
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-emerald-400 font-mono">Perfect keyword alignment.</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Award className="size-4 shrink-0" />
                PARSED SKILLS ({parsedData.skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {parsedData.skills && parsedData.skills.length > 0 ? (
                  parsedData.skills.map((kw, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold px-2 py-1 bg-slate-950 border border-cyan-500/20 text-cyan-400 rounded">
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500 font-mono">No skills extracted.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 backdrop-blur-xl bg-emerald-950/10 border border-emerald-900/30 rounded-2xl shadow-xl flex flex-col gap-4">
          <h4 className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest flex items-center gap-1.5 uppercase border-b border-emerald-900/50 pb-2">
            <CheckCircle2 className="size-4" /> RECOGNIZED STRENGTHS
          </h4>
          <ul className="flex flex-col gap-3">
            {strengths.map((str, i) => (
              <li key={i} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2">
                <span className="text-emerald-400 mt-0.5">•</span> {str}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-6 backdrop-blur-xl bg-rose-950/10 border border-rose-900/30 rounded-2xl shadow-xl flex flex-col gap-4">
          <h4 className="text-[10px] font-mono font-bold text-rose-400 tracking-widest flex items-center gap-1.5 uppercase border-b border-rose-900/50 pb-2">
            <XCircle className="size-4" /> IDENTIFIED WEAKNESSES
          </h4>
          <ul className="flex flex-col gap-3">
            {weaknesses.map((weak, i) => (
              <li key={i} className="text-xs text-slate-300 font-semibold leading-relaxed flex gap-2">
                <span className="text-rose-400 mt-0.5">•</span> {weak}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="p-6 backdrop-blur-xl bg-cyan-950/10 border border-cyan-900/30 rounded-2xl shadow-xl flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan-500/50" />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan-500/50" />
        
        <h4 className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest flex items-center gap-1.5 uppercase border-b border-cyan-900/50 pb-2">
          <Sparkles className="size-4" /> ACTIONABLE IMPROVEMENTS
        </h4>
        
        <div className="flex flex-col gap-4 mt-2">
          {improvementSuggestions.map((suggestion, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
            >
              <div className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 font-mono font-bold text-xs">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed mt-1">
                {suggestion}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Extracted Data Preview (Optional debugging/info) */}
      <div className="p-6 backdrop-blur-xl bg-slate-950/40 border border-slate-800 rounded-2xl shadow-xl flex flex-col gap-4">
         <h4 className="text-[10px] font-mono font-bold text-slate-400 tracking-widest flex items-center gap-1.5 uppercase border-b border-slate-900 pb-2">
          <FileText className="size-4" /> PARSED DATA EXTRACT (READ-ONLY)
        </h4>
        <pre className="text-[10px] text-slate-500 font-mono overflow-x-auto p-4 bg-slate-950 rounded-lg custom-scrollbar">
          {JSON.stringify(parsedData, null, 2)}
        </pre>
      </div>
      
    </div>
  );
}
