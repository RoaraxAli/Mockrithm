"use client";

import { ParsedResume } from "@/types/resume";

interface PDFRendererProps {
  data: ParsedResume;
  mode?: "normal" | "diagnostic" | "optimized";
  atsAnalysis?: {
    atsScore: number;
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    improvementSuggestions: string[];
  } | null;
}

export default function PDFRenderer({ data, mode = "normal", atsAnalysis = null }: PDFRendererProps) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="w-full bg-white text-black p-8 font-serif shadow-2xl border border-zinc-200 aspect-[1/1.414] overflow-y-auto max-h-[800px] text-[11px] leading-relaxed select-text rounded-2xl">
      {/* Header section */}
      <div className="text-center border-b border-black pb-4 mb-4">
        <h1 className="text-xl font-bold tracking-tight uppercase mb-1">{basics?.name || "Your Name"}</h1>
        <p className="text-[12px] font-sans font-medium text-zinc-650 tracking-wide italic mb-2">
          {basics?.label || "Professional Label"}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10px] font-mono text-zinc-600">
          {basics?.email && <span>{basics.email}</span>}
          {basics?.phone && <span>{basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx} className="underline">
              {link.platform}: {link.url}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {basics?.summary && (
        <div className="mb-4">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Professional Summary
          </h2>
          {mode === "diagnostic" ? (
            <div className="relative border border-dashed border-red-500/60 bg-red-50/30 p-2.5 rounded-lg mb-1 mt-1">
              <p className="text-zinc-700 leading-normal">{basics.summary}</p>
              <div
                className="text-red-650 text-[13px] font-bold mt-1.5 leading-tight flex items-start gap-1 select-none"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                <span>✎</span>
                <span>Summary lacks keyword density. Reword to highlight target skills and credentials. (-10 pts)</span>
              </div>
            </div>
          ) : mode === "optimized" ? (
            <div className="relative border border-emerald-550/20 bg-emerald-50/20 p-2.5 rounded-lg mb-1 mt-1">
              <p className="text-zinc-750 leading-normal font-medium">{basics.summary}</p>
              <div
                className="text-emerald-700 text-[10px] font-bold mt-1 leading-tight flex items-center gap-1 select-none"
              >
                <span className="bg-emerald-100 border border-emerald-200 text-emerald-850 text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  ✓ Optimized Summary (STAR Framework & Target Keywords Integrated)
                </span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-700 leading-normal">{basics.summary}</p>
          )}
        </div>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {work.map((w, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-start font-sans font-bold text-zinc-850">
                  <span>{w.position} @ {w.company}</span>
                  <span className="font-mono text-[9px] font-normal text-zinc-500">
                    {w.startDate} — {w.endDate}
                  </span>
                </div>
                {mode === "diagnostic" ? (
                  <div className="relative border border-dashed border-red-500/60 bg-red-50/30 p-2.5 rounded-lg mt-1 mb-1">
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-zinc-700">
                      {w.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="underline decoration-wavy decoration-red-400/70">{h}</li>
                      ))}
                    </ul>
                    <div
                      className="text-red-650 text-[13px] font-bold mt-1.5 leading-tight flex items-start gap-1 select-none"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      <span>✎</span>
                      <span>Lacks metrics/STAR structure. Quantify achievements (%, $, hours). (-15 pts)</span>
                    </div>
                  </div>
                ) : mode === "optimized" ? (
                  <div className="relative border border-emerald-500/20 bg-emerald-50/20 p-2.5 rounded-lg mt-1 mb-1">
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-zinc-755 font-medium">
                      {w.highlights.map((h, hIdx) => (
                        <li key={hIdx}>
                          {h} <span className="text-emerald-600 font-bold ml-0.5">✓</span>
                        </li>
                      ))}
                    </ul>
                    <div
                      className="text-emerald-700 text-[10px] font-bold mt-1 leading-tight flex items-center gap-1 select-none"
                    >
                      <span className="bg-emerald-100 border border-emerald-200 text-emerald-850 text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                        ✓ STAR Structured & Quantified Highlights
                      </span>
                    </div>
                  </div>
                ) : (
                  <ul className="list-disc list-outside pl-4 mt-1 space-y-0.5 text-zinc-700">
                    {w.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Key Projects
          </h2>
          <div className="space-y-2">
            {projects.map((p, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="flex justify-between items-start font-sans font-bold text-zinc-850">
                  <span>{p.name} {p.link && <span className="text-[9px] font-normal text-zinc-500 font-mono">({p.link})</span>}</span>
                  {p.technologies.length > 0 && (
                    <span className="font-mono text-[8px] bg-zinc-100 text-zinc-650 px-1.5 py-0.5 rounded">
                      {p.technologies.join(", ")}
                    </span>
                  )}
                </div>
                <p className="text-zinc-700 mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Skills Inventory
          </h2>
          {mode === "diagnostic" ? (
            <div className="border border-dashed border-red-500/60 bg-red-50/30 p-2.5 rounded-lg">
              <p className="text-zinc-700 font-mono text-[10px] tracking-tight">{skills.join("  •  ")}</p>
              {atsAnalysis?.missingKeywords && atsAnalysis.missingKeywords.length > 0 && (
                <div className="mt-2 pt-2 border-t border-red-200/55">
                  <span className="font-sans font-bold text-[8.5px] text-red-700 uppercase tracking-wider block mb-1">
                    Missing Target Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {atsAnalysis.missingKeywords.slice(0, 5).map((kw, i) => (
                      <span key={i} className="text-red-650 border border-dashed border-red-400 text-[8px] font-mono px-1.5 py-0.5 rounded bg-red-100/50">
                        {kw} ✗
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="text-red-650 text-[13px] font-bold mt-1.5 leading-tight flex items-start gap-1 select-none"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                <span>✎</span>
                <span>Fails core ATS competency checks. Missing critical industry keywords. (-15 pts)</span>
              </div>
            </div>
          ) : mode === "optimized" ? (
            <div className="border border-emerald-500/20 bg-emerald-50/20 p-2.5 rounded-lg">
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {skills.map((s, i) => {
                  const isNew = atsAnalysis?.missingKeywords?.some(
                    (kw: string) => kw.toLowerCase() === s.toLowerCase()
                  );
                  return (
                    <span
                      key={i}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all ${
                        isNew
                          ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-bold"
                          : "bg-zinc-100 border-zinc-200 text-zinc-650"
                      }`}
                    >
                      {s} {isNew ? "✓" : ""}
                    </span>
                  );
                })}
              </div>
              <div
                className="text-emerald-700 text-[10px] font-bold mt-1.5 leading-tight flex items-center gap-1 select-none"
              >
                <span className="bg-emerald-100 border border-emerald-200 text-emerald-850 text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                  ✓ Keywords Added
                </span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-700 font-mono text-[10px] tracking-tight">{skills.join("  •  ")}</p>
          )}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((e, idx) => (
              <div key={idx} className="flex justify-between items-start font-sans">
                <div>
                  <span className="font-bold text-zinc-850">{e.studyType} in {e.area}</span>
                  <span className="text-zinc-500 text-[10px] ml-2">({e.institution})</span>
                </div>
                <span className="font-mono text-[9px] text-zinc-500">{e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-[10px] font-sans font-bold uppercase tracking-wider border-b border-zinc-200 pb-0.5 mb-1.5 text-zinc-800">
            Certifications
          </h2>
          <div className="grid grid-cols-2 gap-2 text-zinc-700">
            {certifications.map((c, idx) => (
              <div key={idx} className="flex justify-between items-center font-sans border-l-2 border-zinc-200 pl-2">
                <div>
                  <div className="font-bold text-zinc-800">{c.name}</div>
                  <div className="text-[9px] text-zinc-500">{c.issuer}</div>
                </div>
                <span className="font-mono text-[8px] text-zinc-400">{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
