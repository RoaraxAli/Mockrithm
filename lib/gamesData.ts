// lib/gamesData.ts

export interface GameInfo {
  id: string;
  name: string;
  theme: string;
  iconName: string;
  description: string;
  gradient: string;
  prerequisites: string[];
}

export interface TestCase {
  name?: string;
  description?: string;
  input?: any[];
  expected?: any;
  customCheck?: string;
  testRegex?: string;
}

export interface LevelData {
  id: string;
  level: number;
  levelId: number;
  tier: "Apprentice" | "Mage" | "Knight" | "Warlord" | "Grandmaster";
  title: string;
  conceptText: string;
  codeExample: string;
  missionText: string;
  starterCode: string;
  hints: string[];
  validation: {
    checkType: "eval" | "regex" | "sql" | "html" | "css" | "git" | "docker" | "security" | "react" | "node";
    testCases: TestCase[];
  };
}

// 14 Games Definition
export const GAMES_LIST: GameInfo[] = [
  {
    id: "html5",
    name: "HTML5",
    theme: "Hypertext Architect",
    iconName: "FileCode",
    description: "Construct the skeletal foundations of the web. Learn semantic elements, layouts, and structures.",
    gradient: "from-orange-600 to-amber-500",
    prerequisites: []
  },
  {
    id: "css3",
    name: "CSS3",
    theme: "Layout Alchemist",
    iconName: "Palette",
    description: "Transmute structural code into beautiful digital canvases. Master flexbox, grids, and animations.",
    gradient: "from-blue-600 to-indigo-500",
    prerequisites: ["html5"]
  },
  {
    id: "javascript",
    name: "JavaScript",
    theme: "Cyberpunk Code Hacker",
    iconName: "Zap",
    description: "Bring static architectures to life. Hack scripts, handle async protocols, and conquer DOM terminals.",
    gradient: "from-yellow-500 to-amber-600",
    prerequisites: ["html5", "css3"]
  },
  {
    id: "typescript",
    name: "TypeScript",
    theme: "Type Guardian",
    iconName: "Shield",
    description: "Erect compile-time safety shields. Master strict types, complex interfaces, and advanced generics.",
    gradient: "from-cyan-600 to-blue-600",
    prerequisites: ["javascript"]
  },
  {
    id: "reactjs",
    name: "ReactJS",
    theme: "Virtual DOM Sorcerer",
    iconName: "Layers",
    description: "Weave component arrays and manage state portals. Optimize virtual render reconciliations.",
    gradient: "from-sky-500 to-teal-500",
    prerequisites: ["html5", "css3", "javascript"]
  },
  {
    id: "nodejs",
    name: "NodeJS",
    theme: "Server Core Overlord",
    iconName: "Cpu",
    description: "Harness back-end energy. Build filesystem routers, custom event loops, and server architectures.",
    gradient: "from-green-600 to-emerald-500",
    prerequisites: ["javascript"]
  },
  {
    id: "nextjs",
    name: "Next.js",
    theme: "Hydration Master",
    iconName: "Sparkles",
    description: "Bridge client portals and server bastions. Orchestrate Server Actions, SSR, and edge optimizations.",
    gradient: "from-zinc-700 to-zinc-900",
    prerequisites: ["reactjs", "nodejs"]
  },
  {
    id: "python",
    name: "Python",
    theme: "Snake AI Evolution",
    iconName: "Compass",
    description: "Write clean scripts and implement algorithms. Transition from syntax basics to decorators and asyncio.",
    gradient: "from-emerald-500 to-blue-600",
    prerequisites: []
  },
  {
    id: "sql",
    name: "SQL & Databases",
    theme: "Database Dungeon Crawler",
    iconName: "Database",
    description: "Descend into relational storage dungeons. Query keys, structure joins, and index transaction speeds.",
    gradient: "from-purple-600 to-indigo-600",
    prerequisites: []
  },
  {
    id: "django",
    name: "Django & FastAPI",
    theme: "REST Citadel",
    iconName: "Server",
    description: "Fortify endpoint barriers and design database migrations. Build secure REST and Async APIs.",
    gradient: "from-teal-600 to-green-700",
    prerequisites: ["python", "sql"]
  },
  {
    id: "git",
    name: "Git & GitHub",
    theme: "Timeline Weaver",
    iconName: "GitBranch",
    description: "Manipulate project history streams. Branch, rebase, resolve conflicts, and reverse timelines.",
    gradient: "from-rose-600 to-orange-500",
    prerequisites: ["html5"]
  },
  {
    id: "docker",
    name: "Docker & DevOps",
    theme: "Container Helmsman",
    iconName: "Container",
    description: "Encapsulate applications in container fleets. Build multi-stage Dockerfiles and deploy CI/CD.",
    gradient: "from-blue-500 to-cyan-500",
    prerequisites: ["nodejs"]
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    theme: "Utility Ninja",
    iconName: "Wind",
    description: "Style interfaces at lightning speed using CSS utility spells. Master configurations and responsiveness.",
    gradient: "from-cyan-500 to-teal-400",
    prerequisites: ["css3"]
  },
  {
    id: "cybersecurity",
    name: "Cyber Security",
    theme: "Net Defender",
    iconName: "ShieldAlert",
    description: "Infiltrate vulnerable targets and defend servers. Crack hashes, inject SQL, and secure endpoints.",
    gradient: "from-red-700 to-rose-950",
    prerequisites: ["javascript", "sql", "nodejs"]
  }
];

export function getTierName(level: number): "Apprentice" | "Mage" | "Knight" | "Warlord" | "Grandmaster" {
  if (level <= 100) return "Apprentice";
  if (level <= 200) return "Mage";
  if (level <= 300) return "Knight";
  if (level <= 400) return "Warlord";
  return "Grandmaster";
}

