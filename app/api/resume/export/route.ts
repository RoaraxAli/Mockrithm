import { NextRequest, NextResponse } from "next/server";
import { getResumeById } from "@/lib/actions/resume.action";
import puppeteer from "puppeteer";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getTemplateComponent } from "@/components/resume/templates";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";

function compileHtml(parsedData: any) {
  const basics = parsedData?.basics || {};
  const templateId = parsedData?.templateId || "minimal";
  const TemplateComponent = getTemplateComponent(templateId);

  const markup = renderToStaticMarkup(
    React.createElement(TemplateComponent, { data: parsedData, templateId })
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Resume - ${basics.name || "Export"}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700;800&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet">
        <style>
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
            color: black !important;
          }
        </style>
      </head>
      <body class="bg-white text-black min-h-screen">
        ${markup}
      </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { resumeId, userId, parsedData, format } = await req.json();

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

    let dataToCompile = parsedData;
    if (!dataToCompile) {
      const resume = await getResumeById(userId, resumeId);
      if (!resume) {
        return NextResponse.json({ error: "Resume not found" }, { status: 404 });
      }
      dataToCompile = resume.parsedData;
    }

    const htmlContent = compileHtml(dataToCompile);

    if (format === "html") {
      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // Launch headless browser with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

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

    const resumeName = dataToCompile?.basics?.name || "resume";

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resumeName}.pdf"`,
        "Content-Length": pdfBuffer.length.toString()
      }
    });

  } catch (error: any) {
    console.error("Puppeteer PDF Export Error:", error);
    return NextResponse.json({ error: "Failed to generate PDF: " + error.message }, { status: 500 });
  }
}
