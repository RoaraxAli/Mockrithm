import { ParsedResume } from "@/types/resume";

export const SAMPLE_PROFILES: Record<string, ParsedResume> = {
  // === EDUCATION ===
  "elementary-teacher": {
    basics: {
      name: "Diana Klein",
      label: "Elementary School Teacher",
      email: "diana.klein@school.org",
      phone: "+1 (555) 016-5511",
      summary: "Passionate elementary educator with 7 years of classroom experience teaching early literacy, mathematics, and science."
    },
    work: [
      { company: "The Hill School", position: "Lead Kindergarten Teacher", startDate: "2018", endDate: "Present", highlights: ["Designed interactive science curriculum adopted across 4 district schools.", "Organized quarterly parent conferences to review children developmental scores."] }
    ],
    education: [{ institution: "Boston College", studyType: "B.Ed.", area: "Elementary Education", endDate: "2016" }],
    skills: ["Classroom Management", "Curriculum Design", "Early Literacy", "Child Psychology"],
    projects: [{ name: "Reading Circle Initiative", description: "Improved class average reading levels by 35% through parent collaboration.", technologies: ["Education"] }],
    certifications: [{ name: "State Educator License", issuer: "Board of Education", date: "2016" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/dianaklein" }]
  },
  "high-school-teacher": {
    basics: {
      name: "Sarah Jenkins",
      label: "High School History Teacher",
      email: "s.jenkins@academy.edu",
      phone: "+1 (555) 021-9988",
      summary: "Dedicated secondary educator specializing in European History and AP US History. Committed to building analytical writing and critical thinking skills."
    },
    work: [
      { company: "Oakridge High School", position: "AP History Teacher", startDate: "2019", endDate: "Present", highlights: ["Achieved a 92% pass rate on AP European History exams.", "Created an extracurricular debate club, leading teams to regional finals."] }
    ],
    education: [{ institution: "Vanderbilt University", studyType: "M.Ed.", area: "Secondary Education", endDate: "2018" }],
    skills: ["AP Curriculum", "Lecturing", "Essay Grading", "Debate Coaching"],
    projects: [{ name: "Digital History Archive", description: "Guided students in building a public history website archiving local veterans.", technologies: ["Classroom Tech"] }],
    certifications: [{ name: "Professional Teaching Certificate", issuer: "State Board", date: "2019" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/sarahjenkins" }]
  },
  "college-professor": {
    basics: {
      name: "Dr. Nancy Adams",
      label: "Professor of Biology",
      email: "n.adams@university.edu",
      phone: "+1 (555) 019-3382",
      summary: "Academic researcher specializing in genetics, DNA sequencing pathways, and biochemistry lab guidance."
    },
    work: [
      { company: "State University", position: "Associate Professor", startDate: "2019", endDate: "Present", highlights: ["Secured $500k research grant for genetic pathway modeling.", "Published 8 peer-reviewed articles in core biochemical journals."] }
    ],
    education: [{ institution: "UCLA", studyType: "Ph.D.", area: "Molecular Biology", endDate: "2016" }],
    skills: ["Genetics", "Grant Writing", "Bioinformatics", "Data Analysis", "Lecturing"],
    projects: [{ name: "Gene Map Pipeline", description: "Created open-source sequencing parser for research labs.", technologies: ["R", "Python"] }],
    certifications: [{ name: "Lab Safety Director Certification", issuer: "OSHA", date: "2021" }],
    socialLinks: [{ platform: "ResearchGate", url: "researchgate.net/profile/nancy_adams" }]
  },
  "special-education": {
    basics: {
      name: "Robert Vance",
      label: "Special Education Instructor",
      email: "r.vance@specialedu.org",
      phone: "+1 (555) 024-1133",
      summary: "Compassionate specialist tailoring individual education programs (IEPs) for children with learning disabilities and developmental delays."
    },
    work: [
      { company: "Lakeside Academy", position: "Special Ed Specialist", startDate: "2017", endDate: "Present", highlights: ["Maintained case files and IEP modifications for 18 students.", "Integrated assistive communication devices, improving classroom socialization."] }
    ],
    education: [{ institution: "Syracuse University", studyType: "B.Sc.", area: "Special Education", endDate: "2016" }],
    skills: ["IEP Drafting", "Behavioral Interventions", "Assistive Tech", "Parent Counseling"],
    projects: [{ name: "Sensory Room Design", description: "Designed school sensory room to help dysregulated students recover.", technologies: ["Sensory Aids"] }],
    certifications: [{ name: "Special Education Endorsement", issuer: "Board of Ed", date: "2016" }],
    socialLinks: []
  },
  "esl-teacher": {
    basics: {
      name: "Emily Stone",
      label: "ESL Instructor",
      email: "e.stone@globalenglish.org",
      phone: "+1 (555) 032-4411",
      summary: "Experienced English as a Second Language teacher. Specialized in adult literacy, conversational fluency, and business English instruction."
    },
    work: [
      { company: "Language First Academy", position: "Lead ESL Instructor", startDate: "2020", endDate: "Present", highlights: ["Developed curriculum for 120 adult immigrants from diverse backgrounds.", "Implemented digital interactive games to boost vocabulary retention."] }
    ],
    education: [{ institution: "Indiana University", studyType: "B.A.", area: "Applied Linguistics", endDate: "2019" }],
    skills: ["Language Immersion", "Adult Literacy", "Accent Modification", "Lesson Planning"],
    projects: [{ name: "Culture Swap Meetups", description: "Organized monthly community language exchange meetups.", technologies: ["Events"] }],
    certifications: [{ name: "TESOL Certificate", issuer: "TESOL Org", date: "2019" }],
    socialLinks: []
  },
  "school-counselor": {
    basics: {
      name: "Marcus Sterling",
      label: "School Guidance Counselor",
      email: "m.sterling@schools.gov",
      phone: "+1 (555) 035-7799",
      summary: "Licensed counselor advising high school students on academic paths, college admissions, and crisis management."
    },
    work: [
      { company: "Central High School", position: "Guidance Counselor", startDate: "2021", endDate: "Present", highlights: ["Coordinated college prep seminars, boosting admissions by 18%.", "Led group therapy circles for children dealing with family transitions."] }
    ],
    education: [{ institution: "Rutgers University", studyType: "M.S.", area: "School Counseling", endDate: "2020" }],
    skills: ["Academic Advising", "Crisis Intervention", "College Prep", "Group Therapy"],
    projects: [{ name: "FAFSA Prep Drive", description: "Helped low-income families complete college financial aid apps.", technologies: ["Financial Aid"] }],
    certifications: [{ name: "Licensed Professional Counselor", issuer: "State Board", date: "2021" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/msterling" }]
  },

  // === GOVERNMENT ===
  "public-policy": {
    basics: {
      name: "Maria Lopez",
      label: "Public Policy Analyst",
      email: "maria.lopez@policy.org",
      phone: "+1 (555) 012-7729",
      summary: "Analytical government professional specializing in economic research, policy drafting, and demographic statistics."
    },
    work: [
      { company: "Civic Research Institute", position: "Senior Analyst", startDate: "2020", endDate: "Present", highlights: ["Analyzed municipal housing data, drafting guidelines presented to City Council.", "Coordinated economic impact reports regarding green energy initiatives."] }
    ],
    education: [{ institution: "Georgetown University", studyType: "M.P.P.", area: "Public Policy", endDate: "2019" }],
    skills: ["Data Analysis", "Policy Drafting", "GIS Mapping", "Public Relations"],
    projects: [{ name: "Transit Corridor Study", description: "Conducted public survey regarding new metro corridor layouts.", technologies: ["R", "GIS"] }],
    certifications: [{ name: "Certified Public Analyst", issuer: "Policy Board", date: "2020" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/marialopez" }]
  },
  "city-planner": {
    basics: {
      name: "Ethan Hunt",
      label: "Urban Planner",
      email: "e.hunt@cityplanning.gov",
      phone: "+1 (555) 041-8844",
      summary: "Urban planner focused on zoning compliance, sustainable transportation corridors, and neighborhood revitalization."
    },
    work: [
      { company: "Metro City Zoning Board", position: "Associate Planner", startDate: "2021", endDate: "Present", highlights: ["Reviewed 80+ zoning applications for commercial and mixed-use expansions.", "Designed bike lane master plans, reducing traffic congestion points."] }
    ],
    education: [{ institution: "University of Washington", studyType: "B.S.", area: "Urban Planning", endDate: "2020" }],
    skills: ["Zoning Laws", "CAD Drafting", "Public Hearings", "Transit Planning"],
    projects: [{ name: "Green Space Revitalize", description: "Converted 3 abandoned parking lots into community gardens.", technologies: ["CAD", "GIS"] }],
    certifications: [{ name: "AICP Certification", issuer: "Planning Association", date: "2022" }],
    socialLinks: []
  },
  "environmental-officer": {
    basics: {
      name: "Clara Oswald",
      label: "Environmental Compliance Officer",
      email: "c.oswald@epa.gov",
      phone: "+1 (555) 044-1155",
      summary: "Environmental officer implementing air and water pollution checks, industrial site audits, and conservation initiatives."
    },
    work: [
      { company: "State Environmental Agency", position: "Lead Inspector", startDate: "2018", endDate: "Present", highlights: ["Conducted 150+ chemical safety inspections at industrial locations.", "Managed water quality restoration projects along regional river basins."] }
    ],
    education: [{ institution: "Oregon State University", studyType: "B.Sc.", area: "Environmental Science", endDate: "2017" }],
    skills: ["EPA Audits", "Water Sampling", "Chemical Safety", "Report Writing"],
    projects: [{ name: "Forest Canopy Audit", description: "Mapped regional forest decay metrics using satellite data.", technologies: ["GIS", "Python"] }],
    certifications: [{ name: "OSHA HAZWOPER Certification", issuer: "OSHA", date: "2018" }],
    socialLinks: []
  },
  "federal-admin": {
    basics: {
      name: "George Henderson",
      label: "Federal Program Administrator",
      email: "g.henderson@hhs.gov",
      phone: "+1 (555) 047-3399",
      summary: "Experienced federal administrator supervising program budget allocation, auditing compliance, and public grant operations."
    },
    work: [
      { company: "Dept of Health & Human Services", position: "Program Director", startDate: "2015", endDate: "Present", highlights: ["Supervised $12M federal funding disbursement for regional health clinics.", "Maintained 100% audit accuracy across all project reporting guidelines."] }
    ],
    education: [{ institution: "George Washington University", studyType: "M.P.A.", area: "Public Administration", endDate: "2014" }],
    skills: ["Budget Allocation", "Federal Audits", "Grant Writing", "Staff Management"],
    projects: [{ name: "Clinic Fund Audit", description: "Restructured regional health database to verify fund distribution.", technologies: ["SQL", "ERP"] }],
    certifications: [{ name: "Project Management Professional (PMP)", issuer: "PMI", date: "2017" }],
    socialLinks: []
  },
  "social-worker": {
    basics: {
      name: "Linda Belcher",
      label: "Social Services Coordinator",
      email: "l.belcher@socialcare.gov",
      phone: "+1 (555) 051-6677",
      summary: "Licensed social worker dedicated to family advocacy, child protective services, and community housing operations."
    },
    work: [
      { company: "County Family Services", position: "Lead Caseworker", startDate: "2019", endDate: "Present", highlights: ["Managed active casework files for 35 vulnerable families.", "Coordinated emergency shelter placements for families fleeing domestic crises."] }
    ],
    education: [{ institution: "Boston University", studyType: "M.S.W.", area: "Social Work", endDate: "2018" }],
    skills: ["Family Counseling", "Crisis Management", "Advocacy", "Court Testifying"],
    projects: [{ name: "Youth Shelter Outreach", description: "Established partnership with local clinics to provide mental health aids.", technologies: ["Care Networks"] }],
    certifications: [{ name: "Licensed Clinical Social Worker (LCSW)", issuer: "State Board", date: "2019" }],
    socialLinks: []
  },
  "diplomat": {
    basics: {
      name: "Sir Arthur Wellesley",
      label: "Foreign Relations Advisor",
      email: "arthur.w@state.gov",
      phone: "+1 (555) 054-9900",
      summary: "Diplomatic advisor specializing in treaty negotiations, bilateral trade discussions, and international policy analysis."
    },
    work: [
      { company: "Department of State", position: "Consular Relations Specialist", startDate: "2016", endDate: "Present", highlights: ["Assisted in drafting bilateral commerce protocols with European trade partners.", "Coordinated security logistics for 14 high-profile embassy summits."] }
    ],
    education: [{ institution: "Oxford University", studyType: "M.A.", area: "International Relations", endDate: "2015" }],
    skills: ["Treaty Drafting", "Trade Policy", "Bilingual Negotiation", "Crisis Protocol"],
    projects: [{ name: "Embassy Security Redesign", description: "Audited secure communications across 6 consular offices.", technologies: ["Secured Nets"] }],
    certifications: [{ name: "Foreign Service Officer Certification", issuer: "State Dept", date: "2016" }],
    socialLinks: []
  },

  // === LEGAL ===
  "corporate-counsel": {
    basics: {
      name: "Victoria Sterling",
      label: "Corporate Legal Counsel",
      email: "v.sterling@legalcorp.com",
      phone: "+1 (555) 012-4422",
      summary: "Corporate attorney advising businesses on mergers, acquisitions, regulatory governance, and commercial agreements."
    },
    work: [
      { company: "Sterling Associates", position: "Senior Counsel", startDate: "2018", endDate: "Present", highlights: ["Drafted 80+ international commercial contracts, reducing liability by 15%.", "Oversaw legal audit of $40M tech company acquisition."] }
    ],
    education: [{ institution: "Penn State Law", studyType: "J.D.", area: "Corporate Law", endDate: "2015" }],
    skills: ["Contract Drafting", "M&A Advisory", "Zoning Compliance", "IP Licensing"],
    projects: [{ name: "Regulatory Compliance Audit", description: "Aligned internal data practices with GDPR standards.", technologies: ["Compliance"] }],
    certifications: [{ name: "State Bar Association License", issuer: "State Supreme Court", date: "2015" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/vsterling" }]
  },
  "litigation-attorney": {
    basics: {
      name: "Harvey Specter",
      label: "Litigation Attorney",
      email: "harvey@specterlaw.com",
      phone: "+1 (555) 061-7711",
      summary: "Litigation lawyer specializing in high-stakes commercial disputes, civil trial practice, and appellate litigation."
    },
    work: [
      { company: "Specter Law Firm", position: "Managing Partner", startDate: "2014", endDate: "Present", highlights: ["Won 14 multi-million dollar jury verdicts in federal courts.", "Secured favorable appellate ruling regarding antitrust claims."] }
    ],
    education: [{ institution: "Harvard Law School", studyType: "J.D.", area: "Law", endDate: "2012" }],
    skills: ["Jury Trials", "Deposition", "Appellate Briefs", "Antitrust Law"],
    projects: [{ name: "Federal Class Action", description: "Lead counsel for class action lawsuit on data breaches.", technologies: ["Litigation"] }],
    certifications: [{ name: "State Bar License", issuer: "State Court", date: "2012" }],
    socialLinks: []
  },
  "compliance-specialist": {
    basics: {
      name: "Rachel Zane",
      label: "Compliance Specialist",
      email: "rachel@compliance.com",
      phone: "+1 (555) 064-2233",
      summary: "Specialist managing anti-money laundering (AML) controls, regulatory filings, and corporate governance audits."
    },
    work: [
      { company: "Capital Compliance Group", position: "Lead Officer", startDate: "2019", endDate: "Present", highlights: ["Designed AML compliance training adopted by 800+ banking employees.", "Liaised with SEC during regulatory review audits, maintaining zero violations."] }
    ],
    education: [{ institution: "NYU School of Law", studyType: "J.D.", area: "Corporate Governance", endDate: "2018" }],
    skills: ["AML Controls", "SEC Filings", "Corporate Audits", "Risk Mitigation"],
    projects: [{ name: "GDPR Alignment Drive", description: "Restructured corporate file archiving to secure user privacy.", technologies: ["Audit Systems"] }],
    certifications: [{ name: "Certified Compliance Professional", issuer: "Compliance Board", date: "2019" }],
    socialLinks: []
  },
  "legal-assistant": {
    basics: {
      name: "Mike Ross",
      label: "Paralegal Assistant",
      email: "mike@specterlaw.com",
      phone: "+1 (555) 067-5544",
      summary: "Detailed paralegal performing trial research, brief drafting, docket filing, and deposition summaries."
    },
    work: [
      { company: "Specter Law Firm", position: "Lead Paralegal", startDate: "2020", endDate: "Present", highlights: ["Researched and drafted briefs for 30+ federal cases.", "Managed electronic discovery databases, indexing 15,000+ files."] }
    ],
    education: [{ institution: "Columbia University", studyType: "B.A.", area: "Legal Studies", endDate: "2019" }],
    skills: ["Legal Research", "LexisNexis", "Brief Drafting", "Docket Management"],
    projects: [{ name: "Electronic Discovery Sync", description: "Restructured discovery database, saving attorneys 80 hours per case.", technologies: ["E-Discovery"] }],
    certifications: [{ name: "Certified Paralegal (CP)", issuer: "NALA", date: "2020" }],
    socialLinks: []
  },
  "judge-clerk": {
    basics: {
      name: "Clara Barton",
      label: "Judicial Law Clerk",
      email: "c.barton@courts.gov",
      phone: "+1 (555) 071-8899",
      summary: "Law clerk drafting judicial opinions, reviewing trial records, and conducting appellate case research."
    },
    work: [
      { company: "Federal District Court", position: "Judicial Clerk", startDate: "2021", endDate: "Present", highlights: ["Drafted 14 memo opinions regarding summary judgment motions.", "Researched evidentiary rules during civil jury trial operations."] }
    ],
    education: [{ institution: "Yale Law School", studyType: "J.D.", area: "Law", endDate: "2020" }],
    skills: ["Opinion Drafting", "Trial Records", "Evidentiary Rules", "Legal Writing"],
    projects: [{ name: "Habeas Corpus Review", description: "Audited 40 prisoner appeals to summarize claim validity.", technologies: ["Research"] }],
    certifications: [{ name: "State Bar Admittance", issuer: "Bar", date: "2020" }],
    socialLinks: []
  },
  "arbitrator": {
    basics: {
      name: "Raymond Holt",
      label: "Conflict Resolution Specialist",
      email: "r.holt@mediation.org",
      phone: "+1 (555) 074-9988",
      summary: "Certified arbitrator mediating commercial disputes, labor relations conflicts, and family settlements."
    },
    work: [
      { company: "National Arbitration Association", position: "Senior Arbitrator", startDate: "2015", endDate: "Present", highlights: ["Mediated and settled 120+ labor disputes, preventing strikes.", "Drafted legally binding arbitration awards for commercial contracting partners."] }
    ],
    education: [{ institution: "Columbia Law School", studyType: "J.D.", area: "Alternative Dispute Resolution", endDate: "2013" }],
    skills: ["Mediation", "Conflict De-escalation", "Labor Relations", "Award Drafting"],
    projects: [{ name: "Union Pact Arbitrage", description: "Mediated disputes between transit union and regional cities.", technologies: ["Mediation"] }],
    certifications: [{ name: "Certified Arbitrator", issuer: "Arbitration Board", date: "2014" }],
    socialLinks: []
  },

  // === TECHNOLOGY ===
  "full-stack-dev": {
    basics: {
      name: "Samir Patel",
      label: "Full-Stack Developer",
      email: "samir.patel@tech.io",
      phone: "+1 (555) 015-8839",
      summary: "Full-stack developer building performant web applications with React, Next.js, Node.js, and cloud architectures."
    },
    work: [
      { company: "Neon Labs", position: "Lead Full-Stack Engineer", startDate: "2022", endDate: "Present", highlights: ["Built secure API services in Node.js serving 500k monthly active users.", "Refactored React state management, reducing render lag by 45%."] }
    ],
    education: [{ institution: "MIT", studyType: "B.Tech", area: "Computer Engineering", endDate: "2020" }],
    skills: ["React", "Next.js", "Node.js", "GraphQL", "PostgreSQL"],
    projects: [{ name: "Real-time Chat Portal", description: "Created low-latency WebSocket chat application.", technologies: ["Next.js", "WebSockets"] }],
    certifications: [{ name: "AWS Developer Associate", issuer: "Amazon", date: "2021" }],
    socialLinks: [{ platform: "GitHub", url: "github.com/samirp" }]
  },
  "devops-engineer": {
    basics: {
      name: "Marcus Chen",
      label: "DevOps Engineer",
      email: "marcus.chen@tech.io",
      phone: "+1 (555) 014-9988",
      summary: "Infrastructure engineer specialized in Kubernetes orchestration, CI/CD automation, and cloud cost reduction."
    },
    work: [
      { company: "CloudScale Inc", position: "Senior DevOps Engineer", startDate: "2021", endDate: "Present", highlights: ["Automated cloud resource provisioning using Terraform, saving 30% on AWS costs.", "Migrated legacy monolith to Docker containers orchestrated by Kubernetes."] }
    ],
    education: [{ institution: "University of Washington", studyType: "B.S.", area: "Informatics", endDate: "2019" }],
    skills: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "AWS"],
    projects: [{ name: "GitOps Infrastructure", description: "Automated continuous delivery deployments using ArgoCD.", technologies: ["Kubernetes", "ArgoCD"] }],
    certifications: [{ name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2022" }],
    socialLinks: [{ platform: "GitHub", url: "github.com/marcusdevops" }]
  },
  "ui-ux-designer": {
    basics: {
      name: "Lena Chen",
      label: "Creative Designer",
      email: "lena.chen@email.com",
      phone: "+1 (555) 011-9230",
      summary: "UX/UI designer crafting elegant digital experiences and distinct corporate branding guidelines."
    },
    work: [
      { company: "CreativeWorks", position: "Senior Designer", startDate: "2021", endDate: "Present", highlights: ["Rebranded consumer web app, boosting conversion rates by 22%.", "Designed responsive layout templates used by 10k+ clients."] }
    ],
    education: [{ institution: "Art Institute", studyType: "B.A.", area: "Visual Communication", endDate: "2018" }],
    skills: ["Figma", "Adobe CC", "UI/UX", "Brand Strategy", "Illustration"],
    projects: [{ name: "Design System Build", description: "Created UI kit in Figma to speed up developer handoffs.", technologies: ["Figma"] }],
    certifications: [{ name: "UX Design Certificate", issuer: "Google", date: "2020" }],
    socialLinks: [{ platform: "Dribbble", url: "dribbble.com/lenachen" }]
  },
  "data-scientist": {
    basics: {
      name: "Dr. Alex Johnson",
      label: "Data Science Lead",
      email: "alex.j@datatech.com",
      phone: "+1 (555) 019-2834",
      summary: "Data scientist applying machine learning algorithms to user analytics, forecasting, and retention modeling."
    },
    work: [
      { company: "DataTech Labs", position: "Lead Data Scientist", startDate: "2020", endDate: "Present", highlights: ["Designed user churn prediction models, improving retention by 14%.", "Established SQL reporting warehouses used by 8 regional executives."] }
    ],
    education: [{ institution: "State University", studyType: "Ph.D.", area: "Computer Science", endDate: "2018" }],
    skills: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau"],
    projects: [{ name: "Ad Campaign ROI Model", description: "Automated analysis of online advertisement campaign efficiency.", technologies: ["Python", "SQL"] }],
    certifications: [{ name: "AWS Machine Learning Specialty", issuer: "Amazon", date: "2021" }],
    socialLinks: [{ platform: "GitHub", url: "github.com/alexj" }]
  },
  "product-manager": {
    basics: {
      name: "Kenji Sato",
      label: "Technical Product Manager",
      email: "kenji@techcorp.com",
      phone: "+1 (555) 081-3344",
      summary: "Product manager aligning developer roadmaps, gathering user stories, and launching cloud products."
    },
    work: [
      { company: "TechCorp Labs", position: "Product Manager", startDate: "2021", endDate: "Present", highlights: ["Launched mobile application, gaining 100k downloads in 3 months.", "Conducted 40 user interviews to prioritize Q4 roadmap planning."] }
    ],
    education: [{ institution: "Stanford University", studyType: "B.Sc.", area: "Computer Science", endDate: "2019" }],
    skills: ["Roadmapping", "Jira", "A/B Testing", "Agile", "SQL"],
    projects: [{ name: "API Subscription Launch", description: "Managed release of subscription-based developer APIs.", technologies: ["Product"] }],
    certifications: [{ name: "Certified Scrum Product Owner", issuer: "Scrum Alliance", date: "2021" }],
    socialLinks: []
  },
  "cyber-security": {
    basics: {
      name: "Trinity Vane",
      label: "PenTester & Security Analyst",
      email: "trinity@matrix.io",
      phone: "+1 (555) 084-6677",
      summary: "Certified hacker conducting vulnerability audits, network penetration checks, and secure code reviews."
    },
    work: [
      { company: "Oracle Security Group", position: "Lead PenTester", startDate: "2020", endDate: "Present", highlights: ["Identified and resolved 40 high-threat vulnerabilities in banking apps.", "Conducted simulated phishing campaigns to train 1,200 company staff."] }
    ],
    education: [{ institution: "UC Berkeley", studyType: "B.S.", area: "EECS", endDate: "2019" }],
    skills: ["Kali Linux", "Metasploit", "Penetration Testing", "Burp Suite", "OWASP"],
    projects: [{ name: "Auth Security Patch", description: "Identhed session hijacking vulnerability in corporate SSO.", technologies: ["SSO", "Burp"] }],
    certifications: [{ name: "OSCP Certification", issuer: "Offensive Security", date: "2021" }],
    socialLinks: [{ platform: "GitHub", url: "github.com/trinitysec" }]
  },

  // === CREATIVE ===
  "art-director": {
    basics: {
      name: "Jenna Ruiz",
      label: "Creative Art Director",
      email: "jenna@agencyspark.com",
      phone: "+1 (555) 013-6450",
      summary: "Creative director managing designer teams, outlining brand assets, and launching video advertisements."
    },
    work: [
      { company: "MediaSpark Agency", position: "Art Director", startDate: "2019", endDate: "Present", highlights: ["Directed 15 visual campaigns for global fashion brands.", "Managed visual assets for campaigns yielding 10M+ online impressions."] }
    ],
    education: [{ institution: "Columbia School of Arts", studyType: "B.F.A.", area: "Design", endDate: "2016" }],
    skills: ["Art Direction", "Figma", "Adobe InDesign", "Video Campaigns"],
    projects: [{ name: "Interactive Billboard Campaign", description: "Designed digital dynamic billboard layouts in NY Times Square.", technologies: ["Adobe CC"] }],
    certifications: [{ name: "Design Leadership certification", issuer: "AIGA", date: "2021" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/jennaruiz" }]
  },
  "copywriter": {
    basics: {
      name: "Peter Parker",
      label: "Brand Copywriter",
      email: "peter@dailypugle.com",
      phone: "+1 (555) 091-2233",
      summary: "Creative copywriter drafting marketing taglines, website copy, and newsletter campaigns."
    },
    work: [
      { company: "AdVentures Agency", position: "Senior Copywriter", startDate: "2020", endDate: "Present", highlights: ["Drafted copy for landing pages, boosting email signups by 24%.", "Created script catalogs for 12 television commercial segments."] }
    ],
    education: [{ institution: "NYU", studyType: "B.A.", area: "English Literature", endDate: "2018" }],
    skills: ["Copywriting", "SEO Copy", "Script Writing", "Content Strategy"],
    projects: [{ name: "SaaS Launch Copy", description: "Wrote core features and pricing descriptions for new cloud platform.", technologies: ["Copy"] }],
    certifications: [{ name: "SEO Expert", issuer: "HubSpot", date: "2019" }],
    socialLinks: []
  },
  "social-media": {
    basics: {
      name: "Chloe Fraser",
      label: "Social Media Strategist",
      email: "chloe@mediaspark.com",
      phone: "+1 (555) 094-5566",
      summary: "Strategist building social audience engagement on Instagram, TikTok, and YouTube."
    },
    work: [
      { company: "SocialSpark Group", position: "Lead Strategist", startDate: "2021", endDate: "Present", highlights: ["Grew brand TikTok channel from 10k to 300k followers.", "Analyzed weekly engagement metrics, improving user clicks by 18%."] }
    ],
    education: [{ institution: "University of Southern California", studyType: "B.A.", area: "Public Relations", endDate: "2020" }],
    skills: ["TikTok Algorithm", "Analytics", "CapCut", "Community Growth"],
    projects: [{ name: "Black Friday Campaign", description: "Executed social campaigns yielding $1.2M in direct e-commerce sales.", technologies: ["Ad Manager"] }],
    certifications: [{ name: "Meta Certified Media Buyer", issuer: "Meta", date: "2021" }],
    socialLinks: []
  },
  "content-producer": {
    basics: {
      name: "Nathan Drake",
      label: "Video Producer",
      email: "nathan@unmapped.media",
      phone: "+1 (555) 097-8899",
      summary: "Multimedia producer directing video shoots, editing footage, and coordinating sound designs."
    },
    work: [
      { company: "Unmapped Media", position: "Content Director", startDate: "2018", endDate: "Present", highlights: ["Produced 80+ promotional video clips for tech product channels.", "Supervised audio design and editing workflow pipelines in Premiere."] }
    ],
    education: [{ institution: "UCLA Film School", studyType: "B.A.", area: "Film & Television", endDate: "2017" }],
    skills: ["Video Editing", "Premiere Pro", "Audio Design", "Color Grading"],
    projects: [{ name: "Indie Documentary Edit", description: "Lead editor for award-winning film on urban exploration.", technologies: ["Premiere", "Resolve"] }],
    certifications: [{ name: "Avid Certified Professional", issuer: "Avid", date: "2018" }],
    socialLinks: []
  },
  "fashion-designer": {
    basics: {
      name: "Christian Dior",
      label: "Apparel Designer",
      email: "c.dior@couture.com",
      phone: "+1 (555) 101-1122",
      summary: "Fashion designer specialized in apparel sketch design, fabric sourcing, and runway lines coordination."
    },
    work: [
      { company: "Parisian Style House", position: "Lead Designer", startDate: "2017", endDate: "Present", highlights: ["Designed autumn prêt-à-porter collection featured in Milan fashion week.", "Sourced eco-friendly organic textiles, cutting costs by 12%."] }
    ],
    education: [{ institution: "Parsons School of Design", studyType: "B.F.A.", area: "Fashion Design", endDate: "2016" }],
    skills: ["Sketching", "Pattern Making", "Fabric Sourcing", "CAD Fashion"],
    projects: [{ name: "Zero Waste Capsule", description: "Created 10-piece line generating zero fabric scraps during layout.", technologies: ["CAD"] }],
    certifications: [{ name: "Textile Engineering Diploma", issuer: "Design Institute", date: "2016" }],
    socialLinks: []
  },
  "illustrator": {
    basics: {
      name: "Miyazaki Hayao",
      label: "Concept Illustrator",
      email: "hayao@ghibli.jp",
      phone: "+1 (555) 104-3344",
      summary: "Concept artist creating digital character art, background paintings, and storyboarding for animation."
    },
    work: [
      { company: "Studio Ghibli", position: "Lead Storyboard Artist", startDate: "2012", endDate: "Present", highlights: ["Drafted 1,500+ character frames for core theatrical releases.", "Created digital environment concept guides adopted by 3D modelers."] }
    ],
    education: [{ institution: "Tokyo University of the Arts", studyType: "B.F.A.", area: "Illustration", endDate: "2011" }],
    skills: ["Digital Painting", "Storyboarding", "Character Design", "Photoshop"],
    projects: [{ name: "Forest Spirit Concepts", description: "Created environmental layouts for next animation release.", technologies: ["Photoshop"] }],
    certifications: [],
    socialLinks: [{ platform: "Behance", url: "behance.net/hayao" }]
  },

  // === EXECUTIVE ===
  "ops-director": {
    basics: {
      name: "Arthur Pendelton",
      label: "Director of Operations",
      email: "arthur.p@industrial.com",
      phone: "+1 (555) 017-9092",
      summary: "Director of operations coordinating regional supply chain layouts, budgets, and warehouse scaling."
    },
    work: [
      { company: "Apex Industrial Group", position: "Director of Operations", startDate: "2020", endDate: "Present", highlights: ["Oversaw 3 regional logistics hubs, saving $2M in delivery costs.", "Implemented ERP warehouse frameworks, increasing packing speed by 35%."] }
    ],
    education: [{ institution: "Stanford School of Business", studyType: "M.S.", area: "Management", endDate: "2012" }],
    skills: ["Operations", "Supply Chain", "Budgeting", "Lean Six Sigma", "ERP Systems"],
    projects: [{ name: "Hub Consolidation", description: "Coordinated merger of two distribution hubs in Houston.", technologies: ["Six Sigma", "ERP"] }],
    certifications: [{ name: "Six Sigma Black Belt", issuer: "ASQ", date: "2018" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/arthurpendelton" }]
  },
  "vp-product": {
    basics: {
      name: "Steve Rogers",
      label: "VP of Product",
      email: "steve@shield.com",
      phone: "+1 (555) 111-2233",
      summary: "Product executive supervising product manager teams, building commercial product strategies, and launching SaaS tools."
    },
    work: [
      { company: "Shield Cloud Services", position: "VP of Product", startDate: "2019", endDate: "Present", highlights: ["Grew product revenue from $10M to $65M within 3 years.", "Supervised development and launch of 4 core cloud security APIs."] }
    ],
    education: [{ institution: "NYU Stern", studyType: "M.B.A.", area: "Product Management", endDate: "2015" }],
    skills: ["Product Vision", "Team Scaling", "Market Expansion", "Pricing Models"],
    projects: [{ name: "Enterprise Hub Launch", description: "Led development of new collaborative enterprise dashboard.", technologies: ["Product Strategy"] }],
    certifications: [{ name: "Agile Leadership Certification", issuer: "Scrum Alliance", date: "2016" }],
    socialLinks: []
  },
  "chief-staff": {
    basics: {
      name: "Peggy Carter",
      label: "Chief of Staff",
      email: "peggy@shield.com",
      phone: "+1 (555) 114-5566",
      summary: "Executive partner facilitating strategic board decisions, department communication, and business operations."
    },
    work: [
      { company: "Shield Global", position: "Chief of Staff", startDate: "2020", endDate: "Present", highlights: ["Coordinated executive meetings and budget reviews for 8 global divisions.", "Assisted CEO in executing regional re-organization plan saving $4M."] }
    ],
    education: [{ institution: "London School of Economics", studyType: "B.Sc.", area: "Economics", endDate: "2017" }],
    skills: ["Executive Support", "Strategy Alignment", "Conflict Resolution", "Budget Auditing"],
    projects: [{ name: "Corporate Realignment", description: "Streamlined regional reporting structures across 4 hubs.", technologies: ["Management"] }],
    certifications: [{ name: "Strategic Management certification", issuer: "LSE", date: "2018" }],
    socialLinks: []
  },
  "managing-director": {
    basics: {
      name: "Tony Stark",
      label: "Managing Director",
      email: "tony@stark.com",
      phone: "+1 (555) 117-8899",
      summary: "MD leading corporate innovation, investment partnerships, P&L management, and brand expansions."
    },
    work: [
      { company: "Stark Enterprises", position: "Managing Director", startDate: "2012", endDate: "Present", highlights: ["Directed global operations of 5,000 employees across clean energy sectors.", "Negotiated joint venture agreements, increasing stock valuation by 42%."] }
    ],
    education: [{ institution: "MIT", studyType: "M.S.", area: "Engineering & Finance", endDate: "2010" }],
    skills: ["P&L Control", "Strategic Partners", "Venture Capital", "Clean Energy", "IP Portfolio"],
    projects: [{ name: "Arc Energy Grid", description: "Coordinated development of municipal clean power grids.", technologies: ["Arc Systems"] }],
    certifications: [],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/tonystark" }]
  },
  "cfo": {
    basics: {
      name: "Pepper Potts",
      label: "Chief Financial Officer",
      email: "pepper@stark.com",
      phone: "+1 (555) 121-1122",
      summary: "CFO managing corporate treasury, fiscal accounting audits, financial modeling, and SEC compliance."
    },
    work: [
      { company: "Stark Industries", position: "Chief Financial Officer", startDate: "2016", endDate: "Present", highlights: ["Oversaw $2.4B annual operational budget, optimizing tax reserves.", "Managed fiscal reporting during corporate restructuring and division spin-offs."] }
    ],
    education: [{ institution: "Columbia Business School", studyType: "M.B.A.", area: "Finance", endDate: "2014" }],
    skills: ["Treasury", "SEC Compliance", "Audit Oversight", "Financial Forecasting"],
    projects: [{ name: "Global Tax Restructuring", description: "Audited international tax liabilities, saving $12M in compliance costs.", technologies: ["Tax ERP"] }],
    certifications: [{ name: "Certified Public Accountant (CPA)", issuer: "CPA Board", date: "2015" }],
    socialLinks: []
  },
  "cio": {
    basics: {
      name: "Bruce Banner",
      label: "Chief Information Officer",
      email: "bruce@labtech.com",
      phone: "+1 (555) 124-3344",
      summary: "CIO guiding tech infrastructure planning, corporate cybersecurity posture, data storage scaling, and vendor relations."
    },
    work: [
      { company: "Banner Lab Networks", position: "CIO", startDate: "2018", endDate: "Present", highlights: ["Directed migration of internal analytics to secure private hybrid cloud systems.", "Established threat intelligence response teams, cutting security breaches by 80%."] }
    ],
    education: [{ institution: "Caltech", studyType: "Ph.D.", area: "Nuclear Engineering & Physics", endDate: "2012" }],
    skills: ["Cloud Migration", "IT Infrastructure", "Cyber Security", "vendor Management", "Data Analytics"],
    projects: [{ name: "Lab Security Upgrade", description: "Secured research data stores against cyber espionage attempts.", technologies: ["IAM", "Encryption"] }],
    certifications: [{ name: "CISSP", issuer: "ISC2", date: "2016" }],
    socialLinks: []
  },

  // === HEALTHCARE ===
  "registered-nurse": {
    basics: {
      name: "Florence Nightingale",
      label: "Registered Nurse",
      email: "florence@nursing.org",
      phone: "+1 (555) 131-1122",
      summary: "Registered Nurse providing direct patient care, executing clinical safety codes, and coordinating emergency interventions."
    },
    work: [
      { company: "Mercy General Hospital", position: "ICU Charge Nurse", startDate: "2017", endDate: "Present", highlights: ["Supervised clinical care team of 12 nurses in active ICU wards.", "Maintained 100% adherence to patient safety and hygiene protocols."] }
    ],
    education: [{ institution: "King's College London", studyType: "B.Sc.", area: "Nursing", endDate: "2015" }],
    skills: ["ICU Care", "Patient Hygiene", "Emergency Meds", "Triage Protocols", "EHR Systems"],
    projects: [{ name: "Hygiene Protocol Sync", description: "Restructured ward hygiene routines, cutting infection rates by 30%.", technologies: ["Clinical Safety"] }],
    certifications: [{ name: "Registered Nurse License", issuer: "State Board", date: "2015" }],
    socialLinks: []
  },
  "clinical-coordinator": {
    basics: {
      name: "John Watson",
      label: "Clinical Trial Coordinator",
      email: "john.watson@trialcare.com",
      phone: "+1 (555) 134-3344",
      summary: "Coordinator managing medical clinical trial protocols, patient recruiting compliance, and FDA database reporting."
    },
    work: [
      { company: "CarePoint Biotech", position: "Clinical Coordinator", startDate: "2019", endDate: "Present", highlights: ["Supervised patient scheduling and lab tests compliance for Phase II cancer study.", "Documented patient histories in FDA compliance portals with zero errors."] }
    ],
    education: [{ institution: "University of Edinburgh", studyType: "B.Sc.", area: "Biomedical Sciences", endDate: "2018" }],
    skills: ["FDA Reporting", "Clinical Protocols", "Patient Recruiting", "Lab Tracking"],
    projects: [{ name: "Biotech Trial Phase II", description: "Coordinated data collection for drug trial involving 180 patients.", technologies: ["EHR", "FDA Portal"] }],
    certifications: [{ name: "CCRC Certification", issuer: "ACRP", date: "2020" }],
    socialLinks: []
  },
  "physical-therapist": {
    basics: {
      name: "Stephen Strange",
      label: "Physical Therapist",
      email: "dr.strange@rehab.com",
      phone: "+1 (555) 137-5566",
      summary: "Licensed physical therapist specialized in post-surgery recovery, athletic rehab, and joint manipulation."
    },
    work: [
      { company: "Strange Sports Rehab", position: "Lead Therapist", startDate: "2018", endDate: "Present", highlights: ["Designed recovery plans for 60+ athletes, speeding up return-to-play by 15%.", "Conducted deep-tissue manipulation sessions to treat chronic pain clients."] }
    ],
    education: [{ institution: "Columbia University", studyType: "D.P.T.", area: "Physical Therapy", endDate: "2017" }],
    skills: ["Joint Manipulation", "Athletic Rehab", "Recovery Planning", "Pain Management"],
    projects: [{ name: "Post-OP Spine Protocol", description: "Created safe spine recovery movement guidelines for surgical patients.", technologies: ["Rehab"] }],
    certifications: [{ name: "Physical Therapist License", issuer: "State Board", date: "2017" }],
    socialLinks: []
  },
  "health-admin": {
    basics: {
      name: "Leonard McCoy",
      label: "Healthcare Administrator",
      email: "mccoy@starbase.org",
      phone: "+1 (555) 141-8899",
      summary: "Administrator managing hospital billing audits, compliance training, patient record security, and vendor scaling."
    },
    work: [
      { company: "Starbase Medical Center", position: "Administrative Director", startDate: "2016", endDate: "Present", highlights: ["Supervised billing database shift, cutting claim processing delays by 40%.", "Audited patient records to ensure HIPAA encryption standards were met."] }
    ],
    education: [{ institution: "University of Iowa", studyType: "M.H.A.", area: "Healthcare Administration", endDate: "2015" }],
    skills: ["HIPAA Compliance", "Billing Auditing", "Vendor Relations", "EHR Databases", "Staff Training"],
    projects: [{ name: "EHR Cloud Migration", description: "Coordinated secure migration of patient databases to hybrid cloud vaults.", technologies: ["HIPAA", "SQL"] }],
    certifications: [{ name: "Certified Healthcare Admin (CHAPA)", issuer: "AHIMA", date: "2017" }],
    socialLinks: []
  },
  "pharmacist": {
    basics: {
      name: "Gregory House",
      label: "Pharmacist Lead",
      email: "g.house@medcorp.com",
      phone: "+1 (555) 144-1122",
      summary: "Pharmacist supervisor overseeing medication disbursement, prescription auditing, and drug interaction safety checks."
    },
    work: [
      { company: "City Care Pharmacy", position: "Lead Pharmacist", startDate: "2018", endDate: "Present", highlights: ["Dispensed 14,000+ monthly prescriptions with 100% accuracy.", "Conducted patient reviews to check drug interactions and dosage safety."] }
    ],
    education: [{ institution: "University of Michigan", studyType: "Pharm.D.", area: "Pharmacy", endDate: "2017" }],
    skills: ["Dosage Auditing", "Drug Interactions", "Inventory Tracking", "Patient Consulting"],
    projects: [{ name: "Inventory Automation", description: "Integrated barcoding tracking system, reducing stock anomalies by 95%.", technologies: ["ERP"] }],
    certifications: [{ name: "Licensed Pharmacist", issuer: "State Board", date: "2017" }],
    socialLinks: []
  },
  "dentist": {
    basics: {
      name: "Harleen Quinzel",
      label: "Dental Surgeon",
      email: "harleen@dentalcare.com",
      phone: "+1 (555) 147-3344",
      summary: "Dentist specialized in restorative oral surgery, cosmetic veneers, root canal treatments, and preventative cleaning."
    },
    work: [
      { company: "Metro Dental Clinic", position: "Associate Dentist", startDate: "2020", endDate: "Present", highlights: ["Conducted 400+ successful dental extraction and crown procedures.", "Implemented digital 3D jaw modeling, improving veneer fit accuracy by 20%."] }
    ],
    education: [{ institution: "Boston University", studyType: "D.D.S.", area: "Dental Surgery", endDate: "2019" }],
    skills: ["Oral Surgery", "Root Canals", "Jaw Modeling", "Cosmetic Dentistry", "X-Ray Analysis"],
    projects: [{ name: "Laser Whitening Launch", description: "Introduced advanced non-invasive teeth cleaning services.", technologies: ["Dental Laser"] }],
    certifications: [{ name: "Dentist Practitioner License", issuer: "State Board", date: "2019" }],
    socialLinks: []
  },

  // === FINANCE ===
  "banking-associate": {
    basics: {
      name: "Victoria Sterling",
      label: "Investment Banking Associate",
      email: "v.sterling@apexbank.com",
      phone: "+1 (555) 012-4422",
      summary: "M&A advisory associate specializing in discounted cash flow models, leverage buyout audits, and client pitch books."
    },
    work: [
      { company: "Apex Investment Bank", position: "M&A Associate", startDate: "2018", endDate: "Present", highlights: ["Built financial models supporting a $250M chemical industry acquisition.", "Coordinated pitch book materials for 12 corporate restructuring tenders."] }
    ],
    education: [{ institution: "Wharton School", studyType: "M.B.A.", area: "Finance", endDate: "2017" }],
    skills: ["LBO Modeling", "DCF Analysis", "Pitch Books", "Due Diligence", "Capital Markets"],
    projects: [{ name: "Project Chemical Merger", description: "Financial analyst for merger of two chemical distributors.", technologies: ["Excel", "Capital IQ"] }],
    certifications: [{ name: "Series 79 & 63 Licenses", issuer: "FINRA", date: "2018" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/vsterling" }]
  },
  "wealth-consultant": {
    basics: {
      name: "Sterling Archer",
      label: "Wealth Advisor",
      email: "s.archer@wealth.com",
      phone: "+1 (555) 151-5566",
      summary: "Wealth manager advising high-net-worth clients on tax shelter structures, trust planning, and capital distributions."
    },
    work: [
      { company: "Sterling Private Assets", position: "Senior Partner", startDate: "2017", endDate: "Present", highlights: ["Advised 60 active families on estate trust layouts, managing $90M AUM.", "Decreased client tax burdens by 14% via structured asset placement."] }
    ],
    education: [{ institution: "Dartmouth College", studyType: "B.Sc.", area: "Economics", endDate: "2014" }],
    skills: ["Tax Shelters", "Estate Trusts", "Capital Allocations", "Client Relations"],
    projects: [{ name: "Generational Trust Build", description: "Created generational estate structures to protect assets.", technologies: ["Asset Mgmt"] }],
    certifications: [{ name: "Certified Financial Planner (CFP)", issuer: "CFP Board", date: "2016" }],
    socialLinks: []
  },
  "management-consultant": {
    basics: {
      name: "Donald Draper",
      label: "Management Consultant",
      email: "don@draperconsulting.com",
      phone: "+1 (555) 154-8899",
      summary: "Consultant specialized in process optimization, corporate cost reduction, and market entry strategies."
    },
    work: [
      { company: "Draper Consulting Partners", position: "Senior Consultant", startDate: "2019", endDate: "Present", highlights: ["Re-engineered operational workflows for a telecom client, saving $1.5M.", "Led market entry evaluation for retail brand expansion into Canada."] }
    ],
    education: [{ institution: "Columbia Business School", studyType: "M.B.A.", area: "Business Strategy", endDate: "2018" }],
    skills: ["Process Re-design", "Cost Reduction", "Market Entry", "Case Presentation"],
    projects: [{ name: "Retail Canada Launch", description: "Feasibility study outlining logistics and tax laws in Canada.", technologies: ["Analytics"] }],
    certifications: [{ name: "Certified Management Consultant", issuer: "IMC", date: "2020" }],
    socialLinks: []
  },
  "tax-associate": {
    basics: {
      name: "Franklin Nelson",
      label: "Senior Tax Consultant",
      email: "foggy@nelsonlaw.com",
      phone: "+1 (555) 157-1122",
      summary: "Tax specialist auditing corporate tax filings, calculating deduction compliance, and representing clients in IRS audits."
    },
    work: [
      { company: "Nelson Tax Advisory", position: "Tax Associate", startDate: "2021", endDate: "Present", highlights: ["Reviewed 80+ corporate annual tax filings, optimizing tax deductions.", "Successfully represented 8 clients during IRS audits, reducing penalty exposures."] }
    ],
    education: [{ institution: "Columbia University", studyType: "B.Sc.", area: "Accounting", endDate: "2019" }],
    skills: ["Tax Accounting", "IRS Audit Prep", "Tax Software", "Deductions Audit"],
    projects: [{ name: "Audit Exposure Analysis", description: "Built Excel macro calculating historical audit likelihoods.", technologies: ["Excel", "VBA"] }],
    certifications: [{ name: "CPA License", issuer: "State Board", date: "2020" }],
    socialLinks: []
  },
  "risk-manager": {
    basics: {
      name: "Christian Wolff",
      label: "Risk Assessment Lead",
      email: "christian@wolffrisk.com",
      phone: "+1 (555) 161-4455",
      summary: "Risk analyst designing asset vulnerability audits, hedge fund liquidity metrics, and portfolio stress tests."
    },
    work: [
      { company: "Wolff Liquidity Group", position: "Lead Risk Manager", startDate: "2016", endDate: "Present", highlights: ["Designed portfolio stress models calculating asset survival rates during downturns.", "Audited cash reserves of $800M hedge fund to verify asset liquid status."] }
    ],
    education: [{ institution: "University of Chicago", studyType: "M.Sc.", area: "Financial Mathematics", endDate: "2015" }],
    skills: ["Stress Testing", "Liquidity Audit", "Hedge Strategy", "Python Analysis"],
    projects: [{ name: "Hedge Stress Model", description: "Created Python tool modeling portfolio decay during market shocks.", technologies: ["Python", "Pandas"] }],
    certifications: [{ name: "Financial Risk Manager (FRM)", issuer: "GARP", date: "2017" }],
    socialLinks: []
  },
  "auditor": {
    basics: {
      name: "James Bond",
      label: "Internal Auditor",
      email: "bond@mi6.gov",
      phone: "+1 (555) 164-7788",
      summary: "Financial auditor inspecting balance sheet reconciliation, internal controls compliance, and fraud audits."
    },
    work: [
      { company: "Federal Audit Agency", position: "Auditing Inspector", startDate: "2017", endDate: "Present", highlights: ["Conducted 40+ corporate fraud audits, discovering $4M in unrecorded funds.", "Inspected client ledger balance sheets, verifying alignment with GAAP codes."] }
    ],
    education: [{ institution: "Cambridge University", studyType: "B.Sc.", area: "Accounting & Audit", endDate: "2016" }],
    skills: ["Fraud Audits", "GAAP Compliance", "Ledger Audit", "Risk Containment"],
    projects: [{ name: "Ledger Reconciliation", description: "Audited international accounts database to resolve balance errors.", technologies: ["Audits"] }],
    certifications: [{ name: "Certified Internal Auditor (CIA)", issuer: "IIA", date: "2018" }],
    socialLinks: []
  },

  // === SALES ===
  "account-executive": {
    basics: {
      name: "Jordan Belfort",
      label: "Enterprise Account Executive",
      email: "jordan@stratton.com",
      phone: "+1 (555) 011-9230",
      summary: "Enterprise salesperson specialized in sales pipeline management, contract negotiations, and B2B SaaS sales."
    },
    work: [
      { company: "Stratton Enterprise Sales", position: "Account Executive", startDate: "2021", endDate: "Present", highlights: ["Exceeded sales quotas by 140% for 6 consecutive quarters.", "Negotiated contracts with 8 Fortune 500 tech clients, closing $2M in deals."] }
    ],
    education: [{ institution: "Syracuse University", studyType: "B.A.", area: "Business", endDate: "2018" }],
    skills: ["SaaS Sales", "Salesforce", "Deal Closing", "Pipeline Growth"],
    projects: [{ name: "Fortune 500 SaaS Deal", description: "Closed enterprise licensing contract with cloud software client.", technologies: ["Salesforce"] }],
    certifications: [{ name: "Strategic Sales Professional", issuer: "Sales Board", date: "2020" }],
    socialLinks: [{ platform: "LinkedIn", url: "linkedin.com/in/jordanbelfort" }]
  },
  "brand-manager": {
    basics: {
      name: "Emily Cooper",
      label: "Brand Manager",
      email: "emily@savoir.fr",
      phone: "+1 (555) 171-1122",
      summary: "Brand manager specialized in campaign planning, corporate identity, retail advertising, and market share tracking."
    },
    work: [
      { company: "Savoir Marketing Agency", position: "Brand Specialist", startDate: "2020", endDate: "Present", highlights: ["Coordinated launch of luxury cosmetics brand, increasing market share by 8%.", "Managed brand social media guidelines across European marketing teams."] }
    ],
    education: [{ institution: "Northwestern University", studyType: "B.A.", area: "Marketing", endDate: "2018" }],
    skills: ["Campaign Planning", "Brand Identity", "Market Share Analysis", "Influencer Strategy"],
    projects: [{ name: "Cosmetics Launch Campaign", description: "Visual marketing campaign generating 4M online views.", technologies: ["Social Ads"] }],
    certifications: [{ name: "Professional Brand Manager", issuer: "AMA", date: "2019" }],
    socialLinks: []
  },
  "marketing-director": {
    basics: {
      name: "Madison Paige",
      label: "Marketing Director",
      email: "madison@paigemedia.com",
      phone: "+1 (555) 174-3344",
      summary: "Marketing executive supervising ad spend budgeting, regional campaign metrics, and growth operations."
    },
    work: [
      { company: "Paige Media Group", position: "Director of Marketing", startDate: "2018", endDate: "Present", highlights: ["Supervised $5M annual ad spend budget, optimizing CAC by 20%.", "Led regional marketing team of 15 members across digital channels."] }
    ],
    education: [{ institution: "Wharton School", studyType: "M.B.A.", area: "Marketing", endDate: "2015" }],
    skills: ["CAC Optimization", "Budget Management", "Growth Metrics", "Staff Leadership"],
    projects: [{ name: "Q4 Customer Acquisition", description: "Implemented multi-channel ad campaigns, doubling customer signups.", technologies: ["Ad Analytics"] }],
    certifications: [{ name: "Google Analytics Individual Qualification", issuer: "Google", date: "2016" }],
    socialLinks: []
  },
  "sales-rep": {
    basics: {
      name: "Dwight Schrute",
      label: "Regional Sales Representative",
      email: "dwight@dundermifflin.com",
      phone: "+1 (555) 177-5566",
      summary: "Dedicated sales representative specialized in B2B supply contracts, lead generation, and client relationship management."
    },
    work: [
      { company: "Dunder Mifflin Paper Co", position: "Assistant to the Regional Manager", startDate: "2005", endDate: "Present", highlights: ["Consistently ranked as the top-producing paper salesman in the branch.", "Managed key corporate accounts, maintaining a 98% client retention rate."] }
    ],
    education: [{ institution: "Scranton Community College", studyType: "Associate Degree", area: "Business Administration", endDate: "2003" }],
    skills: ["B2B Sales", "Client Retention", "Cold Calling", "Negotiation"],
    projects: [{ name: "Lackawanna County Contract", description: "Secured exclusive paper supply contract for all county government offices.", technologies: ["Sales"] }],
    certifications: [{ name: "Top Salesman of the Year", issuer: "Dunder Mifflin", date: "2022" }],
    socialLinks: []
  },
  "customer-success": {
    basics: {
      name: "Jim Halpert",
      label: "Customer Success Manager",
      email: "jim@dundermifflin.com",
      phone: "+1 (555) 181-7788",
      summary: "Client relations specialist managing B2B onboarding, retention statistics, and customer support workflows."
    },
    work: [
      { company: "Dunder Mifflin Paper Co", position: "Customer Success Lead", startDate: "2008", endDate: "Present", highlights: ["Oversaw onboarding for 40+ key regional commercial clients.", "Maintained client satisfaction score (CSAT) of 96% over 4 years."] }
    ],
    education: [{ institution: "Temple University", studyType: "B.A.", area: "Marketing", endDate: "2006" }],
    skills: ["CSAT Management", "Onboarding Workflows", "B2B Retention", "CRM Systems"],
    projects: [{ name: "Onboarding System Upgrade", description: "Restructured digital onboarding templates, reducing setup delays.", technologies: ["CRM"] }],
    certifications: [],
    socialLinks: []
  },
  "business-dev": {
    basics: {
      name: "Pam Beesly",
      label: "Business Development Associate",
      email: "pam@dundermifflin.com",
      phone: "+1 (555) 184-9900",
      summary: "Business developer establishing commercial partnerships, trade show logistics, and outbound lead generation campaigns."
    },
    work: [
      { company: "Dunder Mifflin Paper Co", position: "Business Development Specialist", startDate: "2010", endDate: "Present", highlights: ["Secured 14 regional distribution partnerships, boosting revenue by 12%.", "Coordinated corporate presence at annual regional trade expositions."] }
    ],
    education: [{ institution: "Marywood University", studyType: "B.A.", area: "Fine Arts", endDate: "2008" }],
    skills: ["Lead Generation", "Partnerships", "Trade Shows", "Cold Outreach"],
    projects: [{ name: "Scranton Trade Expo", description: "Managed corporate booth and partnership leads at Northeast Trade Expo.", technologies: ["Events"] }],
    certifications: [],
    socialLinks: []
  },

  // === HOSPITALITY ===
  "hotel-manager": {
    basics: {
      name: "Basil Fawlty",
      label: "Hotel Operations Manager",
      email: "basil@fawltytowers.com",
      phone: "+1 (555) 191-1122",
      summary: "Hotel manager supervising room inventory schedules, guest check-in safety standards, and regional hospitality compliance."
    },
    work: [
      { company: "Fawlty Towers Hotel", position: "Hotel Manager", startDate: "2015", endDate: "Present", highlights: ["Supervised 25 hospitality staff members across front-desk and housekeeping.", "Achieved 92% occupancy rates during peak summer seasons."] }
    ],
    education: [{ institution: "University of Surrey", studyType: "B.Sc.", area: "Hotel Management", endDate: "2014" }],
    skills: ["Room Inventory", "Guest Check-in", "Hospitality Standards", "Budgeting", "Staff Scheduling"],
    projects: [{ name: "Room Service Sync", description: "Automated room service orders via front-desk database integration.", technologies: ["HMS"] }],
    certifications: [{ name: "Certified Hotel Administrator", issuer: "AHLA", date: "2016" }],
    socialLinks: []
  },
  "restaurant-manager": {
    basics: {
      name: "Arthur Dent",
      label: "Restaurant General Manager",
      email: "arthur@guide.org",
      phone: "+1 (555) 194-3344",
      summary: "Restaurant manager overseeing menu supply planning, food safety audits (HACCP), and team shift scheduling."
    },
    work: [
      { company: "The Heart of Gold Diner", position: "General Manager", startDate: "2018", endDate: "Present", highlights: ["Managed kitchen operational budgets, cutting waste expenses by 14%.", "Maintained Grade A sanitation ratings across 6 health inspector audits."] }
    ],
    education: [{ institution: "Cardiff University", studyType: "B.A.", area: "Business", endDate: "2016" }],
    skills: ["Food Safety Auditing", "Shift Scheduling", "Inventory Audits", "HACCP Codes"],
    projects: [{ name: "Kitchen waste Audit", description: "Implemented strict raw supply tracking, cutting dining waste.", technologies: ["POS", "Excel"] }],
    certifications: [{ name: "ServSafe Manager Certification", issuer: "NRA", date: "2018" }],
    socialLinks: []
  },
  "event-coordinator": {
    basics: {
      name: "Tiana Rogers",
      label: "Event Coordinator",
      email: "tiana@palaceevents.com",
      phone: "+1 (555) 197-5566",
      summary: "Event planner organizing corporate conventions, catering logistics, vendor negotiations, and audio setups."
    },
    work: [
      { company: "Palace Event Planners", position: "Lead Coordinator", startDate: "2019", endDate: "Present", highlights: ["Coordinated logistics for 40+ weddings and corporate conventions.", "Negotiated pricing with catering and equipment vendors, saving clients 15%."] }
    ],
    education: [{ institution: "University of New Orleans", studyType: "B.A.", area: "Hospitality & Tourism", endDate: "2017" }],
    skills: ["Vendor Relations", "Convention Logistics", "Catering Coordination", "Budgeting"],
    projects: [{ name: "Palace Wedding Expo", description: "Organized regional bridal showcase hosting 1,200 active guests.", technologies: ["Logistics"] }],
    certifications: [{ name: "Certified Meeting Professional", issuer: "EIC", date: "2020" }],
    socialLinks: []
  },
  "travel-agent": {
    basics: {
      name: "Lara Croft",
      label: "Travel Specialist",
      email: "lara@tombadventures.com",
      phone: "+1 (555) 201-1122",
      summary: "Travel specialist booking custom international itineraries, adventure travel safety plans, and ticketing."
    },
    work: [
      { company: "Adventures Travel Agency", position: "Travel Consultant", startDate: "2016", endDate: "Present", highlights: ["Arranged custom travel itineraries for 200+ clients traveling to Asia/Africa.", "Coordinated travel logistics, hotel accommodations, and visa filings with embassies."] }
    ],
    education: [{ institution: "University College London", studyType: "B.A.", area: "Archaeology & Geography", endDate: "2015" }],
    skills: ["Itinerary Planning", "embassy Visas", "Adventure Safety", "Ticketing GDS"],
    projects: [{ name: "Expedition Safaris", description: "Custom group travel booking package for African archaeological tours.", technologies: ["GDS"] }],
    certifications: [{ name: "IATA Consultant Certification", issuer: "IATA", date: "2017" }],
    socialLinks: []
  },
  "flight-attendant": {
    basics: {
      name: "Amelia Earhart",
      label: "Cabin Crew Lead",
      email: "amelia@flyhigh.com",
      phone: "+1 (555) 204-3344",
      summary: "Flight attendant supervisor maintaining FAA safety procedures, crew scheduling, and high customer satisfaction scores."
    },
    work: [
      { company: "Global Airways", position: "Flight Attendant Lead", startDate: "2015", endDate: "Present", highlights: ["Completed 1,200+ flight segments, maintaining 100% adherence to FAA rules.", "Led emergency evacuation training drills for a team of 40 cabin crew members."] }
    ],
    education: [{ institution: "Columbia College", studyType: "Associate Degree", area: "Public Relations", endDate: "2013" }],
    skills: ["FAA Safety Codes", "Emergency Evacuation", "First Aid / CPR", "Customer Satisfaction"],
    projects: [{ name: "Cabin Crew Service Upgrade", description: "Refactored inflight service protocols, improving customer ratings by 20%.", technologies: ["Service"] }],
    certifications: [{ name: "FAA Flight Attendant Certification", issuer: "FAA", date: "2015" }],
    socialLinks: []
  },
  "sommelier": {
    basics: {
      name: "Hannibal Lecter",
      label: "Wine & Beverage Director",
      email: "hannibal@gourmet.com",
      phone: "+1 (555) 207-5566",
      summary: "Master sommelier managing wine cellars inventory, menu pairings, and training restaurant staff."
    },
    work: [
      { company: "The Grand Bistro", position: "Sommelier Director", startDate: "2016", endDate: "Present", highlights: ["Curated 400-label award-winning wine list, boosting beverage revenues by 28%.", "Conducted weekly staff tasting seminars to explain menu wine pairings."] }
    ],
    education: [{ institution: "Culinary Institute of America", studyType: "B.A.", area: "Gastronomy", endDate: "2014" }],
    skills: ["Wine Pairings", "Cellar Management", "Staff Education", "Vendor Sourcing", "Tasting Seminars"],
    projects: [{ name: "Bespoke Wine Cellar Sync", description: "Implemented digital temperature logging system across restaurant cellars.", technologies: ["Cellar Tech"] }],
    certifications: [{ name: "Master Sommelier Diploma", issuer: "Court of Master Sommeliers", date: "2018" }],
    socialLinks: []
  }
};
