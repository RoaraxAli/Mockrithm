import { ParsedResume } from "@/types/resume";

export default function MinimalTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-8 bg-white text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{basics.name || "Your Name"}</h1>
        <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">{basics.label || "Professional Title"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-mono">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx}>{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {basics.summary && (
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Summary</h2>
          <p className="text-sm text-slate-650 leading-relaxed text-justify">{basics.summary}</p>
        </div>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Experience</h2>
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
                  <ul className="list-disc list-outside ml-4 text-xs text-slate-600 space-y-1 leading-relaxed">
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
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Education</h2>
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
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-150">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Projects</h2>
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
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Certifications</h2>
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
