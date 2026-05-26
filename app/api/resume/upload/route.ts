import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { getCurrentUser } from "@/lib/actions/auth.action";
const parsedResumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    label: z.string(),
    email: z.string(),
    phone: z.string(),
    summary: z.string(),
  }),
  work: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      highlights: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      studyType: z.string(),
      area: z.string(),
      endDate: z.string(),
    })
  ),
  skills: z.array(z.string()).default([]),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()).default([]),
      link: z.string().optional(),
    })
  ).default([]),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
    })
  ).default([]),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string(),
    })
  ).default([]),
});

export async function POST(request: Request) {
  try {
    const pdf = require("pdf-parse");
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 });
    }

    // 3. Extract text using pdf-parse
    const buffer = await file.arrayBuffer();
    const pdfData = await pdf(Buffer.from(buffer));
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF. It might be scanned or empty." },
        { status: 400 }
      );
    }

    // 4. Parse structured data using Gemini
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: parsedResumeSchema,
      prompt: `
        You are an expert AI Resume Parsing Engine specialized in Applicant Tracking Systems (ATS) and document data extraction.
        
        Your task is to accept raw, unformatted text extracted from an uploaded resume PDF and parse it into a strictly structured JSON format.
        
        Core Objectives:
        1. Extract all relevant professional information cleanly.
        2. Correct minor OCR/PDF extraction errors.
        3. Infer professional skills logically from the text.
        4. Normalize dates into YYYY-MM format or keep as "Present" if applicable.
        5. Never hallucinate missing data. Return empty strings/arrays if not found.
        
        RAW RESUME TEXT:
        ${extractedText}
      `,
    });

    // Return the extracted text and structured data
    return NextResponse.json({
      rawText: extractedText,
      parsedData: object,
      fileName: file.name
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error in resume upload API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
