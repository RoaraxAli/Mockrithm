import { ParsedResume } from "@/types/resume";

export default function MinimalTemplate({ data, templateId }: { data: ParsedResume; templateId?: string }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;
  const normId = (templateId || "").toLowerCase();

  // Defaults
  let containerBg = "bg-white text-slate-800 font-sans border-t-8 border-slate-800";
  let nameColor = "text-slate-900";
  let labelColor = "text-slate-500";
  let headerClass = "border-b border-slate-200 pb-4 text-center";
  let headingClass = "text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1";
  let skillClass = "text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-150";
  let bulletClass = "text-slate-600";

  if (normId === "high-school-teacher") {
    containerBg = "bg-stone-50 text-stone-900 font-serif border-t-8 border-amber-800";
    nameColor = "text-amber-950 font-serif";
    labelColor = "text-stone-500";
    headerClass = "border-b border-stone-200 pb-4 text-left pl-2";
    headingClass = "text-xs font-serif font-bold uppercase tracking-widest text-amber-900 border-b-2 border-stone-200 pb-1";
    skillClass = "text-xs bg-stone-100 text-stone-850 px-2.5 py-1 font-medium border border-stone-250";
  } else if (normId === "city-planner") {
    containerBg = "bg-white text-emerald-950 font-sans border-t-8 border-emerald-700";
    nameColor = "text-emerald-900 font-sans font-black";
    labelColor = "text-emerald-600";
    headerClass = "border-b border-emerald-100 pb-4 text-right pr-2";
    headingClass = "text-xs font-sans font-bold uppercase tracking-wider text-emerald-800 border-b border-emerald-100 pb-1";
    skillClass = "text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-none border border-emerald-200";
  } else if (normId === "compliance-specialist") {
    containerBg = "bg-slate-50 text-slate-800 font-sans border-t-8 border-blue-900";
    nameColor = "text-slate-900 font-sans font-extrabold";
    labelColor = "text-blue-700";
    headerClass = "border-b border-slate-200 pb-4 text-center";
    headingClass = "text-xs font-mono font-bold uppercase tracking-wider text-blue-900 border-b border-slate-200 pb-1";
    skillClass = "text-xs bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-100";
  } else if (normId === "data-scientist") {
    containerBg = "bg-zinc-950 text-zinc-300 font-mono border-t-8 border-teal-500";
    nameColor = "text-teal-400 font-mono font-black";
    labelColor = "text-zinc-500";
    headerClass = "border-b border-zinc-900 pb-4 text-left";
    headingClass = "text-xs font-mono font-bold uppercase tracking-widest text-teal-500 border-b border-zinc-900 pb-1";
    skillClass = "text-xs bg-zinc-900 text-teal-450 px-2.5 py-1 font-medium border border-zinc-800";
    bulletClass = "text-zinc-400";
  } else if (normId === "registered-nurse") {
    containerBg = "bg-white text-slate-800 font-sans border-t-8 border-sky-400";
    nameColor = "text-sky-900 font-sans font-bold";
    labelColor = "text-sky-500";
    headerClass = "border-b border-sky-100 pb-4 text-center";
    headingClass = "text-xs font-sans font-bold uppercase tracking-wider text-sky-800 border-b border-sky-100 pb-1";
    skillClass = "text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-150";
  } else if (normId === "tax-associate") {
    containerBg = "bg-white text-slate-800 font-sans border-t-8 border-indigo-900";
    nameColor = "text-slate-900 font-sans font-bold";
    labelColor = "text-indigo-800";
    headerClass = "border-b border-indigo-100 pb-4 text-left";
    headingClass = "text-xs font-sans font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1";
    skillClass = "text-xs bg-indigo-50 text-indigo-950 px-2.5 py-1 rounded border border-indigo-100";
  } else if (normId === "customer-success") {
    containerBg = "bg-white text-slate-800 font-sans border-t-8 border-violet-600";
    nameColor = "text-violet-900 font-sans font-bold";
    labelColor = "text-slate-500";
    headerClass = "border-b border-slate-200 pb-4 text-center";
    headingClass = "text-xs font-sans font-bold uppercase tracking-wider text-violet-800 border-b border-violet-100 pb-1";
    skillClass = "text-xs bg-violet-50 text-violet-750 px-2.5 py-1 rounded border border-violet-150";
  } else if (normId === "travel-agent") {
    containerBg = "bg-orange-50/20 text-stone-800 font-sans border-t-8 border-orange-500";
    nameColor = "text-orange-950 font-sans font-bold";
    labelColor = "text-orange-600";
    headerClass = "border-b border-orange-100 pb-4 text-center";
    headingClass = "text-xs font-sans font-bold uppercase tracking-wider text-orange-850 border-b border-orange-100 pb-1";
    skillClass = "text-xs bg-orange-100/50 text-orange-950 px-2.5 py-1 rounded border border-orange-200";
  }

  return (
    <div className={`p-8 max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col gap-6 ${containerBg}`}>
      {/* Header */}
      <div className={headerClass}>
        <h1 className={`text-3xl font-bold tracking-tight ${nameColor}`}>{basics.name || "Your Name"}</h1>
        <p className={`text-sm font-medium mt-1 uppercase tracking-wider ${labelColor}`}>{basics.label || "Professional Title"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx}>{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      {basics.summary && (
        <div className="flex flex-col gap-1.5">
          <h2 className={headingClass}>Summary</h2>
          <p className="text-sm leading-relaxed text-justify">{basics.summary}</p>
        </div>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className={headingClass}>Experience</h2>
          <div className="flex flex-col gap-4">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-bold text-slate-850">{item.position}</span>
                    <span className="text-slate-400 font-medium"> @ </span>
                    <span className="font-semibold text-slate-700">{item.company}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {item.startDate} – {item.endDate || "Present"}
                  </span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className={`list-disc list-outside ml-4 text-xs space-y-1 leading-relaxed ${bulletClass}`}>
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

      {/* Education */}
      {education.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className={headingClass}>Education</h2>
          <div className="flex flex-col gap-3">
            {education.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm">
                <div>
                  <span className="font-bold text-slate-850">{item.studyType} in {item.area}</span>
                  <div className="text-xs text-slate-500 font-medium">{item.institution}</div>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{item.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className={headingClass}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className={skillClass}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className={headingClass}>Projects</h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-850">
                    {proj.name}
                    {proj.link && <span className="text-[10px] text-slate-400 font-mono ml-2">({proj.link})</span>}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 max-w-[200px] truncate">
                      {proj.technologies.join(", ")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-650 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className={headingClass}>Certifications</h2>
          <div className="flex flex-col gap-1.5">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{cert.name}</span>
                  <span className="text-slate-400 font-mono text-[10px]"> — {cert.issuer}</span>
                </div>
                <span className="text-slate-400 font-mono shrink-0">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
