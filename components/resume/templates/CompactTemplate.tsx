import { ParsedResume } from "@/types/resume";

export default function CompactTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-6 bg-white text-zinc-900 font-sans max-w-[800px] mx-auto min-h-[1131px] shadow-sm flex flex-col gap-4 select-text text-[10px] leading-snug">
      {/* Dense Header */}
      <div className="flex justify-between items-center border-b border-zinc-300 pb-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-black text-zinc-900 leading-none uppercase">{basics.name || "Your Name"}</h1>
          <p className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest">{basics.label || "Professional Label"}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-[9px] text-zinc-500 font-mono">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx} className="underline">{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      {basics.summary && (
        <div className="flex flex-col gap-0.5">
          <p className="text-justify text-zinc-700 leading-normal">{basics.summary}</p>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Experience - Main Column */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {work.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.5">Work History</h2>
              <div className="flex flex-col gap-3">
                {work.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline font-bold text-[10px]">
                      <span>{item.position} <span className="font-normal text-zinc-500">at</span> {item.company}</span>
                      <span className="text-[8.5px] font-mono text-zinc-400 font-normal">{item.startDate} – {item.endDate || "Present"}</span>
                    </div>
                    {item.highlights && item.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-3.5 text-zinc-600 space-y-0.5 text-[9.5px]">
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
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.5">Projects</h2>
              <div className="flex flex-col gap-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center font-bold text-[10px]">
                      <span>{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-[8.5px] font-mono text-zinc-400 font-normal">[{proj.technologies.join(", ")}]</span>
                      )}
                    </div>
                    <p className="text-zinc-600 leading-normal text-[9.5px]">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Education, Skills, Certs - Sidebar Column */}
        <div className="md:col-span-4 flex flex-col gap-3.5">
          {skills.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.5">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.5">Education</h2>
              <div className="flex flex-col gap-2">
                {education.map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-bold text-zinc-800">{item.studyType} in {item.area}</span>
                    <span className="text-zinc-500 text-[9px]">{item.institution}</span>
                    <span className="text-[8.5px] font-mono text-zinc-400 mt-0.5">{item.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800 border-b border-zinc-200 pb-0.5">Certifications</h2>
              <div className="flex flex-col gap-1.5 text-zinc-650">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="font-bold text-zinc-850">{cert.name}</span>
                    <span className="text-[8.5px] text-zinc-450">{cert.issuer} ({cert.date})</span>
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