// Handcrafted Codédex blueprints for initial sequence (HTML5 Game target)
const HTML5_INITIAL_LEVELS: LevelData[] = [
  {
    id: "html5-1",
    level: 1,
    levelId: 1,
    tier: "Apprentice",
    title: "Document Skeleton",
    conceptText: `### 1. The Concept (The "Why")
Web pages are structured just like a **human skeleton**. In HTML5, we define structural wrappers to hold text content.
The container \`<div id="element-container">\` acts as the chest cavity, and we are going to place a **heart** inside it using a text layout!`,
    codeExample: `\`\`\`html
<div id="element-container">
  <h1>Document Skeleton</h1>
</div>
\`\`\``,
    missionText: `### 2. Your Mission
Write an HTML tag containing the text **"Document Skeleton Part 1"** inside the starter wrapper container.`,
    starterCode: `<!-- HTML Apprentice - Level 1 -->
<div id="element-container">
  
</div>`,
    hints: [
      "Use an <h1> or <h2> heading element.",
      "Ensure you close your tags properly.",
      "Check spelling: 'Document Skeleton Part 1'"
    ],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Should contain an h1 or h2 heading tag inside container",
          testRegex: "<(h1|h2)[\\s>]"
        },
        {
          description: "Should render the text 'Document Skeleton Part 1'",
          testRegex: "Document\\s+Skeleton\\s+Part\\s+1"
        }
      ]
    }
  },
  {
    id: "html5-2",
    level: 2,
    levelId: 2,
    tier: "Apprentice",
    title: "Headings & Paragraphs",
    conceptText: `### 1. The Concept (The "Why")
A page needs structural hierarchy. Headings range from \`<h1>\` (largest, main titles) down to \`<h6>\` (smallest subheaders).
For regular text blocks, we use the paragraph \`<p>\` tag, which adds standard spacing above and below.`,
    codeExample: `\`\`\`html
<h1>Main Title</h1>
<p>This is a standard body text block.</p>
\`\`\``,
    missionText: `### 2. Your Mission
Add an \`<h2>\` subtitle and a \`<p>\` description paragraph inside the container. The description paragraph must contain the phrase "Learn layout foundations".`,
    starterCode: `<!-- HTML Apprentice - Level 2 -->
<div id="element-container">
  
</div>`,
    hints: [
      "Add an <h2> element first.",
      "Create a <p> element next containing the target text.",
      "Verify tags close cleanly."
    ],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Should contain an h2 tag",
          testRegex: "<h2[\\s>]"
        },
        {
          description: "Should contain a p paragraph tag",
          testRegex: "<p[\\s>]"
        },
        {
          description: "Paragraph should contain the text 'Learn layout foundations'",
          testRegex: "Learn\\s+layout\\s+foundations"
        }
      ]
    }
  },
  {
    id: "html5-3",
    level: 3,
    levelId: 3,
    tier: "Apprentice",
    title: "Text Formatting",
    conceptText: `### 1. The Concept (The "Why")
Skeletel content can be highlighted. To make text **bold**, we use the \`<strong>\` tag. To *italicize* text, we wrap it in the \`<em>\` (emphasis) tag.
This lets the browser and screen readers know which words carry weight.`,
    codeExample: `\`\`\`html
<p>We must defend the <strong>Citadel</strong> from danger.</p>
\`\`\``,
    missionText: `### 2. Your Mission
Write a paragraph tag containing the bolded word **"stronghold"** inside the container using the \`<strong>\` tag.`,
    starterCode: `<!-- HTML Apprentice - Level 3 -->
<div id="element-container">
  
</div>`,
    hints: [
      "Wrap the target word inside <strong> and </strong>.",
      "Place the strong tag inside a <p> element.",
      "Check spelling of 'stronghold'"
    ],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Should include a strong tag",
          testRegex: "<strong[\\s>]"
        },
        {
          description: "Should contain the word 'stronghold'",
          testRegex: "stronghold"
        }
      ]
    }
  },
  {
    id: "html5-4",
    level: 4,
    levelId: 4,
    tier: "Apprentice",
    title: "Hyperlinks",
    conceptText: `### 1. The Concept (The "Why")
Links are the neural pathways of the internet. We weave them using the anchor \`<a>\` tag.
It requires an \`href\` attribute stating the target URL and wraps the clickable text.`,
    codeExample: `\`\`\`html
<a href="https://mockrithm.com">Click Here</a>
\`\`\``,
    missionText: `### 2. Your Mission
Create an anchor link pointing to **"https://mockrithm.com/games"** displaying the text "Enter Arena".`,
    starterCode: `<!-- HTML Apprentice - Level 4 -->
<div id="element-container">
  
</div>`,
    hints: [
      "Set the href attribute to 'https://mockrithm.com/games'.",
      "Set the anchor inner text to 'Enter Arena'."
    ],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Should contain an anchor link tag",
          testRegex: "<a[\\s>]"
        },
        {
          description: "Should specify the target href parameter",
          testRegex: "href=[\"']https://mockrithm\\.com/games[\"']"
        },
        {
          description: "Link text must read 'Enter Arena'",
          testRegex: ">Enter\\s+Arena</a>"
        }
      ]
    }
  },
  {
    id: "html5-5",
    level: 5,
    levelId: 5,
    tier: "Apprentice",
    title: "Image Embedding",
    conceptText: `### 1. The Concept (The "Why")
Images add portals to other visual dimensions. We embed them with the \`<img>\` tag.
It is a **self-closing tag** (meaning it does not need a closing \`</img>\` element) and uses the \`src\` attribute for the file path, along with \`alt\` for accessibility descriptions.`,
    codeExample: `\`\`\`html
<img src="/logo.svg" alt="Mockrithm Logo" />
\`\`\``,
    missionText: `### 2. Your Mission
Embed an image using the source path **"/logo.svg"** and an alt description tag set to "Cyber Logo".`,
    starterCode: `<!-- HTML Apprentice - Level 5 -->
<div id="element-container">
  
</div>`,
    hints: [
      "Use img tag properties src and alt.",
      "Remember that image tags are self-closing.",
      "Check spelling of '/logo.svg'"
    ],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Should contain an img tag",
          testRegex: "<img[\\s>]"
        },
        {
          description: "Source must point to '/logo.svg'",
          testRegex: "src=[\"']/logo\\.svg[\"']"
        },
        {
          description: "Alt description must read 'Cyber Logo'",
          testRegex: "alt=[\"']Cyber\\s+Logo[\"']"
        }
      ]
    }
  }
];

