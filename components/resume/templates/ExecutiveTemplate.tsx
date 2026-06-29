import { ParsedResume } from "@/types/resume";

export default function ExecutiveTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-10 bg-white text-zinc-800 font-serif max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col gap-6 border-t-8 border-indigo-950 select-text text-[11px] leading-relaxed">
      {/* Centered Premium Header */}
      <div className="text-center flex flex-col gap-1 border-b border-zinc-200 pb-4">
        <h1 className="text-3xl font-normal tracking-wide text-indigo-950 uppercase">{basics.name || "Your Name"}</h1>
        <p className="text-[11px] font-sans font-bold text-zinc-500 uppercase tracking-widest">{basics.label || "Professional Label"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-zinc-500 font-sans mt-2">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx} className="underline text-indigo-900">{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      {basics.summary && (
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Executive Profile</h2>
          <p className="text-justify leading-relaxed text-zinc-700 italic">"{basics.summary}"</p>
        </div>
      )}

      {work.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Professional Leadership Experience</h2>
          <div className="flex flex-col gap-4">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline font-sans text-xs">
                  <div>
                    <span className="font-bold text-indigo-950">{item.company}</span>
                    <span className="text-zinc-400"> — </span>
                    <span className="italic font-bold text-zinc-700">{item.position}</span>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400 font-bold">{item.startDate} – {item.endDate || "Present"}</span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-zinc-700 space-y-1">
                    {item.highlights.map((hl, hIdx) => (
                      <li key={hIdx} className="leading-relaxed">{hl}</li>
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
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Key Projects & Initiatives</h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center font-sans text-xs">
                  <span className="font-bold text-indigo-950">{proj.name}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[9px] font-mono text-zinc-500">[{proj.technologies.join(", ")}]</span>
                  )}
                </div>
                <p className="text-zinc-700 leading-normal text-justify">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 border-t border-zinc-200 pt-4">
        {education.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Education</h2>
            <div className="flex flex-col gap-2">
              {education.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-bold text-indigo-950">{item.institution}</span>
                  <span className="italic text-zinc-650">{item.studyType} in {item.area}</span>
                  <span className="text-[9px] font-mono text-zinc-400 mt-0.5">{item.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {skills.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Core Competencies</h2>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-2.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded font-semibold uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-indigo-950 border-b border-zinc-200 pb-0.5">Certifications</h2>
              <div className="flex flex-col gap-1 text-zinc-700 font-sans text-[10px]">
                {certifications.map((cert, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-zinc-800">{cert.name}</span>
                    <span className="text-zinc-500 font-mono"> — {cert.issuer} ({cert.date})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
