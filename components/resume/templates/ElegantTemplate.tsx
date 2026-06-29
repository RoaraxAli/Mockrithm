import { ParsedResume } from "@/types/resume";

export default function ElegantTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-8 bg-stone-50/15 text-stone-850 font-serif max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col gap-6 border border-stone-200 select-text text-[11px] leading-relaxed relative">
      {/* Accent frame decoration */}
      <div className="absolute inset-4 border border-stone-200/50 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 p-2">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-stone-300 pb-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-light tracking-wide text-stone-900">{basics.name || "Your Name"}</h1>
            <p className="text-xs font-sans font-bold text-stone-500 uppercase tracking-widest">{basics.label || "Professional Label"}</p>
          </div>
          <div className="flex flex-col gap-1 text-right text-[10px] text-stone-600 font-sans">
            {basics.email && <div>{basics.email}</div>}
            {basics.phone && <div>{basics.phone}</div>}
            {socialLinks.map((link, idx) => (
              <div key={idx} className="underline text-stone-700">{link.platform}: {link.url}</div>
            ))}
          </div>
        </div>

        {basics.summary && (
          <div className="flex flex-col gap-1">
            <p className="text-justify leading-relaxed text-stone-700 font-medium italic">"{basics.summary}"</p>
          </div>
        )}

        {work.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-0.5">Professional Experience</h2>
            <div className="flex flex-col gap-4">
              {work.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-baseline font-sans text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{item.company}</span>
                      <span className="text-stone-400"> • </span>
                      <span className="italic text-stone-700">{item.position}</span>
                    </div>
                    <span className="text-[9px] font-mono text-stone-400">{item.startDate} – {item.endDate || "Present"}</span>
                  </div>
                  {item.highlights && item.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-[11px] text-stone-650 space-y-0.5 font-serif">
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
          <div className="flex flex-col gap-2.5">
            <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-0.5">Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 font-serif">
                  <div className="flex justify-between items-center font-sans text-xs">
                    <span className="font-bold text-stone-900">{proj.name}</span>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <span className="text-[9px] font-mono text-stone-450">[{proj.technologies.join(", ")}]</span>
                    )}
                  </div>
                  <p className="text-stone-650 leading-relaxed text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 border-t border-stone-200 pt-4">
          {education.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-0.5">Education</h2>
              <div className="flex flex-col gap-2 font-serif">
                {education.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-bold text-stone-900">{item.studyType} in {item.area}</span>
                    <span className="text-stone-500 font-sans text-[10px]">{item.institution}</span>
                    <span className="text-[9px] font-mono text-stone-400 mt-0.5">{item.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {skills.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-0.5">Core Competencies</h2>
                <div className="flex flex-wrap gap-1.5 font-sans">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-stone-100 border border-stone-200 text-stone-700 rounded font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-800 border-b border-stone-200 pb-0.5">Certifications</h2>
                <div className="flex flex-col gap-1 text-stone-650 font-sans text-[10px]">
                  {certifications.map((cert, idx) => (
                    <div key={idx}>
                      <span className="font-bold text-stone-850">{cert.name}</span>
                      <span className="text-stone-400 font-mono"> — {cert.issuer} ({cert.date})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