// Progressive sub-topics syllabus configuration mapping
const GAME_SYLLABUS: Record<string, string[]> = {
  html5: ["Headings", "Paragraphs", "Text Formatting", "Hyperlinks", "Image Embedding", "Lists", "Forms", "Semantic Containers", "Tables", "Video Player", "Canvas basics", "SVG inline", "Local storage links", "Geolocation", "Web Workers", "WebSockets", "Shadow DOM", "Custom Elements", "Preloading", "SEO Metadata"],
  css3: ["Color properties", "Box Model spacing", "Borders & Shadows", "Fonts & Alignment", "Flexbox Axes", "Flexbox Axes Alignments", "CSS Positioning", "Keyframe Animations", "Transitions speed", "CSS Transforms", "Gradients patterns", "Grid layout columns", "Will-Change render", "CSS custom properties", "Container queries"],
  javascript: ["Variables let-const", "Arithmetic modifiers", "Conditional blocks", "While loop cycles", "Array manipulation", "Arrow function expressions", "Scope resolutions", "Array mapping", "Array filtering", "Promises & async", "DOM events listeners", "Closures scopes", "Prototype inheritances", "Debounce utilities", "AST compilations"],
  typescript: ["Primitive variables typing", "Tuple structures", "Interface models", "Type alias sets", "Union intersections", "Access parameters modifiers", "Generics declarations", "Generic constraint criteria", "Utility Partial and Pick", "Mapped typing parameters", "Discriminated unions"],
  reactjs: ["JSX structures", "Component properties", "UseState variables", "Conditional tags", "UseEffect data updates", "UseRef tags selection", "Context providers", "UseReducer structures", "UseCallback cache functions", "UseMemo cache values", "Zustand global stores"],
  nodejs: ["Process args parsing", "Path resolutions", "FS file writing", "FS file reading", "Event Emitter listeners", "HTTP server routing", "Express server setup", "Express middleware logic", "JWT token signatures", "Node worker threads"],
  nextjs: ["App router paths", "Link navigation next/link", "Image tag next/image", "Page dynamic route layout", "RSC Server actions", "UseActionState hooks", "Route API handlers", "NextAuth configurations", "Sitemaps indexing", "Caching segment options"],
  python: ["Indentation values print", "Conditional expressions", "Def parameter functions", "List dict items", "List comprehensions", "Lambda declarations", "Classes instances init", "Yield generator loops", "Asyncio tasks loops", "Metaclasses overrides"],
  sql: ["Select query columns", "Where filter values", "Order by sorting", "Inner join relations", "Group by aggregates", "Having query limits", "Subqueries select parameters", "Triggers actions events", "Transactions logs commit", "Explain plan indexes"],
  django: ["Startproject structures", "FastAPI path variables", "FastAPI request query items", "Pydantic validator schemas", "Django ORM filtering", "FastAPI async endpoints", "FastAPI Dependency injections", "Celery task pipelines", "DRF serializers mapping", "Async database postgres"],
  git: ["Git init configuration", "Git status stages", "Git add workspace", "Git commit hashes", "Git log timeline", "Git branch creations", "Git merge timelines", "Git rebase paths", "Git stash temporary status", "Git reflog recovery"],
  docker: ["Docker version listings", "Docker run hello", "Docker ps statuses", "Dockerfile FROM images", "Dockerfile WORKDIR targets", "Dockerfile COPY files", "Docker Volume bounds", "Docker Compose configuration", "Multi-stage builds reduce", "K8s service pods"],
  tailwind: ["Text sizes text-lg", "Margin and paddings", "Background colors bg-zinc", "Borders rounded utilities", "Flex grid responsive sm", "Hover states hover:bg", "Transitions durations", "Custom extend spacing", "Arbitrary colors extends", "Tailwind plugins writes"],
  cybersecurity: ["HTTP status codes", "Base64 decodings", "MD5 hashing check", "SQL Injection bypasses", "Cross Site Scripting XSS", "CSRF token checks", "JWT none algorithm cracking", "Command Injection terminal", "SSRF server-side requests", "Privilege escalations audits"]
};

/**
 * Dynamic Progressive Syllabus Generator
 * Maps level L and step index to completely different, progressive categories of missions.
 */
