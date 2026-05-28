import { ParsedResume } from "@/types/resume";

export default function CyberTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-8 bg-slate-950 text-slate-300 font-mono max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col gap-6 border-2 border-cyan-500/30 relative overflow-hidden">
      {/* Grid background effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-widest text-white uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
              {basics.name || "INTEGRATED_IDENTITY"}
            </h1>
            <p className="text-xs font-bold text-cyan-400 uppercase mt-1 tracking-[0.2em]">{basics.label || "TITLE_REDACTED"}</p>
          </div>
          <div className="text-[10px] text-right font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
            STATUS: ACTIVE // LOGGED
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-4 font-bold">
          {basics.email && <span className="hover:text-cyan-400 transition-colors">EMAIL: {basics.email}</span>}
          {basics.phone && <span className="hover:text-cyan-400 transition-colors">TEL: {basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx} className="hover:text-cyan-400 transition-colors">{link.platform.toUpperCase()}: {link.url}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {basics.summary && (
        <div className="flex flex-col gap-1.5 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="inline-block size-1.5 bg-cyan-400" /> EXECUTION_SUMMARY
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed text-justify bg-slate-900/50 p-3 rounded border border-slate-900">{basics.summary}</p>
        </div>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <div className="flex flex-col gap-3 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="inline-block size-1.5 bg-cyan-400" /> RECORDED_WORK_HISTORY
          </h2>
          <div className="flex flex-col gap-4">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1 border-l border-slate-800 pl-4 relative ml-1">
                <div className="absolute -left-[4.5px] top-1 size-2 rounded-full bg-cyan-500" />
                <div className="flex justify-between items-start text-xs font-bold">
                  <div>
                    <span className="text-white font-black">{item.position.toUpperCase()}</span>
                    <span className="text-cyan-400"> @ {item.company.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">
                    [{item.startDate.toUpperCase()} - {item.endDate ? item.endDate.toUpperCase() : "PRESENT"}]
                  </span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-none text-[11px] text-slate-400 space-y-1 mt-1">
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="flex gap-2">
                        <span className="text-cyan-400 shrink-0">&gt;</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="flex flex-col gap-3 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="inline-block size-1.5 bg-cyan-400" /> EDUCATION_CREDENTIALS
          </h2>
          <div className="flex flex-col gap-3">
            {education.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs border border-slate-900 bg-slate-900/30 p-2.5 rounded">
                <div>
                  <span className="font-black text-white">{item.studyType.toUpperCase()} IN {item.area.toUpperCase()}</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.institution.toUpperCase()}</div>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 shrink-0">[{item.endDate.toUpperCase()}]</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-3 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="inline-block size-1.5 bg-cyan-400" /> SKILL_CAPABILITIES
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-[10px] font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-3 py-1 rounded">
                // {skill.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-3 relative z-10">
          <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <span className="inline-block size-1.5 bg-cyan-400" /> REPLICATED_MODULES
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="border border-slate-900 bg-slate-900/20 p-3 rounded flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">{proj.name.toUpperCase()}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[9px] text-cyan-400/80">
                      [{proj.technologies.join(", ").toUpperCase()}]
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{proj.description}</p>
                {proj.link && <span className="text-[9px] text-slate-600 mt-0.5">SRC_LINK: {proj.link}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
