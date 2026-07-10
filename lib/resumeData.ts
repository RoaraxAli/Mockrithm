export interface ResumeLandingConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCTA: string;
  featureTitle: string;
  features: Array<{
    title: string;
    description: string;
  }>;
}

export const RESUME_LANDING_LIST: Record<string, ResumeLandingConfig> = {
  "ats-checker": {
    slug: "ats-checker",
    title: "Free AI ATS Resume Checker & Scanner | Mockrithm",
    description: "Scan your resume against ATS algorithms. Get an instant score, identify missing keywords, and optimize formatting to bypass applicant filters.",
    keywords: "ats resume checker, resume scanner, resume score, keyword optimizer, resume parsing",
    heroTitle: "Bypass Applicant Tracking Systems.",
    heroSubtitle: "Analyze your resume with our production-grade ATS compiler. Reveal hidden parsing errors, calculate match scores, and inject high-impact keywords.",
    primaryCTA: "Scan Your Resume",
    featureTitle: "Engineered to pass the recruiter screen.",
    features: [
      { title: "Deterministic Parse Check", description: "Simulates actual Greenhouse, Workday, and Lever parsers to check structure preservation." },
      { title: "Semantic Density Score", description: "Calculates context weights for your experience bullet points based on industry standards." },
      { title: "Missing Keyword Map", description: "Scrapes target job descriptions and lists high-priority keywords to inject instantly." }
    ]
  },
  "templates": {
    slug: "templates",
    title: "10+ Developer-Optimized Resume Templates | Mockrithm",
    description: "Choose from 10 premium, single-page resume layouts designed specifically for technical professionals. PDF exported, clean parsing.",
    keywords: "resume templates, developer resume, markdown resume, clean resume pdf, parsing safe layout",
    heroTitle: "Single-Page Parsing-Safe Layouts.",
    heroSubtitle: "Stop struggling with word processors. Choose from 10 developer-centric templates built to render perfectly across all mobile devices and print.",
    primaryCTA: "Choose a Template",
    featureTitle: "Minimalist, structural excellence.",
    features: [
      { title: "No Column Disruption", description: "Single-column and modular designs that ensure parser loops read your experience linearly." },
      { title: "Custom Theme Injection", description: "Inject cybernetic, classic corporate, or modern aesthetic variables dynamically." },
      { title: "Pixel-Perfect Export", description: "CSS page-break optimized exports to guarantee your resume fits exactly onto a single page." }
    ]
  },
  "software-engineer": {
    slug: "software-engineer",
    title: "Software Engineer Resume Builder | Mockrithm",
    description: "Build a high-converting software engineering resume. Highlight system designs, codebase scales, and algorithmic accomplishments.",
    keywords: "software engineer resume, tech resume, swe resume, github portfolio link, developer resume builder",
    heroTitle: "Drafted for principal engineers.",
    heroSubtitle: "Quantify your impact. Our specialized compiler structures your experience around distributed systems, codebase optimization, and metric scales.",
    primaryCTA: "Build SWE Resume",
    featureTitle: "Highlight your codebase contributions.",
    features: [
      { title: "Metric Suggestion Engine", description: "Autogenerates data points like database latency cuts, CPU optimization, and query speedups." },
      { title: "Tech Stack Badges", description: "Directly associates language frameworks with relevant project descriptions for fast review." },
      { title: "Git Repository Sync", description: "Pulls your repository structures to automatically generate high-converting project summaries." }
    ]
  },
  "frontend-developer": {
    slug: "frontend-developer",
    title: "Frontend Developer Resume Optimizer | Mockrithm",
    description: "Create a stunning frontend resume. Focus on state architectures, rendering optimizations, core web vitals, and UX frameworks.",
    keywords: "frontend resume, react developer, core web vitals, state management, UI UX design resume",
    heroTitle: "Engineered for interface builders.",
    heroSubtitle: "Present your frontend expertise clearly. Highlight your mastery of React, state management, core web vitals, and CSS layouts.",
    primaryCTA: "Build Frontend Resume",
    featureTitle: "Highlight visual and architectural mastery.",
    features: [
      { title: "Web Performance Tracking", description: "Suggests bullets describing Lighthouse score jumps, dynamic hydration, and bundle size reduction." },
      { title: "Component Library Focus", description: "Highlights custom reusable UI patterns, design system integrations, and accessibility compliance." },
      { title: "Live Demo Links", description: "Embedded verified hyperlinks to your Vercel or Netlify deploys directly in the contact panel." }
    ]
  },
  "backend-developer": {
    slug: "backend-developer",
    title: "Backend Engineer Resume Builder | Mockrithm",
    description: "Optimize your backend resume. Focus on REST/gRPC APIs, sharding database schemas, caching, and server scaling systems.",
    keywords: "backend developer resume, nodejs resume, database design, system architecture, API optimization",
    heroTitle: "Structured for backend architects.",
    heroSubtitle: "Show off your low-latency APIs, horizontally scalable systems, caching tiers, and database optimizations.",
    primaryCTA: "Build Backend Resume",
    featureTitle: "Make system impact quantifiable.",
    features: [
      { title: "API Throughput Bullets", description: "Guides you to document concurrent request handles, latency improvements, and rate limit structures." },
      { title: "Database Sharding Logs", description: "Helps you highlight index partitioning, transactional integrity, and read-replica routing." },
      { title: "Security and Compliance", description: "Focuses on your experience with OAuth2/JWT integration, CORS, and encryption policies." }
    ]
  },
  "data-scientist": {
    slug: "data-scientist",
    title: "Data Scientist Resume Analyzer | Mockrithm",
    description: "Build a resume highlighting ML models, data pipelines, statistically robust tests, and business impact.",
    keywords: "data scientist resume, machine learning resume, data pipeline, pandas numpy scikit, model training",
    heroTitle: "Drafted for numerical analytical minds.",
    heroSubtitle: "Optimize your data science resume. Highlight predictive model gains, pipeline scaling, and conversion lifts.",
    primaryCTA: "Build Data Science Resume",
    featureTitle: "Validate analytical business returns.",
    features: [
      { title: "Model Performance Highlights", description: "Assists in highlighting ROC-AUC, precision-recall, and model training optimizations." },
      { title: "Data Pipeline Metrics", description: "Quantifies your ETL processing capacity, pipeline latency, and warehouse query speed." },
      { title: "A/B Testing Impact", description: "Structures bullet points around statistical significance, sample sizes, and revenue lift." }
    ]
  },
  "devops-engineer": {
    slug: "devops-engineer",
    title: "DevOps & SRE Resume Optimizer | Mockrithm",
    description: "Author a resume for DevOps and Site Reliability Engineering. Highlight CI/CD, IaC, Kubernetes, and uptime records.",
    keywords: "devops resume, sre resume, kubernetes docker, terraform aws, cicd pipeline builder",
    heroTitle: "Optimized for pipeline reliability.",
    heroSubtitle: "Highlight your automated deployment workflows, Infrastructure-as-Code setups, container orchestration, and zero-downtime releases.",
    primaryCTA: "Build DevOps Resume",
    featureTitle: "Structure your pipeline automations.",
    features: [
      { title: "IaC Template Focus", description: "Presents your Terraform, Ansible, and CloudFormation blueprints clearly to reviewers." },
      { title: "CI/CD Pipeline Cuts", description: "Suggests phrasing to highlight build speedups, automated canary tests, and rollback safety." },
      { title: "Uptime and SLA Tracking", description: "Quantifies your history of managing SLA/SLOs, cloud spend reductions, and system health monitors." }
    ]
  },
  "product-manager": {
    slug: "product-manager",
    title: "Technical Product Manager Resume Builder | Mockrithm",
    description: "Create a high-converting product management resume. Focus on user metrics, roadmapping, and cross-functional success.",
    keywords: "product manager resume, tpm resume, product roadmap, agile scrum, conversion funnel optimizer",
    heroTitle: "Shaped for product outcomes.",
    heroSubtitle: "Highlight roadmap executions, agile team coordination, user conversion funnel wins, and product-led growth metrics.",
    primaryCTA: "Build PM Resume",
    featureTitle: "Quantify product outcomes, not outputs.",
    features: [
      { title: "Revenue Conversion Funnels", description: "Structures metrics showing activation rate jumps, retention increases, and ARR expansion." },
      { title: "Stakeholder Alignment", description: "Phrases your collaboration with engineering, design, and executive leadership clearly." },
      { title: "Agile Development Cycles", description: "Highlights your history of sprinting, release planning, and feature scoping." }
    ]
  },
  "ui-ux-designer": {
    slug: "ui-ux-designer",
    title: "UI/UX Designer Resume & Portfolio Optimizer | Mockrithm",
    description: "Design a clean UI/UX resume. Focus on user research, design systems, wireframes, and design-to-engineering handoffs.",
    keywords: "ui ux designer resume, figma design system, user research, wireframes, interaction designer resume",
    heroTitle: "Designed for product artists.",
    heroSubtitle: "Align your design experience. Highlight user-testing feedback loops, systematic UI libraries, and design handoff speeds.",
    primaryCTA: "Build Designer Resume",
    featureTitle: "Integrate user research and system aesthetics.",
    features: [
      { title: "Design System Integrations", description: "Quantifies design token scale, element reusability, and front-end layout styling alignment." },
      { title: "User Testing Feedback Loops", description: "Highlights usability metrics, error reduction, and accessibility compliance." },
      { title: "Figma Link Placements", description: "Integrates direct, clean links to your interactive prototypes and portfolio frames." }
    ]
  },
  "full-stack-developer": {
    slug: "full-stack-developer",
    title: "Full-Stack Developer Resume Builder | Mockrithm",
    description: "Build a balanced full-stack engineering resume. Highlight cross-layer web performance, system scale, and frontend-backend parity.",
    keywords: "full stack resume, nextjs developer, node backend, database UI integration, web developer resume",
    heroTitle: "Engineered for cross-layer builders.",
    heroSubtitle: "Document your full-stack capability. Present your mastery from database tuning down to modern frontend responsive designs.",
    primaryCTA: "Build Full-Stack Resume",
    featureTitle: "Demonstrate architectural parity.",
    features: [
      { title: "End-to-End Latency Reductions", description: "Prompts you with metrics showing state synchronization speedups and serverless response optimizations." },
      { title: "Monolith to Microservice Steps", description: "Highlights migration strategies, API boundaries, and modular component structures." },
      { title: "DevOps & Deployment Parity", description: "Structures your bullet points to show deployment flow ownership and cloud configuration." }
    ]
  },
  "mobile-developer": {
    slug: "mobile-developer",
    title: "Mobile App Developer Resume Builder | Mockrithm",
    description: "Optimize your iOS or Android resume. Focus on Swift, Kotlin, React Native, App Store reviews, and memory footprint optimizations.",
    keywords: "mobile developer resume, ios developer swift, android kotlin, react native flutter, app store deployment",
    heroTitle: "Drafted for application developers.",
    heroSubtitle: "Present your Swift, Kotlin, and React Native mastery. Highlight App Store ranking improvements, battery usage cuts, and offline caching.",
    primaryCTA: "Build Mobile Resume",
    featureTitle: "Quantify device performance and user retention.",
    features: [
      { title: "Memory Performance Fixes", description: "Guides you to list memory leak fixes, payload size drops, and image cache speeds." },
      { title: "Store Optimization Ratings", description: "Highlights your history of getting features featured, improving review scores, and app store updates." },
      { title: "Multi-Platform App Parity", description: "Structures your experience with Flutter, React Native, or Native iOS/Android modules." }
    ]
  },
  "ml-engineer": {
    slug: "ml-engineer",
    title: "Machine Learning Engineer Resume Builder | Mockrithm",
    description: "Write an ML resume focusing on training pipelines, custom loss functions, LLM fine-tuning, and model inference latency.",
    keywords: "ml engineer resume, machine learning engineer, pytorch tensorflow, llm finetuning, inference optimization",
    heroTitle: "Compiled for model engineers.",
    heroSubtitle: "Highlight PyTorch/TensorFlow models, GPU clusters management, custom fine-tuning, and low-latency inference pipelines.",
    primaryCTA: "Build ML Resume",
    featureTitle: "Structure mathematical and optimization achievements.",
    features: [
      { title: "Inference Latency Drops", description: "Showcases model quantization, pruning, and Triton inference server deployments." },
      { title: "Fine-Tuning Outcomes", description: "Documents custom parameter adjustments, LoRA, and pipeline training efficiency." },
      { title: "Data Ingestion Pipeline Scaling", description: "Highlights processing Terabytes of training datasets, model validation, and drift loops." }
    ]
  },
  "cloud-architect": {
    slug: "cloud-architect",
    title: "Cloud Systems Architect Resume Builder | Mockrithm",
    description: "Build a resume for Cloud Systems Architects. Highlight AWS, Azure, GCP, multi-region failover, cost-control, and architecture scaling.",
    keywords: "cloud architect resume, aws solutions architect, multi region disaster recovery, cloud cost optimization",
    heroTitle: "Designed for system orchestrators.",
    heroSubtitle: "Quantify cloud cost optimization, secure network setups, disaster recovery times, and multi-cloud system architectures.",
    primaryCTA: "Build Cloud Resume",
    featureTitle: "Display high-availability architectures.",
    features: [
      { title: "Disaster Recovery SLAs", description: "Highlights multi-region active-active deployments and database backup times." },
      { title: "Cost Reduction Blueprints", description: "Assists in showcasing serverless conversions, cloud compute adjustments, and savings." },
      { title: "Zero Trust Security Networks", description: "Presents VPC setups, IAM policies, and cloud firewalls accurately to recruiters." }
    ]
  },
  "qa-engineer": {
    slug: "qa-engineer",
    title: "QA & Test Automation Resume Builder | Mockrithm",
    description: "Optimize your QA resume. Focus on Playwright, Cypress, Selenium, load testing, and regression rate reductions.",
    keywords: "qa engineer resume, test automation, playwright cypress, selenium test script, regression test suite",
    heroTitle: "Crafted for quality controllers.",
    heroSubtitle: "Highlight your test automation suites, Playwright/Cypress coverage improvements, and automated regression speedups.",
    primaryCTA: "Build QA Resume",
    featureTitle: "Showcase automated stability.",
    features: [
      { title: "Pipeline Release Speeds", description: "Documents parallel execution gains, flaky test reductions, and pipeline build steps." },
      { title: "Bug Escape Reductions", description: "Highlights test coverage improvements and production regression prevention." },
      { title: "Performance Stress Tests", description: "Presents JMeter, k6, or Locust load testing throughput results clearly." }
    ]
  },
  "career-changer": {
    slug: "career-changer",
    title: "Career Transition to Tech Resume Builder | Mockrithm",
    description: "Transition into tech. Highlight transferable analytical skills, bootcamp projects, open source, and fast learning capability.",
    keywords: "career change to tech, coding bootcamp resume, transferable developer skills, entry level swe resume",
    heroTitle: "Drafted for bold career builders.",
    heroSubtitle: "Showcase your real building capabilities. Highlight transferable skills, intensive bootcamps, and coding achievements.",
    primaryCTA: "Build Tech Resume",
    featureTitle: "Frame capabilities, not credentials.",
    features: [
      { title: "Open Source Achievements", description: "Highlights contributions, code reviews, and community collaboration." },
      { title: "Bootcamp Capstone Focus", description: "Presents your complex project architectures clearly to hiring managers." },
      { title: "Transferable Analytical Wins", description: "Frames your previous career history through database, management, and process scales." }
    ]
  }
};