export function generateLevel(gameId: string, level: number): LevelData {
  // Use handcrafted HTML5 levels 1-5 for initial onboarding
  if (gameId === "html5" && level <= 5) {
    return HTML5_INITIAL_LEVELS[level - 1];
  }

  const game = GAMES_LIST.find(g => g.id === gameId);
  if (!game) throw new Error(`Game ${gameId} not found`);

  const tier = getTierName(level);
  const topics = GAME_SYLLABUS[gameId] || ["General Foundations"];
  const topicIndex = Math.floor((level - 1) / 10) % topics.length;
  const stepIndex = (level - 1) % 10;
  const concept = topics[topicIndex];

  const title = `Level ${level}: ${concept} (Part ${stepIndex + 1})`;
  const id = `${gameId}-${level}`;

  let conceptText = "";
  let codeExample = "";
  let missionText = "";
  let starterCode = "";
  let hints: string[] = [];
  let checkType: LevelData["validation"]["checkType"] = "eval";
  let testCases: TestCase[] = [];

  // Determine step category based on stepIndex to vary task structures!
  const categoryIndex = stepIndex % 5;

  switch (gameId) {
    case "html5":
      checkType = "html";
      if (categoryIndex === 0) {
        // Category 0: Headings
        const headingSize = (level % 4) + 1; // dynamically sets h1, h2, h3, h4
        conceptText = `### 1. The Concept (The "Why")\nHTML headings structure key headers. Today we explore **${concept}** (Part ${stepIndex + 1}) using size \`<h${headingSize}>\` tags.`;
        codeExample = `\`\`\`html\n<h${headingSize}>Content Header</h${headingSize}>\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a heading tag **\`<h${headingSize}>\`** containing the exact text **\`"Heading Level ${level}"\`** inside the container.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Write '<h${headingSize}>Heading Level ${level}</h${headingSize}>'`];
        testCases = [
          { description: `Contains <h${headingSize}> tag`, testRegex: `<h${headingSize}[\\s>]` },
          { description: `Renders text "Heading Level ${level}"`, testRegex: `Heading\\s+Level\\s+${level}` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Paragraphs
        conceptText = `### 1. The Concept (The "Why")\nParagraph tags structure paragraph blocks. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<p>Body copy lines</p>\n\`\`\``;
        missionText = `### 2. Your Mission\nCreate a paragraph element **\`<p>\`** containing the phrase **\`"Active parameter index is ${level}"\`**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Use <p> tags enclosing 'Active parameter index is ${level}'.`];
        testCases = [
          { description: "Contains a <p> tag", testRegex: "<p[\\s>]" },
          { description: `Renders text "Active parameter index is ${level}"`, testRegex: `Active\\s+parameter\\s+index\\s+is\\s+${level}` }
        ];
      } else if (categoryIndex === 2) {
        // Category 2: Anchors
        conceptText = `### 1. The Concept (The "Why")\nAnchors link URL paths together. We explore **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<a href="/target">Label</a>\n\`\`\``;
        missionText = `### 2. Your Mission\nAdd an anchor tag linking to **\`"https://mockrithm.me/level/${level}"\`** with the click label **\`"Proceed ${level}"\`**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Write '<a href="https://mockrithm.me/level/${level}">Proceed ${level}</a>'`];
        testCases = [
          { description: "Contains an anchor tag", testRegex: "<a[\\s>]" },
          { description: `Links to target path`, testRegex: `href=["']https://mockrithm\\.me/level/${level}["']` },
          { description: `Has label "Proceed ${level}"`, testRegex: `Proceed\\s+${level}` }
        ];
      } else if (categoryIndex === 3) {
        // Category 3: List Items
        conceptText = `### 1. The Concept (The "Why")\nHTML list structures bundle points together. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<ul>\n  <li>Item</li>\n</ul>\n\`\`\``;
        missionText = `### 2. Your Mission\nConstruct an unordered list **\`<ul>\`** containing a list item **\`<li>\`** displaying the text **\`"Syllabus Item ${level}"\`**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Nest <li> inside <ul>."];
        testCases = [
          { description: "Contains a ul tag", testRegex: "<ul[\\s>]" },
          { description: "Contains a li tag", testRegex: "<li[\\s>]" },
          { description: `Renders text "Syllabus Item ${level}"`, testRegex: `Syllabus\\s+Item\\s+${level}` }
        ];
      } else {
        // Category 4: Specialized Div nodes
        conceptText = `### 1. The Concept (The "Why")\nDiv tags define document modules. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<div id="wrapper">Block</div>\n\`\`\``;
        missionText = `### 2. Your Mission\nCreate a child div inside the container setting its id attribute to exactly **\`"portal-node-${level}"\`** containing the text **\`"Online"\`**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Write '<div id="portal-node-${level}">Online</div>'`];
        testCases = [
          { description: `Has div with id="portal-node-${level}"`, testRegex: `id=["']portal-node-${level}["']` },
          { description: "Displays text 'Online'", testRegex: "Online" }
        ];
      }
      break;

    case "css3":
      checkType = "css";
      if (categoryIndex === 0) {
        // Category 0: Colors
        const hex = `#${(level % 16).toString(16).repeat(3)}`;
        conceptText = `### 1. The Concept (The "Why")\nCSS properties style element colors. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`css\n.visual-box {\n  color: ${hex};\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nSet the text **\`color\`** property of class selector \`.visual-box\` to exactly **\`${hex}\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'color: ${hex};'`];
        testCases = [
          { description: `Sets color to ${hex}`, testRegex: `color:\\s*${hex}` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Margins & Padding
        const size = (level % 10 + 1) * 4;
        conceptText = `### 1. The Concept (The "Why")\nBox model spacing configures internal padding. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`css\n.visual-box {\n  padding: ${size}px;\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a declaration inside the block setting the **\`padding\`** of the element to exactly **\`${size}px\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'padding: ${size}px;'`];
        testCases = [
          { description: `Sets padding to ${size}px`, testRegex: `padding:\\s*${size}px` }
        ];
      } else if (categoryIndex === 2) {
        // Category 2: Borders
        const size = (level % 4) + 1;
        conceptText = `### 1. The Concept (The "Why")\nBorders outline structural items. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`css\n.visual-box {\n  border: ${size}px solid red;\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nConfigure the **\`border-width\`** (or the generic border property) of the element class selector \`.visual-box\` to exactly **\`${size}px\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'border-width: ${size}px;' or 'border: ${size}px ...'`];
        testCases = [
          { description: `Border size set to ${size}px`, testRegex: `border(-width)?\\s*:\\s*(${size}px|[^;]*${size}px)` }
        ];
      } else if (categoryIndex === 3) {
        // Category 3: Layouts
        const displayType = level % 2 === 0 ? "flex" : "grid";
        conceptText = `### 1. The Concept (The "Why")\nCSS displays map layout parameters. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`css\n.visual-box {\n  display: ${displayType};\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nApply layout options by setting the **\`display\`** property of the class selector to exactly **\`${displayType}\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'display: ${displayType};'`];
        testCases = [
          { description: `Sets display to ${displayType}`, testRegex: `display:\\s*${displayType}` }
        ];
      } else {
        // Category 4: Transforms & Angles
        const rotVal = (level % 8 + 1) * 45;
        conceptText = `### 1. The Concept (The "Why")\nCSS transforms rotate visual matrices. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`css\n.visual-box {\n  transform: rotate(${rotVal}deg);\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nApply a transformation rotating the element by exactly **\`${rotVal}deg\`** using the **\`transform\`** property.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'transform: rotate(${rotVal}deg);'`];
        testCases = [
          { description: `Rotates element by ${rotVal}deg`, testRegex: `transform:\\s*rotate\\(\\s*${rotVal}deg\\s*\\)` }
        ];
      }
      break;

    case "javascript":
      checkType = "eval";
      if (categoryIndex === 0) {
        // Category 0: Basic math assignment
        const adder = level * 2;
        conceptText = `### 1. The Concept (The "Why")\nJavaScript evaluates numeric values. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nfunction processData(x) {\n  return x + ${adder};\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nComplete function \`processData(x)\` so that it returns the parameter \`x\` added to exactly **\`${adder}\`**.`;
        starterCode = `function processData(x) {\n  // Write logic\n  \n}`;
        hints = [`Use 'return x + ${adder};'`];
        testCases = [
          { description: "Defines processData function", testRegex: "function\\s+processData" },
          { description: `Adds ${adder} to inputs`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData(5);");
            return fn() === 5 + ${adder};
          }` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Modulo & Operations
        const divisor = (level % 4) + 2;
        conceptText = `### 1. The Concept (The "Why")\nArithmetic operators modify values. We inspect **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nfunction processData(x) {\n  return x % ${divisor};\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a function body that returns the remainder of dividing the parameter \`x\` by exactly **\`${divisor}\`** (using the modulo \`%\` operator).`;
        starterCode = `function processData(x) {\n  \n}`;
        hints = [`Use 'return x % ${divisor};'`];
        testCases = [
          { description: `Performs mod division by ${divisor}`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData(15);");
            return fn() === 15 % ${divisor};
          }` }
        ];
      } else if (categoryIndex === 2) {
        // Category 2: Limit Conditionals
        const threshold = level * 10;
        conceptText = `### 1. The Concept (The "Why")\nBranching handles custom thresholds. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nif (x > ${threshold}) {\n  return "Above";\n} else {\n  return "Below";\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nComplete function \`processData(x)\` to return string **\`"Above"\`** if \`x\` exceeds **\`${threshold}\`**, and **\`"Below"\`** otherwise.`;
        starterCode = `function processData(x) {\n  \n}`;
        hints = [`Use if statements checking thresholds against ${threshold}.`];
        testCases = [
          { description: `Returns Above for values > ${threshold}`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData(${threshold + 5});");
            return fn() === "Above";
          }` },
          { description: `Returns Below for values <= ${threshold}`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData(${threshold - 5});");
            return fn() === "Below";
          }` }
        ];
      } else if (categoryIndex === 3) {
        // Category 3: Array Mapping
        const multiplier = (level % 5) + 2;
        conceptText = `### 1. The Concept (The "Why")\nMapping transforms arrays. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nreturn arr.map(n => n * ${multiplier});\n\`\`\``;
        missionText = `### 2. Your Mission\nComplete function \`processData(arr)\` to map over the array inputs, returning a new array where each number is multiplied by exactly **\`${multiplier}\`**.`;
        starterCode = `function processData(arr) {\n  \n}`;
        hints = [`Call 'return arr.map(item => item * ${multiplier});'`];
        testCases = [
          { description: `Maps elements multiplying by ${multiplier}`, customCheck: `(code) => {
            const fn = new Function(code + "; return JSON.stringify(processData([1, 2, 3]));");
            return fn() === JSON.stringify([1 * multiplier, 2 * multiplier, 3 * multiplier]);
          }` }
        ];
      } else {
        // Category 4: Object structures
        conceptText = `### 1. The Concept (The "Why")\nJSON object parameters package records. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nreturn { id: 1, val: ${level} };\n\`\`\``;
        missionText = `### 2. Your Mission\nComplete function \`processData()\` to return a plain object containing a key **\`level\`** set to the number **\`${level}\`**, and a key **\`status\`** set to string **\`"active"\`**.`;
        starterCode = `function processData() {\n  \n}`;
        hints = [`Use 'return { level: ${level}, status: "active" };'`];
        testCases = [
          { description: `Returns object with level ${level}`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData().level;");
            return fn() === level;
          }` },
          { description: "Sets status to active", customCheck: `(code) => {
            const fn = new Function(code + "; return processData().status;");
            return fn() === "active";
          }` }
        ];
      }
      break;

    case "typescript":
      checkType = "eval";
      if (categoryIndex === 0) {
        // Category 0: Union types
        const typesLabel = level % 2 === 0 ? "string | boolean" : "number | string";
        conceptText = `### 1. The Concept (The "Why")\nTypeScript types secure parameters. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`typescript\nfunction processType(x: ${typesLabel}) {}\n\`\`\``;
        missionText = `### 2. Your Mission\nDeclare a function named **\`processType\`** that accepts parameter \`x\` explicitly typed as **\`${typesLabel}\`**.`;
        starterCode = `// TS workspace\nfunction processType(x: any) {\n  \n}`;
        hints = [`Change type from 'any' to '${typesLabel}'`];
        testCases = [
          { description: `Declares function processType`, testRegex: "function\\s+processType" },
          { description: `Types parameter x as ${typesLabel}`, testRegex: `x\\s*:\\s*(${typesLabel.replace("|", "\\|")}|${typesLabel.split("|").reverse().join("|").replace("|", "\\|")})` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Interfaces
        const interfaceName = `LevelNode_${level}`;
        conceptText = `### 1. The Concept (The "Why")\nInterfaces model shape constraints. We inspect **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`typescript\ninterface ${interfaceName} {\n  id: number;\n  name: string;\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nDefine an interface named **\`${interfaceName}\`** with a property **\`uid\`** typed as \`number\`, and a property **\`tag\`** typed as \`string\`.`;
        starterCode = `// Declare interface below\n`;
        hints = [`Write 'interface ${interfaceName} { uid: number; tag: string; }'`];
        testCases = [
          { description: `Declares interface ${interfaceName}`, testRegex: `interface\\s+${interfaceName}` },
          { description: "Has property uid: number", testRegex: "uid\\s*:\\s*number" },
          { description: "Has property tag: string", testRegex: "tag\\s*:\\s*string" }
        ];
      } else if (categoryIndex === 2) {
        // Category 2: Generic functions
        conceptText = `### 1. The Concept (The "Why")\nGenerics define reusable type parameters. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`typescript\nfunction wrapper<T>(x: T): T {\n  return x;\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nCreate a generic function named **\`identity<T>\`** that accepts a parameter \`arg\` typed as **\`T\`** and returns type **\`T\`**.`;
        starterCode = `// Generic workspace\n`;
        hints = ["Write 'function identity<T>(arg: T): T { return arg; }'"];
        testCases = [
          { description: "Declares identity function with type parameter T", testRegex: "function\\s+identity\\s*<\\s*T\\s*>" },
          { description: "Types parameter as generic parameter", testRegex: "arg\\s*:\\s*T" }
        ];
      } else if (categoryIndex === 3) {
        // Category 3: Optional keys
        const propName = `option_${level}`;
        conceptText = `### 1. The Concept (The "Why")\nOptional properties are denoted by a question mark. We explore **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`typescript\ninterface Node {\n  name?: string;\n}\n\`\`\``;
        missionText = `### 2. Your Mission\nDefine an interface named **\`Params\`** containing an optional property named **\`${propName}\`** typed as \`boolean\`.`;
        starterCode = `interface Params {\n  \n}`;
        hints = [`Write '${propName}?: boolean;'`];
        testCases = [
          { description: `Contains optional property ${propName}`, testRegex: `${propName}\\s*\\?\\s*:\\s*boolean` }
        ];
      } else {
        // Category 4: Type aliases
        const aliasName = `KeyId_${level}`;
        conceptText = `### 1. The Concept (The "Why")\nType aliases name custom types. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`typescript\ntype ${aliasName} = string | number;\n\`\`\``;
        missionText = `### 2. Your Mission\nDeclare a type alias named **\`${aliasName}\`** that is a union of \`string\` and \`null\`.`;
        starterCode = `// Write type alias\n`;
        hints = [`Write 'type ${aliasName} = string | null;'`];
        testCases = [
          { description: `Defines type alias ${aliasName}`, testRegex: `type\\s+${aliasName}\\s*=\\s*` },
          { description: "Checks type is string | null", testRegex: "(string\\s*\\|\\s*null|null\\s*\\|\\s*string)" }
        ];
      }
      break;

    case "reactjs":
      checkType = "react";
      if (categoryIndex === 0) {
        // Category 0: useState hooks
        const initVal = level * 5;
        conceptText = `### 1. The Concept (The "Why")\nReact useState handles local component states. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`jsx\nconst [value, setValue] = useState(${initVal});\n\`\`\``;
        missionText = `### 2. Your Mission\nInitialize state in component \`CounterControl\` using **\`useState\`** with an initial value of exactly **\`${initVal}\`**.`;
        starterCode = `import React, { useState } from 'react';\n\nexport default function CounterControl() {\n  // Write hook below\n  \n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
        hints = [`Use 'const [state, setState] = useState(${initVal});'`];
        testCases = [
          { description: `Calls useState initialized to ${initVal}`, testRegex: `useState\\(\\s*${initVal}\\s*\\)` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Destructured Props
        conceptText = `### 1. The Concept (The "Why")\nReact components receive props values. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`jsx\nexport default function CounterControl({ role }) {}\n\`\`\``;
        missionText = `### 2. Your Mission\nModify component \`CounterControl\` parameter signature to destructure the prop parameter **\`{ levelId }\`** and render it inside the return div.`;
        starterCode = `import React from 'react';\n\nexport default function CounterControl(props) {\n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
        hints = ["Change (props) to ({ levelId }) and use {levelId} inside the tags."];
        testCases = [
          { description: "Destructures levelId parameter in props", testRegex: "CounterControl\\s*\\(\\s*\\{\\s*levelId\\s*\\}\\s*\\)" }
        ];
      } else {
        // Category 2: JSX tags
        conceptText = `### 1. The Concept (The "Why")\nJSX structures HTML elements inside React. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`jsx\nreturn <span className="label">Item</span>;\n\`\`\``;
        missionText = `### 2. Your Mission\nRender a child span tag inside the return div containing the text **\`"React Node ${level}"\`**.`;
        starterCode = `import React from 'react';\n\nexport default function CounterControl() {\n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
        hints = [`Write '<span>React Node ${level}</span>'`];
        testCases = [
          { description: "Contains span tag in JSX return", testRegex: "<span[\\s>]" },
          { description: `Renders text "React Node ${level}"`, testRegex: `React\\s+Node\\s+${level}` }
        ];
      }
      break;

    case "nodejs":
      checkType = "node";
      if (categoryIndex === 0) {
        // Category 0: fs writeFileSync
        conceptText = `### 1. The Concept (The "Why")\nNode filesystem writes variables to disc. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nfs.writeFileSync('output.log', 'Log text');\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a script inside \`runNodeScript\` using **\`fs.writeFileSync\`** to record string **\`"Status OK: ${level}"\`** to a file named **\`"build.log"\`**.`;
        starterCode = `function runNodeScript(require) {\n  const fs = require('fs');\n  // Write file\n  \n}`;
        hints = [`Write 'fs.writeFileSync("build.log", "Status OK: ${level}");'`];
        testCases = [
          { description: "Uses fs.writeFileSync method", testRegex: "fs\\.writeFileSync" },
          { description: `Writes text containing status level ${level}`, testRegex: `Status\\s+OK:\\s+${level}` }
        ];
      } else {
        // Category 1: path joins
        conceptText = `### 1. The Concept (The "Why")\nPath module joins relative strings. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`javascript\nconst file = path.join(__dirname, 'src');\n\`\`\ \``;
        missionText = `### 2. Your Mission\nJoin path directories by calling **\`path.join\`** on variables **\`__dirname\`** and **\`"assets"\`**.`;
        starterCode = `function runNodeScript(require) {\n  const path = require('path');\n  // Write path resolver\n  \n}`;
        hints = ["Use path.join(__dirname, 'assets') in your code."];
        testCases = [
          { description: "Uses path.join to resolve relative folders", testRegex: "path\\.join" },
          { description: "References assets path parameter", testRegex: "assets" }
        ];
      }
      break;

    case "nextjs":
      checkType = "react";
      conceptText = `### 1. The Concept (The "Why")\nNext.js structures route layout systems. We explore **${concept}** (Part ${stepIndex + 1}).`;
      codeExample = `\`\`\`jsx\nexport default function Page() {\n  return <h1>Next.js page</h1>;\n}\n\`\`\``;
      missionText = `### 2. Your Mission\nDefine a Next.js default page component named **\`Page\`** rendering a heading tag containing the title **\`"Portal ${level}"\`**.`;
      starterCode = `// Page route workspace\n`;
      hints = [`Write 'export default function Page() { return <h1>Portal ${level}</h1>; }'`];
      testCases = [
        { description: "Exports default Page component", testRegex: "export\\s+default\\s+function\\s+Page" },
        { description: `Renders text "Portal ${level}"`, testRegex: `Portal\\s+${level}` }
      ];
      break;

    case "python":
      checkType = "eval";
      if (categoryIndex === 0) {
        // Category 0: Variables
        const varName = `py_val_${level}`;
        const val = level * 15;
        conceptText = `### 1. The Concept (The "Why")\nIn Python, variable assignment binds a label to data. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`python\n${varName} = ${val}\n\`\`\``;
        missionText = `### 2. Your Mission\nDeclare a Python variable named **\`${varName}\`** and assign it the numeric value of exactly **\`${val}\`**.`;
        starterCode = `# Python variables space\n`;
        hints = [`Write '${varName} = ${val}'`];
        testCases = [
          { description: `Declares ${varName} equal to ${val}`, testRegex: `${varName}\\s*=\\s*${val}` }
        ];
      } else if (categoryIndex === 1) {
        // Category 1: Functions
        const fnName = `calc_level_${level}`;
        const multiplier = (level % 5) + 2;
        conceptText = `### 1. The Concept (The "Why")\nPython functions are declared with 'def'. We review **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`python\ndef ${fnName}(n):\n    return n * ${multiplier}\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a Python function named **\`${fnName}(n)\`** that takes a number and returns it multiplied by exactly **\`${multiplier}\`**.`;
        starterCode = `# Python functions workspace\ndef ${fnName}(n):\n    pass`;
        hints = [`Use 'return n * ${multiplier}'`];
        testCases = [
          { description: `Defines function ${fnName}`, testRegex: `def\\s+${fnName}` },
          { description: `Multiplies variable by ${multiplier}`, testRegex: `return\\s+n\\s*\\*\\s*${multiplier}` }
        ];
      } else if (categoryIndex === 2) {
        // Category 2: Conditionals
        const fnName = `check_bounds_${level}`;
        const cap = level * 5;
        conceptText = `### 1. The Concept (The "Why")\nConditionals branch script pathways. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`python\nif x >= ${cap}:\n    return True\nelse:\n    return False\n\`\`\``;
        missionText = `### 2. Your Mission\nComplete the function **\`${fnName}(x)\`** to return **\`True\`** if \`x\` is greater than or equal to **\`${cap}\`**, and **\`False\`** otherwise.`;
        starterCode = `# Python conditionals\ndef ${fnName}(x):\n    # Write logic\n    pass`;
        hints = [`Check parameter x against ${cap}.`];
        testCases = [
          { description: `Defines function ${fnName}`, testRegex: `def\\s+${fnName}` },
          { description: `Returns True when x >= ${cap}`, testRegex: `if\\s+x\\s*>=\\s*${cap}` }
        ];
      } else if (categoryIndex === 3) {
        // Category 3: List creation
        const listName = `items_level_${level}`;
        const size = (level % 5) + 3;
        conceptText = `### 1. The Concept (The "Why")\nPython lists store linear sequences. We inspect **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`python\n${listName} = [1, 2, 3]\n\`\`\``;
        missionText = `### 2. Your Mission\nDeclare a list variable named **\`${listName}\`** containing exactly **\`${size}\`** comma-separated numbers inside square brackets.`;
        starterCode = `# Python collections\n`;
        hints = [`Write '${listName} = [1, 2, ... up to ${size}]'`];
        testCases = [
          { description: `Declares list ${listName}`, testRegex: `${listName}\\s*=\\s*\\[` },
          { description: `Contains ${size} items`, testRegex: `\\[\\s*(\\d+\\s*,\\s*){${size - 1}}\\d+\\s*\\]` }
        ];
      } else {
        // Category 4: List comprehensions
        const varName = `powers_${level}`;
        conceptText = `### 1. The Concept (The "Why")\nList comprehensions compile sequences inline. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`python\n${varName} = [x * 2 for x in range(10)]\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a list comprehension storing values in a variable named **\`${varName}\`**.`;
        starterCode = `# Python loops\n`;
        hints = [`Write '${varName} = [x * 2 for x in range(5)]'`];
        testCases = [
          { description: `Uses list comprehension`, testRegex: `${varName}\\s*=\\s*\\[\\s*.*for\\s+.*in\\s+.*\\]` }
        ];
      }
      break;

    case "sql":
      checkType = "sql";
      if (categoryIndex === 0) {
        // Category 0: SELECT columns
        const limit = level * 4;
        conceptText = `### 1. The Concept (The "Why")\nSQL SELECT filters records. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`sql\nSELECT * FROM dungeon_users\nWHERE level > ${limit};\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite an SQL query to select all columns from table \`dungeon_users\` where column **\`level\`** is greater than exactly **\`${limit}\`**.`;
        starterCode = `-- SQL query\n`;
        hints = [`Include 'WHERE level > ${limit}' in the select statement.`];
        testCases = [
          { description: "Uses SELECT statements", testRegex: "SELECT" },
          { description: "References dungeon_users", testRegex: "dungeon_users" },
          { description: `Filters levels higher than ${limit}`, testRegex: `level\\s*>\\s*${limit}` }
        ];
      } else {
        // Category 1: ORDER BY
        conceptText = `### 1. The Concept (The "Why")\nSQL sorting sorts rows. We inspect **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`sql\nSELECT * FROM dungeon_users\nORDER BY level DESC;\n\`\`\``;
        missionText = `### 2. Your Mission\nFormulate a query selecting all rows from table \`dungeon_users\` sorted by **\`id\`** in descending order (\`DESC\`).`;
        starterCode = `-- SQL query\n`;
        hints = ["Use ORDER BY id DESC in your query statement."];
        testCases = [
          { description: "Includes ORDER BY command", testRegex: "ORDER\\s+BY" },
          { description: "Sorts by id in descending order", testRegex: "id\\s+DESC" }
        ];
      }
      break;

    case "django":
      checkType = "eval";
      conceptText = `### 1. The Concept (The "Why")\nAPI schemas bind route payloads. We cover **${concept}** (Part ${stepIndex + 1}).`;
      codeExample = `\`\`\`python\nclass Data(BaseModel):\n    uid: int\n\`\`\``;
      missionText = `### 2. Your Mission\nDeclare a FastAPI Pydantic schema class named **\`Params_${level}\`** inheriting from \`BaseModel\` containing a variable **\`uid\`** typed as \`int\`.`;
      starterCode = `from pydantic import BaseModel\n# Write model class\n`;
      hints = [`Write 'class Params_${level}(BaseModel): uid: int'`];
      testCases = [
        { description: `Declares Params_${level} schema class`, testRegex: `class\\s+Params_${level}` },
        { description: "Inherits from BaseModel", testRegex: `Params_${level}\\s*\\(\\s*BaseModel\\s*\\)` }
      ];
      break;

    case "git":
      checkType = "git";
      if (categoryIndex === 0) {
        // Category 0: Branch creation
        conceptText = `### 1. The Concept (The "Why")\nGit structures timeline logs. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`bash\ngit branch feature-node\ngit checkout feature-node\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite git commands to initialize a repository and create a branch named **\`branch-patch-${level}\`**.`;
        starterCode = `git init\n`;
        hints = [`Add command 'git branch branch-patch-${level}'`];
        testCases = [
          { description: "Initializes git repository", testRegex: "git init" },
          { description: `Creates branch branch-patch-${level}`, testRegex: `git\\s+branch\\s+branch-patch-${level}` }
        ];
      } else {
        // Category 1: Commits
        conceptText = `### 1. The Concept (The "Why")\nCommits record staged updates. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`bash\ngit commit -m "timeline update"\n\`\`\``;
        missionText = `### 2. Your Mission\nInitialize a repo, stage changes, and create a git commit with the exact message **\`"commit update ${level}"\`**.`;
        starterCode = `git init\n`;
        hints = [`Use 'git commit -m "commit update ${level}"'`];
        testCases = [
          { description: "Stages workspace changes", testRegex: "git\\s+add" },
          { description: `Commits message 'commit update ${level}'`, testRegex: `git\\s+commit\\s+-m\\s+['"]commit\\s+update\\s+${level}['"]` }
        ];
      }
      break;

    case "docker":
      checkType = "docker";
      conceptText = `### 1. The Concept (The "Why")\nDockerfiles configure container workspaces. We review **${concept}** (Part ${stepIndex + 1}).`;
      codeExample = `\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /citadel\n\`\`\``;
      missionText = `### 2. Your Mission\nWrite a Dockerfile using **\`node:alpine\`** as the base image and setting the working directory to **\`"/app-${level}"\`**.`;
      starterCode = `# Dockerfile workspace\n`;
      hints = [`Use 'FROM node:alpine' and 'WORKDIR /app-${level}'`];
      testCases = [
        { description: "Specifies base image node:alpine", testRegex: "FROM\\s+node:alpine" },
        { description: `Sets working folder /app-${level}`, testRegex: `WORKDIR\\s+/app-${level}` }
      ];
      break;

    case "tailwind":
      checkType = "html";
      if (categoryIndex === 0) {
        // Category 0: Padding utilities
        const pad = (level % 6) + 1;
        conceptText = `### 1. The Concept (The "Why")\nTailwind layout utilities style margins. We examine **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<div class="p-${pad}">Card</div>\n\`\`\``;
        missionText = `### 2. Your Mission\nWrite a div container applying Tailwind padding class **\`p-${pad}\`** around the text "Card".`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Write '<div class="p-${pad}">Card</div>'`];
        testCases = [
          { description: `Applies padding class p-${pad}`, testRegex: `class=["'][^"']*p-${pad}[^"']*["']` }
        ];
      } else {
        // Category 1: Width utilities
        conceptText = `### 1. The Concept (The "Why")\nTailwind widths configure element scaling. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<div class="w-full">Width scale</div>\n\`\`\``;
        missionText = `### 2. Your Mission\nApply class utility **\`w-1/2\`** (half width) to a div container inside the wrapper.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Use class='w-1/2' inside the tags."];
        testCases = [
          { description: "Applies width class w-1/2", testRegex: "class=[\"'][^\"]*w-1/2[^\"]*[\"']" }
        ];
      }
      break;

    case "cybersecurity":
      checkType = "security";
      conceptText = `### 1. The Concept (The "Why")\nPenetration audits check payload values. We examine **${concept}** (Part ${stepIndex + 1}).`;
      codeExample = `\`\`\`python\npayload = "' OR '1'='1"\n\`\`\``;
      missionText = `### 2. Your Mission\nSubmit the SQL Injection bypass payload key by declaring a variable **\`payload\`** equal to exactly **\`"auth-bypass-level-${level}"\`**.`;
      starterCode = `# Exploit payload workspace\npayload = ""`;
      hints = [`Set payload = "auth-bypass-level-${level}"`];
      testCases = [
        { description: `Declares payload equal to auth-bypass-level-${level}`, testRegex: `payload\\s*=\\s*['"]auth-bypass-level-${level}['"]` }
      ];
      break;

    default:
      starterCode = `// Workspace`;
      hints = ["Write target code."];
      testCases = [{ description: "Completes parameters", testRegex: ".+" }];
  }

  return {
    id,
    level,
    levelId: level,
    tier,
    title,
    conceptText,
    codeExample,
    missionText,
    starterCode,
    hints,
    validation: {
      checkType,
      testCases
    }
  };
}
