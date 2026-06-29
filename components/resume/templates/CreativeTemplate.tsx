import { ParsedResume } from "@/types/resume";

export default function CreativeTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="bg-white text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col overflow-hidden text-[11px] leading-relaxed select-text">
      {/* Colorful Header block */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 p-8 text-white flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{basics.name || "Your Name"}</h1>
        <p className="text-xs font-mono uppercase tracking-widest text-pink-200">{basics.label || "Professional Label"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-100 font-mono mt-2">
          {basics.email && <span>Email: {basics.email}</span>}
          {basics.phone && <span>Phone: {basics.phone}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx}>{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6">
        {basics.summary && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Profile Summary</h2>
            <p className="text-slate-600 text-justify">{basics.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="md:col-span-8 flex flex-col gap-5">
            {work.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Work History</h2>
                <div className="flex flex-col gap-4">
                  {work.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-800 text-[12px]">{item.position} at {item.company}</span>
                        <span className="text-[9px] font-mono text-slate-450">{item.startDate} – {item.endDate || "Present"}</span>
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
              <div className="flex flex-col gap-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Projects</h2>
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
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {skills.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-pink-50 border border-pink-100 rounded text-pink-700 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Education</h2>
                <div className="flex flex-col gap-3">
                  {education.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800">{item.studyType}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{item.area}</span>
                      <span className="text-[10px] text-slate-500">{item.institution}</span>
                      <span className="text-[9px] font-mono text-slate-400 mt-0.5">{item.endDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">Certifications</h2>
                <div className="flex flex-col gap-2 text-slate-600">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800">{cert.name}</span>
                      <span className="text-[9px] text-slate-400">{cert.issuer} ({cert.date})</span>
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
