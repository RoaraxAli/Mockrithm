import { ParsedResume } from "@/types/resume";

export default function AcademicTemplate({ data }: { data: ParsedResume }) {
  const { basics, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = data;

  return (
    <div className="p-10 bg-white text-zinc-900 font-serif max-w-[800px] mx-auto min-h-[1131px] shadow-sm flex flex-col gap-6 select-text text-[11px] leading-relaxed">
      {/* Name and Title Centered */}
      <div className="text-center flex flex-col gap-1 border-b-2 border-zinc-900 pb-3">
        <h1 className="text-2xl font-bold tracking-tight uppercase text-zinc-950">{basics.name || "Your Name"}</h1>
        <p className="text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-widest">{basics.label || "Curriculum Vitae"}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[10px] text-zinc-650 font-mono mt-1.5">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location && <span>{basics.location}</span>}
          {basics.github && <span className="break-all">Github: {basics.github}</span>}
          {basics.linkedin && <span className="break-all">LinkedIn: {basics.linkedin}</span>}
          {basics.website && <span className="break-all">Website: {basics.website}</span>}
          {socialLinks.map((link, idx) => (
            <span key={idx}>{link.platform}: {link.url}</span>
          ))}
        </div>
      </div>

      {basics.summary && (
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Research Interests</h2>
          <p className="text-justify leading-relaxed text-zinc-800">{basics.summary}</p>
        </div>
      )}

      {education.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Education</h2>
          <div className="flex flex-col gap-3">
            {education.map((item, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-zinc-900">{item.studyType} in {item.area}</span>
                  <div className="text-zinc-600 font-medium">{item.institution}</div>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold shrink-0">{item.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {work.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Academic & Professional Appointments</h2>
          <div className="flex flex-col gap-4">
            {work.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-zinc-900">{item.position}</span>
                    <span className="text-zinc-400 font-medium"> @ </span>
                    <span className="font-semibold text-zinc-700">{item.company}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0 font-bold">
                    {item.startDate} – {item.endDate || "Present"}
                  </span>
                </div>
                {item.highlights && item.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-zinc-700 space-y-1">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Selected Publications & Projects</h2>
          <div className="flex flex-col gap-3">
            {projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-zinc-900">{proj.name}</span>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[9px] font-mono text-zinc-500">[{proj.technologies.join(", ")}]</span>
                  )}
                </div>
                <p className="text-zinc-750 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Technical & Academic Skills</h2>
          <p className="text-zinc-750 leading-relaxed font-mono">
            {skills.join("  •  ")}
          </p>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-955 border-b border-zinc-200 pb-0.5">Affiliations & Certifications</h2>
          <div className="flex flex-col gap-1.5 text-zinc-700">
            {certifications.map((cert, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-zinc-800">{cert.name}</span>
                  <span className="text-zinc-500 text-[10px]"> — {cert.issuer}</span>
                </div>
                <span className="text-zinc-450 font-mono font-bold shrink-0">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
