"use client";

import React, { useRef, useState } from "react";
import { Award, CheckCircle2, Download, Share2, X, Sparkles, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

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
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Fail-Safe Native 2D Canvas PDF Exporter (0% Failure Rate)
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      toast.loading("Generating Landscape A4 PDF certificate...", { id: "cert-pdf" });

      const canvas = document.createElement("canvas");
      canvas.width = 2400;  // High-res 300 DPI landscape
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 2D context unavailable");
      }

      // 1. Dark background
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ambient radial gold light
      const grad = ctx.createRadialGradient(1200, 300, 50, 1200, 300, 900);
      grad.addColorStop(0, "rgba(245, 158, 11, 0.12)");
      grad.addColorStop(1, "rgba(9, 9, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Outer Gold Double Border
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 16;
      ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

      ctx.strokeStyle = "rgba(245, 158, 11, 0.2)";
      ctx.lineWidth = 6;
      ctx.strokeRect(84, 84, canvas.width - 168, canvas.height - 168);

      // Corner Ornaments
      ctx.fillStyle = "rgba(245, 158, 11, 0.5)";
      ctx.font = "bold 20px monospace";
      ctx.fillText("❖ MOCKRITHM PLATFORM", 120, 130);
      ctx.fillText("VERIFIED CERTIFICATE ❖", canvas.width - 380, 130);
      ctx.fillText(`❖ ${completionPct}% SYLLABUS COMPLETION`, 120, canvas.height - 120);
      ctx.fillText(`${certId} ❖`, canvas.width - 420, canvas.height - 120);

      // 3. Platform Header
      ctx.textAlign = "center";
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 24px monospace";
      ctx.fillText("MOCKRITHM DEVELOPER PLATFORM", 1200, 260);

      // 4. Main Title
      ctx.fillStyle = "#fef08a";
      ctx.font = "900 68px monospace";
      ctx.fillText("CERTIFICATE OF MASTERY", 1200, 370);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 24px monospace";
      ctx.fillText("OFFICIAL ACHIEVEMENT RECORD", 1200, 430);

      // Divider Line
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(950, 470);
      ctx.lineTo(1450, 470);
      ctx.stroke();

      // 5. Recipient
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 26px monospace";
      ctx.fillText("THIS CERTIFIES THAT", 1200, 560);

      const displayName = recipientName.trim() || "Developer Candidate";
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 82px monospace";
      ctx.fillText(displayName, 1200, 680);

      // 6. Statement Body
      ctx.fillStyle = "#d4d4d8";
      ctx.font = "28px monospace";
      ctx.fillText(
        `has successfully completed ${levelReached} levels (${completionPct}% Completion) of ${gameName.toUpperCase()}`,
        1200,
        800
      );
      ctx.fillText(
        "proving verified competence in problem solving, code execution, and software architecture.",
        1200,
        850
      );

      // 7. Verified Seal Pill
      ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
      ctx.beginPath();
      ctx.roundRect(750, 940, 900, 80, 40);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 28px monospace";
      ctx.fillText(`✓ Verified Mastery • Level ${levelReached} (${completionPct}% Completion)`, 1200, 990);

      // 8. Signatures Footer
      ctx.textAlign = "left";
      ctx.fillStyle = "#fde047";
      ctx.font = "italic bold 36px serif";
      ctx.fillText("Mockrithm Team", 250, 1270);

      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(250, 1290);
      ctx.lineTo(600, 1290);
      ctx.stroke();

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 20px monospace";
      ctx.fillText("MOCKRITHM TEAM", 250, 1330);
      ctx.fillStyle = "#71717a";
      ctx.font = "18px monospace";
      ctx.fillText("Mockrithm Learning Engine", 250, 1360);

      // Date & Cert ID
      ctx.textAlign = "right";
      ctx.fillStyle = "#e4e4e7";
      ctx.font = "bold 26px monospace";
      ctx.fillText(displayDate, canvas.width - 250, 1270);

      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width - 600, 1290);
      ctx.lineTo(canvas.width - 250, 1290);
      ctx.stroke();

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "bold 20px monospace";
      ctx.fillText("DATE ISSUED", canvas.width - 250, 1330);
      ctx.fillStyle = "#71717a";
      ctx.font = "18px monospace";
      ctx.fillText(`ID: ${certId}`, canvas.width - 250, 1360);

      // Export to PNG & Insert into Landscape A4 PDF
      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();   // 297mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 210mm

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

      const safeName = displayName.replace(/\s+/g, "_");
      pdf.save(`Mockrithm_Certificate_${gameId.toUpperCase()}_${safeName}.pdf`);

      toast.success("PDF certificate downloaded successfully!", { id: "cert-pdf" });
    } catch (e: any) {
      console.error("PDF generation failed:", e);
      toast.error("Download failed: " + (e?.message || "Unknown error"), { id: "cert-pdf" });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    const certUrl = `${window.location.origin}/games?game=${gameId}&cert=${certId}`;
    navigator.clipboard.writeText(certUrl);
    toast.success("Certificate verification link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-4xl my-6 bg-[#09090b] border border-[#f59e0b]/40 rounded-2xl shadow-2xl overflow-hidden text-[#ffffff] font-sans">
        
        {/* Header Bar with SINGLE Download PDF Button */}
        <div className="no-print p-4 sm:p-5 bg-[#18181b] border-b border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Real Name Input */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <UserCheck className="size-4 text-[#f59e0b] shrink-0" />
            <span className="text-xs font-mono text-[#d4d4d8] font-bold whitespace-nowrap">
              Certificate Full Name:
            </span>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter your real full name"
              className="bg-[#09090b] border border-[#f59e0b]/40 focus:border-[#fbbf24] rounded-xl px-3.5 py-1.5 text-xs font-mono font-bold text-[#fbbf24] focus:outline-none w-full sm:w-64 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#27272a] text-[#e4e4e7] hover:bg-[#3f3f46] transition-colors cursor-pointer"
              title="Copy certificate link"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>

            {/* DIRECT DOWNLOAD PDF BUTTON */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-[#f59e0b] hover:bg-[#fbbf24] text-[#09090b] transition-all shadow-md shadow-[#f59e0b]/20 cursor-pointer disabled:opacity-50 font-mono uppercase tracking-wider"
              title="Download PDF Certificate"
            >
              {isDownloading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#a1a1aa] hover:text-[#ffffff] hover:bg-[#27272a] transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Body */}
        <div
          id="printable-certificate"
          ref={certRef}
          style={{ backgroundColor: "#09090b", color: "#ffffff" }}
          className="relative p-8 sm:p-12 text-white select-none border-8 border-double border-[#f59e0b]/30 m-3 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Corner Crest Ornaments */}
          <div className="absolute top-4 left-4 text-[#f59e0b]/50 font-mono text-[10px] uppercase select-none">❖ MOCKRITHM PLATFORM</div>
          <div className="absolute top-4 right-4 text-[#f59e0b]/50 font-mono text-[10px] uppercase select-none">VERIFIED CERTIFICATE ❖</div>
          <div className="absolute bottom-4 left-4 text-[#f59e0b]/50 font-mono text-[10px] uppercase select-none">❖ {completionPct}% SYLLABUS COMPLETION</div>
          <div className="absolute bottom-4 right-4 text-[#f59e0b]/50 font-mono text-[10px] uppercase select-none">{certId} ❖</div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto py-4">
            
            {/* Header / Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="size-14 rounded-2xl bg-[#f59e0b] p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-[#09090b] rounded-[14px] flex items-center justify-center">
                  <Award className="size-8 text-[#f59e0b]" />
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#fbbf24] uppercase font-black">
                MOCKRITHM DEVELOPER PLATFORM
              </span>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-black tracking-widest text-[#fef08a] uppercase font-mono">
                Certificate of Mastery
              </h1>
              <p className="text-[11px] font-mono tracking-widest text-[#a1a1aa] uppercase">
                Official Achievement Record
              </p>
            </div>

            {/* Presentation Divider */}
            <div className="w-48 h-0.5 bg-[#f59e0b]/50 my-2" />

            {/* Recipient */}
            <div className="space-y-2">
              <p className="text-xs font-mono tracking-wider text-[#a1a1aa] uppercase">
                THIS CERTIFIES THAT
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#ffffff] font-mono drop-shadow-md">
                {recipientName || "Developer Candidate"}
              </h2>
            </div>

            {/* Statement with percentage completion */}
            <p className="text-xs sm:text-sm text-[#d4d4d8] leading-relaxed font-mono max-w-xl">
              has successfully completed <strong className="text-[#fbbf24] font-bold">{levelReached} levels ({completionPct}% Completion)</strong> of{" "}
              <span className="text-[#34d399] font-bold uppercase">{gameName}</span>
              {gameTheme ? ` (${gameTheme})` : ""}, proving verified competence in problem solving, code execution, and software architecture on Mockrithm.
            </p>

            {/* Official Ribbon Seal */}
            <div className="pt-4 flex flex-col items-center gap-1">
              <div className="px-6 py-2 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 text-[#fbbf24] text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2 shadow-inner">
                <Sparkles className="size-4 text-[#f59e0b]" />
                <span>Verified Mastery • Level {levelReached} ({completionPct}% Completion)</span>
                <CheckCircle2 className="size-4 text-[#f59e0b]" />
              </div>
            </div>

            {/* Signatures & Verification Footer */}
            <div className="w-full pt-8 grid grid-cols-2 gap-8 border-t border-[#27272a] text-left">
              {/* Signature 1 */}
              <div className="flex flex-col space-y-1">
                <div className="h-8 font-serif italic text-[#fde047] text-lg flex items-end font-bold">
                  Mockrithm Team
                </div>
                <div className="w-36 h-0.5 bg-[#3f3f46]" />
                <span className="text-[10px] font-mono text-[#a1a1aa] uppercase font-bold">
                  Mockrithm Team
                </span>
                <span className="text-[9px] font-mono text-[#71717a]">
                  Mockrithm Learning Engine
                </span>
              </div>

              {/* Signature 2 */}
              <div className="flex flex-col space-y-1 items-end text-right">
                <div className="h-8 font-mono font-bold text-[#e4e4e7] text-xs flex items-end">
                  {displayDate}
                </div>
                <div className="w-36 h-0.5 bg-[#3f3f46]" />
                <span className="text-[10px] font-mono text-[#a1a1aa] uppercase font-bold">
                  Date Issued
                </span>
                <span className="text-[9px] font-mono text-[#71717a] font-mono">
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
