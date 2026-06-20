import { create } from "zustand";
import { ParsedResume, AtsScoreResult } from "@/types/resume";

interface ResumeState {
  resumeId: string | null;
  parsedData: ParsedResume;
  atsAnalysis: AtsScoreResult | null;
  isSaving: boolean;
  lastSaved: string | null;
  
  // Actions
  setResumeId: (id: string) => void;
  setParsedData: (data: ParsedResume) => void;
  updateParsedData: (partialData: Partial<ParsedResume>) => void;
  setAtsAnalysis: (analysis: AtsScoreResult) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSaved: (date: string) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumeId: null,
  parsedData: {
    basics: { name: "", label: "", email: "", phone: "", summary: "" },
    work: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    socialLinks: [],
    templateId: "minimal"
  },
  atsAnalysis: null,
  isSaving: false,
  lastSaved: null,

  setResumeId: (id) => set({ resumeId: id }),
  setParsedData: (data) => set({ parsedData: data }),
  updateParsedData: (partialData) => 
    set((state) => ({ 
      parsedData: { ...state.parsedData, ...partialData } 
    })),
  setAtsAnalysis: (analysis) => set({ atsAnalysis: analysis }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (date) => set({ lastSaved: date })
}));
