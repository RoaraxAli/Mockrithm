import { ParsedResume } from "@/types/resume";

export default function ModernTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="flex bg-white text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm overflow-hidden text-[11px] leading-relaxed">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-slate-900 text-slate-200 p-6 flex flex-col gap-6 select-text">
        <div className="flex flex-col gap-1 border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold tracking-tight text-white">{basics.name || "Your Name"}</h1>
          <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">{basics.label || "Professional Label"}</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">Contact</span>
          <div className="flex flex-col gap-2 text-[10px] font-mono break-all text-slate-300">
            {basics.email && <div>Email: <span className="text-white block">{basics.email}</span></div>}
            {basics.phone && <div>Phone: <span className="text-white block">{basics.phone}</span></div>}
            {socialLinks.map((link, idx) => (
              <div key={idx}>
                {link.platform}: <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline block">{link.url}</a>
              </div>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">Skills</span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-slate-850 border border-slate-800 rounded text-slate-300">
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
            <p className="text-slate-600 text-justify leading-relaxed">{basics.summary}</p>
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
                  <p className="text-slate-600 leading-normal">{proj.description}</p>
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
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
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
