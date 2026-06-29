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

export const TEMPLATE_MAPPING: Record<string, string> = {
  // Education
  "elementary-teacher": "compact",
  "high-school-teacher": "minimal",
  "college-professor": "academic",
  "special-education": "modern",
  // Government
  "public-policy": "corporate",
  "city-planner": "minimal",
  "environmental-officer": "executive",
  "federal-admin": "academic",
  // Legal
  "corporate-counsel": "elegant",
  "litigation-attorney": "corporate",
  "compliance-specialist": "minimal",
  "legal-assistant": "compact",
  // Technology
  "full-stack-dev": "tech",
  "devops-engineer": "tech",
  "ui-ux-designer": "modern",
  "data-scientist": "minimal",
  // Creative
  "art-director": "creative",
  "copywriter": "creative",
  "social-media": "creative",
  "content-producer": "modern",
  // Executive
  "ops-director": "executive",
  "vp-product": "executive",
  "chief-staff": "elegant",
  "managing-director": "executive",
  // Healthcare
  "registered-nurse": "minimal",
  "clinical-coordinator": "academic",
  "physical-therapist": "corporate",
  "health-admin": "compact",
  // Finance
  "banking-associate": "elegant",
  "wealth-consultant": "elegant",
  "management-consultant": "corporate",
  "tax-associate": "minimal",
  // Sales
  "account-executive": "modern",
  "brand-manager": "creative",
  "marketing-director": "executive",
  "sales-rep": "compact",
  // Hospitality
  "hotel-manager": "corporate",
  "customer-success": "minimal",
  "restaurant-manager": "compact",
  "event-coordinator": "modern",
};

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
  const baseId = TEMPLATE_MAPPING[normalizedId] || normalizedId;
  return RESUME_TEMPLATES[baseId] || MinimalTemplate;
}
