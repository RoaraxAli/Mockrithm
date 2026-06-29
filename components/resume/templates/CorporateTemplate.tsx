import { ParsedResume } from "@/types/resume";

export default function CorporateTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-8 bg-white text-slate-900 font-serif max-w-[800px] mx-auto min-h-[1131px] shadow-sm flex flex-col gap-5 border-t-8 border-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">{basics.name || "Your Name"}</h1>
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-2">
          <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">{basics.label || "Professional Title"}</p>
          <div className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-[10px] text-slate-600 font-mono">
            {basics.email && <span>{basics.email}</span>}
            {basics.phone && <span>{basics.phone}</span>}
            {socialLinks.map((link, idx) => (
              <span key={idx}>{link.platform}: {link.url}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      {basics.summary && (
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">Professional Summary</h2>
          <p className="text-xs text-slate-700 leading-relaxed font-sans text-justify">{basics.summary}</p>
        </div>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Professional Experience</h2>
          <div className="flex flex-col gap-3">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-extrabold font-sans text-slate-900">{item.company}</span>
                    <span className="text-slate-500"> — </span>
                    <span className="font-bold text-slate-750">{item.position}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {item.startDate} – {item.endDate || "Present"}
                  </span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[11px] text-slate-700 space-y-0.5 font-sans">
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
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Education</h2>
          <div className="flex flex-col gap-2">
            {education.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-extrabold font-sans text-slate-900">{item.institution}</span>
                  <span className="text-slate-500"> — </span>
                  <span className="italic text-slate-700">{item.studyType} in {item.area}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">{item.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Core Competencies</h2>
          <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
            {skills.join(" • ")}
          </p>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Key Projects</h2>
          <div className="flex flex-col gap-2">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-0.5 text-xs font-sans">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">
                    {proj.name}
                    {proj.link && <span className="text-[9px] text-slate-500 font-mono ml-1">({proj.link})</span>}
                  </span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">
                      [{proj.technologies.join(", ")}]
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-750 leading-relaxed text-justify">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Professional Certifications</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-xs font-sans">
                <span className="font-bold text-slate-800">{cert.name}</span>
                <span className="text-slate-500 text-[10px]"> ({cert.issuer}, {cert.date})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
