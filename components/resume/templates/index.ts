import MinimalTemplate from "./MinimalTemplate";
import CorporateTemplate from "./CorporateTemplate";
import CyberTemplate from "./CyberTemplate";
import { ParsedResume } from "@/types/resume";

export const RESUME_TEMPLATES: Record<string, React.ComponentType<{ data: ParsedResume }>> = {
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  cyber: CyberTemplate,
  modern: MinimalTemplate, // fallback
  creative: CyberTemplate,  // fallback
  academic: CorporateTemplate // fallback
};

export function getTemplateComponent(templateId?: string) {
  const normalizedId = (templateId || "minimal").toLowerCase();
  return RESUME_TEMPLATES[normalizedId] || MinimalTemplate;
}
