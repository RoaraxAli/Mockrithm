export interface ParsedResume {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    summary: string;
  };
  work: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    studyType: string;
    area: string;
    endDate: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  templateId?: string; // which template is currently selected
}

export interface AtsScoreResult {
  atsScore: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  formattingQuality: string;
  skillRelevance: string;
}

export interface ResumeDocument {
  id?: string;
  userId: string;
  fileName: string;
  fileUrl?: string; // If stored in Firebase Storage
  rawText?: string;
  parsedData: ParsedResume;
  atsAnalysis?: AtsScoreResult;
  createdAt: string;
}
