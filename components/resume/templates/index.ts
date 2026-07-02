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
  "esl-teacher": "creative",
  "school-counselor": "elegant",

  // Government
  "public-policy": "corporate",
  "city-planner": "minimal",
  "environmental-officer": "executive",
  "federal-admin": "academic",
  "social-worker": "compact",
  "diplomat": "elegant",

  // Legal
  "corporate-counsel": "elegant",
  "litigation-attorney": "corporate",
  "compliance-specialist": "minimal",
  "legal-assistant": "compact",
  "judge-clerk": "academic",
  "arbitrator": "modern",

  // Technology
  "full-stack-dev": "tech",
  "devops-engineer": "tech",
  "ui-ux-designer": "modern",
  "data-scientist": "minimal",
  "product-manager": "executive",
  "cyber-security": "cyber",

  // Creative
  "art-director": "creative",
  "copywriter": "creative",
  "social-media": "creative",
  "content-producer": "modern",
  "fashion-designer": "elegant",
  "illustrator": "compact",

  // Executive
  "ops-director": "executive",
  "vp-product": "executive",
  "chief-staff": "elegant",
  "managing-director": "executive",
  "cfo": "corporate",
  "cio": "tech",

  // Healthcare
  "registered-nurse": "minimal",
  "clinical-coordinator": "academic",
  "physical-therapist": "corporate",
  "health-admin": "compact",
  "pharmacist": "elegant",
  "dentist": "modern",

  // Finance
  "banking-associate": "elegant",
  "wealth-consultant": "elegant",
  "management-consultant": "corporate",
  "tax-associate": "minimal",
  "risk-manager": "compact",
  "auditor": "academic",

  // Sales
  "account-executive": "modern",
  "brand-manager": "creative",
  "marketing-director": "executive",
  "sales-rep": "compact",
  "customer-success": "minimal",
  "business-dev": "elegant",

  // Hospitality
  "hotel-manager": "corporate",
  "restaurant-manager": "compact",
  "event-coordinator": "modern",
  "travel-agent": "minimal",
  "flight-attendant": "elegant",
  "sommelier": "creative"
};

export const RESUME_TEMPLATES: Record<string, React.ComponentType<{ data: ParsedResume; templateId?: string }>> = {
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
