import { ParsedResume } from "@/types/resume";

export default function TechTemplate({ data, templateId }: { data: ParsedResume; templateId?: string }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;
  const normId = (templateId || "").toLowerCase();

  // Custom styles for TechTemplate variants
  let themeBg = "bg-zinc-950 text-zinc-300 border-t-8 border-emerald-500";
  let promptColor = "text-emerald-500";
  let promptChar = ">";
  let commentColor = "text-zinc-500 font-mono";
  let commentPrefix = "// ";
  let tagBg = "bg-zinc-900 border border-zinc-800 text-emerald-450";
  let linkColor = "text-emerald-400";

  if (normId === "full-stack-dev") {
    themeBg = "bg-slate-950 text-slate-350 border-t-8 border-cyan-500";
    promptColor = "text-cyan-400";
    promptChar = "$";
    commentColor = "text-slate-500 font-mono";
    commentPrefix = "/* ";
    tagBg = "bg-slate-900 border border-slate-800 text-cyan-300";
    linkColor = "text-cyan-400";
  } else if (normId === "cio") {
    themeBg = "bg-zinc-900 text-zinc-200 border-t-8 border-sky-600";
    promptColor = "text-sky-400";
    promptChar = "⚡";
    commentColor = "text-zinc-400 font-bold uppercase tracking-wider";
    commentPrefix = ":: ";
    tagBg = "bg-zinc-800 border border-zinc-700 text-sky-200";
    linkColor = "text-sky-400";
  }

  return (
    <div className={`p-8 font-mono max-w-[800px] mx-auto min-h-[1131px] shadow-sm flex flex-col gap-5 select-text text-[10px] leading-relaxed ${themeBg}`}>
      {/* Dev Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-1.5">
          <span className={promptColor}>{promptChar}</span> {basics.name || "Developer_Name"}
        </h1>
        <p className="text-[11px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">{basics.label || "Full_Stack_Engineer"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-500 mt-2 text-[9px]">
          {basics.email && <span>email: {basics.email}</span>}
          {basics.phone && <span>phone: {basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx} className={`underline ${linkColor}`}>
              {link.platform.toLowerCase()}: {link.url}
            </span>
          ))}
        </div>
      </div>

      {basics.summary && (
        <div className="flex flex-col gap-1">
          <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Profile Summary</span>
          <p className="text-zinc-400 text-justify">{basics.summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Core Technologies</span>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className={`px-2 py-0.5 rounded font-bold ${tagBg}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {work.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Work History</span>
          <div className="flex flex-col gap-4">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline font-bold">
                  <span className="text-white text-[11px]">{item.position} @ {item.company}</span>
                  <span className="text-[9px] text-zinc-500 shrink-0">{item.startDate} – {item.endDate || "Present"}</span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-inside list-disc pl-2 text-zinc-400 space-y-0.5">
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Technical Projects</span>
          <div className="flex flex-col gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-white">{proj.name}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className={`${promptColor} text-[9px]`}>{`[${proj.technologies.join(", ")}]`}</span>
                  )}
                </div>
                <p className="text-zinc-400 leading-normal">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-4">
        {education.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Education</span>
            <div className="flex flex-col gap-2">
              {education.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-white font-bold">{item.studyType} in {item.area}</span>
                  <span className="text-zinc-400">{item.institution}</span>
                  <span className="text-zinc-500 text-[8.5px] mt-0.5">{item.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className={`text-[9px] uppercase tracking-widest ${commentColor}`}>{commentPrefix}Certifications</span>
            <div className="flex flex-col gap-1 text-zinc-400">
              {certifications.map((cert, idx) => (
                <div key={idx}>
                  <span className="text-white font-bold">{cert.name}</span>
                  <span className="text-zinc-500"> — {cert.issuer} ({cert.date})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
