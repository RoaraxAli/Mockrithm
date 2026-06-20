import { NextRequest, NextResponse } from "next/server";
import { getResumeById } from "@/lib/actions/resume.action";
import puppeteer from "puppeteer";
import { getCurrentUser } from "@/lib/actions/auth.action";

// Function to compile HTML depending on the template selected
function compileHtml(parsedData: any) {
  const { basics = {}, work = [], education = [], skills = [], projects = [], certifications = [], socialLinks = [] } = parsedData;
  const templateId = (parsedData.templateId || "minimal").toLowerCase();

  // Common Head with fonts and Tailwind CSS CDN
  const commonHead = `
    <head>
      <meta charset="UTF-8">
      <title>Resume - ${basics.name || "Export"}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet">
      <style>
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
    </head>
  `;

  if (templateId === "cyber") {
    // Cyberpunk themed dark HTML
    return `
      <!DOCTYPE html>
      <html>
        ${commonHead}
        <body class="bg-slate-950 text-slate-300 font-mono p-8 min-h-screen">
          <div class="max-w-4xl mx-auto border-2 border-cyan-500/30 p-8 relative rounded-lg">
            
            <!-- Header -->
            <div class="border-b border-cyan-500/20 pb-4 mb-6">
              <div class="flex justify-between items-start">
                <div>
                  <h1 class="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 uppercase">
                    ${basics.name || "INTEGRATED_IDENTITY"}
                  </h1>
                  <p class="text-xs font-bold text-cyan-400 uppercase mt-1 tracking-[0.2em]">${basics.label || "TITLE_REDACTED"}</p>
                </div>
                <div class="text-[9px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded">
                  STATUS: ACTIVE // LOGGED
                </div>
              </div>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 mt-4 font-bold">
                ${basics.email ? `<span>EMAIL: ${basics.email}</span>` : ""}
                ${basics.phone ? `<span>TEL: ${basics.phone}</span>` : ""}
                ${socialLinks.map((link: any) => `<span>${link.platform.toUpperCase()}: ${link.url}</span>`).join("")}
              </div>
            </div>

            <!-- Summary -->
            ${basics.summary ? `
              <div class="flex flex-col gap-1.5 mb-6">
                <h2 class="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span class="inline-block w-1.5 h-1.5 bg-cyan-400"></span> EXECUTION_SUMMARY
                </h2>
                <p class="text-xs text-slate-400 leading-relaxed text-justify bg-slate-900/50 p-3 rounded border border-slate-900">${basics.summary}</p>
              </div>
            ` : ""}

            <!-- Experience -->
            ${work.length > 0 ? `
              <div class="flex flex-col gap-3 mb-6">
                <h2 class="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span class="inline-block w-1.5 h-1.5 bg-cyan-400"></span> RECORDED_WORK_HISTORY
                </h2>
                <div class="flex flex-col gap-4">
                  ${work.map((item: any) => `
                    <div class="flex flex-col gap-1 border-l border-slate-800 pl-4 relative ml-1">
                      <div class="flex justify-between items-start text-xs font-bold">
                        <div>
                          <span class="text-white font-black">${item.position.toUpperCase()}</span>
                          <span class="text-cyan-400"> @ ${item.company.toUpperCase()}</span>
                        </div>
                        <span class="text-[9px] text-slate-500 font-bold shrink-0">
                          [${item.startDate.toUpperCase()} - ${item.endDate ? item.endDate.toUpperCase() : "PRESENT"}]
                        </span>
                      </div>
                      ${item.highlights && item.highlights.length > 0 ? `
                        <ul class="list-none text-[11px] text-slate-400 space-y-1 mt-1">
                          ${item.highlights.map((hl: string) => `
                            <li class="flex gap-2">
                              <span class="text-cyan-400 shrink-0">&gt;</span>
                              <span>${hl}</span>
                            </li>
                          `).join("")}
                        </ul>
                      ` : ""}
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Education -->
            ${education.length > 0 ? `
              <div class="flex flex-col gap-3 mb-6">
                <h2 class="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span class="inline-block w-1.5 h-1.5 bg-cyan-400"></span> EDUCATION_CREDENTIALS
                </h2>
                <div class="flex flex-col gap-3">
                  ${education.map((item: any) => `
                    <div class="flex justify-between items-start text-xs border border-slate-900 bg-slate-900/30 p-2.5 rounded">
                      <div>
                        <span class="font-black text-white">${item.studyType.toUpperCase()} IN ${item.area.toUpperCase()}</span>
                        <div class="text-[9px] text-slate-500 mt-0.5">${item.institution.toUpperCase()}</div>
                      </div>
                      <span class="text-[9px] font-bold text-cyan-400 shrink-0">[${item.endDate.toUpperCase()}]</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Skills -->
            ${skills.length > 0 ? `
              <div class="flex flex-col gap-3 mb-6">
                <h2 class="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span class="inline-block w-1.5 h-1.5 bg-cyan-400"></span> SKILL_CAPABILITIES
                </h2>
                <div class="flex flex-wrap gap-2">
                  ${skills.map((skill: string) => `
                    <span class="text-[9px] font-bold bg-slate-900 border border-slate-800 text-cyan-400 px-3 py-1 rounded">
                      // ${skill.toUpperCase()}
                    </span>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Projects -->
            ${projects.length > 0 ? `
              <div class="flex flex-col gap-3">
                <h2 class="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span class="inline-block w-1.5 h-1.5 bg-cyan-400"></span> REPLICATED_MODULES
                </h2>
                <div class="grid grid-cols-1 gap-3">
                  ${projects.map((proj: any) => `
                    <div class="border border-slate-900 bg-slate-900/20 p-3 rounded flex flex-col gap-1">
                      <div class="flex justify-between items-center text-xs font-bold">
                        <span class="text-white">${proj.name.toUpperCase()}</span>
                        ${proj.technologies && proj.technologies.length > 0 ? `
                          <span class="text-[8px] text-cyan-400/80">
                            [${proj.technologies.join(", ").toUpperCase()}]
                          </span>
                        ` : ""}
                      </div>
                      <p class="text-[11px] text-slate-400 leading-relaxed mt-1">${proj.description}</p>
                      ${proj.link ? `<span class="text-[8px] text-slate-600 mt-0.5">SRC_LINK: ${proj.link}</span>` : ""}
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}
            
          </div>
        </body>
      </html>
    `;
  }

  if (templateId === "corporate") {
    // Executive serif style
    return `
      <!DOCTYPE html>
      <html>
        ${commonHead}
        <body class="bg-white text-slate-900 font-serif p-8 min-h-screen">
          <div class="max-w-4xl mx-auto border-t-8 border-slate-900 pt-6">
            
            <!-- Header -->
            <div class="flex flex-col gap-2 mb-6">
              <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">${basics.name || "Your Name"}</h1>
              <div class="flex justify-between items-center border-b-2 border-slate-900 pb-2">
                <p class="text-[11px] font-sans font-bold text-slate-500 uppercase tracking-widest">${basics.label || "Professional Title"}</p>
                <div class="flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-[9px] text-slate-600 font-mono">
                  ${basics.email ? `<span>${basics.email}</span>` : ""}
                  ${basics.phone ? `<span>${basics.phone}</span>` : ""}
                  ${socialLinks.map((link: any) => `<span>${link.platform}: ${link.url}</span>`).join("")}
                </div>
              </div>
            </div>

            <!-- Summary -->
            ${basics.summary ? `
              <div class="flex flex-col gap-1 mb-6">
                <h2 class="text-xs font-sans font-bold uppercase tracking-wider text-slate-900">Professional Summary</h2>
                <p class="text-xs text-slate-700 leading-relaxed font-sans text-justify">${basics.summary}</p>
              </div>
            ` : ""}

            <!-- Experience -->
            ${work.length > 0 ? `
              <div class="flex flex-col gap-2 mb-6">
                <h2 class="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Professional Experience</h2>
                <div class="flex flex-col gap-3">
                  ${work.map((item: any) => `
                    <div class="flex flex-col gap-0.5">
                      <div class="flex justify-between items-baseline text-xs">
                        <div>
                          <span class="font-extrabold font-sans text-slate-900">${item.company}</span>
                          <span class="text-slate-500"> — </span>
                          <span class="font-bold text-slate-750">${item.position}</span>
                        </div>
                        <span class="text-[9px] font-mono text-slate-500 shrink-0">
                          ${item.startDate} – ${item.endDate || "Present"}
                        </span>
                      </div>
                      ${item.highlights && item.highlights.length > 0 ? `
                        <ul class="list-disc list-outside ml-4 text-[10px] text-slate-700 space-y-0.5 font-sans">
                          ${item.highlights.map((hl: string) => `<li>${hl}</li>`).join("")}
                        </ul>
                      ` : ""}
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Education -->
            ${education.length > 0 ? `
              <div class="flex flex-col gap-2 mb-6">
                <h2 class="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Education</h2>
                <div class="flex flex-col gap-2">
                  ${education.map((item: any) => `
                    <div class="flex justify-between items-baseline text-xs">
                      <div>
                        <span class="font-extrabold font-sans text-slate-900">${item.institution}</span>
                        <span class="text-slate-500"> — </span>
                        <span class="italic text-slate-700">${item.studyType} in ${item.area}</span>
                      </div>
                      <span class="text-[9px] font-mono text-slate-500 shrink-0">${item.endDate}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

            <!-- Skills -->
            ${skills.length > 0 ? `
              <div class="flex flex-col gap-2 mb-6">
                <h2 class="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Core Competencies</h2>
                <p class="text-[10px] text-slate-700 font-sans leading-relaxed">
                  ${skills.join(" • ")}
                </p>
              </div>
            ` : ""}

            <!-- Projects -->
            ${projects.length > 0 ? `
              <div class="flex flex-col gap-2">
                <h2 class="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">Key Projects</h2>
                <div class="flex flex-col gap-2">
                  ${projects.map((proj: any) => `
                    <div class="flex flex-col gap-0.5 text-xs font-sans">
                      <div class="flex justify-between items-center">
                        <span class="font-extrabold text-slate-900">
                          ${proj.name}
                          ${proj.link ? `<span class="text-[8px] text-slate-500 font-mono ml-1">(${proj.link})</span>` : ""}
                        </span>
                        ${proj.technologies && proj.technologies.length > 0 ? `
                          <span class="text-[8px] font-mono text-slate-500 shrink-0">
                            [${proj.technologies.join(", ")}]
                          </span>
                        ` : ""}
                      </div>
                      <p class="text-[10px] text-slate-750 leading-relaxed text-justify">${proj.description}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            ` : ""}

          </div>
        </body>
      </html>
    `;
  }

  // Fallback / Minimal template
  return `
    <!DOCTYPE html>
    <html>
      ${commonHead}
      <body class="bg-white text-slate-800 font-sans p-8 min-h-screen">
        <div class="max-w-4xl mx-auto flex flex-col gap-6">
          
          <!-- Header -->
          <div class="border-b border-slate-200 pb-4 text-center">
            <h1 class="text-3xl font-bold tracking-tight text-slate-900">${basics.name || "Your Name"}</h1>
            <p class="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">${basics.label || "Professional Title"}</p>
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-slate-500 mt-2 font-mono">
              ${basics.email ? `<span>${basics.email}</span>` : ""}
              ${basics.phone ? `<span>${basics.phone}</span>` : ""}
              ${socialLinks.map((link: any) => `<span>${link.platform}: ${link.url}</span>`).join("")}
            </div>
          </div>

          <!-- Summary -->
          ${basics.summary ? `
            <div class="flex flex-col gap-1.5">
              <h2 class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Summary</h2>
              <p class="text-xs text-slate-650 leading-relaxed text-justify">${basics.summary}</p>
            </div>
          ` : ""}

          <!-- Experience -->
          ${work.length > 0 ? `
            <div class="flex flex-col gap-2">
              <h2 class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Experience</h2>
              <div class="flex flex-col gap-4">
                ${work.map((item: any) => `
                  <div class="flex flex-col gap-1">
                    <div class="flex justify-between items-start text-xs">
                      <div>
                        <span class="font-bold text-slate-850">${item.position}</span>
                        <span class="text-slate-400 font-medium"> @ </span>
                        <span class="font-semibold text-slate-700">${item.company}</span>
                      </div>
                      <span class="text-[10px] font-mono text-slate-400 shrink-0">
                        ${item.startDate} – ${item.endDate || "Present"}
                      </span>
                    </div>
                    ${item.highlights && item.highlights.length > 0 ? `
                      <ul class="list-disc list-outside ml-4 text-[11px] text-slate-600 space-y-1 leading-relaxed">
                        ${item.highlights.map((hl: string) => `<li>${hl}</li>`).join("")}
                      </ul>
                    ` : ""}
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Education -->
          ${education.length > 0 ? `
            <div class="flex flex-col gap-2">
              <h2 class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Education</h2>
              <div class="flex flex-col gap-3">
                ${education.map((item: any) => `
                  <div class="flex justify-between items-start text-xs">
                    <div>
                      <span class="font-bold text-slate-850">${item.studyType} in ${item.area}</span>
                      <div class="text-[10px] text-slate-500 font-medium">${item.institution}</div>
                    </div>
                    <span class="text-[10px] font-mono text-slate-400 shrink-0">${item.endDate}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Skills -->
          ${skills.length > 0 ? `
            <div class="flex flex-col gap-2">
              <h2 class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Skills</h2>
              <div class="flex flex-wrap gap-2">
                ${skills.map((skill: string) => `
                  <span class="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium border border-slate-150">
                    ${skill}
                  </span>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Projects -->
          ${projects.length > 0 ? `
            <div class="flex flex-col gap-2">
              <h2 class="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">Projects</h2>
              <div class="flex flex-col gap-3">
                ${projects.map((proj: any) => `
                  <div class="flex flex-col gap-1 text-xs">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-slate-850">
                        ${proj.name}
                        ${proj.link ? `<span class="text-[9px] text-slate-400 font-mono ml-2">(${proj.link})</span>` : ""}
                      </span>
                      ${proj.technologies && proj.technologies.length > 0 ? `
                        <span class="text-[9px] font-mono text-slate-400 shrink-0">
                          ${proj.technologies.join(", ")}
                        </span>
                      ` : ""}
                    </div>
                    <p class="text-[11px] text-slate-650 leading-relaxed">${proj.description}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

        </div>
      </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { resumeId, userId } = await req.json();

    if (!resumeId || !userId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Tenant isolation violation." },
        { status: 403 }
      );
    }

    const resume = await getResumeById(userId, resumeId);
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const htmlContent = compileHtml(resume.parsedData);

    // Launch headless browser with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0.4in",
        bottom: "0.4in",
        left: "0.4in",
        right: "0.4in"
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.parsedData.basics.name || "resume"}.pdf"`,
        "Content-Length": pdfBuffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error("Puppeteer PDF Export Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF: " + error.message }, { status: 500 });
  }
}
