// lib/gamesData.ts

export interface GameInfo {
  id: string;
  name: string;
  theme: string;
  iconName: string; // Used to select Lucide icons dynamically
  description: string;
  gradient: string; // CSS gradient class
  prerequisites: string[];
}

export interface TestCase {
  name: string;
  input?: any[];
  expected: any;
  customCheck?: string; // JS code string for advanced checking
}

export interface LevelData {
  id: string;
  level: number;
  tier: "Apprentice" | "Mage" | "Knight" | "Warlord" | "Grandmaster";
  title: string;
  concept: string;
  instructions: string;
  starterCode: string;
  hints: string[];
  validation: {
    checkType: "eval" | "regex" | "sql" | "html" | "css" | "git" | "docker" | "security" | "react" | "node";
    testCases: TestCase[];
  };
}

// 14 Games Definition & Prerequisite Tree
export const GAMES_LIST: GameInfo[] = [
  {
    id: "html5",
    name: "HTML5",
    theme: "Hypertext Architect",
    iconName: "FileCode",
    description: "Construct the skeletal foundations of the web. Learn layout layouts, meta-tags, and semantic schemas.",
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
    prerequisites: ["nodejs"] // Simplified prerequisite tree (NodeJS or Django -> NodeJS is sufficient)
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

// Helper to determine Level Tier
export function getTierName(level: number): "Apprentice" | "Mage" | "Knight" | "Warlord" | "Grandmaster" {
  if (level <= 100) return "Apprentice";
  if (level <= 200) return "Mage";
  if (level <= 300) return "Knight";
  if (level <= 400) return "Warlord";
  return "Grandmaster";
}

/**
 * Procedural Syllabus Concept Map
 */
const GAME_SYLLABUS: Record<string, {
  Apprentice: string[];
  Mage: string[];
  Knight: string[];
  Warlord: string[];
  Grandmaster: string[];
}> = {
  html5: {
    Apprentice: ["Document Skeleton", "Text Formatting", "Headings & Paragraphs", "Hyperlinks", "Image Embedding", "Lists Creation", "HTML Forms basics", "Textarea & Input fields", "Button events layout", "Semantic elements"],
    Mage: ["HTML Table Structure", "Table Headers & Bodies", "Datalist and Option dropdowns", "Iframe Integrations", "Audio Tag Embedding", "Video Player Options", "Source elements", "Details & Summary collapsible blocks", "Dialog Modals", "Form Validations"],
    Knight: ["Canvas context setup", "Canvas Line Drawing", "Canvas Rectangles", "SVG Inline Graphics", "SVG Path creations", "Drag & Drop API", "Custom data-* Attributes", "Local storage links", "Geolocation API hooks", "Web Storage objects"],
    Warlord: ["HTML5 Web Workers", "Offline Manifests / PWA intro", "Server-Sent Events interface", "WebSockets setups", "Microdata Schemas", "SEO Semantic Hierarchy", "ARIA roles for accessibility", "Tabindex & keyboard navigation", "Form capture validation states", "AudioContext Nodes"],
    Grandmaster: ["Web Components creation", "Shadow DOM capsules", "HTML Templates & slots", "Custom HTML elements", "SEO Meta header injections", "Preload & Prefetch links", "AMP concepts", "Service Worker configurations", "WebRTC Peer Connections skeleton", "Dynamic layout rendering models"]
  },
  css3: {
    Apprentice: ["Element selectors", "Class & ID Selectors", "Color codes (HEX, RGB)", "CSS Box Model (Padding, Margin)", "Borders & Shadows", "Font Styling", "Text Alignment", "Background Colors", "Display Property (block/inline)", "Basic Link Styling"],
    Mage: ["Flexbox Containers", "Flexbox Axes Alignments", "Flex Direction & Wrap", "Grid Container Setups", "Grid Template Columns", "Absolute vs Relative positioning", "Float & Clear layout", "Opacity & Visibility", "Pseudo-classes (:hover, :focus)", "Pseudo-elements (::before, ::after)"],
    Knight: ["Media Queries (Mobile first)", "CSS Transitions speed", "2D Transforms (scale, translate)", "3D Transforms (rotate, perspective)", "CSS Keyframe Animations", "Linear Gradients", "Radial Gradients", "Clip-Path masks", "Object-Fit properties", "Z-Index Layering"],
    Warlord: ["CSS Custom Properties (Variables)", "CSS Variables Calc adjustments", "CSS Filters (blur, contrast)", "CSS Blend Modes", "CSS Grid Areas", "Subgrid concepts", "Feature Queries (@supports)", "Aspect-Ratio rules", "Logical Properties", "CSS Counters"],
    Grandmaster: ["Complex Responsive layouts", "Tailored Keyframe timelines", "Paint Performance Optimizations", "Will-Change rendering speed", "Container Queries (@container)", "Custom scroll behaviors", "Variable Font controls", "CSS Houdini Paint API basic concept", "Light/Dark mode standard theme systems", "Sass-like nesting compiler layout"]
  },
  javascript: {
    Apprentice: ["Declaring variables (let, const)", "Basic arithmetic operators", "String concatenation", "If/Else conditional blocks", "Switch statement structures", "While loop iterations", "For loop cycles", "Creating arrays", "Creating basic objects", "Defining simple functions"],
    Mage: ["Arrow function syntax", "Variable Scopes (Block, Function, Global)", "Array methods (map)", "Array methods (filter)", "Array methods (forEach)", "Array accumulators (reduce)", "Array checkings (some, every)", "Template Literals", "Object Destructuring", "Spread & Rest operators"],
    Knight: ["DOM element selections", "DOM content changes", "Event Listener bindings", "Event Bubbling & Capturing", "Javascript Callbacks", "JS Promises", "Async/Await functions", "Fetch API request handling", "LocalStorage persistence", "JSON parsing and stringifying"],
    Warlord: ["Function Closures", "Lexical Scoping chains", "Object Prototypes", "Prototype Inheritances", "JavaScript Event Loop details", "WebSockets real-time sockets", "CORS API request errors", "Custom Event Dispatching", "Debounce function logic", "Throttle function logic"],
    Grandmaster: ["Memory leak investigations", "Garbage collection concepts", "Web Workers multi-threading", "Service Worker caching offline", "V8 Engine optimizations (Shapes/ICs)", "Monads & Functor structures", "P2P WebRTC data channels", "AST parser generators", "Mini Bundler build models", "Virtual DOM diffing engines"]
  },
  typescript: {
    Apprentice: ["Explicit primitive types", "Type assertions", "Arrays & Tuples declarations", "Basic Interface declarations", "Type Aliases syntax", "Optional parameters", "Union Types", "Intersection Types", "Any vs Unknown types", "Void vs Never types"],
    Mage: ["Readonly properties", "Function types interfaces", "Class types & constructors", "Access modifiers (public, private)", "Abstract classes", "Literal types", "Type Guards (typeof, instanceof)", "Index Signatures", "Type narrowing techniques", "Type Casts"],
    Knight: ["Generic functions", "Generic interfaces", "Generic constraints", "Utility types (Partial)", "Utility types (Pick)", "Utility types (Omit)", "Utility types (Readonly)", "Keyof operator queries", "Typeof operator queries", "Enums vs Const Enums"],
    Warlord: ["Class Decorators", "Method Decorators", "Advanced Generic parameters", "Mapped types", "Conditional types", "Exclude & Extract mechanics", "ReturnType utility logic", "Parameters utility logic", "Template Literal Types", "Satisfies operator"],
    Grandmaster: ["Declaration merging", "Ambient Modules declarations", "Strict tsconfig configurations", "Covariance & Contravariance definitions", "Recursive types mapping", "Discriminated unions optimizations", "Brand / Nominal typing tricks", "Custom Type guard assertions", "Module resolution rules", "Compiler API integrations"]
  },
  reactjs: {
    Apprentice: ["JSX Syntax rules", "Functional Components creation", "Passing Component Props", "Using UseState hook", "React Conditional rendering", "Rendering arrays with map/key", "Handling Click events", "Handling form inputs onChange", "Inline Component Styling", "State vs Props concepts"],
    Mage: ["Using UseEffect for data", "UseEffect cleanup triggers", "UseRef for DOM element", "Controlled vs Uncontrolled inputs", "React children prop", "Fragment structures", "React Context API configs", "UseContext hook", "React Memo render checks", "Custom Hooks creations"],
    Knight: ["Using UseReducer hook", "UseCallback cache functions", "UseMemo cache values", "Component Portals overlays", "React Error Boundaries", "React Suspense data load", "Lazy Loading components", "Strict Mode checks", "UseLayoutEffect vs UseEffect", "Compound Component Patterns"],
    Warlord: ["Zustand global store updates", "Redux Toolkit slices", "React Query data fetch", "Query caching & refetch", "Routing parameters (React Router/Link)", "Protected Routes checks", "React Form hooks (react-hook-form)", "React animation basics (framer-motion)", "React portals modaling", "Dynamic script injectors"],
    Grandmaster: ["React Server Components (RSC)", "Suspense Streaming models", "Server Actions triggers", "Render Profiler diagnostics", "Virtual window scroll listings", "Fiber architecture lifecycles", "Concurrency (useTransition)", "Hydration error debugging", "Custom React hooks packages", "Virtual DOM compiler capstones"]
  },
  nodejs: {
    Apprentice: ["Node version checks", "Global objects (process, __dirname)", "CommonJS module requires", "NPM init & package.json", "Node script scripts", "OS module properties", "Path joins & parses", "Console logs and errors", "Process args parsing", "Environment variables basics"],
    Mage: ["FS readFileSync", "FS writeFileSync", "FS async readFile", "FS async writeFile", "Event Emitter triggers", "EventEmitter listeners", "Buffer buffers", "HTTP basic servers", "Request request objects", "Response response objects"],
    Knight: ["Stream pipe methods", "Writable Streams creation", "Readable Streams creation", "Express server setup", "Express middleware runs", "Express JSON parsers", "Express routes (GET, POST)", "Express Route params", "HTTP Headers responses", "CORS setups in Node"],
    Warlord: ["JWT token signatures", "Bcrypt password hashing", "Morgan API logging", "MongoDB connections in Node", "Mongoose schema configs", "SQL Client queries (pg, mysql)", "Express error handling middleware", "Node clusters configs", "Child Processes spawns", "Cluster workers logic"],
    Grandmaster: ["Memory leak tracking in Node", "V8 heap profiler analysis", "Worker Threads configurations", "WebSockets servers", "File Streams piping scale", "System Clustering scale", "Crypto package keys", "HTTP/2 server implementation", "Event Loop phase locks", "Custom microservices routers"]
  },
  nextjs: {
    Apprentice: ["App router structures", "Static file links next/link", "Optimized image next/image", "CSS Modules integration", "Page route creation", "Dynamic route paths", "Next metadata titles", "Layout wrappers", "Loading UI pages", "Not Found pages"],
    Mage: ["Client Components (use client)", "Server Components (default)", "SSR (Server Side Rendering)", "SSG (Static Site Generation)", "ISR (Incremental Static Regeneration)", "Route Handlers (API Routes)", "Dynamic Route Params fetching", "Parallel routes configs", "Intercepting routes layouts", "Middleware edge routes"],
    Knight: ["Server Actions creations", "Form states with Server Actions", "UseActionState hooks", "UseOptimistic hooks", "Dynamic metadata generation", "Static site export configs", "Next.js cache revalidations", "Fetch tags configs", "Next.js Font optimizations", "Next.js Script loading rules"],
    Warlord: ["Next Auth integrations", "JWT session tokens Next", "SEO Meta descriptions headers", "Sitemap.xml configurations", "Robots.txt pages", "Dynamic Imports (next/dynamic)", "Next.js config custom rewrites", "Next.js Redirect structures", "Custom headers security", "Edge Runtime builds"],
    Grandmaster: ["Advanced Incremental builds", "Caching headers setups", "Edge functions cache optimizations", "Static/Dynamic segment configs", "Next.js bundle profiling", "Custom asset CDN mappings", "Monorepo structures configurations", "Server Actions throttle scales", "Draft Mode/Preview updates", "Full Capstone: Hydration compiler dashboards"]
  },
  python: {
    Apprentice: ["Variables and Print outputs", "Basic Data types", "If/Else branching structures", "For loop list indexes", "While loops logic", "Defining def functions", "Calling functions with parameters", "Creating list variables", "Dictionary structures key/value", "Tuple immutable definitions"],
    Mage: ["List comprehensions basic", "Dictionary comprehensions definitions", "Function default parameters", "Keyword arguments *args", "Keyword kwargs **kwargs", "Try/Except error blocks", "File read operations", "File write logs", "Importing sys/os library modules", "Lambda simple scripts"],
    Knight: ["Class constructor init", "Class inheritance structures", "Class methods vs Static methods", "Magic methods (__str__, __len__)", "Python Set structures", "Module packaging models", "Datetime date manipulation", "JSON parsing configs", "Regular expression pattern matches", "List sorting custom keys"],
    Warlord: ["Generator yields", "Custom decorators configurations", "Context managers with statement", "Threading basic concurrency", "Multiprocessing speed tests", "Asyncio loop tasks", "Decorators with custom parameters", "Virtualenv package tools", "Pipfile configurations", "Abstract Base Classes (abc)"],
    Grandmaster: ["Advanced asyncio concurrency", "Metaclass definitions", "Memory optimization __slots__", "Cython compiler interfaces", "Python Garbage collector hooks", "SQLAlchemy ORM integrations", "Multi-thread locks pipelines", "Unit testing Mock setups", "Custom AST parser codes", "Snake game automation script"]
  },
  sql: {
    Apprentice: ["SELECT fields", "WHERE conditions", "ORDER BY sorting", "LIMIT results offset", "SQL Comments notes", "CREATE DATABASE setups", "CREATE TABLE configurations", "INSERT INTO values", "UPDATE values WHERE", "DELETE rows WHERE"],
    Mage: ["Relational Foreign Keys", "INNER JOIN commands", "LEFT JOIN queries", "RIGHT JOIN links", "GROUP BY aggregates", "HAVING conditions", "COUNT calculations", "SUM calculations", "AVG calculations", "MAX/MIN filters"],
    Knight: ["Subqueries SELECT nested", "EXISTS conditions statements", "UNION row merging", "CASE conditions mapping", "ALTER TABLE schemas", "TRUNCATE vs DELETE speed", "PRIMARY KEY adjustments", "UNIQUE constraints indexes", "DEFAULT settings properties", "INDEX speed creations"],
    Warlord: ["SQL Transactions COMMIT", "ROLLBACK safety updates", "Database Views structures", "Stored Procedures creations", "Database Triggers events", "Explain query plans", "Foreign Key constraints cascades", "Window Functions (ROW_NUMBER)", "Window Functions (RANK)", "Common Table Expressions (WITH)"],
    Grandmaster: ["Query performance optimizations", "Indexes scans vs Seek optimizations", "Database Sharding structures", "Read/Write replica partitions", "Horizontal partitioning setups", "Database Normalization (1NF, 2NF, 3NF)", "Denormalization speed increases", "ACID properties transactions", "Locks and Isolation levels", "Dungeon crawler queries solver"]
  },
  django: {
    Apprentice: ["Django startproject structure", "Django Apps setup", "Setting up routes URL", "FastAPI simple path", "FastAPI main:app launch", "Django Views basic", "FastAPI path parameters", "FastAPI query strings", "Django settings configurations", "FastAPI Pydantic models"],
    Mage: ["Django Models mapping", "Django migrations run", "FastAPI POST request items", "FastAPI Response models", "Django admin pages", "Django ORM SELECT queries", "Django ORM filtering", "FastAPI Dependency Injection basic", "FastAPI status codes", "Django forms basic"],
    Knight: ["Django Templates rendering", "Pydantic validator methods", "Django ORM relationships (1-to-N)", "FastAPI async endpoints", "FastAPI CORSMiddleware configurations", "Django ModelForms basic", "FastAPI Path validations", "FastAPI Query validations", "Django ORM select_related joins", "Django ORM prefetch_related joins"],
    Warlord: ["JWT Auth configs Django", "FastAPI OAuth2PasswordBearer", "Django custom Middleware", "FastAPI custom Middleware", "Django DB migrations resolve", "Django signals triggers", "Celery background worker tasks", "FastAPI background tasks", "Django REST framework serializers", "FastAPI API Router splits"],
    Grandmaster: ["Django prefetch query counts", "FastAPI async DB postgres", "Django caching settings redis", "FastAPI lifecycle events", "DRF Custom viewsets scales", "Database transaction handling", "Django custom admin panels", "FastAPI websockets routes", "Unit Testing API Client endpoints", "API Citadel capstone router configurations"]
  },
  git: {
    Apprentice: ["Git init directories", "Git status updates", "Git add staging", "Git commit messages", "Git config names", "Git log commits", "Git diff changes", "Git checkout files", "Git rm removals", "Git clone repositories"],
    Mage: ["Git branch creations", "Git checkout branches", "Git merge branch histories", "Git branch deletion", "Git clone remote paths", "Git remote add commands", "Git fetch updates", "Git pull repository runs", "Git push commits origin", "Git log graph visualization"],
    Knight: ["Git rebase branches", "Git rebase interactive", "Git push --force cautions", "Git stash temporary store", "Git stash pop restore", "Git tag release versions", "Git checkout tags", "Git cherry-pick commit", "Git diff branch comparisons", "Git merge conflicts resolves"],
    Warlord: ["Git revert commits", "Git reset --soft histories", "Git reset --hard histories", "Git clean directory files", "Git reflog timeline tracking", "Git commit --amend updates", "Git show commit details", "Git blame file authoring", "Git bisect bug search", "Git hooks automation pre-commit"],
    Grandmaster: ["Custom git hooks scripts", "Git submodules configurations", "Git worktree workspace splits", "Git filter-branch histories", "Interactive rebases merge conflict resolve", "GitHub Actions CI/CD workflows", "GitHub Actions env secrets", "GitHub Pull Request reviews merges", "Git merge strategies (ours, theirs)", "Git capstone timeline recovery"]
  },
  docker: {
    Apprentice: ["Docker version checks", "Docker run hello-world", "Docker ps active containers", "Docker ps -a all", "Docker images lists", "Docker stop container IDs", "Docker start containers", "Docker rm containers", "Docker rmi images", "Docker logs outputs"],
    Mage: ["Dockerfiles creation", "Docker FROM base", "Docker RUN commands", "Docker COPY assets", "Docker EXPOSE ports", "Docker CMD starts", "Docker build image creation", "Docker tag versioning", "Docker push image registry", "Docker pull container layers"],
    Knight: ["Docker Volumes persistent", "Docker Port mapping (-p)", "Docker Env variables (-e)", "Docker Networks setup", "Docker Compose configurations", "Docker Compose up commands", "Docker Compose down commands", "Docker Compose build flags", "Docker Run interactive mode (-it)", "Docker Exec command executions"],
    Warlord: ["Docker Multi-stage builds", "Docker Image size reduction", "Docker Config mount files", "Docker Compose multiple files", "Docker Swarm cluster init", "Kubernetes Minikube start", "Kubernetes Pod configurations", "Kubernetes Service configurations", "Kubernetes Deployments setups", "Docker login registry access"],
    Grandmaster: ["Kubernetes Rolling Updates deployments", "Kubernetes ConfigMaps secrets", "Docker Daemon configuration settings", "Docker container CPU/Memory limits", "CI/CD runners integration docker", "Multi-architecture builds buildx", "Docker registry self-hosted configs", "Kubernetes Ingress controllers routing", "DevOps pipeline automation script", "DevOps capstone deployment script"]
  },
  tailwind: {
    Apprentice: ["Tailwind script include", "Text colors (text-red-500)", "Font sizes (text-lg)", "Margins utility (m-4)", "Padding utility (p-2)", "Background colors (bg-white)", "Font weights (font-bold)", "Text alignment (text-center)", "Borders configurations (border)", "Border radius utilities (rounded)"],
    Mage: ["Flex layout (flex)", "Flex item align (items-center)", "Flex justify (justify-between)", "Grid layout (grid)", "Grid columns (grid-cols-3)", "Hover utilities (hover:bg-blue-500)", "Focus utilities (focus:outline-none)", "Active transitions (transition-all)", "Transition duration (duration-300)", "Custom spacing values"],
    Knight: ["Responsive design (sm:text-sm)", "Medium layouts (md:flex)", "Large layouts (lg:grid)", "Dark mode utility (dark:bg-black)", "Absolute layout (absolute)", "Relative layout (relative)", "Z-index layers (z-10)", "Width percentages (w-1/2)", "Height values (h-screen)", "Tailwind Ring styling"],
    Warlord: ["Tailwind config files", "Custom colors configuration", "Extending font sizes", "Extending theme spacings", "Arbitrary values (w-[350px])", "Arbitrary properties ([mask-type:luminance])", "Group hover triggers (group-hover:block)", "Peer states selectors (peer-checked:block)", "Aspect ratio utilities", "Tailwind aspect utilities custom"],
    Grandmaster: ["Custom tailwind plugins writing", "Container Queries plugin usage", "Tailwind CSS compilation optimization", "Purge CSS utility configurations", "Tailwind @apply layers css", "Custom font face tailwind config", "Grid template custom extends", "Tailwind animations customization", "Light/Dark mode switcher layouts", "Tailwind ninja dashboard compiler page"]
  },
  cybersecurity: {
    Apprentice: ["HTTP Requests structures", "HTTP Response codes", "URL parameters structures", "Browser developer tools inspector", "Base64 encoding parsing", "Base64 decoding codes", "MD5 hashing checks", "HTML Source code comments checks", "Cookie session tracking", "HTTP Headers analysis"],
    Mage: ["SQL Injection basic (OR 1=1)", "SQL Injection string bypass", "Cross Site Scripting (XSS) basic", "XSS Alert prompt scripts", "Directory traversal paths", "Parameter tampering prices", "Weak admin passwords search", "Brute-force auth scripts", "Robots.txt security checks", "API endpoints enumerations"],
    Knight: ["Cross-Site Request Forgery (CSRF)", "JWT token signature inspection", "JWT token none algorithm crack", "Broken Authentication session hijack", "Insecure Direct Object Reference (IDOR)", "XML External Entity (XXE) injection", "CORS misconfigurations wildcard", "Command Injection basic terminal", "File upload exploits bypass", "Sensitive Data exposures search"],
    Warlord: ["SSRF (Server Side Request Forgery)", "Buffer overflow theory inputs", "HMAC verification failures", "Reverse shell terminal setups", "SQL Injection union based queries", "Blind SQL Injection sleep commands", "Cryptographic hashing salts", "Public Key vs Private Key analysis", "SSL/TLS handshake vulnerabilities", "Rate limiting bypass techniques"],
    Grandmaster: ["Privilege Escalation admin access", "Penetration testing reporting format", "Heap spray overflow structures", "Active directory layout audits", "OAuth2 flow token hijacks", "Zero-day exploit mitigation steps", "Cryptographic signature forgery attacks", "Websocket authentication hijackings", "Intrusion Detection filter bypasses", "Red Team citadel hacking capstone exploits"]
  }
};

/**
 * Dynamic Level Generator Engine
 * Transforms any gameId + level (1-500) into a fully structured, playable level.
 */
export function generateLevel(gameId: string, level: number): LevelData {
  const game = GAMES_LIST.find(g => g.id === gameId);
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }

  const tier = getTierName(level);
  const syllabus = GAME_SYLLABUS[gameId] || { Apprentice: [], Mage: [], Knight: [], Warlord: [], Grandmaster: [] };
  const topics = syllabus[tier];

  // Map 100 levels of a tier into 10 topics (10 levels each)
  const levelInTier = (level - 1) % 100;
  const topicIndex = Math.floor(levelInTier / 10) % topics.length;
  const stepIndex = levelInTier % 10;
  const concept = topics[topicIndex] || "Advanced Systems";

  const title = `Level ${level}: ${concept} (Part ${stepIndex + 1})`;
  const id = `${gameId}-${level}`;

  // Procedural content generation based on gameId and level
  let instructions = "";
  let starterCode = "";
  let hints: string[] = [];
  let checkType: LevelData["validation"]["checkType"] = "eval";
  let testCases: TestCase[] = [];

  switch (gameId) {
    case "html5":
      checkType = "html";
      instructions = `Build a structural element for ${concept}. You need to implement an element with tag details suitable for this task.\n\nTask: Add an HTML snippet containing a proper structure representing '${concept}'. The node must contain matching identifier or class content, and display content related to '${concept} Part ${stepIndex + 1}'.`;
      starterCode = `<!-- Write your HTML code below -->\n<div id="element-container">\n  \n</div>`;
      hints = [
        "Ensure all HTML elements are correctly closed.",
        `Use HTML tag elements that match the ${concept} theme.`,
        "Make sure to avoid modifying the wrapper container."
      ];
      testCases = [
        {
          name: "Contains required tags",
          expected: true,
          customCheck: `(code) => {
            const doc = new DOMParser().parseFromString(code, 'text/html');
            const container = doc.getElementById('element-container');
            return !!container && container.children.length > 0;
          }`
        },
        {
          name: "Includes concept topic text",
          expected: true,
          customCheck: `(code) => code.toLowerCase().includes("${concept.toLowerCase()}")`
        }
      ];
      break;

    case "css3":
      checkType = "css";
      instructions = `Develop CSS rules to style a ${concept} component.\n\nTask: Target class '.visual-box' and write style statements to apply styles. You need to assign the appropriate color codes, layout flex/grid properties, or animation parameters.\n\nConfigure: set property values reflecting topic details.`;
      starterCode = `/* Write your CSS rules targeting .visual-box */\n.visual-box {\n  \n}`;
      hints = [
        "Remember class selectors start with a period (.) in CSS.",
        `Set key properties associated with ${concept}.`,
        "Do not leave properties empty or syntactically broken."
      ];
      testCases = [
        {
          name: "CSS Selector Matches",
          expected: true,
          customCheck: `(code) => code.includes(".visual-box")`
        },
        {
          name: "Specifies style rules",
          expected: true,
          customCheck: `(code) => code.includes("{") && code.includes("}") && code.length > 30`
        }
      ];
      break;

    case "javascript":
      checkType = "eval";
      if (level <= 100) {
        // Apprentice syntax coding
        instructions = `Implement code for ${concept}.\n\nTask: Write a function named 'processData' that takes parameters based on ${concept} and returns output matching topic criteria.\n\nExample: returns double value, verifies conditionals, or processes loop inputs.`;
        starterCode = `// JS Apprentice - ${concept}\nfunction processData(x) {\n  // Write your code here\n  \n}`;
        hints = [
          "Use basic primitive variables and control structures.",
          "Ensure you return the correct computed result.",
          "Check for syntax errors such as missing braces."
        ];
        testCases = [
          {
            name: "Function exists",
            input: [5],
            expected: true,
            customCheck: `(code) => typeof eval(code + "; processData") === "function"`
          },
          {
            name: "Returns correct value for input",
            input: [10],
            expected: 20,
            customCheck: `(code) => {
              const fn = new Function(code + "; return processData(10);");
              return fn();
            }`
          }
        ];
      } else {
        // Advanced logic Knight/Warlord/Grandmaster
        instructions = `Write an optimized handler for ${concept} under Mage/Knight/Warlord conditions.\n\nTask: Define a function 'handleProcess' that resolves inputs using advanced paradigms (promises, closure, or generators).`;
        starterCode = `// JS Advanced - ${concept}\nfunction handleProcess(data) {\n  // Implement high performance algorithm\n  \n}`;
        hints = [
          "Avoid nested callback locks. Use modern ES6+ structures.",
          `Ensure you align data returns with ${concept} requirements.`,
          "Think about algorithmic efficiency."
        ];
        testCases = [
          {
            name: "Resolves data array input",
            input: [[1, 2, 3]],
            expected: 6,
            customCheck: `(code) => {
              const fn = new Function(code + "; return handleProcess([1, 2, 3]);");
              const res = fn();
              return Array.isArray(res) ? res.reduce((a,b)=>a+b, 0) : res;
            }`
          }
        ];
      }
      break;

    case "typescript":
      checkType = "eval";
      instructions = `Write typed code for Type Guardian - ${concept}.\n\nTask: Create interfaces, types, or generic handlers enforcing strict typing. Declare your exports or functions.\n\nMake sure the Javascript equivalent compiles successfully.`;
      starterCode = `// TypeScript - ${concept}\ntype TopicType = string | number;\n\nfunction processType(arg: TopicType) {\n  // Write implementation code\n  \n}`;
      hints = [
        "Enforce strict compile-time types.",
        "Ensure your type assertions are safe.",
        "Check that parameters map to union definitions."
      ];
      testCases = [
        {
          name: "Compiles without error",
          expected: true,
          customCheck: `(code) => {
            // Strip simple TS types for dynamic client-side evaluation checks
            const cleanCode = code.replace(/:\\s*[a-zA-Z<>|\\[\\]]+/g, "").replace(/type\\s+\\w+\\s*=\\s*[^;]+;/g, "");
            const fn = new Function(cleanCode + "; return typeof processType;");
            return fn() === "function";
          }`
        }
      ];
      break;

    case "reactjs":
      checkType = "react";
      instructions = `Implement a React Component to manage ${concept}.\n\nTask: Build a functional React component named 'CounterControl' that uses React state/hooks to update text and output based on user actions.`;
      starterCode = `import React, { useState } from 'react';\n\nexport default function CounterControl() {\n  // Implement useState and elements\n  return (\n    <div className="react-box">\n      \n    </div>\n  );\n}`;
      hints = [
        "Keep components pure and return JSX.",
        "Ensure all hooks are called at the top level of the component.",
        "Remember to export the component as default."
      ];
      testCases = [
        {
          name: "Imports React correctly",
          expected: true,
          customCheck: `(code) => code.includes("react")`
        },
        {
          name: "Declares CounterControl component",
          expected: true,
          customCheck: `(code) => code.includes("function CounterControl") || code.includes("const CounterControl")`
        }
      ];
      break;

    case "nodejs":
      checkType = "node";
      instructions = `Implement Node.js logic for ${concept}.\n\nTask: Create a Node script that uses module abstractions (like fs or path) or writes standard HTTP routing checks.\n\nWrite a function 'runNodeScript(require)' that uses the mocked node imports.`;
      starterCode = `// Node.js - ${concept}\nfunction runNodeScript(require) {\n  const fs = require('fs');\n  // Write code using fs module\n  \n}`;
      hints = [
        "Use the provided mock require functions.",
        "Create files or parse paths using node modules.",
        "Avoid using browser globals like window."
      ];
      testCases = [
        {
          name: "Uses require('fs') module",
          expected: true,
          customCheck: `(code) => code.includes("require('fs')") || code.includes('require("fs")')`
        },
        {
          name: "Fulfills script execution block",
          expected: true,
          customCheck: `(code) => {
            const fsMock = { writeFileSync: () => {} };
            const reqMock = (mod) => mod === 'fs' ? fsMock : {};
            const fn = new Function(code + "; return runNodeScript;");
            fn()(reqMock);
            return true;
          }`
        }
      ];
      break;

    case "nextjs":
      checkType = "react";
      instructions = `Implement a Next.js App Router layout for ${concept}.\n\nTask: Code a React Server Action or a layout component exporting meta headers suited for page routes.`;
      starterCode = `// Next.js Route Page - ${concept}\nexport const metadata = {\n  title: "${concept}",\n};\n\nexport default function Page() {\n  return (\n    <main>\n      <h1>${concept} Server Rendered</h1>\n    </main>\n  );\n}`;
      hints = [
        "Make sure to export metadata for SEO layout.",
        "Keep components rendering semantic elements.",
        "RSC runs server-side by default."
      ];
      testCases = [
        {
          name: "Contains metadata object",
          expected: true,
          customCheck: `(code) => code.includes("metadata")`
        },
        {
          name: "Defines Page component default export",
          expected: true,
          customCheck: `(code) => code.includes("export default function Page")`
        }
      ];
      break;

    case "python":
      checkType = "eval";
      instructions = `Write Python script parameters for ${concept}.\n\nTask: Create a python function 'solve_logic(x)' that evaluates logic parameters.\n\nSince this runner simulates code parsing, structure the parameters exactly as described.`;
      starterCode = `# Python Apprentice - ${concept}\ndef solve_logic(x):\n    # Write python code with proper indentation\n    pass`;
      hints = [
        "Python relies on strict indentation.",
        "Use pass or return statements inside function blocks.",
        "Match the naming specifications of solve_logic."
      ];
      testCases = [
        {
          name: "Function definition present",
          expected: true,
          customCheck: `(code) => code.includes("def solve_logic")`
        },
        {
          name: "Avoids syntax errors",
          expected: true,
          customCheck: `(code) => !code.includes("function")` // Check that JavaScript syntax is not used
        }
      ];
      break;

    case "sql":
      checkType = "sql";
      instructions = `Formulate an SQL statement for Database Crawler - ${concept}.\n\nTask: Write a query selecting records from table 'dungeon_users' matching filters.\n\nFilter: select required columns where values correspond to '${concept}' thresholds.`;
      starterCode = `-- SQL Relational Query - ${concept}\nSELECT * FROM dungeon_users\nWHERE \nORDER BY id ASC;`;
      hints = [
        "Specify the exact fields instead of wildcard SELECT * if needed.",
        "Filter using the WHERE clause.",
        "Check spelling of columns and tableName."
      ];
      testCases = [
        {
          name: "Uses SELECT statements",
          expected: true,
          customCheck: `(code) => code.toUpperCase().includes("SELECT")`
        },
        {
          name: "References table dungeon_users",
          expected: true,
          customCheck: `(code) => code.toLowerCase().includes("dungeon_users")`
        }
      ];
      break;

    case "django":
      checkType = "eval";
      instructions = `Develop Django/FastAPI configurations for ${concept}.\n\nTask: Design models or async route parameters. Declare a class or path handler.`;
      starterCode = `# Django/FastAPI Controller - ${concept}\nfrom pydantic import BaseModel\n\nclass TopicItem(BaseModel):\n    name: str\n    level: int\n`;
      hints = [
        "Inherit from BaseModel for FastAPI Pydantic requests.",
        "Use Django model fields like models.CharField for DB schemas.",
        "Keep class variables typed."
      ];
      testCases = [
        {
          name: "Declares TopicItem schema class",
          expected: true,
          customCheck: `(code) => code.includes("class TopicItem")`
        }
      ];
      break;

    case "git":
      checkType = "git";
      instructions = `Orchestrate a sequence of Git operations to manage ${concept}.\n\nTask: Provide the commands in order, each on a new line, to accomplish this timeline task.\n\nCommands needed: git init, git add, and commit parameters.`;
      starterCode = `# Type your Git commands, one per line\ngit init\n`;
      hints = [
        "Include the exact file name if adding specific documents.",
        "Write only standard git CLI syntax.",
        "Do not prefix commands with console variables."
      ];
      testCases = [
        {
          name: "Initializes repository",
          expected: true,
          customCheck: `(code) => code.toLowerCase().includes("git init")`
        },
        {
          name: "Adds assets to staging",
          expected: true,
          customCheck: `(code) => code.toLowerCase().includes("git add")`
        }
      ];
      break;

    case "docker":
      checkType = "docker";
      instructions = `Construct image parameters in a Dockerfile for ${concept}.\n\nTask: Specify the base image, directories, commands to execute, and run points.`;
      starterCode = `# Dockerfile - ${concept}\nFROM node:18-alpine\n\nWORKDIR /app\n`;
      hints = [
        "Select lightweight alpine bases for efficiency.",
        "Set WORKDIR before copying files.",
        "Use EXPOSE for container port definitions."
      ];
      testCases = [
        {
          name: "Specifies base image",
          expected: true,
          customCheck: `(code) => code.toUpperCase().includes("FROM ")`
        },
        {
          name: "Sets working directory",
          expected: true,
          customCheck: `(code) => code.toUpperCase().includes("WORKDIR ")`
        }
      ];
      break;

    case "tailwind":
      checkType = "html";
      instructions = `Build custom component styles using Tailwind CSS for ${concept}.\n\nTask: Apply responsive utilities, background gradients, flex grids, or dark states onto HTML nodes.\n\nClasses: include appropriate responsive text size and layout styles.`;
      starterCode = `<!-- Tailwind UI Sandbox - ${concept} -->\n<div class="flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-xl">\n  <h2 class="text-xl font-bold text-white">\n    ${concept}\n  </h2>\n</div>`;
      hints = [
        "Hover rules prefix as hover:modifier.",
        "Use flex-col for vertical layouts.",
        "Provide text size modifiers like text-sm or text-lg."
      ];
      testCases = [
        {
          name: "Applies Tailwind grid/flex classes",
          expected: true,
          customCheck: `(code) => code.includes("class=") && (code.includes("flex") || code.includes("grid"))`
        }
      ];
      break;

    case "cybersecurity":
      checkType = "security";
      instructions = `Conduct security audit tasks for Net Defender - ${concept}.\n\nTask: Identify vulnerabilities or write payload hashes satisfying target gates.\n\nInput: Enter exploitation queries, decode hash payloads, or solve authentication bypass parameters.`;
      starterCode = `# Enter security key, payload string, or hash decode below\npayload = ""\n`;
      hints = [
        "SQL bypasses often use OR operations.",
        "Check MD5 decoding rules.",
        "Identify inputs from source logs."
      ];
      testCases = [
        {
          name: "Inputs a non-empty payload key",
          expected: true,
          customCheck: `(code) => code.includes("payload = ") && code.split("payload =")[1].trim().length > 2`
        }
      ];
      break;

    default:
      instructions = `Review code conventions for ${concept}.`;
      starterCode = `// Code goes here`;
      hints = ["Write clean code."];
      testCases = [{ name: "Valid structure", expected: true, customCheck: `() => true` }];
  }

  // Inject additional progressive descriptions for tiers
  let tierDesc = "";
  if (tier === "Apprentice") {
    tierDesc = "🔰 APPRENTICE LEVEL: Establish basic syntax capabilities and core foundations.";
  } else if (tier === "Mage") {
    tierDesc = "🔮 MAGE LEVEL: Implement functional workflows, basic logic, and clean returns.";
  } else if (tier === "Knight") {
    tierDesc = "⚔️ KNIGHT LEVEL: Manipulate data arrays, async workflows, and structural layouts.";
  } else if (tier === "Warlord") {
    tierDesc = "👑 WARLORD LEVEL: Orchestrate state managers, endpoint security, and APIs.";
  } else {
    tierDesc = "🌌 GRANDMASTER LEVEL: Optimize rendering performance, profiling, and build systems.";
  }

  instructions = `${tierDesc}\n\n${instructions}`;

  return {
    id,
    level,
    tier,
    title,
    concept,
    instructions,
    starterCode,
    hints,
    validation: {
      checkType,
      testCases
    }
  };
}
