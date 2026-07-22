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

// 9 Games Definition
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
    prerequisites: ["nodejs"]
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
    id: "git",
    name: "Git & GitHub",
    theme: "Timeline Weaver",
    iconName: "GitBranch",
    description: "Manipulate project history streams. Branch, rebase, resolve conflicts, and reverse timelines.",
    gradient: "from-rose-600 to-orange-500",
    prerequisites: ["html5"]
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    theme: "Utility Ninja",
    iconName: "Wind",
    description: "Style interfaces at lightning speed using CSS utility spells. Master configurations and responsiveness.",
    gradient: "from-cyan-500 to-teal-400",
    prerequisites: ["css3"]
  }
];


// Handcrafted Codédex blueprints for initial sequence (HTML5 Game target)

const HTML5_EARLY_LEVELS: LevelData[] = [
  {
    id: "html5-1",
    level: 1,
    levelId: 1,
    tier: "Apprentice",
    title: "Doctype",
    conceptText: "### Concept\nThe <!DOCTYPE html> declaration is placed at the very start of your document to tell the browser that the page is a modern HTML5 document.",
    codeExample: "```html\n<!DOCTYPE html>\n```",
    missionText: "### Mission\nWrite the modern HTML5 doctype declaration at the beginning of the file.",
    starterCode: "<!-- Level 1 -->\n",
    hints: ["Write '<!DOCTYPE html>' exactly."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create the HTML5 doctype declaration",
          testRegex: "<!DOCTYPE\\s+html>"
        }
      ]
    }
  },
  {
    id: "html5-2",
    level: 2,
    levelId: 2,
    tier: "Apprentice",
    title: "Root Element",
    conceptText: "### Concept\nThe <html> tag acts as the root container element of any HTML document. Everything else on the page goes inside it.",
    codeExample: "```html\n<html>\n  <!-- other elements -->\n</html>\n```",
    missionText: "### Mission\nWrite opening <html> and closing </html> tags.",
    starterCode: "<!-- Level 2 -->\n",
    hints: ["Write opening <html> and closing </html> tags."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create the html root element",
          testRegex: "<html>\\s*</html>"
        }
      ]
    }
  },
  {
    id: "html5-3",
    level: 3,
    levelId: 3,
    tier: "Apprentice",
    title: "Document Head",
    conceptText: "### Concept\nThe <head> tag acts as a container for metadata about the document, such as character sets, stylesheets, and scripts, which are invisible to visitors.",
    codeExample: "```html\n<head>\n  <!-- metadata -->\n</head>\n```",
    missionText: "### Mission\nCreate a basic <head></head> structural block.",
    starterCode: "<!-- Level 3 -->\n",
    hints: ["Add opening <head> and closing </head> tags."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create a head element",
          testRegex: "<head>\\s*</head>"
        }
      ]
    }
  },
  {
    id: "html5-4",
    level: 4,
    levelId: 4,
    tier: "Apprentice",
    title: "Document Body",
    conceptText: "### Concept\nThe <body> tag contains all the visible elements that appear on the screen, such as headers, text, images, and lists.",
    codeExample: "```html\n<body>\n  <h1>Hello Web!</h1>\n</body>\n```",
    missionText: "### Mission\nCreate a basic <body></body> structural block.",
    starterCode: "<!-- Level 4 -->\n",
    hints: ["Add opening <body> and closing </body> tags."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create a body element",
          testRegex: "<body>\\s*</body>"
        }
      ]
    }
  },
  {
    id: "html5-5",
    level: 5,
    levelId: 5,
    tier: "Apprentice",
    title: "Full Scaffold",
    conceptText: "### Concept\nA standard HTML document structure combines the DOCTYPE declaration, followed by the <html> block containing the <head> and <body> blocks.",
    codeExample: "```html\n<!DOCTYPE html>\n<html>\n  <head></head>\n  <body></body>\n</html>\n```",
    missionText: "### Mission\nWrite a complete basic HTML document skeleton.",
    starterCode: "<!-- Level 5 -->\n",
    hints: ["Combine <!DOCTYPE html>, <html>, <head>, and <body> in order."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create a complete HTML structure",
          testRegex: "<!DOCTYPE\\s+html>\\s*<html>\\s*<head>\\s*</head>\\s*<body>\\s*</body>\\s*</html>"
        }
      ]
    }
  },
  {
    id: "html5-6",
    level: 6,
    levelId: 6,
    tier: "Apprentice",
    title: "Document Title",
    conceptText: "### Concept\nThe <title> element goes inside the <head> section and sets the name that appears on the browser tab.",
    codeExample: "```html\n<head>\n  <title>My Portfolio</title>\n</head>\n```",
    missionText: "### Mission\nCreate a head block containing a title set to 'My Portfolio'.",
    starterCode: "<!-- Level 6 -->\n",
    hints: ["Nest <title>My Portfolio</title> inside a <head> block."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create a head element with title nested inside",
          testRegex: "<head[\\s>]"
        },
        {
          description: "Set title text to 'My Portfolio'",
          testRegex: "<title>\\s*My\\s+Portfolio\\s*</title>"
        }
      ]
    }
  },
  {
    id: "html5-7",
    level: 7,
    levelId: 7,
    tier: "Apprentice",
    title: "Paragraphs",
    conceptText: "### Concept\nThe <p> tag is used to wrap blocks of text. It automatically adds spacing before and after the paragraph to stack paragraphs cleanly.",
    codeExample: "\`\`\`html\n<p>Hello World</p>\n\`\`\`",
    missionText: "### Mission\nWrap 'Hello World' in a paragraph (p) tag.",
    starterCode: "<!-- Level 7 -->\n",
    hints: ["Write '<p>Hello World</p>'."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create a p tag with Hello World text",
          testRegex: "<p>\\s*Hello\\s+World\\s*</p>"
        }
      ]
    }
  },
  {
    id: "html5-8",
    level: 8,
    levelId: 8,
    tier: "Apprentice",
    title: "Heading 1",
    conceptText: "### Concept\nThe <h1> tag defines the primary heading of your page. It is usually the largest title on the screen.",
    codeExample: "\`\`\`html\n<h1>Welcome to My Site</h1>\n\`\`\`",
    missionText: "### Mission\nCreate a primary heading (h1) that reads 'Welcome to My Site'.",
    starterCode: "<!-- Level 8 -->\n",
    hints: ["Write '<h1>Welcome to My Site</h1>'."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create an h1 element with welcome text",
          testRegex: "<h1>\\s*Welcome\\s+to\\s+My\\s+Site\\s*</h1>"
        }
      ]
    }
  },
  {
    id: "html5-9",
    level: 9,
    levelId: 9,
    tier: "Apprentice",
    title: "Heading Hierarchy",
    conceptText: "### Concept\nHTML supports headings from <h1> to <h6> to build content hierarchy. Subheadings like <h2> mark sub-sections of a page.",
    codeExample: "```html\n<h2>About Me</h2>\n```",
    missionText: "### Mission\nCreate an h2 heading tag that reads 'About Me'.",
    starterCode: "<!-- Level 9 -->\n",
    hints: ["Write '<h2>About Me</h2>'."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Create an h2 element with About Me text",
          testRegex: "<h2>\\s*About\\s+Me\\s*</h2>"
        }
      ]
    }
  },
  {
    id: "html5-10",
    level: 10,
    levelId: 10,
    tier: "Apprentice",
    title: "Line Breaks",
    conceptText: "### Concept\nNormally, HTML collapses multiple spaces and line breaks. The <br> tag is a self-closing element that forces a line break.",
    codeExample: "```html\nLine One<br>Line Two\n```",
    missionText: "### Mission\nWrite a paragraph containing 'Line One' and 'Line Two' separated by a <br> tag.",
    starterCode: "<!-- Level 10 -->\n<p>\n  Line One\n  Line Two\n</p>",
    hints: ["Add '<br>' between 'Line One' and 'Line Two' inside the paragraph."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Separate text with a line break",
          testRegex: "<p>[\\s\\S]*Line\\s+One<br/?>Line\\s+Two[\\s\\S]*</p>"
        }
      ]
    }
  },
  {
    id: "html5-11",
    level: 11,
    levelId: 11,
    tier: "Apprentice",
    title: "Horizontal Rules",
    conceptText: "### Concept\nThe <hr> tag is a self-closing element that displays a horizontal dividing line, useful for separating sections.",
    codeExample: "```html\n<h1>Title</h1>\n<hr>\n<p>Content</p>\n```",
    missionText: "### Mission\nPlace an hr divider between the primary h1 heading and the paragraph.",
    starterCode: "<!-- Level 11 -->\n<h1>Title</h1>\n\n<p>Content</p>",
    hints: ["Add '<hr>' in the empty space between the heading and the paragraph."],
    validation: {
      checkType: "html",
      testCases: [
        {
          description: "Add a horizontal rule between heading and paragraph",
          testRegex: "<h1>.*</h1>\\s*<hr/?>\\s*<p>.*</p>"
        }
      ]
    }
  }
];

