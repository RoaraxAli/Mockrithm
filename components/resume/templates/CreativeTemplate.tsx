import { ParsedResume } from "@/types/resume";

export default function CreativeTemplate({ data, templateId }: { data: ParsedResume; templateId?: string }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;
  const normId = (templateId || "").toLowerCase();

  let headerBg = "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white";
  let labelColor = "text-pink-200";
  let accentColor = "text-pink-600";
  let accentBorder = "border-pink-100";
  let badgeStyle = "bg-pink-50 border border-pink-100 text-pink-700";

  if (normId === "esl-teacher") {
    headerBg = "bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-900";
    labelColor = "text-teal-900 font-bold";
    accentColor = "text-teal-650";
    accentBorder = "border-teal-100";
    badgeStyle = "bg-teal-50 border border-teal-100 text-teal-700";
  } else if (normId === "art-director") {
    headerBg = "bg-zinc-950 border-b-4 border-rose-600 text-white";
    labelColor = "text-rose-500";
    accentColor = "text-rose-600";
    accentBorder = "border-rose-100";
    badgeStyle = "bg-rose-50 border border-rose-100 text-rose-700";
  } else if (normId === "copywriter") {
    headerBg = "bg-amber-100 text-stone-900 border-b border-stone-200";
    labelColor = "text-amber-800 font-bold";
    accentColor = "text-amber-800";
    accentBorder = "border-amber-200";
    badgeStyle = "bg-amber-50 border border-amber-200 text-amber-900";
  } else if (normId === "social-media") {
    headerBg = "bg-gradient-to-r from-purple-600 to-pink-500 text-white";
    labelColor = "text-purple-100";
    accentColor = "text-purple-650";
    accentBorder = "border-purple-100";
    badgeStyle = "bg-purple-50 border border-purple-100 text-purple-700";
  } else if (normId === "brand-manager") {
    headerBg = "bg-gradient-to-r from-indigo-700 to-blue-600 text-white";
    labelColor = "text-indigo-200";
    accentColor = "text-indigo-650";
    accentBorder = "border-indigo-100";
    badgeStyle = "bg-indigo-50 border border-indigo-100 text-indigo-700";
  } else if (normId === "sommelier") {
    headerBg = "bg-gradient-to-r from-red-950 to-red-900 text-white border-b-4 border-amber-500";
    labelColor = "text-amber-300";
    accentColor = "text-red-900";
    accentBorder = "border-red-100";
    badgeStyle = "bg-red-50 border border-red-150 text-red-900";
  }

  return (
    <div className="bg-white text-slate-800 font-sans max-w-[800px] mx-auto min-h-[1050px] shadow-sm flex flex-col overflow-hidden text-[11px] leading-relaxed select-text">
      {/* Colorful Header block */}
      <div className={`p-8 flex flex-col gap-2 ${headerBg}`}>
        <h1 className="text-3xl font-extrabold tracking-tight">{basics.name || "Your Name"}</h1>
        <p className={`text-xs font-mono uppercase tracking-widest ${labelColor}`}>{basics.label || "Professional Label"}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono mt-2 opacity-90">
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
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Profile Summary</h2>
            <p className="text-slate-650 text-justify">{basics.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="md:col-span-8 flex flex-col gap-5">
            {work.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Work History</h2>
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
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Projects</h2>
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
          </div>

          {/* Right Column */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {skills.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span key={idx} className={`text-[9px] font-mono px-2 py-0.5 rounded font-medium ${badgeStyle}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Education</h2>
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
                <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 ${accentColor} ${accentBorder}`}>Certifications</h2>
                <div className="flex flex-col gap-2 text-slate-650">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-850">{cert.name}</span>
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
