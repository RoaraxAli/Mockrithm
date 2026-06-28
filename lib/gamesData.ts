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

// Full curriculum maps for progressive topics
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
 * Procedural Lesson Syllabus Generator Engine
 * Transforms any gameId + level (1-500) into a highly unique, playable, fail-by-default coding challenge.
 */
export function generateLevel(gameId: string, level: number): LevelData {
  const game = GAMES_LIST.find(g => g.id === gameId);
  if (!game) throw new Error(`Game ${gameId} not found`);

  const tier = getTierName(level);
  const topics = GAME_SYLLABUS[gameId] || ["Syntax Foundations"];
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

  // Stack-Specific Procedural Syllabus Generator
  switch (gameId) {
    case "html5":
      checkType = "html";
      conceptText = `### 1. The Concept (The "Why")
HTML tags define the skeletal elements of your portal. In this level, we explore **${concept}** (Part ${stepIndex + 1}).
To construct a valid node, we wrap our target content inside appropriate semantic HTML tags.`;
      
      if (concept.includes("Headings") || concept.includes("Skeleton")) {
        const size = (stepIndex % 3) + 1;
        codeExample = `\`\`\`html\n<h${size}>Title Text</h${size}>\n\`\`\``;
        missionText = `### 2. Your Mission
Write an \`<h${size}>\` tag containing the exact text **"${concept} Step ${stepIndex + 1}"** inside the \`#element-container\` wrapper.`;
        starterCode = `<!-- HTML Workspace -->\n<div id="element-container">\n  \n</div>`;
        hints = [`Use the <h${size}> tag.`, "Make sure to open and close the tag properly."];
        testCases = [
          { description: `Should contain an h${size} tag`, testRegex: `<h${size}[\\s>]` },
          { description: `Should render "${concept} Step ${stepIndex + 1}"`, testRegex: `${concept.replace("&", "\\&")}\\s+Step\\s+${stepIndex + 1}` }
        ];
      } else if (concept.includes("Paragraphs")) {
        codeExample = `\`\`\`html\n<p>This is a text paragraph.</p>\n\`\`\``;
        missionText = `### 2. Your Mission
Create a \`<p>\` paragraph element containing the text **"Writing paragraph lines for ${stepIndex + 1}"** inside the container.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Use the <p> tag.", "Spell the string accurately."];
        testCases = [
          { description: "Should contain a p paragraph tag", testRegex: "<p[\\s>]" },
          { description: `Should contain "Writing paragraph lines for ${stepIndex + 1}"`, testRegex: `Writing\\s+paragraph\\s+lines\\s+for\\s+${stepIndex + 1}` }
        ];
      } else if (concept.includes("Hyperlinks")) {
        codeExample = `\`\`\`html\n<a href="/target">Link Text</a>\n\`\`\``;
        missionText = `### 2. Your Mission
Add an anchor link pointing to **"https://mockrithm.com/games/${stepIndex + 1}"** that says **"Arena Gateway"**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Use href='https://mockrithm.com/games/X' inside an <a> tag."];
        testCases = [
          { description: "Should contain an anchor a tag", testRegex: "<a[\\s>]" },
          { description: `Should link to the URL for step ${stepIndex + 1}`, testRegex: `href=["']https://mockrithm\\.com/games/${stepIndex + 1}["']` }
        ];
      } else {
        codeExample = `\`\`\`html\n<!-- Example -->\n<div id="item-${stepIndex}">Active</div>\n\`\`\``;
        missionText = `### 2. Your Mission
Add a \`<div>\` element inside the container with an attribute \`id="node-${stepIndex}"\` containing the word **"Unlocking"**.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Use <div id='node-X'>.", "Close the element."];
        testCases = [
          { description: `Should have element with id="node-${stepIndex}"`, testRegex: `id=["']node-${stepIndex}["']` },
          { description: "Should contain the word 'Unlocking'", testRegex: "Unlocking" }
        ];
      }
      break;

    case "css3":
      checkType = "css";
      conceptText = `### 1. The Concept (The "Why")
CSS style sheets paint layout parameters onto elements. Today we configure **${concept}** (Part ${stepIndex + 1}) inside our grid styles.
Values can specify sizes in pixels (\`px\`), relative units (\`rem\`), or percentage values (\`%\`).`;

      if (concept.includes("Color")) {
        const colorVal = `#${(stepIndex * 11).toString(16).padStart(3, "a")}`;
        codeExample = `\`\`\`css\n.visual-box {\n  color: ${colorVal};\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Apply the CSS declaration **\`color: ${colorVal};\`** (or matching properties) inside the \`.visual-box\` selector.`;
        starterCode = `/* CSS Style Space */\n.visual-box {\n  \n}`;
        hints = [`Write 'color: ${colorVal};' inside the curly braces.`];
        testCases = [
          { description: `Color property must be set to ${colorVal}`, testRegex: `color:\\s*${colorVal}` }
        ];
      } else if (concept.includes("Box Model") || concept.includes("spacing")) {
        const spacingSize = (stepIndex + 1) * 5;
        codeExample = `\`\`\`css\n.visual-box {\n  padding: ${spacingSize}px;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Set the **\`padding\`** of the element class selector \`.visual-box\` to exactly **\`${spacingSize}px\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'padding: ${spacingSize}px;'`];
        testCases = [
          { description: `Padding must be exactly ${spacingSize}px`, testRegex: `padding:\\s*${spacingSize}px` }
        ];
      } else if (concept.includes("Flexbox")) {
        const align = stepIndex % 2 === 0 ? "center" : "flex-end";
        codeExample = `\`\`\`css\n.visual-box {\n  display: flex;\n  justify-content: ${align};\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Write CSS rules inside the selector to establish a flexbox layout, and set the **\`justify-content\`** property to **\`${align}\`**.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = ["Include both 'display: flex;' and 'justify-content'."];
        testCases = [
          { description: "Should apply display: flex", testRegex: "display:\\s*flex" },
          { description: `Should justify contents to ${align}`, testRegex: `justify-content:\\s*${align}` }
        ];
      } else {
        const val = (stepIndex + 1) * 10;
        codeExample = `\`\`\`css\n.visual-box {\n  width: ${val}%;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Set the **\`width\`** property of the element to exactly **\`${val}%\`** to scale the block.`;
        starterCode = `.visual-box {\n  \n}`;
        hints = [`Write 'width: ${val}%;'`];
        testCases = [
          { description: `Width must be ${val}%`, testRegex: `width:\\s*${val}%` }
        ];
      }
      break;

    case "javascript":
      checkType = "eval";
      conceptText = `### 1. The Concept (The "Why")
JavaScript evaluates scripts and runs logic on inputs. Today we master **${concept}** (Part ${stepIndex + 1}).
To complete this, you must write a function body that returns a calculated value.`;

      if (concept.includes("Variables") || concept.includes("Arithmetic")) {
        const adder = (stepIndex + 1) * 3;
        codeExample = `\`\`\`javascript\nfunction processData(x) {\n  const result = x + ${adder};\n  return result;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Complete the function \`processData\` so that it adds exactly **\`${adder}\`** to the input parameter \`x\` and returns it.`;
        starterCode = `function processData(x) {\n  // Write your code here\n  \n}`;
        hints = [`Use 'return x + ${adder};'`];
        testCases = [
          { description: "Function processData must exist", testRegex: "function\\s+processData" },
          { description: `Adds ${adder} to input value`, customCheck: `(code) => {
            const fn = new Function(code + "; return processData(10);");
            return fn() === 10 + ${adder};
          }` }
        ];
      } else if (concept.includes("Conditional")) {
        const threshold = (stepIndex + 1) * 10;
        codeExample = `\`\`\`javascript\nif (x > ${threshold}) {\n  return "High";\n} else {\n  return "Low";\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Complete the function \`processData(x)\`. If the value of \`x\` is greater than or equal to **\`${threshold}\`**, return the string **\`"High"\`**, else return the string **\`"Low"\`**.`;
        starterCode = `function processData(x) {\n  // Write conditional logic\n  \n}`;
        hints = [`Use an if/else block checking against ${threshold}.`];
        testCases = [
          { description: "Checks conditional branching properly", customCheck: `(code) => {
            const fn = new Function(code + "; return processData(${threshold + 5}) === 'High' && processData(${threshold - 5}) === 'Low';");
            return fn();
          }` }
        ];
      } else if (concept.includes("Array") || concept.includes("loop")) {
        codeExample = `\`\`\`javascript\n// Summing items\nlet total = arr.reduce((a, b) => a + b, 0);\n\`\`\``;
        missionText = `### 2. Your Mission
Write a function \`processData(arr)\` that takes an array of numbers and returns the sum of all elements. If the array is empty, return **\`0\`**.`;
        starterCode = `function processData(arr) {\n  // Sum array elements\n  \n}`;
        hints = ["You can use a for loop or the array.reduce() method."];
        testCases = [
          { description: "Correctly sums elements [1, 2, 3]", customCheck: `(code) => {
            const fn = new Function(code + "; return processData([1, 2, 3]);");
            return fn() === 6;
          }` },
          { description: "Handles empty array inputs", customCheck: `(code) => {
            const fn = new Function(code + "; return processData([]);");
            return fn() === 0;
          }` }
        ];
      } else {
        // Fallback calculations
        codeExample = `\`\`\`javascript\nfunction processData(x) {\n  return x * 2;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Write a function \`processData(x)\` that returns the string **\`"passed"\`** if the input is \`true\`, or **\`"failed"\`** otherwise.`;
        starterCode = `function processData(x) {\n  \n}`;
        hints = ["Use a simple ternary return statement."];
        testCases = [
          { description: "Returns string depending on boolean check", customCheck: `(code) => {
            const fn = new Function(code + "; return processData(true) === 'passed' && processData(false) === 'failed';");
            return fn();
          }` }
        ];
      }
      break;

    case "typescript":
      checkType = "eval";
      conceptText = `### 1. The Concept (The "Why")
TypeScript secures compile-time parameters. Here we typed **${concept}** (Part ${stepIndex + 1}).
We declare typed structures to enforce interfaces.`;

      if (concept.includes("types") || concept.includes("alias")) {
        codeExample = `\`\`\`typescript\ntype TargetType = string | number;\n\`\`\``;
        missionText = `### 2. Your Mission
Declare a function \`processType(x: string | number)\` that returns the string **\`"typed"\`**.`;
        starterCode = `// TS space\nfunction processType(x: any) {\n  \n}`;
        hints = ["Replace 'any' with the union string | number typing."];
        testCases = [
          { description: "Uses TS parameters typing for x", testRegex: "processType\\s*\\(\\s*x\\s*:\\s*(string\\s*\\|\\s*number|number\\s*\\|\\s*string)\\s*\\)" }
        ];
      } else if (concept.includes("Interface")) {
        codeExample = `\`\`\`typescript\ninterface UserItem {\n  id: number;\n  name: string;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Define an interface named \`AdminItem\` that contains a key \`role\` typed as \`string\`, and a key \`clearance\` typed as \`number\`.`;
        starterCode = `// Define AdminItem below\n`;
        hints = ["Declare interface AdminItem { ... }"];
        testCases = [
          { description: "Interface AdminItem must be declared", testRegex: "interface\\s+AdminItem" },
          { description: "Contains role property", testRegex: "role\\s*:\\s*string" },
          { description: "Contains clearance property", testRegex: "clearance\\s*:\\s*number" }
        ];
      } else {
        codeExample = `\`\`\`typescript\nfunction getArray<T>(item: T): T[] {\n  return [item];\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Create a generic function \`identity<T>(val: T): T\` that returns the input parameter directly.`;
        starterCode = `// TS generic workspace\n`;
        hints = ["Use generic parameter <T> on the function definition."];
        testCases = [
          { description: "Defines generic identity function", testRegex: "function\\s+identity\\s*<\\s*T\\s*>" }
        ];
      }
      break;

    case "reactjs":
      checkType = "react";
      conceptText = `### 1. The Concept (The "Why")
React maps states to HTML components. Here we handle **${concept}** (Part ${stepIndex + 1}).
We render tags and update state triggers.`;

      if (concept.includes("State")) {
        codeExample = `\`\`\`jsx\nconst [count, setCount] = useState(0);\n\`\`\``;
        missionText = `### 2. Your Mission
Implement component state using **\`useState\`** initialized to **\`0\`**. Render the current state number inside a container div with className \`"react-box"\`.`;
        starterCode = `import React, { useState } from 'react';\n\nexport default function CounterControl() {\n  // Write state hook below\n  \n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
        hints = ["Declare state variables using destructuring."];
        testCases = [
          { description: "Calls useState hook", testRegex: "useState\\(\\s*0\\s*\\)" }
        ];
      } else {
        codeExample = `\`\`\`jsx\nexport default function User({ name }) {\n  return <h1>{name}</h1>;\n}\n\`\`\``;
        missionText = `### 2. Your Mission
Implement props destructured parameter \`{ role }\` in functional component \`CounterControl\`, and render it inside a heading tag.`;
        starterCode = `import React from 'react';\n\nexport default function CounterControl(props) {\n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
        hints = ["Replace props parameter with destructured { role }."];
        testCases = [
          { description: "Destructures role prop in parameter", testRegex: "CounterControl\\s*\\(\\s*\\{\\s*role\\s*\\}\\s*\\)" }
        ];
      }
      break;

    case "nodejs":
      checkType = "node";
      conceptText = `### 1. The Concept (The "Why")
Node.js processes server files. We explore **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("FS") || concept.includes("file")) {
        codeExample = `\`\`\`javascript\nfs.writeFileSync('log.txt', 'Info');\n\`\`\``;
        missionText = `### 2. Your Mission
Write a Node script inside \`runNodeScript\` using the filesystem module to write the string **\`"Node Log ${stepIndex}"\`** to a file named **\`"build.log"\`**.`;
        starterCode = `function runNodeScript(require) {\n  const fs = require('fs');\n  // Write file below\n  \n}`;
        hints = ["Call fs.writeFileSync('build.log', ...)."];
        testCases = [
          { description: "Fails template check (must use writeFileSync)", testRegex: "fs\\.writeFileSync" },
          { description: `Writes exact string "Node Log ${stepIndex}"`, testRegex: `Node\\s+Log\\s+${stepIndex}` }
        ];
      } else {
        codeExample = `\`\`\`javascript\nconst path = require('path');\nconst file = path.join(__dirname, 'src');\n\`\`\``;
        missionText = `### 2. Your Mission
Use Node's **\`path\`** module to join path parameters. Resolve path strings.`;
        starterCode = `function runNodeScript(require) {\n  const path = require('path');\n  // Declare path join below\n  \n}`;
        hints = ["Use path.join() in your code."];
        testCases = [
          { description: "Uses path.join to resolve folders", testRegex: "path\\.join" }
        ];
      }
      break;

    case "nextjs":
      checkType = "react";
      conceptText = `### 1. The Concept (The "Why")
Next.js handles SSR and server segmented routers. We examine **${concept}** (Part ${stepIndex + 1}).`;

      codeExample = `\`\`\`jsx\nimport Image from 'next/image';\n// Render image tags\n\`\`\``;
      missionText = `### 2. Your Mission
Create a React default export page component using Next.js **\`next/image\`** components to render a graphic.`;
      starterCode = `// Page rendering workspace\n`;
      hints = ["Import Image from 'next/image' and use <Image src='' />."];
      testCases = [
        { description: "Imports Next.js Image component", testRegex: "import\\s+Image\\s+from\\s+['\"]next/image['\"]" }
      ];
      break;

    case "python":
      checkType = "eval";
      conceptText = `### 1. The Concept (The "Why")
Python structures code variables using indentations. Here we check **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("def") || concept.includes("function")) {
        const numVal = (stepIndex + 1) * 7;
        codeExample = `\`\`\`python\ndef solve_logic(x):\n    return x + ${numVal}\n\`\`\``;
        missionText = `### 2. Your Mission
Write a Python function named **\`solve_logic(x)\`** that returns the input value multiplied by exactly **\`${numVal}\`**.`;
        starterCode = `# Python space\ndef solve_logic(x):\n    pass`;
        hints = ["Multiply x by the multiplier value.", "Replace pass with the return statement."];
        testCases = [
          { description: "solve_logic function declared", testRegex: "def\\s+solve_logic" },
          { description: `Multiplies input by ${numVal}`, testRegex: `\\*\\s*${numVal}` }
        ];
      } else {
        codeExample = `\`\`\`python\nmy_list = [i for i in range(10)]\n\`\`\``;
        missionText = `### 2. Your Mission
Define a Python list named **\`items\`** containing numbers. Use list comprehension configurations.`;
        starterCode = `# Python items list\n`;
        hints = ["Create list: items = [x for x in ...]"];
        testCases = [
          { description: "Declares list items", testRegex: "items\\s*=\\s*" }
        ];
      }
      break;

    case "sql":
      checkType = "sql";
      conceptText = `### 1. The Concept (The "Why")
SQL filters relational records. In this lesson, we examine **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("Where") || concept.includes("Select")) {
        const lvlCap = (stepIndex + 1) * 3;
        codeExample = `\`\`\`sql\nSELECT name FROM dungeon_users\nWHERE level > ${lvlCap};\n\`\`\``;
        missionText = `### 2. Your Mission
Formulate a query selecting all fields from table \`dungeon_users\` where column **\`level\`** is greater than exactly **\`${lvlCap}\`**.`;
        starterCode = `-- SQL workspace\n`;
        hints = [`Write 'WHERE level > ${lvlCap}' in the query.`];
        testCases = [
          { description: "Uses SELECT statements", testRegex: "SELECT\\s+(\\*|[a-zA-Z0-9_,\\s]+)\\s+FROM" },
          { description: "References correct table", testRegex: "FROM\\s+dungeon_users" },
          { description: `Filters levels higher than ${lvlCap}`, testRegex: `level\\s*>\\s*${lvlCap}` }
        ];
      } else {
        codeExample = `\`\`\`sql\nSELECT class, COUNT(*) FROM dungeon_users\nGROUP BY class;\n\`\`\``;
        missionText = `### 2. Your Mission
Write an SQL aggregate statement grouping table records by **\`class\`** columns.`;
        starterCode = `-- SQL query\n`;
        hints = ["Use GROUP BY class in your query statement."];
        testCases = [
          { description: "Groups by class column", testRegex: "GROUP\\s+BY\\s+class" }
        ];
      }
      break;

    case "django":
      checkType = "eval";
      conceptText = `### 1. The Concept (The "Why")
Django ORM and FastAPI controllers bind model objects. We check **${concept}** (Part ${stepIndex + 1}).`;

      codeExample = `\`\`\`python\nclass Item(BaseModel):\n    id: int\n\`\`\``;
      missionText = `### 2. Your Mission
Declare a Pydantic model named **\`PayloadSchema\`** that contains an attribute **\`id\`** typed as \`int\`.`;
      starterCode = `# Model workspace\nfrom pydantic import BaseModel\n`;
      hints = ["Declare class PayloadSchema(BaseModel) and set type."];
      testCases = [
        { description: "Declares PayloadSchema class", testRegex: "class\\s+PayloadSchema" },
        { description: "Uses Pydantic BaseModel", testRegex: "PayloadSchema\\s*\\(\\s*BaseModel\\s*\\)" }
      ];
      break;

    case "git":
      checkType = "git";
      conceptText = `### 1. The Concept (The "Why")
Git handles branch merges and timeline commits. We review **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("branch") || concept.includes("checkout")) {
        codeExample = `\`\`\`bash\ngit branch feature-profile\ngit checkout feature-profile\n\`\`\``;
        missionText = `### 2. Your Mission
Initialize a new git branch named **\`timeline-patch-${stepIndex}\`** and switch to it. Write the git CLI commands inside the terminal interface.`;
        starterCode = `git init\n`;
        hints = [`Use 'git checkout -b timeline-patch-${stepIndex}' or write it as separate branch/checkout statements.`];
        testCases = [
          { description: `Initializes git repository`, testRegex: "git init" },
          { description: `Switches to branch timeline-patch-${stepIndex}`, testRegex: `git\\s+(checkout\\s+-b\\s+|branch\\s+)timeline-patch-${stepIndex}` }
        ];
      } else {
        codeExample = `\`\`\`bash\ngit commit -m "timeline patch"\n\`\`\``;
        missionText = `### 2. Your Mission
Stage all files and execute a git commit with the message **\`"version patch ${stepIndex}"\`**.`;
        starterCode = `git init\n`;
        hints = ["Use git add . and git commit -m 'msg'."];
        testCases = [
          { description: "Stages workspace changes", testRegex: "git\\s+add" },
          { description: `Commits message 'version patch ${stepIndex}'`, testRegex: `git\\s+commit\\s+-m\\s+['"]version\\s+patch\\s+${stepIndex}['"]` }
        ];
      }
      break;

    case "docker":
      checkType = "docker";
      conceptText = `### 1. The Concept (The "Why")
Docker isolates microservice runtimes. Today we build **${concept}** (Part ${stepIndex + 1}) Dockerfiles.`;

      codeExample = `\`\`\`dockerfile\nFROM alpine:3.18\nWORKDIR /app\n\`\`\``;
      missionText = `### 2. Your Mission
Create a Dockerfile using **\`alpine:latest\`** as the base image, and configure the working directory to **\`"/citadel"\`**.`;
      starterCode = `# Dockerfile workspace\n`;
      hints = ["Use FROM alpine:latest and WORKDIR /citadel."];
      testCases = [
        { description: "Specifies alpine:latest base", testRegex: "FROM\\s+alpine:latest" },
        { description: "Sets working directory to /citadel", testRegex: "WORKDIR\\s+/citadel" }
      ];
      break;

    case "tailwind":
      checkType = "html";
      conceptText = `### 1. The Concept (The "Why")
Tailwind CSS provides responsive layout classes. Today we inspect **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("sizing") || concept.includes("padding") || concept.includes("Margin")) {
        const padVal = (stepIndex % 4) + 2;
        codeExample = `\`\`\`html\n<div class="p-${padVal}">Content</div>\n\`\`\``;
        missionText = `### 2. Your Mission
Write an HTML tag containing Tailwind CSS padding classes set to exactly **\`p-${padVal}\`** inside the wrapper container.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = [`Include class="p-${padVal}" inside the container.`];
        testCases = [
          { description: `Applies padding class p-${padVal}`, testRegex: `class=["'][^"']*p-${padVal}[^"']*["']` }
        ];
      } else {
        codeExample = `\`\`\`html\n<div class="flex items-center">Content</div>\n\`\`\``;
        missionText = `### 2. Your Mission
Create a responsive div structure applying the **\`flex\`** and **\`items-center\`** class utilities.`;
        starterCode = `<div id="element-container">\n  \n</div>`;
        hints = ["Use class='flex items-center'."];
        testCases = [
          { description: "Applies flex classes", testRegex: "class=[\"'][^\"]*flex[^\"]*[\"']" },
          { description: "Applies items-center class", testRegex: "class=[\"'][^\"]*items-center[^\"]*[\"']" }
        ];
      }
      break;

    case "cybersecurity":
      checkType = "security";
      conceptText = `### 1. The Concept (The "Why")
Cyber Security audits code weaknesses. Today we analyze **${concept}** (Part ${stepIndex + 1}).`;

      if (concept.includes("Injection") || concept.includes("SQL")) {
        codeExample = `\`\`\`sql\n' OR '1'='1\n\`\`\``;
        missionText = `### 2. Your Mission
Submit an SQL Injection payload key that forces conditional verification checks. Set payload to **\`"' OR '1'='1"\`**.`;
        starterCode = `# Exploit Payload workspace\npayload = ""`;
        hints = ["Assign the exploit string to the payload variable."];
        testCases = [
          { description: "Inputs SQL injection bypass payload", testRegex: "payload\\s*=\\s*['\"]'\\s*OR\\s*['\"]1['\"]\\s*=\\s*['\"]1['\"]" }
        ];
      } else {
        codeExample = `\`\`\`html\n<script>alert(1)</script>\n\`\`\``;
        missionText = `### 2. Your Mission
Formulate a basic Cross-Site Scripting (XSS) exploit string script tag containing an alert call. Set payload to **\`"<script>alert(1)</script>"\`**.`;
        starterCode = `# Payload input\npayload = ""`;
        hints = ["Write the alert script inside the payload quotes."];
        testCases = [
          { description: "Inputs XSS payload tags", testRegex: "payload\\s*=\\s*['\"]<script>alert\\(1\\)</script>['\"]" }
        ];
      }
      break;

    default:
      starterCode = `// Coding workspace`;
      hints = ["Implement target logic."];
      testCases = [{ description: "Completes instructions", testRegex: ".+" }];
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