const HTML5_INITIAL_LEVELS: LevelData[] = [
  {
    "id": "html5-6",
    "level": 6,
    "levelId": 6,
    "tier": "Apprentice",
    "title": "Root Element",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<html>` tag is the root container element of any HTML document. Everything else on the page goes inside it.",
    "codeExample": "```html\n<html>\n  <!-- other elements -->\n</html>\n```",
    "missionText": "### 2. Your Mission\nWrap an empty set of `<html>` tags around nothing yet inside the container.",
    "starterCode": "<!-- Level 6 -->\n",
    "hints": [
      "Add opening <html> and closing </html> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain html tags",
          "testRegex": "<html>\\s*</html>"
        }
      ]
    }
  },
  {
    "id": "html5-7",
    "level": 7,
    "levelId": 7,
    "tier": "Apprentice",
    "title": "Document Head",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<head>` tag acts as a container for metadata about the document, such as character sets, stylesheets, and scripts, which are invisible to visitors.",
    "codeExample": "```html\n<head>\n  <!-- metadata -->\n</head>\n```",
    "missionText": "### 2. Your Mission\nCreate a basic `<head></head>` structural block inside the container.",
    "starterCode": "<!-- Level 7 -->\n",
    "hints": [
      "Add opening <head> and closing </head> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain head tags",
          "testRegex": "<head>\\s*</head>"
        }
      ]
    }
  },
  {
    "id": "html5-8",
    "level": 8,
    "levelId": 8,
    "tier": "Apprentice",
    "title": "Document Body",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<body>` tag contains all the visible elements that appear on the screen, such as headers, text, images, and lists.",
    "codeExample": "```html\n<body>\n  <h1>Hello Web!</h1>\n</body>\n```",
    "missionText": "### 2. Your Mission\nCreate a basic `<body></body>` structural block inside the container.",
    "starterCode": "<!-- Level 8 -->\n",
    "hints": [
      "Add opening <body> and closing </body> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain body tags",
          "testRegex": "<body>\\s*</body>"
        }
      ]
    }
  },
  {
    "id": "html5-9",
    "level": 9,
    "levelId": 9,
    "tier": "Apprentice",
    "title": "Doctype",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<!DOCTYPE html>` declaration is mandatory at the very start of your document to tell the browser it is a modern HTML5 page.",
    "codeExample": "```html\n<!DOCTYPE html>\n```",
    "missionText": "### 2. Your Mission\nWrite just the modern HTML5 doctype declaration line inside the container.",
    "starterCode": "<!-- Level 9 -->\n",
    "hints": [
      "Write '<!DOCTYPE html>' exactly."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain standard HTML5 doctype declaration",
          "testRegex": "<!DOCTYPE\\s+html>"
        }
      ]
    }
  },
  {
    "id": "html5-10",
    "level": 10,
    "levelId": 10,
    "tier": "Apprentice",
    "title": "Full Scaffold",
    "conceptText": "### 1. The Concept (The \"Why\")\nA standard HTML document structure combines the DOCTYPE declaration, followed by the `<html>` block containing the `<head>` and `<body>` blocks.",
    "codeExample": "```html\n<!DOCTYPE html>\n<html>\n  <head></head>\n  <body></body>\n</html>\n```",
    "missionText": "### 2. Your Mission\nWrite a complete, empty basic HTML document skeleton inside the container.",
    "starterCode": "<!-- Level 10 -->\n",
    "hints": [
      "Combine <!DOCTYPE html>, <html>, <head>, and <body> in order."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain doctype, html, head, and body tags structured correctly",
          "testRegex": "<!DOCTYPE\\s+html>\\s*<html>\\s*<head>\\s*</head>\\s*<body>\\s*</body>\\s*</html>"
        }
      ]
    }
  },
  {
    "id": "html5-11",
    "level": 11,
    "levelId": 11,
    "tier": "Apprentice",
    "title": "Document Title",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<title>` element goes inside the `<head>` section and sets the name that appears on the browser tab.",
    "codeExample": "```html\n<head>\n  <title>My Cool Page</title>\n</head>\n```",
    "missionText": "### 2. Your Mission\nCreate a head block containing a title set to \"My Portfolio\" inside the container.",
    "starterCode": "<!-- Level 11 -->\n",
    "hints": [
      "Nest <title>My Portfolio</title> inside a <head> block."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain head tag",
          "testRegex": "<head[\\s>]"
        },
        {
          "description": "Should contain title tag",
          "testRegex": "<title[\\s>]"
        },
        {
          "description": "Should set title text to 'My Portfolio'",
          "testRegex": "<title>\\s*My\\s+Portfolio\\s*</title>"
        }
      ]
    }
  },
  {
    "id": "html5-12",
    "level": 12,
    "levelId": 12,
    "tier": "Apprentice",
    "title": "Preformatted Text",
    "conceptText": "### 1. The Concept (The \"Why\")\nNormally, HTML collapses multiple spaces and line breaks. The `<pre>` tag preserves exact spaces, tabs, and line breaks as typed.",
    "codeExample": "```html\n<pre>\n  Line One\n    Line Two (indented)\n</pre>\n```",
    "missionText": "### 2. Your Mission\nWrap a multi-line ASCII art character or spaced text in a pre tag inside the container. It should contain at least one line break inside the pre tag.",
    "starterCode": "<!-- Level 12 -->\n",
    "hints": [
      "Create a <pre> tag.",
      "Add multiple lines or custom spacing inside, then close with </pre>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain pre tag",
          "testRegex": "<pre[\\s>]"
        },
        {
          "description": "Pre tag should contain some text with line break",
          "testRegex": "<pre>[^<]*\\n[^<]*</pre>"
        }
      ]
    }
  },
  {
    "id": "html5-13",
    "level": 13,
    "levelId": 13,
    "tier": "Apprentice",
    "title": "Elements Nesting",
    "conceptText": "### 1. The Concept (The \"Why\")\nHTML tags must close in the reverse order they were opened. This is called nesting. For example, `<body><p>Text</p></body>`.",
    "codeExample": "```html\n<div>\n  <p>Nested text</p>\n```",
    "missionText": "### 2. Your Mission\nNest a paragraph inside a body tag correctly inside the container.",
    "starterCode": "<!-- Level 13 -->\n",
    "hints": [
      "Open <body>, then open <p>, add some text, close </p>, and then close </body>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain a p tag nested in a body tag",
          "testRegex": "<body>\\s*<p>.*</p>\\s*</body>"
        }
      ]
    }
  },
  {
    "id": "html5-14",
    "level": 14,
    "levelId": 14,
    "tier": "Apprentice",
    "title": "Comments",
    "conceptText": "### 1. The Concept (The \"Why\")\nHTML comments are used to leave notes in the code that are completely ignored by the browser and won't show up on the page.",
    "codeExample": "```html\n<!-- This is a comment -->\n```",
    "missionText": "### 2. Your Mission\nWrite an HTML comment that says \"Main content starts here\" inside the container.",
    "starterCode": "<!-- Level 14 -->\n",
    "hints": [
      "Use <!-- to open a comment and --> to close it."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain the exact comment",
          "testRegex": "<!--\\s*Main\\s+content\\s+starts\\s+here\\s*-->"
        }
      ]
    }
  },
  {
    "id": "html5-15",
    "level": 15,
    "levelId": 15,
    "tier": "Apprentice",
    "title": "Structural Review",
    "conceptText": "### 1. The Concept (The \"Why\")\nLet's review the fundamental structure elements we have learned in Module 1. We'll build a simple web page structure.",
    "codeExample": "```html\n<!DOCTYPE html>\n<html>\n  <!-- Combine elements -->\n</html>\n```",
    "missionText": "### 2. Your Mission\nBuild a full webpage skeleton with a title (My Page), an h1 (Welcome), a divider line, and a paragraph inside the container.",
    "starterCode": "<!-- Level 15 -->\n",
    "hints": [
      "Nest head and body within html.",
      "Add title inside head, and h1, hr, p inside body."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain a title tag",
          "testRegex": "<title[\\s>]"
        },
        {
          "description": "Should contain h1, hr, and p tags inside body",
          "testRegex": "<body>\\s*<h1[\\s>].*</h1>\\s*<hr\\s*/?>\\s*<p[\\s>].*</p>\\s*</body>"
        }
      ]
    }
  },
  {
    "id": "html5-16",
    "level": 16,
    "levelId": 16,
    "tier": "Apprentice",
    "title": "Strong Importance",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<strong>` element marks text that has strong importance or urgency, displaying it in bold.",
    "codeExample": "```html\n<p>This is <strong>critical</strong> to understand.</p>\n```",
    "missionText": "### 2. Your Mission\nMake the word \"Warning\" strong within a sentence inside the container.",
    "starterCode": "<!-- Level 16 -->\n",
    "hints": [
      "Wrap 'Warning' inside <strong> and </strong>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain strong tag around Warning",
          "testRegex": "<strong>\\s*Warning\\s*</strong>"
        }
      ]
    }
  },
  {
    "id": "html5-17",
    "level": 17,
    "levelId": 17,
    "tier": "Apprentice",
    "title": "Emphasis",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<em>` element italicizes text to show conversational emphasis or stress.",
    "codeExample": "```html\n<p>You <em>must</em> save your progress.</p>\n```",
    "missionText": "### 2. Your Mission\nMake the word \"must\" emphasized within a sentence inside the container.",
    "starterCode": "<!-- Level 17 -->\n",
    "hints": [
      "Wrap 'must' inside <em> and </em>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain em tag around must",
          "testRegex": "<em>\\s*must\\s*</em>"
        }
      ]
    }
  },
  {
    "id": "html5-18",
    "level": 18,
    "levelId": 18,
    "tier": "Apprentice",
    "title": "Highlighted Text",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<mark>` element highlights text, typically with a yellow background, to indicate relevance in a context.",
    "codeExample": "```html\n<p>Check the <mark>important terms</mark> here.</p>\n```",
    "missionText": "### 2. Your Mission\nHighlight the phrase \"Special Offer\" inside a paragraph inside the container.",
    "starterCode": "<!-- Level 18 -->\n",
    "hints": [
      "Use <mark>Special Offer</mark> nested inside <p>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain mark tag around Special Offer",
          "testRegex": "<mark>\\s*Special\\s+Offer\\s*</mark>"
        }
      ]
    }
  },
  {
    "id": "html5-19",
    "level": 19,
    "levelId": 19,
    "tier": "Apprentice",
    "title": "Deleted Text",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<del>` tag represents deleted or removed text, drawing a line (strikethrough) over it.",
    "codeExample": "```html\n<p>Old pricing: <del>$99</del></p>\n```",
    "missionText": "### 2. Your Mission\nShow an old price of \"$50\" marked as deleted inside the container.",
    "starterCode": "<!-- Level 19 -->\n",
    "hints": [
      "Wrap '$50' in <del> and </del> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain del tag around $50",
          "testRegex": "<del>\\s*\\$50\\s*</del>"
        }
      ]
    }
  },
  {
    "id": "html5-20",
    "level": 20,
    "levelId": 20,
    "tier": "Apprentice",
    "title": "Inserted Text",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<ins>` tag represents inserted or added text, rendering it with an underline. It is often paired with `<del>`.",
    "codeExample": "```html\n<p><del>Old</del> <ins>New</ins></p>\n```",
    "missionText": "### 2. Your Mission\nShow a new price of \"$30\" marked as inserted next to a deleted price of \"$50\" inside the container.",
    "starterCode": "<!-- Level 20 -->\n",
    "hints": [
      "Put <del>$50</del> followed by <ins>$30</ins>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain del and ins tags next to each other",
          "testRegex": "<del>\\s*\\$50\\s*</del>\\s*<ins>\\s*\\$30\\s*</ins>"
        }
      ]
    }
  },
  {
    "id": "html5-21",
    "level": 21,
    "levelId": 21,
    "tier": "Apprentice",
    "title": "Subscript",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<sub>` tag lowers text to a subscript position, useful for chemical equations or formulas.",
    "codeExample": "```html\n<p>CO<sub>2</sub> represents Carbon Dioxide.</p>\n```",
    "missionText": "### 2. Your Mission\nWrite the chemical formula for water (H2O) using subscript for the \"2\" inside the container.",
    "starterCode": "<!-- Level 21 -->\n",
    "hints": [
      "Format it as H<sub>2</sub>O."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain chemical formula for water with sub tag",
          "testRegex": "H<sub>\\s*2\\s*</sub>O"
        }
      ]
    }
  },
  {
    "id": "html5-22",
    "level": 22,
    "levelId": 22,
    "tier": "Apprentice",
    "title": "Superscript",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<sup>` tag raises text to a superscript position, useful for math exponents or calendar dates.",
    "codeExample": "```html\n<p>2<sup>3</sup> equals 8.</p>\n```",
    "missionText": "### 2. Your Mission\nWrite \"October 4th\" using superscript for the \"th\" inside the container.",
    "starterCode": "<!-- Level 22 -->\n",
    "hints": [
      "Format it as October 4<sup>th</sup>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain superscript 'th'",
          "testRegex": "October\\s+4<sup>\\s*th\\s*</sup>"
        }
      ]
    }
  },
  {
    "id": "html5-23",
    "level": 23,
    "levelId": 23,
    "tier": "Apprentice",
    "title": "Inline Quotes",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<q>` tag defines an inline, short quote. Browsers normally insert quotation marks around the text automatically.",
    "codeExample": "```html\n<p>She said, <q>This is great!</q></p>\n```",
    "missionText": "### 2. Your Mission\nQuote someone saying \"Keep coding\" using the inline quote tag inside the container.",
    "starterCode": "<!-- Level 23 -->\n",
    "hints": [
      "Wrap 'Keep coding' in a <q> tag."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain q tag around Keep coding",
          "testRegex": "<q>\\s*Keep\\s+coding\\s*</q>"
        }
      ]
    }
  },
  {
    "id": "html5-24",
    "level": 24,
    "levelId": 24,
    "tier": "Apprentice",
    "title": "Blockquotes",
    "conceptText": "### 1. The Concept (The \"Why\")\nFor long, standalone quotes cited from other sources, we use the `<blockquote>` tag, which usually indents the block of text.",
    "codeExample": "```html\n<blockquote>\n  This is a long quote that spans multiple lines.\n</blockquote>\n```",
    "missionText": "### 2. Your Mission\nCreate a standalone blockquote containing a famous inspirational phrase (e.g. \"To be or not to be\") inside the container.",
    "starterCode": "<!-- Level 24 -->\n",
    "hints": [
      "Write <blockquote>Your quote here</blockquote>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain blockquote tag",
          "testRegex": "<blockquote>\\s*.*\\s*</blockquote>"
        }
      ]
    }
  },
  {
    "id": "html5-25",
    "level": 25,
    "levelId": 25,
    "tier": "Apprentice",
    "title": "Abbreviations",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<abbr>` element represents an abbreviation or acronym. It uses a `title` attribute to show the full version on hover.",
    "codeExample": "```html\n<abbr title=\"World Wide Web\">WWW</abbr>\n```",
    "missionText": "### 2. Your Mission\nCreate an abbreviation for \"HTML\" with the title \"HyperText Markup Language\" inside the container.",
    "starterCode": "<!-- Level 25 -->\n",
    "hints": [
      "Use <abbr title=\"HyperText Markup Language\">HTML</abbr>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain abbr tag with correct title attribute",
          "testRegex": "<abbr\\s+title=[\"']HyperText\\s+Markup\\s+Language[\"']>\\s*HTML\\s*</abbr>"
        }
      ]
    }
  },
  {
    "id": "html5-26",
    "level": 26,
    "levelId": 26,
    "tier": "Apprentice",
    "title": "Code Formatting",
    "conceptText": "### 1. The Concept (The \"Why\")\nTo render snippets of inline computer code in a monospace font, we wrap them in the `<code>` tag.",
    "codeExample": "```html\n<p>Define a variable with <code>let x = 10;</code>.</p>\n```",
    "missionText": "### 2. Your Mission\nWrap the text \"var x = 5\" in a code tag inside a sentence inside the container.",
    "starterCode": "<!-- Level 26 -->\n",
    "hints": [
      "Wrap 'var x = 5' inside <code> and </code>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain code tag around target text",
          "testRegex": "<code>\\s*var\\s+x\\s*=\\s*5\\s*</code>"
        }
      ]
    }
  },
  {
    "id": "html5-27",
    "level": 27,
    "levelId": 27,
    "tier": "Apprentice",
    "title": "Unordered Lists",
    "conceptText": "### 1. The Concept (The \"Why\")\nTo present items in no specific sequence, we use unordered lists (`<ul>`), wrapping each point in a list item (`<li>`) tag.",
    "codeExample": "```html\n<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>\n```",
    "missionText": "### 2. Your Mission\nCreate a bulleted list containing three grocery items (e.g. Milk, Bread, Eggs) inside the container.",
    "starterCode": "<!-- Level 27 -->\n",
    "hints": [
      "Use <ul> opening and closing tags, with three <li> elements nested inside."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain ul tag",
          "testRegex": "<ul[\\s>]"
        },
        {
          "description": "Should contain three li tags",
          "testRegex": "(<li[\\s>].*</li>\\s*){3}"
        }
      ]
    }
  },
  {
    "id": "html5-28",
    "level": 28,
    "levelId": 28,
    "tier": "Apprentice",
    "title": "Ordered Lists",
    "conceptText": "### 1. The Concept (The \"Why\")\nFor sequential guides, we use ordered lists (`<ol>`), which automatically number each nested list item (`<li>`).",
    "codeExample": "```html\n<ol>\n  <li>Step One</li>\n  <li>Step Two</li>\n</ol>\n```",
    "missionText": "### 2. Your Mission\nCreate a numbered list showing a 3-step setup guide inside the container.",
    "starterCode": "<!-- Level 28 -->\n",
    "hints": [
      "Use <ol> tags containing three <li> elements."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain ol tag",
          "testRegex": "<ol[\\s>]"
        },
        {
          "description": "Should contain three li tags",
          "testRegex": "(<li[\\s>].*</li>\\s*){3}"
        }
      ]
    }
  },
  {
    "id": "html5-29",
    "level": 29,
    "levelId": 29,
    "tier": "Apprentice",
    "title": "Description Lists",
    "conceptText": "### 1. The Concept (The \"Why\")\nDescription lists (`<dl>`) organize terms (`<dt>`) and their matching descriptions or definitions (`<dd>`).",
    "codeExample": "```html\n<dl>\n  <dt>Term</dt>\n  <dd>Definition</dd>\n</dl>\n```",
    "missionText": "### 2. Your Mission\nDefine the term \"CSS\" as \"Cascading Style Sheets\" using a description list inside the container.",
    "starterCode": "<!-- Level 29 -->\n",
    "hints": [
      "Nest <dt>CSS</dt> and <dd>Cascading Style Sheets</dd> inside a <dl> block."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain dl tag",
          "testRegex": "<dl[\\s>]"
        },
        {
          "description": "Should contain dt tag with term CSS",
          "testRegex": "<dt>\\s*CSS\\s*</dt>"
        },
        {
          "description": "Should contain dd tag with definition Cascading Style Sheets",
          "testRegex": "<dd>\\s*Cascading\\s+Style\\s+Sheets\\s*</dd>"
        }
      ]
    }
  },
  {
    "id": "html5-30",
    "level": 30,
    "levelId": 30,
    "tier": "Apprentice",
    "title": "Nesting Lists",
    "conceptText": "### 1. The Concept (The \"Why\")\nLists can be nested within list items to build hierarchical menu layouts or outlines.",
    "codeExample": "```html\n<ul>\n  <li>Main Item\n    <ul>\n      <li>Sub-item</li>\n    </ul>\n  </li>\n</ul>\n```",
    "missionText": "### 2. Your Mission\nCreate a numbered list (ol) with 2 items, where item #2 contains a 2-item bulleted sub-list (ul) inside the container.",
    "starterCode": "<!-- Level 30 -->\n",
    "hints": [
      "Create <ol> with two <li> items. Inside the second <li>, add a complete <ul> list."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain outer ol tag with two li elements",
          "testRegex": "<ol>\\s*<li>\\s*.*\\s*</li>\\s*<li>\\s*.*\\s*<ul[\\s>].*</ul>\\s*</li>\\s*</ol>"
        },
        {
          "description": "Should contain inner ul list with two nested li elements",
          "testRegex": "<ul>\\s*(<li>\\s*.*\\s*</li>\\s*){2}</ul>"
        }
      ]
    }
  },
  {
    "id": "html5-31",
    "level": 31,
    "levelId": 31,
    "tier": "Apprentice",
    "title": "Introduction to Links",
    "conceptText": "### 1. The Concept (The \"Why\")\nLinks are created using the anchor `<a>` tag. The `href` attribute specifies the URL target.",
    "codeExample": "```html\n<a href=\"https://example.com\">Visit site</a>\n```",
    "missionText": "### 2. Your Mission\nLink the text \"Google\" to \"https://www.google.com\" inside the container.",
    "starterCode": "<!-- Level 31 -->\n",
    "hints": [
      "Use <a href=\"https://www.google.com\">Google</a>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain anchor tag pointing to google.com",
          "testRegex": "<a\\s+href=[\"']https://www\\.google\\.com[\"']>\\s*Google\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-32",
    "level": 32,
    "levelId": 32,
    "tier": "Apprentice",
    "title": "Absolute URLs",
    "conceptText": "### 1. The Concept (The \"Why\")\nAn absolute URL contains the complete address of a web resource, including the protocol (http:// or https://), pointing to external sites.",
    "codeExample": "```html\n<a href=\"https://www.example.com\">External Link</a>\n```",
    "missionText": "### 2. Your Mission\nLink to \"https://www.wikipedia.org\" with the text \"Wikipedia\" inside the container.",
    "starterCode": "<!-- Level 32 -->\n",
    "hints": [
      "Use href=\"https://www.wikipedia.org\"."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain external absolute link to wikipedia.org",
          "testRegex": "<a\\s+href=[\"']https://www\\.wikipedia\\.org[\"']>\\s*Wikipedia\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-33",
    "level": 33,
    "levelId": 33,
    "tier": "Apprentice",
    "title": "Relative Paths",
    "conceptText": "### 1. The Concept (The \"Why\")\nRelative paths link to pages residing on the same host or relative to the current file directory, omitting protocols and domains.",
    "codeExample": "```html\n<a href=\"contact.html\">Contact Us</a>\n```",
    "missionText": "### 2. Your Mission\nLink to a local file named \"about.html\" using the text \"About Us\" inside the container.",
    "starterCode": "<!-- Level 33 -->\n",
    "hints": [
      "Set href=\"about.html\" and link text to 'About Us'."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain relative link to about.html",
          "testRegex": "<a\\s+href=[\"']about\\.html[\"']>\\s*About\\s+Us\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-34",
    "level": 34,
    "levelId": 34,
    "tier": "Apprentice",
    "title": "New Window Target",
    "conceptText": "### 1. The Concept (The \"Why\")\nAdding `target=\"_blank\"` inside link tags forces the browser to open the target destination in a new window or tab.",
    "codeExample": "```html\n<a href=\"https://example.com\" target=\"_blank\">Open new tab</a>\n```",
    "missionText": "### 2. Your Mission\nMake an external link to Google (\"https://www.google.com\" with text \"Google\") open safely in a brand new tab.",
    "starterCode": "<!-- Level 34 -->\n",
    "hints": [
      "Add target=\"_blank\" inside your anchor tag attributes."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain target='_blank' attribute",
          "testRegex": "<a\\s+[^>]*target=[\"']_blank[\"'][^>]*>\\s*Google\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-35",
    "level": 35,
    "levelId": 35,
    "tier": "Apprentice",
    "title": "Document Section Anchors",
    "conceptText": "### 1. The Concept (The \"Why\")\nTo link to specific elements on the same page, we set the `href` attribute to point to the `id` selector of the target section (e.g. `#footer`).",
    "codeExample": "```html\n<a href=\"#about\">Jump to About</a>\n...\n<section id=\"about\">About Details</section>\n```",
    "missionText": "### 2. Your Mission\nCreate a link that jumps down to an element with id=\"contact\" inside the container. The link text should say \"Jump to Contact\".",
    "starterCode": "<!-- Level 35 -->\n",
    "hints": [
      "Use <a href=\"#contact\">Jump to Contact</a>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain link pointing to #contact hash location",
          "testRegex": "<a\\s+href=[\"']#contact[\"']>\\s*Jump\\s+to\\s+Contact\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-36",
    "level": 36,
    "levelId": 36,
    "tier": "Apprentice",
    "title": "Image Tag",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe self-closing `<img>` tag embeds images on web pages using the `src` attribute to reference image files.",
    "codeExample": "```html\n<img src=\"pic.jpg\" />\n```",
    "missionText": "### 2. Your Mission\nEmbed an image using the source path \"logo.png\" inside the container.",
    "starterCode": "<!-- Level 36 -->\n",
    "hints": [
      "Use <img src=\"logo.png\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain an img tag pointing to logo.png",
          "testRegex": "<img\\s+[^>]*src=[\"']logo\\.png[\"']\\s*/?>"
        }
      ]
    }
  },
  {
    "id": "html5-37",
    "level": 37,
    "levelId": 37,
    "tier": "Apprentice",
    "title": "Image Alt Text",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `alt` attribute describes the content of an image. It is critical for web accessibility, allowing screen readers to describe images, and displays text if images fail to load.",
    "codeExample": "```html\n<img src=\"logo.png\" alt=\"Company Logo\" />\n```",
    "missionText": "### 2. Your Mission\nAdd descriptive alt text \"Company Logo\" to your \"logo.png\" image inside the container.",
    "starterCode": "<!-- Level 37 -->\n",
    "hints": [
      "Add alt=\"Company Logo\" attribute inside the img element."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain alt attribute with correct descriptive text",
          "testRegex": "<img\\s+[^>]*alt=[\"']Company\\s+Logo[\"'][^>]*src=[\"']logo\\.png[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-38",
    "level": 38,
    "levelId": 38,
    "tier": "Apprentice",
    "title": "Image Dimensions",
    "conceptText": "### 1. The Concept (The \"Why\")\nWe can set pixel width and height boundaries directly on images using `width` and `height` attributes inside the tag.",
    "codeExample": "```html\n<img src=\"logo.png\" width=\"300\" height=\"200\" />\n```",
    "missionText": "### 2. Your Mission\nForce an image \"logo.png\" to display at exactly 200 pixels wide and 100 pixels tall inside the container.",
    "starterCode": "<!-- Level 38 -->\n",
    "hints": [
      "Specify width=\"200\" height=\"100\" attributes on the img element."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should set image width to 200 and height to 100",
          "testRegex": "width=[\"']200[\"']"
        },
        {
          "description": "Should check height parameter too",
          "testRegex": "height=[\"']100[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-39",
    "level": 39,
    "levelId": 39,
    "tier": "Apprentice",
    "title": "Clickable Image Links",
    "conceptText": "### 1. The Concept (The \"Why\")\nTo make an image a clickable link, we nest the `<img>` tag inside an `<a>` anchor tag container.",
    "codeExample": "```html\n<a href=\"index.html\">\n  <img src=\"home.png\" alt=\"Home\" />\n</a>\n```",
    "missionText": "### 2. Your Mission\nMake a \"home.png\" image click through to navigate to \"index.html\" inside the container.",
    "starterCode": "<!-- Level 39 -->\n",
    "hints": [
      "Nest <img src=\"home.png\" /> inside <a href=\"index.html\">."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should wrap image in relative link to index.html",
          "testRegex": "<a\\s+href=[\"']index\\.html[\"']>\\s*<img\\s+[^>]*src=[\"']home\\.png[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-40",
    "level": 40,
    "levelId": 40,
    "tier": "Apprentice",
    "title": "Email Targets",
    "conceptText": "### 1. The Concept (The \"Why\")\nUsing `mailto:` inside the link `href` attribute triggers the user's default email client, pre-filling the email address.",
    "codeExample": "```html\n<a href=\"mailto:hello@example.com\">Contact Us</a>\n```",
    "missionText": "### 2. Your Mission\nCreate a link labeled \"Email Me\" that points to \"test@example.com\" inside the container.",
    "starterCode": "<!-- Level 40 -->\n",
    "hints": [
      "Use <a href=\"mailto:test@example.com\">Email Me</a>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain mailto link to test@example.com",
          "testRegex": "<a\\s+href=[\"']mailto:test@example\\.com[\"']>\\s*Email\\s+Me\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-41",
    "level": 41,
    "levelId": 41,
    "tier": "Apprentice",
    "title": "Phone Connections",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `tel:` protocol creates direct dialing links, allowing mobile visitors to easily place telephone calls directly.",
    "codeExample": "```html\n<a href=\"tel:+1234567890\">Call Us</a>\n```",
    "missionText": "### 2. Your Mission\nCreate a link labeled \"Call Support\" pointing to phone number \"1234567890\" inside the container.",
    "starterCode": "<!-- Level 41 -->\n",
    "hints": [
      "Use href=\"tel:1234567890\"."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain phone dialer link tel:1234567890",
          "testRegex": "<a\\s+href=[\"']tel:1234567890[\"']>\\s*Call\\s+Support\\s*</a>"
        }
      ]
    }
  },
  {
    "id": "html5-42",
    "level": 42,
    "levelId": 42,
    "tier": "Apprentice",
    "title": "Figures",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<figure>` tag acts as a semantic box layout wrapping photos, illustrations, charts, or code snippets to separate them from main text streams.",
    "codeExample": "```html\n<figure>\n  <img src=\"chart.png\" alt=\"Stats\" />\n</figure>\n```",
    "missionText": "### 2. Your Mission\nWrap an image tag (sourcing \"logo.png\") completely inside a figure element inside the container.",
    "starterCode": "<!-- Level 42 -->\n",
    "hints": [
      "Nest <img src=\"logo.png\" /> inside <figure></figure> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain figure tag with img tag inside",
          "testRegex": "<figure>\\s*<img\\s+[^>]*src=[\"']logo\\.png[\"'].*</figure>"
        }
      ]
    }
  },
  {
    "id": "html5-43",
    "level": 43,
    "levelId": 43,
    "tier": "Apprentice",
    "title": "Figure Captions",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<figcaption>` element places semantic subtitle captions directly under figure graphics or code layout blocks.",
    "codeExample": "```html\n<figure>\n  <img src=\"chart.png\" alt=\"Stats\" />\n  <figcaption>Fig 1. Sales Chart</figcaption>\n</figure>\n```",
    "missionText": "### 2. Your Mission\nAdd a caption saying \"Figure 1: Site Analytics\" inside your figure (below the logo.png image) inside the container.",
    "starterCode": "<!-- Level 43 -->\n<figure>\n    <img src=\"logo.png\" alt=\"Analytics logo\" />\n    \n  </figure>",
    "hints": [
      "Write <figcaption>Figure 1: Site Analytics</figcaption> inside the figure block."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain figcaption tag with analytics caption text",
          "testRegex": "<figcaption>\\s*Figure\\s+1:\\s+Site\\s+Analytics\\s*</figcaption>"
        }
      ]
    }
  },
  {
    "id": "html5-44",
    "level": 44,
    "levelId": 44,
    "tier": "Apprentice",
    "title": "File Download Trigger",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `download` attribute on a link forces browser programs to prompt a file download rather than opening a page file layout.",
    "codeExample": "```html\n<a href=\"manual.pdf\" download>Download PDF</a>\n```",
    "missionText": "### 2. Your Mission\nCreate a link to \"report.pdf\" that downloads explicitly when clicked. The link label should say \"Get Report\".",
    "starterCode": "<!-- Level 44 -->\n",
    "hints": [
      "Use <a href=\"report.pdf\" download>Get Report</a>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain download attribute",
          "testRegex": "<a\\s+[^>]*download[^>]*href=[\"']report\\.pdf[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-45",
    "level": 45,
    "levelId": 45,
    "tier": "Apprentice",
    "title": "Asset Integration Review",
    "conceptText": "### 1. The Concept (The \"Why\")\nLet's review the asset features we learned. Combining figures, images, relative links, alt descriptions, and captions.",
    "codeExample": "```html\n<figure>\n  <a href=\"dest.html\">\n    <img src=\"img.jpg\" alt=\"Description\" />\n  </a>\n  <figcaption>Caption text</figcaption>\n</figure>\n```",
    "missionText": "### 2. Your Mission\nBuild a figure with an image (logo.png, alt description \"Company Logo\") that links to an external site (\"https://example.com\"), complete with a caption \"Fig 1\" inside the container.",
    "starterCode": "<!-- Level 45 -->\n",
    "hints": [
      "Nest the link inside figure, then nest image inside link, and add figcaption next to link."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should structure figure, link, image, and figcaption correctly",
          "testRegex": "<figure>\\s*<a\\s+href=[\"']https://example\\.com[\"']>\\s*<img\\s+[^>]*src=[\"']logo\\.png[\"'][^>]*alt=[\"']Company\\s+Logo[\"'].*</a>\\s*<figcaption>\\s*Fig\\s+1\\s*</figcaption>\\s*</figure>"
        }
      ]
    }
  },
  {
    "id": "html5-46",
    "level": 46,
    "levelId": 46,
    "tier": "Apprentice",
    "title": "Table Foundation",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<table>` element acts as the primary wrapper structure housing columns and rows of dataset records.",
    "codeExample": "```html\n<table>\n  <!-- rows go here -->\n</table>\n```",
    "missionText": "### 2. Your Mission\nOpen and close a basic empty table container inside the container.",
    "starterCode": "<!-- Level 46 -->\n",
    "hints": [
      "Write <table></table>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain table tag",
          "testRegex": "<table>\\s*</table>"
        }
      ]
    }
  },
  {
    "id": "html5-47",
    "level": 47,
    "levelId": 47,
    "tier": "Apprentice",
    "title": "Table Rows",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<tr>` element defines a horizontal row of cells inside a table.",
    "codeExample": "```html\n<table>\n  <tr></tr>\n</table>\n```",
    "missionText": "### 2. Your Mission\nBuild a table framework containing exactly two rows inside the container.",
    "starterCode": "<!-- Level 47 -->\n",
    "hints": [
      "Nest two <tr></tr> blocks inside <table></table>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain table with two rows",
          "testRegex": "<table>\\s*(<tr>\\s*</tr>\\s*){2}</table>"
        }
      ]
    }
  },
  {
    "id": "html5-48",
    "level": 48,
    "levelId": 48,
    "tier": "Apprentice",
    "title": "Table Data Cells",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<td>` element defines standard data cells containing actual numbers or text values inside a table row.",
    "codeExample": "```html\n<tr>\n  <td>John</td>\n  <td>Doe</td>\n</tr>\n```",
    "missionText": "### 2. Your Mission\nCreate a single row containing two data cells: \"John\" and \"Doe\" inside the container. (Do not forget the parent table tag).",
    "starterCode": "<!-- Level 48 -->\n",
    "hints": [
      "Inside table and tr, add <td>John</td> and <td>Doe</td>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain tr with two td cells John and Doe",
          "testRegex": "<tr>\\s*<td>\\s*John\\s*</td>\\s*<td>\\s*Doe\\s*</td>\\s*</tr>"
        }
      ]
    }
  },
  {
    "id": "html5-49",
    "level": 49,
    "levelId": 49,
    "tier": "Apprentice",
    "title": "Table Header Cells",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<th>` element defines column descriptors or titles. The browser centers and bolds this text by default.",
    "codeExample": "```html\n<tr>\n  <th>First Name</th>\n  <th>Last Name</th>\n</tr>\n```",
    "missionText": "### 2. Your Mission\nCreate a top row using two header cells labeled \"First Name\" and \"Last Name\" inside the container.",
    "starterCode": "<!-- Level 49 -->\n",
    "hints": [
      "Inside table and tr, add <th>First Name</th> and <th>Last Name</th>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain tr with th header cells",
          "testRegex": "<tr>\\s*<th>\\s*First\\s+Name\\s*</th>\\s*<th>\\s*Last\\s+Name\\s*</th>\\s*</tr>"
        }
      ]
    }
  },
  {
    "id": "html5-50",
    "level": 50,
    "levelId": 50,
    "tier": "Apprentice",
    "title": "Basic Table Assembly",
    "conceptText": "### 1. The Concept (The \"Why\")\nNow, compile a complete basic table combining header cells (`<th>`) on the top row, and standard data cells (`<td>`) on subsequent rows.",
    "codeExample": "```html\n<table>\n  <tr><th>Item</th></tr>\n  <tr><td>Book</td></tr>\n</table>\n```",
    "missionText": "### 2. Your Mission\nBuild a 2x2 table showing headers (Item, Price) on row 1, and one row of data (Book, $10) on row 2 inside the container.",
    "starterCode": "<!-- Level 50 -->\n",
    "hints": [
      "Use <table>. Add first <tr> with two <th>. Add second <tr> with two <td>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should structure a 2x2 table with header row and data row",
          "testRegex": "<table>\\s*<tr>\\s*<th>\\s*Item\\s*</th>\\s*<th>\\s*Price\\s*</th>\\s*</tr>\\s*<tr>\\s*<td>\\s*Book\\s*</td>\\s*<td>\\s*\\$10\\s*</td>\\s*</tr>\\s*</table>"
        }
      ]
    }
  },
  {
    "id": "html5-51",
    "level": 51,
    "levelId": 51,
    "tier": "Mage",
    "title": "Column Spanning",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `colspan` attribute allows a single table cell to stretch horizontally across multiple columns.",
    "codeExample": "```html\n<td colspan=\"2\">Spans two columns</td>\n```",
    "missionText": "### 2. Your Mission\nMake a `<td>` span across 3 columns with the text \"Merged\" inside a row inside the container.",
    "starterCode": "<!-- Level 51 -->\n<table>\n    <tr>\n      \n    </tr>\n  </table>",
    "hints": [
      "Use <td colspan=\"3\">Merged</td>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain td with colspan 3 and text Merged",
          "testRegex": "<td\\s+colspan=[\"']3[\"']>\\s*Merged\\s*</td>"
        }
      ]
    }
  },
  {
    "id": "html5-52",
    "level": 52,
    "levelId": 52,
    "tier": "Mage",
    "title": "Row Spanning",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `rowspan` attribute allows a single table cell to stretch vertically down across multiple rows.",
    "codeExample": "```html\n<th rowspan=\"2\">Spans two rows</th>\n```",
    "missionText": "### 2. Your Mission\nMake a `<th>` span down across 2 rows inside a table inside the container.",
    "starterCode": "<!-- Level 52 -->\n<table>\n    <tr>\n      \n    </tr>\n    <tr>\n      \n    </tr>\n  </table>",
    "hints": [
      "Use <th rowspan=\"2\">Your header</th>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain th with rowspan 2",
          "testRegex": "<th\\s+rowspan=[\"']2[\"']>"
        }
      ]
    }
  },
  {
    "id": "html5-53",
    "level": 53,
    "levelId": 53,
    "tier": "Mage",
    "title": "Table Captions",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<caption>` element sets a visible semantic title directly associated with a table. It must be placed immediately after the opening `<table>` tag.",
    "codeExample": "```html\n<table>\n  <caption>Employee Directory</caption>\n  <tr>...</tr>\n</table>\n```",
    "missionText": "### 2. Your Mission\nAdd a caption stating \"Employee Directory\" immediately inside a table element inside the container.",
    "starterCode": "<!-- Level 53 -->\n",
    "hints": [
      "Nest <caption>Employee Directory</caption> immediately inside the table tag."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain table with caption Employee Directory",
          "testRegex": "<table>\\s*<caption>\\s*Employee\\s+Directory\\s*</caption>"
        }
      ]
    }
  },
  {
    "id": "html5-54",
    "level": 54,
    "levelId": 54,
    "tier": "Mage",
    "title": "Table Header Groups",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<thead>` tag groups the header rows of a table, helping with page layout styling and print behavior.",
    "codeExample": "```html\n<table>\n  <thead>\n    <tr><th>Label</th></tr>\n  </thead>\n</table>\n```",
    "missionText": "### 2. Your Mission\nWrap the header row of a table inside an explicit `<thead>` block inside the container.",
    "starterCode": "<!-- Level 54 -->\n<table>\n    \n      <tr>\n        <th>ID</th>\n      </tr>\n    \n  </table>",
    "hints": [
      "Surround the <tr> header row with <thead> and </thead>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain thead tag around tr",
          "testRegex": "<thead>\\s*<tr>\\s*<th>\\s*ID\\s*</th>\\s*</tr>\\s*</thead>"
        }
      ]
    }
  },
  {
    "id": "html5-55",
    "level": 55,
    "levelId": 55,
    "tier": "Mage",
    "title": "Table Body Sections",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<tbody>` tag encapsulates the main body data rows of a table separate from headers or footers.",
    "codeExample": "```html\n<table>\n  <tbody>\n    <tr><td>Data</td></tr>\n  </tbody>\n</table>\n```",
    "missionText": "### 2. Your Mission\nWrap two data rows cleanly inside a `<tbody>` container inside the table inside the container.",
    "starterCode": "<!-- Level 55 -->\n<table>\n    \n  </table>",
    "hints": [
      "Add <tbody> containing two <tr><td>Data</td></tr> blocks inside your table."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain tbody enclosing two tr rows",
          "testRegex": "<tbody>\\s*(<tr>\\s*<td>.*</td>\\s*</tr>\\s*){2}</tbody>"
        }
      ]
    }
  },
  {
    "id": "html5-56",
    "level": 56,
    "levelId": 56,
    "tier": "Mage",
    "title": "Table Footers",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<tfoot>` tag groups summary, total, or calculations rows at the bottom of tables.",
    "codeExample": "```html\n<tfoot>\n  <tr><td>Total: $100</td></tr>\n</tfoot>\n```",
    "missionText": "### 2. Your Mission\nCreate a table footer row displaying a \"Total: $100\" cell inside the container.",
    "starterCode": "<!-- Level 56 -->\n<table>\n    \n  </table>",
    "hints": [
      "Add <tfoot><tr><td>Total: $100</td></tr></tfoot> inside the table."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain tfoot tag enclosing row with total cell",
          "testRegex": "<tfoot>\\s*<tr>\\s*<td>\\s*Total:\\s*\\$100\\s*</td>\\s*</tr>\\s*</tfoot>"
        }
      ]
    }
  },
  {
    "id": "html5-57",
    "level": 57,
    "levelId": 57,
    "tier": "Mage",
    "title": "Column Groups",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<colgroup>` element groups full columns together for styling purposes, enabling shared classes or widths.",
    "codeExample": "```html\n<table>\n  <colgroup>\n    <!-- column tracks -->\n  </colgroup>\n</table>\n```",
    "missionText": "### 2. Your Mission\nAdd a colgroup element containing two column tracks (using empty tags or elements) above your rows inside a table inside the container.",
    "starterCode": "<!-- Level 57 -->\n<table>\n    \n  </table>",
    "hints": [
      "Nest <colgroup></colgroup> inside table before rows."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain colgroup tag",
          "testRegex": "<colgroup[\\s>]"
        }
      ]
    }
  },
  {
    "id": "html5-58",
    "level": 58,
    "levelId": 58,
    "tier": "Mage",
    "title": "Column Track Styling",
    "conceptText": "### 1. The Concept (The \"Why\")\nInside a `<colgroup>`, the self-closing `<col>` tag specifies properties (like background color or span) for individual vertical column tracks.",
    "codeExample": "```html\n<colgroup>\n  <col span=\"2\" class=\"highlight\" />\n</colgroup>\n```",
    "missionText": "### 2. Your Mission\nCreate a col group with an explicit self-closing `<col>` element inside the table inside the container.",
    "starterCode": "<!-- Level 58 -->\n<table>\n    \n  </table>",
    "hints": [
      "Write <colgroup><col /></colgroup> inside the table."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain colgroup with col tag inside",
          "testRegex": "<colgroup>\\s*<col\\s*/?>\\s*</colgroup>"
        }
      ]
    }
  },
  {
    "id": "html5-59",
    "level": 59,
    "levelId": 59,
    "tier": "Mage",
    "title": "Complex Structure",
    "conceptText": "### 1. The Concept (The \"Why\")\nLet's assemble a complete semantically divided table using `<caption>`, `<thead>`, `<tbody>`, and `<tfoot>` in order.",
    "codeExample": "```html\n<table>\n  <caption>Info</caption>\n  <thead>...</thead>\n  <tbody>...</tbody>\n  <tfoot>...</tfoot>\n</table>\n```",
    "missionText": "### 2. Your Mission\nWrite a structured table complete with caption, thead, tbody, and tfoot blocks in order inside the container.",
    "starterCode": "<!-- Level 59 -->\n",
    "hints": [
      "Verify the tags caption, thead, tbody, and tfoot exist and close cleanly in order inside table."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain caption, thead, tbody, and tfoot elements structured in correct order inside table",
          "testRegex": "<table>\\s*<caption>.*</caption>\\s*<thead>.*</thead>\\s*<tbody>.*</tbody>\\s*<tfoot>.*</tfoot>\\s*</table>"
        }
      ]
    }
  },
  {
    "id": "html5-60",
    "level": 60,
    "levelId": 60,
    "tier": "Mage",
    "title": "Structural Data Review",
    "conceptText": "### 1. The Concept (The \"Why\")\nReview data architecture table structures by combining cell spanning and layout divisions.",
    "codeExample": "```html\n<tr>\n  <td colspan=\"2\">Total</td>\n</tr>\n```",
    "missionText": "### 2. Your Mission\nCreate a complete 2-column billing table showing headers (Product, Price), 1 product item row (Widget, $50), and a footer row total utilizing a colspan of 2 (Total: $50) inside the container.",
    "starterCode": "<!-- Level 60 -->\n",
    "hints": [
      "Nest the rows within details, using th for headers, td for data, and tfoot td with colspan='2' for the total."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should structure 2-column table with product row and total colspan row",
          "testRegex": "<table>\\s*<thead>\\s*<tr>\\s*<th>\\s*Product\\s*</th>\\s*<th>\\s*Price\\s*</th>\\s*</tr>\\s*</thead>\\s*<tbody>\\s*<tr>\\s*<td>\\s*Widget\\s*</td>\\s*<td>\\s*\\$50\\s*</td>\\s*</tr>\\s*</tbody>\\s*<tfoot>\\s*<tr>\\s*<td\\s+colspan=[\"']2[\"']>\\s*Total:\\s*\\$50\\s*</td>\\s*</tr>\\s*</tfoot>\\s*</table>"
        }
      ]
    }
  },
  {
    "id": "html5-61",
    "level": 61,
    "levelId": 61,
    "tier": "Mage",
    "title": "Form Container",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<form>` element acts as a container block to collect and structure interactive user input fields before submitting them to a server.",
    "codeExample": "```html\n<form>\n  <!-- inputs -->\n</form>\n```",
    "missionText": "### 2. Your Mission\nOpen and close a basic form container tag inside the container.",
    "starterCode": "<!-- Level 61 -->\n",
    "hints": [
      "Write <form></form>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain form tag",
          "testRegex": "<form>\\s*</form>"
        }
      ]
    }
  },
  {
    "id": "html5-62",
    "level": 62,
    "levelId": 62,
    "tier": "Mage",
    "title": "Text Inputs",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<input type=\"text\">` field creates a single-line text box for capture of standard string names or usernames.",
    "codeExample": "```html\n<input type=\"text\" />\n```",
    "missionText": "### 2. Your Mission\nCreate a standard text input field inside a form inside the container.",
    "starterCode": "<!-- Level 62 -->\n<form>\n    \n  </form>",
    "hints": [
      "Use <input type=\"text\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain text input tag",
          "testRegex": "<input\\s+[^>]*type=[\"']text[\"']\\s*/?>"
        }
      ]
    }
  },
  {
    "id": "html5-63",
    "level": 63,
    "levelId": 63,
    "tier": "Mage",
    "title": "Input Placeholders",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `placeholder` attribute specifies a short hint that describes the expected value of an input field, disappearing once typing begins.",
    "codeExample": "```html\n<input type=\"text\" placeholder=\"Your name\" />\n```",
    "missionText": "### 2. Your Mission\nAdd a placeholder saying \"Enter username...\" to a text input inside the container.",
    "starterCode": "<!-- Level 63 -->\n<input type=\"text\" />",
    "hints": [
      "Add placeholder=\"Enter username...\" inside the input element."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should set placeholder text to 'Enter username...'",
          "testRegex": "placeholder=[\"']Enter\\s+username\\.\\.\\.[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-64",
    "level": 64,
    "levelId": 64,
    "tier": "Mage",
    "title": "Input Labels",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<label>` tag defines text descriptions for fields. Connecting them using matching `for` and `id` attributes links the label text to the input field, enhancing accessibility.",
    "codeExample": "```html\n<label for=\"name\">Name</label>\n<input type=\"text\" id=\"name\" />\n```",
    "missionText": "### 2. Your Mission\nCreate a label text \"Username:\" bound securely to a text input using id=\"user\" inside the container.",
    "starterCode": "<!-- Level 64 -->\n",
    "hints": [
      "Use <label for=\"user\">Username:</label> and <input type=\"text\" id=\"user\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain label with for='user' and matching input id",
          "testRegex": "<label\\s+for=[\"']user[\"']>\\s*Username:\\s*</label>\\s*<input\\s+[^>]*id=[\"']user[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-65",
    "level": 65,
    "levelId": 65,
    "tier": "Mage",
    "title": "Password Input Masking",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<input type=\"password\">` obscures text characters automatically, securing passwords during entry.",
    "codeExample": "```html\n<input type=\"password\" id=\"pass\" />\n```",
    "missionText": "### 2. Your Mission\nCreate a password entry field with id=\"pwd\" and an attached label container with text \"Password:\" inside the container.",
    "starterCode": "<!-- Level 65 -->\n",
    "hints": [
      "Use <label for=\"pwd\">Password:</label> and <input type=\"password\" id=\"pwd\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should connect label and password input correctly",
          "testRegex": "<label\\s+for=[\"']pwd[\"']>\\s*Password:\\s*</label>\\s*<input\\s+[^>]*type=[\"']password[\"'][^>]*id=[\"']pwd[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-66",
    "level": 66,
    "levelId": 66,
    "tier": "Mage",
    "title": "Form Action Buttons",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<button type=\"submit\">` tag submits form inputs to the destination server handler when clicked.",
    "codeExample": "```html\n<button type=\"submit\">Submit</button>\n```",
    "missionText": "### 2. Your Mission\nCreate a form button displaying the explicit text \"Register Now\" inside a form inside the container.",
    "starterCode": "<!-- Level 66 -->\n<form>\n    \n  </form>",
    "hints": [
      "Write <button type=\"submit\">Register Now</button>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain button of submit type with text Register Now",
          "testRegex": "<button\\s+type=[\"']submit[\"']>\\s*Register\\s+Now\\s*</button>"
        }
      ]
    }
  },
  {
    "id": "html5-67",
    "level": 67,
    "levelId": 67,
    "tier": "Mage",
    "title": "Radio Single-Select",
    "conceptText": "### 1. The Concept (The \"Why\")\nRadio buttons (`<input type=\"radio\">`) let users choose exactly one option from a group. They must share the same `name` attribute to restrict selection to a single option.",
    "codeExample": "```html\n<input type=\"radio\" name=\"opt\" value=\"A\" />\n<input type=\"radio\" name=\"opt\" value=\"B\" />\n```",
    "missionText": "### 2. Your Mission\nCreate two radio buttons for choices \"Yes\" and \"No\" sharing the name \"agree\" inside the container.",
    "starterCode": "<!-- Level 67 -->\n",
    "hints": [
      "Create <input type=\"radio\" name=\"agree\" value=\"yes\" /> and <input type=\"radio\" name=\"agree\" value=\"no\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain two radio inputs with name agree",
          "testRegex": "(<input\\s+[^>]*type=[\"']radio[\"'][^>]*name=[\"']agree[\"'][^>]*>\\s*.*\\s*){2}"
        }
      ]
    }
  },
  {
    "id": "html5-68",
    "level": 68,
    "levelId": 68,
    "tier": "Mage",
    "title": "Checkbox Selects",
    "conceptText": "### 1. The Concept (The \"Why\")\nCheckboxes (`<input type=\"checkbox\">`) allow users to select multiple options or toggle single settings (like opt-ins).",
    "codeExample": "```html\n<input type=\"checkbox\" id=\"terms\" />\n<label for=\"terms\">Accept terms</label>\n```",
    "missionText": "### 2. Your Mission\nCreate a checkbox input bound to a label showing \"Subscribe to newsletter\" (use id=\"sub\") inside the container.",
    "starterCode": "<!-- Level 68 -->\n",
    "hints": [
      "Connect checkbox input (id=\"sub\") and label (for=\"sub\")."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should connect label and checkbox input for newsletter",
          "testRegex": "<input\\s+[^>]*type=[\"']checkbox[\"'][^>]*id=[\"']sub[\"']>\\s*<label\\s+for=[\"']sub[\"']>\\s*Subscribe\\s+to\\s+newsletter\\s*</label>"
        }
      ]
    }
  },
  {
    "id": "html5-69",
    "level": 69,
    "levelId": 69,
    "tier": "Mage",
    "title": "Text Areas",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<textarea>` tag defines a multi-line text input block, suitable for long descriptions, comments, or bios.",
    "codeExample": "```html\n<textarea rows=\"5\" cols=\"30\">Preset text</textarea>\n```",
    "missionText": "### 2. Your Mission\nCreate a multi-line text input block with 4 rows for a user \"Bio\" inside the container. Set its rows attribute to 4 and id=\"bio\".",
    "starterCode": "<!-- Level 69 -->\n",
    "hints": [
      "Use <textarea rows=\"4\" id=\"bio\"></textarea>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain textarea with rows='4' and id='bio'",
          "testRegex": "<textarea\\s+[^>]*rows=[\"']4[\"'][^>]*id=[\"']bio[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-70",
    "level": 70,
    "levelId": 70,
    "tier": "Mage",
    "title": "Dropdown Selectors",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<select>` element creates a dropdown list containing selectable `<option>` menu items.",
    "codeExample": "```html\n<select>\n  <option value=\"1\">Option One</option>\n</select>\n```",
    "missionText": "### 2. Your Mission\nCreate a dropdown menu listing two options: \"Admin\" and \"User\" inside the container.",
    "starterCode": "<!-- Level 70 -->\n",
    "hints": [
      "Create <select> enclosing two <option> tags."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain select with two options Admin and User",
          "testRegex": "<select>\\s*(<option[^>]*>\\s*(Admin|User)\\s*</option>\\s*){2}</select>"
        }
      ]
    }
  },
  {
    "id": "html5-71",
    "level": 71,
    "levelId": 71,
    "tier": "Mage",
    "title": "Option Grouping",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<optgroup>` tag groups related choices in dropdown selectors, separating options under descriptive headings.",
    "codeExample": "```html\n<select>\n  <optgroup label=\"Fruit\">\n    <option>Apple</option>\n  </optgroup>\n</select>\n```",
    "missionText": "### 2. Your Mission\nGroup dropdown choices under an optgroup labeled \"Vehicles\" inside a select block inside the container.",
    "starterCode": "<!-- Level 71 -->\n<select>\n    \n  </select>",
    "hints": [
      "Nest <optgroup label=\"Vehicles\"><option>Car</option></optgroup> inside select."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain optgroup with label Vehicles",
          "testRegex": "<optgroup\\s+label=[\"']Vehicles[\"']>"
        }
      ]
    }
  },
  {
    "id": "html5-72",
    "level": 72,
    "levelId": 72,
    "tier": "Mage",
    "title": "File Upload Fields",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<input type=\"file\">` field lets users select and attach files from their local system storage for upload.",
    "codeExample": "```html\n<input type=\"file\" />\n```",
    "missionText": "### 2. Your Mission\nCreate an input field tailored explicitly for loading up image assets inside the container. (Use accept=\"image/*\" or similar target properties if desired, but prioritize type=\"file\").",
    "starterCode": "<!-- Level 72 -->\n",
    "hints": [
      "Write <input type=\"file\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain file type input",
          "testRegex": "<input\\s+[^>]*type=[\"']file[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-73",
    "level": 73,
    "levelId": 73,
    "tier": "Mage",
    "title": "Hidden Form State",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<input type=\"hidden\">` field stores backend state tokens or user IDs that are completely hidden from the visual interface.",
    "codeExample": "```html\n<input type=\"hidden\" name=\"token\" value=\"abc\" />\n```",
    "missionText": "### 2. Your Mission\nCreate a hidden token field with name=\"userID\" value=\"123\" inside the container.",
    "starterCode": "<!-- Level 73 -->\n",
    "hints": [
      "Use <input type=\"hidden\" name=\"userID\" value=\"123\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain hidden type input with name userID and value 123",
          "testRegex": "<input\\s+[^>]*type=[\"']hidden[\"'][^>]*name=[\"']userID[\"'][^>]*value=[\"']123[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-74",
    "level": 74,
    "levelId": 74,
    "tier": "Mage",
    "title": "Field Enforcement",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `required` boolean attribute stops users from submitting a form if the field is empty, enforcing data validation in the browser.",
    "codeExample": "```html\n<input type=\"text\" required />\n```",
    "missionText": "### 2. Your Mission\nCreate an email type input field flagged as absolutely required inside the container.",
    "starterCode": "<!-- Level 74 -->\n",
    "hints": [
      "Use <input type=\"email\" required />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain email input flagged as required",
          "testRegex": "<input\\s+[^>]*type=[\"']email[\"'][^>]*required"
        }
      ]
    }
  },
  {
    "id": "html5-75",
    "level": 75,
    "levelId": 75,
    "tier": "Mage",
    "title": "Input Boundary Validation",
    "conceptText": "### 1. The Concept (The \"Why\")\nAttributes like `min`, `max`, and `maxlength` restrict numeric ranges or text string lengths in form fields.",
    "codeExample": "```html\n<input type=\"number\" min=\"1\" max=\"100\" />\n```",
    "missionText": "### 2. Your Mission\nCreate a number field restricting inputs strictly between 1 and 10 inside the container.",
    "starterCode": "<!-- Level 75 -->\n",
    "hints": [
      "Use <input type=\"number\" min=\"1\" max=\"10\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain number input with min 1 and max 10",
          "testRegex": "<input\\s+[^>]*type=[\"']number[\"'][^>]*min=[\"']1[\"'][^>]*max=[\"']10[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-76",
    "level": 76,
    "levelId": 76,
    "tier": "Mage",
    "title": "Page Headers",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<header>` semantic element designates introductory container space, wrapping logos, site names, navigation bars, or header tags.",
    "codeExample": "```html\n<header>\n  <h1>My Site</h1>\n</header>\n```",
    "missionText": "### 2. Your Mission\nCreate a top header block containing your site's main h1 title (Welcome to Portfolio) inside the container.",
    "starterCode": "<!-- Level 76 -->\n",
    "hints": [
      "Nest <h1>Welcome to Portfolio</h1> inside <header></header>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain header tag enclosing h1 heading",
          "testRegex": "<header>\\s*<h1[\\s>].*Welcome.*</h1>\\s*</header>"
        }
      ]
    }
  },
  {
    "id": "html5-77",
    "level": 77,
    "levelId": 77,
    "tier": "Mage",
    "title": "Navigation Areas",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<nav>` semantic tag isolates menu links, outlining structural pathways throughout site directories.",
    "codeExample": "```html\n<nav>\n  <a href=\"/\">Home</a>\n  <a href=\"/about\">About</a>\n</nav>\n```",
    "missionText": "### 2. Your Mission\nWrap a list of three menu anchor links neatly inside a nav element inside the container.",
    "starterCode": "<!-- Level 77 -->\n",
    "hints": [
      "Nest three anchor links (e.g. Home, Portfolio, Contact) inside <nav></nav>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain nav tag enclosing three anchor links",
          "testRegex": "<nav>\\s*(<a\\s+[^>]*>.*</a>\\s*){3}</nav>"
        }
      ]
    }
  },
  {
    "id": "html5-78",
    "level": 78,
    "levelId": 78,
    "tier": "Mage",
    "title": "Main Body Content",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<main>` semantic container isolates the single, primary core topic unique to this active web document view. There should only be one `<main>` element per page.",
    "codeExample": "```html\n<main>\n  <p>Primary page content goes here.</p>\n</main>\n```",
    "missionText": "### 2. Your Mission\nEstablish the single primary `<main></main>` body track block inside the container.",
    "starterCode": "<!-- Level 78 -->\n",
    "hints": [
      "Write <main></main> inside the container."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain main tag",
          "testRegex": "<main>\\s*</main>"
        }
      ]
    }
  },
  {
    "id": "html5-79",
    "level": 79,
    "levelId": 79,
    "tier": "Mage",
    "title": "Theme Sections",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<section>` element groups related thematic elements together (such as chapters, tabs, or introduction sections), typically containing a heading tag.",
    "codeExample": "```html\n<section>\n  <h2>Services</h2>\n  <p>We build websites.</p>\n</section>\n```",
    "missionText": "### 2. Your Mission\nCreate a section element housing an h2 titled \"Our Services\" inside the container.",
    "starterCode": "<!-- Level 79 -->\n",
    "hints": [
      "Nest <h2>Our Services</h2> inside <section></section>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain section with h2 titled Our Services",
          "testRegex": "<section>\\s*<h2>\\s*Our\\s+Services\\s*</h2>\\s*</section>"
        }
      ]
    }
  },
  {
    "id": "html5-80",
    "level": 80,
    "levelId": 80,
    "tier": "Mage",
    "title": "Articles",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<article>` tag encapsulates fully independent, self-contained layout blocks intended for independent syndication (e.g. blog posts, forum replies, news stories).",
    "codeExample": "```html\n<article>\n  <h2>News Title</h2>\n  <p>Story description text.</p>\n</article>\n```",
    "missionText": "### 2. Your Mission\nCreate an article block wrapping a title (h2) and paragraph blog post inside the container.",
    "starterCode": "<!-- Level 80 -->\n",
    "hints": [
      "Nest an <h2> heading and <p> paragraph inside <article></article>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain article tag wrapping h2 and p tags",
          "testRegex": "<article>\\s*<h2[\\s>].*</h2>\\s*<p[\\s>].*</p>\\s*</article>"
        }
      ]
    }
  },
  {
    "id": "html5-81",
    "level": 81,
    "levelId": 81,
    "tier": "Mage",
    "title": "Sidebars & Callouts",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<aside>` semantic element groups auxiliary sidebar links, callout quote details, or advertisement blocks tangential to the primary main layout stream.",
    "codeExample": "```html\n<aside>\n  <h4>Quick Links</h4>\n  <p>Related pages.</p>\n</aside>\n```",
    "missionText": "### 2. Your Mission\nCreate an aside box displaying \"Related Links\" inside the container.",
    "starterCode": "<!-- Level 81 -->\n",
    "hints": [
      "Write <aside>Related Links</aside>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain aside tag",
          "testRegex": "<aside>\\s*Related\\s+Links\\s*</aside>"
        }
      ]
    }
  },
  {
    "id": "html5-82",
    "level": 82,
    "levelId": 82,
    "tier": "Mage",
    "title": "Page Footers",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<footer>` semantic element bounds copyright warnings, terms of use links, address blocks, and metadata at the bottom of pages.",
    "codeExample": "```html\n<footer>\n  <p>&copy; 2026 Developer</p>\n</footer>\n```",
    "missionText": "### 2. Your Mission\nCreate a site footer containing a copyright notice paragraph inside the container.",
    "starterCode": "<!-- Level 82 -->\n",
    "hints": [
      "Nest <p>&copy; 2026</p> or similar notice inside <footer></footer>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain footer tag wrapping paragraph",
          "testRegex": "<footer>\\s*<p>.*</p>\\s*</footer>"
        }
      ]
    }
  },
  {
    "id": "html5-83",
    "level": 83,
    "levelId": 83,
    "tier": "Mage",
    "title": "Generic Block Divs",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<div>` (division) is a generic block container tag. It has no semantic meaning but is used to group items for layout styling.",
    "codeExample": "```html\n<div class=\"box\">\n  <p>Inside box</p>\n```",
    "missionText": "### 2. Your Mission\nWrap two paragraphs inside a generic division container inside the container.",
    "starterCode": "<!-- Level 83 -->\n",
    "hints": [
      "Create a <div> block enclosing two separate <p> paragraphs."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain div wrapping two paragraphs",
          "testRegex": "<div>\\s*(<p>.*</p>\\s*){2}</div>"
        }
      ]
    }
  },
  {
    "id": "html5-84",
    "level": 84,
    "levelId": 84,
    "tier": "Mage",
    "title": "Generic Inline Spans",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<span>` element is a generic inline container used to style small sections of text or word fragments without starting a new line.",
    "codeExample": "```html\n<p>This is <span class=\"highlight\">colored</span> text.</p>\n```",
    "missionText": "### 2. Your Mission\nWrap a single word inside a paragraph with a span tag inside the container.",
    "starterCode": "<!-- Level 84 -->\n<p>Wrap the middle word inside a span tag.</p>",
    "hints": [
      "Select 'middle' or another word, and wrap it in <span>middle</span>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain a span tag within a paragraph",
          "testRegex": "<p>.*<span>.*</span>.*</p>"
        }
      ]
    }
  },
  {
    "id": "html5-85",
    "level": 85,
    "levelId": 85,
    "tier": "Mage",
    "title": "Audio Embeds",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<audio>` element embeds sound files. The `controls` attribute displays play/pause controls in the browser.",
    "codeExample": "```html\n<audio src=\"song.mp3\" controls></audio>\n```",
    "missionText": "### 2. Your Mission\nEmbed an audio track sourcing \"podcast.mp3\" showing user control buttons inside the container.",
    "starterCode": "<!-- Level 85 -->\n",
    "hints": [
      "Use <audio src=\"podcast.mp3\" controls></audio>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain audio tag with src podcast.mp3 and controls attribute",
          "testRegex": "<audio\\s+[^>]*src=[\"']podcast\\.mp3[\"'][^>]*controls"
        }
      ]
    }
  },
  {
    "id": "html5-86",
    "level": 86,
    "levelId": 86,
    "tier": "Mage",
    "title": "Video Elements",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<video>` element embeds movie clips. We can configure size boundary options and include standard play controls.",
    "codeExample": "```html\n<video src=\"clip.mp4\" width=\"320\" height=\"240\" controls></video>\n```",
    "missionText": "### 2. Your Mission\nEmbed a movie asset sourcing \"clip.mp4\" displaying user control options inside the container.",
    "starterCode": "<!-- Level 86 -->\n",
    "hints": [
      "Use <video src=\"clip.mp4\" controls></video>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain video tag with src clip.mp4 and controls attribute",
          "testRegex": "<video\\s+[^>]*src=[\"']clip\\.mp4[\"'][^>]*controls"
        }
      ]
    }
  },
  {
    "id": "html5-87",
    "level": 87,
    "levelId": 87,
    "tier": "Mage",
    "title": "Media Subtitles",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<track>` tag nests inside `<video>` or `<audio>` elements to map WebVTT subtitle track files to playback media, facilitating accessibility.",
    "codeExample": "```html\n<video src=\"clip.mp4\" controls>\n  <track src=\"subs.vtt\" kind=\"subtitles\" srclang=\"en\" label=\"English\" />\n</video>\n```",
    "missionText": "### 2. Your Mission\nNest a subtitles track sourcing \"sub.vtt\" directly inside a video container inside the container.",
    "starterCode": "<!-- Level 87 -->\n<video src=\"clip.mp4\" controls>\n    \n  </video>",
    "hints": [
      "Add <track src=\"sub.vtt\" kind=\"subtitles\" srclang=\"en\" label=\"English\" /> inside video."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain track tag with src sub.vtt and kind subtitles",
          "testRegex": "<track\\s+[^>]*src=[\"']sub\\.vtt[\"'][^>]*kind=[\"']subtitles[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-88",
    "level": 88,
    "levelId": 88,
    "tier": "Mage",
    "title": "Inline Frames",
    "conceptText": "### 1. The Concept (The \"Why\")\nAn `<iframe>` (inline frame) nests another web document inside the active page view.",
    "codeExample": "```html\n<iframe src=\"https://example.com\" width=\"400\" height=\"300\"></iframe>\n```",
    "missionText": "### 2. Your Mission\nEmbed an iframe pointing out to \"https://example.com\" inside the container.",
    "starterCode": "<!-- Level 88 -->\n",
    "hints": [
      "Use <iframe src=\"https://example.com\"></iframe>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain iframe tag with src pointing to example.com",
          "testRegex": "<iframe\\s+[^>]*src=[\"']https://example\\.com[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-89",
    "level": 89,
    "levelId": 89,
    "tier": "Mage",
    "title": "Interactive Details",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<details>` tag builds native accordion folders that open on user mouse clicks. The `<summary>` tag specifies the visible toggle handle.",
    "codeExample": "```html\n<details>\n  <summary>Click here</summary>\n  <p>Hidden content revealed!</p>\n</details>\n```",
    "missionText": "### 2. Your Mission\nCreate an FAQ block where clicking \"View Answer\" expands hidden text inside the container.",
    "starterCode": "<!-- Level 89 -->\n",
    "hints": [
      "Nest <summary>View Answer</summary> and some paragraph text inside a <details> container."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain details and summary tags with View Answer text",
          "testRegex": "<details>\\s*<summary>\\s*View\\s+Answer\\s*</summary>\\s*.*\\s*</details>"
        }
      ]
    }
  },
  {
    "id": "html5-90",
    "level": 90,
    "levelId": 90,
    "tier": "Mage",
    "title": "Semantic Layout Compilation",
    "conceptText": "### 1. The Concept (The \"Why\")\nLet's assemble a complete, organized layout combining header, navigation, main sections, and footers in logical order.",
    "codeExample": "```html\n<header>Header</header>\n<nav>Menu</nav>\n<main>Main Body</main>\n<footer>Footer</footer>\n```",
    "missionText": "### 2. Your Mission\nBuild a semantic architecture arranging a header, nav, main (with nested section), and footer in order inside the container.",
    "starterCode": "<!-- Level 90 -->\n",
    "hints": [
      "Place header, nav, main, and footer blocks sequentially. Nest section inside main."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should arrange layout tags sequentially in order",
          "testRegex": "<header>.*</header>\\s*<nav>.*</nav>\\s*<main>\\s*<section>.*</section>\\s*</main>\\s*<footer>.*</footer>"
        }
      ]
    }
  },
  {
    "id": "html5-91",
    "level": 91,
    "levelId": 91,
    "tier": "Mage",
    "title": "Charset Meta",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<meta charset=\"UTF-8\">` declaration inside the `<head>` is critical to instruct browsers to decode page text characters using international UTF-8 encoding standard rules.",
    "codeExample": "```html\n<head>\n  <meta charset=\"UTF-8\" />\n</head>\n```",
    "missionText": "### 2. Your Mission\nAdd a meta tag declaring UTF-8 encoding inside a document head inside the container.",
    "starterCode": "<!-- Level 91 -->\n<head>\n    \n  </head>",
    "hints": [
      "Use <meta charset=\"UTF-8\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain meta charset tag inside head",
          "testRegex": "<head>\\s*<meta\\s+charset=[\"']UTF-8[\"']\\s*/?>\\s*</head>"
        }
      ]
    }
  },
  {
    "id": "html5-92",
    "level": 92,
    "levelId": 92,
    "tier": "Mage",
    "title": "Viewport Optimization",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe responsive viewport meta tag ensures page layouts scale correctly on mobile devices by mapping the layout size to the screen width.",
    "codeExample": "```html\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n```",
    "missionText": "### 2. Your Mission\nWrite the standard meta tag for viewport scale optimization inside a head block inside the container.",
    "starterCode": "<!-- Level 92 -->\n<head>\n    \n  </head>",
    "hints": [
      "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain standard viewport meta tag inside head",
          "testRegex": "<meta\\s+name=[\"']viewport[\"']\\s+content=[\"']width=device-width,\\s*initial-scale=1\\.0[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-93",
    "level": 93,
    "levelId": 93,
    "tier": "Mage",
    "title": "Search Descriptions",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<meta name=\"description\">` tag provides page summary blurbs displayed under link titles in search engine result list pages.",
    "codeExample": "```html\n<meta name=\"description\" content=\"Detailed page description.\" />\n```",
    "missionText": "### 2. Your Mission\nAdd a meta description tag stating \"Professional web developer portfolio\" inside the container.",
    "starterCode": "<!-- Level 93 -->\n<head>\n    \n  </head>",
    "hints": [
      "Use <meta name=\"description\" content=\"Professional web developer portfolio\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain meta description with targeted content text",
          "testRegex": "<meta\\s+name=[\"']description[\"']\\s+content=[\"']Professional\\s+web\\s+developer\\s+portfolio[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-94",
    "level": 94,
    "levelId": 94,
    "tier": "Mage",
    "title": "External Stylesheet Links",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<link rel=\"stylesheet\">` tag imports styling parameters from independent external CSS files into pages.",
    "codeExample": "```html\n<link rel=\"stylesheet\" href=\"style.css\" />\n```",
    "missionText": "### 2. Your Mission\nWire up an external style file named \"styles.css\" inside a head block inside the container.",
    "starterCode": "<!-- Level 94 -->\n<head>\n    \n  </head>",
    "hints": [
      "Use <link rel=\"stylesheet\" href=\"styles.css\" /> inside head."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain link tag referencing styles.css stylesheet",
          "testRegex": "<link\\s+[^>]*rel=[\"']stylesheet[\"'][^>]*href=[\"']styles\\.css[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-95",
    "level": 95,
    "levelId": 95,
    "tier": "Mage",
    "title": "External Script Assets",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<script src=\"...\">` tag loads and executes logic behaviors from separate JavaScript files. It is usually placed at the bottom of the body.",
    "codeExample": "```html\n<body>\n  ...\n  <script src=\"script.js\"></script>\n</body>\n```",
    "missionText": "### 2. Your Mission\nAttach an external script source named \"app.js\" right before your body close inside the container.",
    "starterCode": "<!-- Level 95 -->\n<body>\n    \n  </body>",
    "hints": [
      "Add <script src=\"app.js\"></script> inside body."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain script tag pointing to app.js inside body",
          "testRegex": "<body>\\s*<script\\s+src=[\"']app\\.js[\"']>\\s*</script>\\s*</body>"
        }
      ]
    }
  },
  {
    "id": "html5-96",
    "level": 96,
    "levelId": 96,
    "tier": "Mage",
    "title": "Tab Favicons",
    "conceptText": "### 1. The Concept (The \"Why\")\nFavicons are tiny site icons loaded onto browser page tabs. We link them using a link element flagged with rel=\"icon\".",
    "codeExample": "```html\n<link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\" />\n```",
    "missionText": "### 2. Your Mission\nAdd a link tag establishing \"favicon.ico\" as the tab icon inside the head tag inside the container.",
    "starterCode": "<!-- Level 96 -->\n<head>\n    \n  </head>",
    "hints": [
      "Use <link rel=\"icon\" href=\"favicon.ico\" />."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain link tag referencing favicon.ico icon",
          "testRegex": "<link\\s+[^>]*rel=[\"']icon[\"'][^>]*href=[\"']favicon\\.ico[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-97",
    "level": 97,
    "levelId": 97,
    "tier": "Mage",
    "title": "Accessibility Roles",
    "conceptText": "### 1. The Concept (The \"Why\")\nARIA roles define the purpose of generic elements, aiding screen readers. For instance, `role=\"search\"` on a form clearly specifies a search function.",
    "codeExample": "```html\n<form role=\"search\">\n  <input type=\"search\" />\n</form>\n```",
    "missionText": "### 2. Your Mission\nAssign role=\"search\" directly onto a generic layout form tag inside the container.",
    "starterCode": "<!-- Level 97 -->\n<form>\n    \n  </form>",
    "hints": [
      "Add role=\"search\" attribute to form."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should assign role='search' to form",
          "testRegex": "<form\\s+[^>]*role=[\"']search[\"']"
        }
      ]
    }
  },
  {
    "id": "html5-98",
    "level": 98,
    "levelId": 98,
    "tier": "Mage",
    "title": "Auto-complete Lists",
    "conceptText": "### 1. The Concept (The \"Why\")\nThe `<datalist>` element structures pre-defined lists of suggestions that users see in dropdown form inputs while typing.",
    "codeExample": "```html\n<input list=\"browsers\" />\n<datalist id=\"browsers\">\n  <option value=\"Chrome\">\n  <option value=\"Firefox\">\n</datalist>\n```",
    "missionText": "### 2. Your Mission\nWire an input with a list attribute to a datalist containing two options inside the container. The input list attribute and datalist id must match.",
    "starterCode": "<!-- Level 98 -->\n",
    "hints": [
      "Create <input list=\"colors\" /> and <datalist id=\"colors\"><option value=\"Red\"><option value=\"Blue\"></datalist>."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should connect input list to datalist id and include options",
          "testRegex": "<input\\s+list=[\"'](\\w+)[\"']/?>\\s*<datalist\\s+id=[\"']\\1[\"']>\\s*(<option[^>]*>\\s*){2}\\s*</datalist>"
        }
      ]
    }
  },
  {
    "id": "html5-99",
    "level": 99,
    "levelId": 99,
    "tier": "Mage",
    "title": "Code Cleanliness",
    "conceptText": "### 1. The Concept (The \"Why\")\nClean indentations make code easy to read and debug. Nested tags should always be indented relative to their parent container.",
    "codeExample": "```html\n<main>\n  <h1>Title</h1>\n  <p>Paragraph</p>\n</main>\n```",
    "missionText": "### 2. Your Mission\nCleanly indent an h1 title and two paragraphs nested inside a main container block inside the container.",
    "starterCode": "<!-- Level 99 -->\n",
    "hints": [
      "Nest <h1> and two <p> blocks inside <main> and use spaces/tabs to indent them clearly."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain main tag with nested h1 and two p tags",
          "testRegex": "<main>\\s+<h1>.*</h1>\\s+<p>.*</p>\\s+<p>.*</p>\\s+</main>"
        }
      ]
    }
  },
  {
    "id": "html5-100",
    "level": 100,
    "levelId": 100,
    "tier": "Mage",
    "title": "Ultimate Professional Capstone",
    "conceptText": "### 1. The Concept (The \"Why\")\nCongratulations! You've reached the Module 7 Capstone. Let's combine standard professional structures into a complete, flawless page.",
    "codeExample": "```html\n<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"UTF-8\" />\n    <title>Title</title>\n  </head>\n  <body>\n    <!-- components -->\n  </body>\n</html>\n```",
    "missionText": "### 2. Your Mission\nBuild an advanced professional setup containing viewport metadata, a linked style sheet (style.css), a navigation header, an article section, a contact form (with username input and submit button), and a semantic footer inside the container.",
    "starterCode": "<!-- Level 100 -->\n",
    "hints": [
      "Scaffold doctype, html, head (with meta viewport, title, and link stylesheet) and body (with header, nav, article, form, and footer tags)."
    ],
    "validation": {
      "checkType": "html",
      "testCases": [
        {
          "description": "Should contain standard page head metadata",
          "testRegex": "<head>.*<meta\\s+name=[\"']viewport[\"'].*<link\\s+[^>]*rel=[\"']stylesheet[\"'][^>]*href=[\"']style\\.css[\"'].*</head>"
        },
        {
          "description": "Should contain semantic header, nav, article, form, and footer tags nested inside body",
          "testRegex": "<body>\\s*<header>.*</header>\\s*<nav>.*</nav>\\s*<article>.*</article>\\s*<form>.*<input.*<button.*</form>\\s*<footer>.*</footer>\\s*</body>"
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
  nodejs: ["Process args parsing", "Path resolutions", "FS file writing", "FS file reading", "Event Emitter listeners", "HTTP server routing", "Express server setup", "Express middleware logic", "JWT token signatures", "Node worker threads"],
  nextjs: ["App router paths", "Link navigation next/link", "Image tag next/image", "Page dynamic route layout", "RSC Server actions", "UseActionState hooks", "Route API handlers", "NextAuth configurations", "Sitemaps indexing", "Caching segment options"],
  python: ["Indentation values print", "Conditional expressions", "Def parameter functions", "List dict items", "List comprehensions", "Lambda declarations", "Classes instances init", "Yield generator loops", "Asyncio tasks loops", "Metaclasses overrides"],
  git: ["Git init configuration", "Git status stages", "Git add workspace", "Git commit hashes", "Git log timeline", "Git branch creations", "Git merge timelines", "Git rebase paths", "Git stash temporary status", "Git reflog recovery"],
  tailwind: ["Text sizes text-lg", "Margin and paddings", "Background colors bg-zinc", "Borders rounded utilities", "Flex grid responsive sm", "Hover states hover:bg", "Transitions durations", "Custom extend spacing", "Arbitrary colors extends", "Tailwind plugins writes"]
};

import { ALL_FROG_LEVELS } from "./frogLevelsData";

/**
 * Dynamic Progressive Syllabus Generator
 * Maps level L and step index to completely different, progressive categories of missions.
 */
export function generateLevel(gameId: string, level: number): LevelData {
  // Use 3D Frog 100-level progressive syllabus for CSS3
  if (gameId === "css3" && level <= 100) {
    const frogLvl = ALL_FROG_LEVELS.find(l => l.id === level) || ALL_FROG_LEVELS[0];
    return {
      id: `css3-${level}`,
      level: level,
      levelId: level,
      tier: "Apprentice",
      title: frogLvl.title,
      conceptText: frogLvl.prompt,
      codeExample: frogLvl.starterCode,
      missionText: frogLvl.targetDescription,
      starterCode: frogLvl.starterCode,
      hints: frogLvl.hints,
      validation: {
        checkType: "css",
        testCases: (frogLvl.validationRules.regexMatches || []).map(r => ({
          description: `Matching CSS rule: ${r}`,
          testRegex: r
        }))
      }
    };
  }

  // Use handcrafted HTML5 levels 1-100 for initial onboarding
  if (gameId === "html5" && level <= 100) {
    if (level >= 1 && level <= 11) {
      return HTML5_EARLY_LEVELS[level - 1];
    }
    // Handcrafted HTML5 Initial levels 12 to 100
    return HTML5_INITIAL_LEVELS[level - 6];
  }

  const game = GAMES_LIST.find(g => g.id === gameId);
  if (!game) throw new Error(`Game ${gameId} not found`);

  const tier = "Apprentice";
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
        starterCode = `<div id="element-container">\n  `;
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
        starterCode = `<div id="element-container">\n  `;
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
        starterCode = `<div id="element-container">\n  `;
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
        starterCode = `<div id="element-container">\n  `;
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
        starterCode = `<div id="element-container">\n  `;
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
        starterCode = `<div id="element-container">\n  `;
        hints = [`Write '<div class="p-${pad}">Card</div>'`];
        testCases = [
          { description: `Applies padding class p-${pad}`, testRegex: `class=["'][^"']*p-${pad}[^"']*["']` }
        ];
      } else {
        // Category 1: Width utilities
        conceptText = `### 1. The Concept (The "Why")\nTailwind widths configure element scaling. We check **${concept}** (Part ${stepIndex + 1}).`;
        codeExample = `\`\`\`html\n<div class="w-full">Width scale</div>\n\`\`\``;
        missionText = `### 2. Your Mission\nApply class utility **\`w-1/2\`** (half width) to a div container inside the wrapper.`;
        starterCode = `<div id="element-container">\n  `;
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
