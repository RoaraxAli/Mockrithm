import { ParsedResume } from "@/types/resume";
import { getFontClass } from "./fonts";

export default function ModernTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;
  const primaryColor = data.customStyles?.primaryColor || "#1e293b";
  const fontClass = getFontClass(data.customStyles?.fontFamily);
  const sizeClass = data.customStyles?.fontSize === "sm" ? "text-[10px]" : data.customStyles?.fontSize === "lg" ? "text-[13px]" : "text-[11px]";

  return (
    <div className={`flex max-w-[800px] mx-auto min-h-[1131px] shadow-sm overflow-hidden bg-white ${fontClass} ${sizeClass} leading-relaxed`}>
      {/* Left Sidebar */}
      <div className="w-[260px] shrink-0 p-6 flex flex-col items-center text-white" style={{ backgroundColor: primaryColor }}>
        {/* Photo */}
        <div className="w-24 h-24 rounded-xl bg-white/15 border-2 border-white/25 flex items-center justify-center mb-4 mt-2 overflow-hidden">
          <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
        </div>
        <h1 className="text-lg font-bold text-center tracking-tight">{basics.name || "Your Name"}</h1>
        <p className="text-[10px] text-white/60 mt-0.5 uppercase tracking-[0.15em]">{basics.label || "Professional Title"}</p>

        <div className="w-full mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Contact</h2>
            {basics.email && <p className="text-[10px] text-white/75">{basics.email}</p>}
            {basics.phone && <p className="text-[10px] text-white/75">{basics.phone}</p>}
            {socialLinks.map((link, idx) => (
              <p key={idx} className="text-[10px] text-white/75 break-all">{link.platform}: {link.url}</p>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Skills</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-white/85">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Education</h2>
              {education.map((item, idx) => (
                <div key={idx}>
                  <p className="text-[10px] font-semibold">{item.studyType} in {item.area}</p>
                  <p className="text-[9px] text-white/55">{item.institution} · {item.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 pt-7 flex flex-col gap-5 text-slate-800">
        {basics.summary && (
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">Profile</h2>
            <p className="text-slate-600 leading-relaxed text-justify">{basics.summary}</p>
          </div>
        )}

        {work.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">Experience</h2>
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-[12px]">{item.position}</span>
                    <span className="text-slate-500 text-[10px]">{item.company}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0">{item.startDate} – {item.endDate || "Present"}</span>
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
        )}

        {projects.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">Projects</h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  {proj.technologies && <span className="text-[9px] text-slate-400 font-mono">[{proj.technologies.join(", ")}]</span>}
                </div>
                <p className="text-slate-600">{proj.description}</p>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1">Certifications</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
              {certifications.map((cert, idx) => (
                <p key={idx}><span className="font-semibold text-slate-800">{cert.name}</span> <span className="text-slate-400">— {cert.issuer}, {cert.date}</span></p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
