"use client";

import React, { useRef, useState } from "react";
import { Award, CheckCircle2, Printer, Share2, X, Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";

export interface ECertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  gameName: string;
  gameTheme?: string;
  gameId: string;
  levelReached: number;
  issuedDate?: string;
}

export const ECertificateModal: React.FC<ECertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  gameName,
  gameTheme,
  gameId,
  levelReached,
  issuedDate,
}) => {
  const certRef = useRef<HTMLDivElement>(null);
  const [recipientName, setRecipientName] = useState<string>(userName || "Developer Candidate");

  if (!isOpen) return null;

  const displayDate =
    issuedDate ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Completion percentage based on 100 total levels
  const completionPct = Math.min(100, Math.round((levelReached / 100) * 100));

  // Generate deterministic certificate ID based on game & user
  const hash = Math.abs(
    (recipientName + gameId).split("").reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(8, "0");

  const certId = `MCK-CERT-${gameId.toUpperCase()}-${hash.slice(0, 8)}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    const certUrl = `${window.location.origin}/games?game=${gameId}&cert=${certId}`;
    navigator.clipboard.writeText(certUrl);
    toast.success("Certificate verification link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Print CSS ensuring 100% exact fidelity without layout alteration */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 2.5rem !important;
            background: #09090b !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl my-6 bg-zinc-950 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 font-sans">
        {/* Real Name Modal Bar & Actions */}
        <div className="no-print p-4 sm:p-5 bg-zinc-900/80 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Real Name Input */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <UserCheck className="size-4 text-amber-400 shrink-0" />
            <span className="text-xs font-mono text-zinc-300 font-bold whitespace-nowrap">
              Certificate Full Name:
            </span>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter your real full name"
              className="bg-zinc-950 border border-amber-500/40 focus:border-amber-400 rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold text-amber-300 focus:outline-none w-full sm:w-64 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 transition-colors"
              title="Copy certificate link"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-md shadow-amber-500/20"
              title="Print or Save PDF"
            >
              <Printer className="size-3.5" />
              <span>Download / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body (100% Exact Layout Fidelity) */}
        <div
          id="printable-certificate"
          ref={certRef}
          className="relative p-8 sm:p-12 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-white select-none border-8 border-double border-amber-500/30 m-3 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Subtle background graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Corner Crest Ornaments */}
          <div className="absolute top-4 left-4 text-amber-500/40 font-mono text-[10px] uppercase select-none">❖ MOCKRITHM PLATFORM</div>
          <div className="absolute top-4 right-4 text-amber-500/40 font-mono text-[10px] uppercase select-none">VERIFIED CERTIFICATE ❖</div>
          <div className="absolute bottom-4 left-4 text-amber-500/40 font-mono text-[10px] uppercase select-none">❖ {completionPct}% SYLLABUS COMPLETION</div>
          <div className="absolute bottom-4 right-4 text-amber-500/40 font-mono text-[10px] uppercase select-none">{certId} ❖</div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto py-4">
            
            {/* Header / Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Award className="size-8 text-amber-400" />
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400/90 uppercase font-black">
                MOCKRITHM DEVELOPER PLATFORM
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase font-mono">
                Certificate of Mastery
              </h1>
              <p className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
                Official Achievement Record
              </p>
            </div>

            {/* Presentation Divider */}
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent my-2" />

            {/* Recipient */}
            <div className="space-y-2">
              <p className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                THIS CERTIFIES THAT
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-mono drop-shadow-md">
                {recipientName || "Developer Candidate"}
              </h2>
            </div>

            {/* Statement with percentage completion */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono max-w-xl">
              has successfully completed <strong className="text-amber-300 font-bold">{levelReached} levels ({completionPct}% Completion)</strong> of{" "}
              <span className="text-emerald-400 font-bold uppercase">{gameName}</span>
              {gameTheme ? ` (${gameTheme})` : ""}, proving verified competence in problem solving, code execution, and software architecture on Mockrithm.
            </p>

            {/* Official Ribbon Seal */}
            <div className="pt-4 flex flex-col items-center gap-1">
              <div className="px-6 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 shadow-inner">
                <Sparkles className="size-4 text-amber-400 animate-pulse" />
                <span>Verified Mastery • Level {levelReached} ({completionPct}% Completion)</span>
                <CheckCircle2 className="size-4 text-amber-400" />
              </div>
            </div>

            {/* Signatures & Verification Footer */}
            <div className="w-full pt-8 grid grid-cols-2 gap-8 border-t border-zinc-800/80 text-left">
              {/* Signature 1 */}
              <div className="flex flex-col space-y-1">
                <div className="h-8 font-serif italic text-amber-200 text-lg flex items-end font-bold">
                  Mockrithm Team
                </div>
                <div className="w-36 h-0.5 bg-zinc-700" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  Mockrithm Team
                </span>
                <span className="text-[9px] font-mono text-zinc-500">
                  Mockrithm Learning Engine
                </span>
              </div>

              {/* Signature 2 */}
              <div className="flex flex-col space-y-1 items-end text-right">
                <div className="h-8 font-mono font-bold text-zinc-300 text-xs flex items-end">
                  {displayDate}
                </div>
                <div className="w-36 h-0.5 bg-zinc-700" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  Date Issued
                </span>
                <span className="text-[9px] font-mono text-zinc-500 font-mono">
                  ID: {certId}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
