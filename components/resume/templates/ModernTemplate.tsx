import { ParsedResume } from "@/types/resume";

export default function ModernTemplate({ data, templateId }: { data: ParsedResume; templateId?: string }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;
  const normId = (templateId || "").toLowerCase();

  let flexRowClass = "flex-row";
  let sidebarBg = "bg-slate-900 text-slate-200";
  let accentText = "text-emerald-400";
  let accentBorder = "border-slate-800";
  let contentBg = "bg-white text-slate-800";
  let skillBadge = "bg-slate-855 border border-slate-800 text-slate-300";
  let labelColor = "text-emerald-400";

  if (normId === "special-education") {
    sidebarBg = "bg-indigo-950 text-indigo-100";
    accentText = "text-indigo-300";
    accentBorder = "border-indigo-900";
    labelColor = "text-indigo-300";
    skillBadge = "bg-indigo-900 border border-indigo-800 text-indigo-200";
  } else if (normId === "arbitrator") {
    sidebarBg = "bg-zinc-900 text-zinc-200";
    accentText = "text-zinc-400";
    accentBorder = "border-zinc-800";
    labelColor = "text-zinc-450";
    skillBadge = "bg-zinc-800 border border-zinc-700 text-zinc-350";
  } else if (normId === "ui-ux-designer") {
    flexRowClass = "flex-row-reverse";
    sidebarBg = "bg-neutral-900 text-neutral-200";
    accentText = "text-cyan-400";
    accentBorder = "border-neutral-850";
    labelColor = "text-cyan-400 font-bold";
    skillBadge = "bg-neutral-800 border border-neutral-700 text-cyan-200";
  } else if (normId === "content-producer") {
    sidebarBg = "bg-violet-950 text-violet-100";
    accentText = "text-pink-450";
    accentBorder = "border-violet-900";
    labelColor = "text-pink-400";
    skillBadge = "bg-violet-900 border border-violet-850 text-pink-200";
  } else if (normId === "dentist") {
    sidebarBg = "bg-teal-950 text-teal-100";
    accentText = "text-teal-450";
    accentBorder = "border-teal-900";
    labelColor = "text-teal-455";
    skillBadge = "bg-teal-900 border border-teal-850 text-teal-200";
  } else if (normId === "event-coordinator") {
    flexRowClass = "flex-row-reverse";
    sidebarBg = "bg-stone-900 text-stone-200";
    accentText = "text-amber-500";
    accentBorder = "border-stone-800";
    labelColor = "text-amber-500";
    skillBadge = "bg-stone-800 border border-stone-700 text-amber-200";
  }

  return (
    <div className={`flex max-w-[800px] mx-auto min-h-[1131px] shadow-sm overflow-hidden text-[11px] leading-relaxed ${contentBg} ${flexRowClass}`}>
      {/* Left Sidebar */}
      <div className={`w-1/3 p-6 flex flex-col gap-6 select-text ${sidebarBg}`}>
        <div className={`flex flex-col gap-1 border-b pb-4 ${accentBorder}`}>
          <h1 className="text-xl font-bold tracking-tight text-white">{basics.name || "Your Name"}</h1>
          <p className={`text-[10px] font-mono uppercase tracking-wider ${labelColor}`}>{basics.label || "Professional Label"}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className={`text-[9px] font-mono uppercase tracking-widest border-b pb-1 ${accentBorder}`}>Contact</span>
          <div className="flex flex-col gap-2 text-[10px] font-mono break-all text-slate-300">
            {basics.email && <div>Email: <span className="text-white block">{basics.email}</span></div>}
            {basics.phone && <div>Phone: <span className="text-white block">{basics.phone}</span></div>}
            {socialLinks.map((link, idx) => (
              <div key={idx}>
                {link.platform}: <a href={link.url} target="_blank" rel="noopener noreferrer" className={`underline block ${accentText}`}>{link.url}</a>
              </div>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className={`text-[9px] font-mono uppercase tracking-widest border-b pb-1 ${accentBorder}`}>Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className={`text-[9px] font-mono px-2 py-0.5 rounded ${skillBadge}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-6 flex flex-col gap-5 select-text">
        {basics.summary && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Profile Summary</h2>
            <p className="text-slate-650 text-justify leading-relaxed">{basics.summary}</p>
          </div>
        )}

        {work.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Experience</h2>
            <div className="flex flex-col gap-4">
              {work.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-800 text-[12px]">{item.position} <span className="font-normal text-slate-450">at</span> {item.company}</span>
                    <span className="text-[9px] font-mono text-slate-400">{item.startDate} – {item.endDate || "Present"}</span>
                  </div>
                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-slate-600 space-y-0.5">
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
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{proj.name}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[9px] font-mono text-slate-500">[{proj.technologies.join(", ")}]</span>
                    )}
                  </div>
                  <p className="text-slate-650 leading-normal">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Education</h2>
            <div className="flex flex-col gap-2">
              {education.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-850">{item.studyType} in {item.area}</span>
                    <div className="text-[10px] text-slate-500">{item.institution}</div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{item.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">Certifications</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-650">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-semibold text-slate-800">{cert.name}</span>
                  <span className="text-slate-400 text-[10px]"> ({cert.issuer}, {cert.date})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
