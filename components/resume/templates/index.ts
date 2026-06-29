import MinimalTemplate from "./MinimalTemplate";
import CorporateTemplate from "./CorporateTemplate";
import CyberTemplate from "./CyberTemplate";
import ModernTemplate from "./ModernTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import AcademicTemplate from "./AcademicTemplate";
import ElegantTemplate from "./ElegantTemplate";
import TechTemplate from "./TechTemplate";
import CompactTemplate from "./CompactTemplate";
import { ParsedResume } from "@/types/resume";

export const RESUME_TEMPLATES: Record<string, React.ComponentType<{ data: ParsedResume }>> = {
  minimal: MinimalTemplate,
  corporate: CorporateTemplate,
  cyber: CyberTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  academic: AcademicTemplate,
  elegant: ElegantTemplate,
  tech: TechTemplate,
  compact: CompactTemplate
};

export function getTemplateComponent(templateId?: string) {
  const normalizedId = (templateId || "minimal").toLowerCase();
  return RESUME_TEMPLATES[normalizedId] || MinimalTemplate;
}
