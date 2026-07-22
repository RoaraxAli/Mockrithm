// lib/frogLevelsData.ts

export interface FrogLevel {
  id: number;
  title: string;
  category: "Basics" | "Sizing & Box Model" | "Flexbox Fundamentals" | "CSS Grid" | "Positioning & Transforms" | "Animations & Transitions" | "Boss Levels & Modern CSS";
  prompt: string;
  targetDescription: string;
  starterCode: string;
  hints: string[];
  validationRules: {
    targetSelector?: string; // e.g. ".frog" or "#pond"
    cssProperties?: Record<string, string | RegExp>;
    regexMatches?: string[];
  };
  targetPondStyle?: Record<string, string>;
  targetFrogStyle?: Record<string, string>;
  targetPads?: { x: number; y: number; label?: string }[];
}

export const FROG_LEVELS_DATA: FrogLevel[] = [
  // ==========================================
  // LEVELS 1 - 10: BASICS
  // ==========================================
  {
    id: 1,
    title: "Welcome to 3D Frog Pond",
    category: "Basics",
    prompt: "Welcome! Help the frog change its color by targeting the `.frog` class selector. Set its `color` property to `green` (or `#2ecc71`).",
    targetDescription: "Apply CSS to target .frog and set its color to green.",
    starterCode: "/* Write your CSS code below */\n.frog {\n  \n}",
    hints: [
      "Target `.frog` using class syntax.",
      "Add `color: green;` or `color: #2ecc71;` inside the curly braces."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "\\.frog\\s*\\{",
        "color\\s*:\\s*(green|#2ecc71|rgb\\(46,\\s*204,\\s*113\\))"
      ]
    },
    targetFrogStyle: {
      color: "#2ecc71"
    }
  },
  {
    id: 2,
    title: "Lily Pad Shading",
    category: "Basics",
    prompt: "The 3D frog needs a fresh coat of background paint. Give `.frog` a `background-color` of `#2ecc71` (Emerald Green).",
    targetDescription: "Set .frog background-color to #2ecc71.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Use `background-color: #2ecc71;`",
      "Ensure you include the hash `#` for hex colors."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "\\.frog\\s*\\{",
        "background-color\\s*:\\s*(#2ecc71|green|emerald)"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71"
    }
  },
  {
    id: 3,
    title: "Ribbit Outline",
    category: "Basics",
    prompt: "Give `.frog` a solid protective outline. Add a `border` property set to `4px solid #27ae60`.",
    targetDescription: "Add a 4px solid #27ae60 border to .frog.",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Use `border: 4px solid #27ae60;`",
      "Remember the order: width, style, color."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "border\\s*:\\s*4px\\s+solid\\s+#27ae60"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      border: "4px solid #27ae60"
    }
  },
  {
    id: 4,
    title: "Camouflage Mode",
    category: "Basics",
    prompt: "The 3D frog wants to blend into the water! Lower `.frog`'s `opacity` to `0.6` to make it semi-transparent.",
    targetDescription: "Set opacity to 0.6 on .frog.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Opacity values range between 0 (invisible) and 1 (opaque).",
      "Write `opacity: 0.6;`"
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "opacity\\s*:\\s*0?\\.6"
      ]
    },
    targetFrogStyle: {
      opacity: "0.6"
    }
  },
  {
    id: 5,
    title: "Blue Poison Dart Frog",
    category: "Basics",
    prompt: "Transform our frog into a Blue Poison Dart frog! Set `.frog`'s `background-color` to `#3498db` (Poison Blue) and `opacity` to `0.85`.",
    targetDescription: "Set background-color: #3498db and opacity: 0.85 on .frog.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Combine `background-color: #3498db;` and `opacity: 0.85;` inside `.frog`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "background-color\\s*:\\s*#3498db",
        "opacity\\s*:\\s*0?\\.85"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#3498db",
      opacity: "0.85"
    }
  },
  {
    id: 6,
    title: "Dashed Protection",
    category: "Basics",
    prompt: "Warn nearby predators by giving `.frog` a red dashed outline. Apply `border: 3px dashed #e74c3c;`.",
    targetDescription: "Apply a 3px dashed #e74c3c border to .frog.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Use `dashed` border style instead of `solid`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "border\\s*:\\s*3px\\s+dashed\\s+#e74c3c"
      ]
    },
    targetFrogStyle: {
      border: "3px dashed #e74c3c"
    }
  },
  {
    id: 7,
    title: "Glow Text Color",
    category: "Basics",
    prompt: "Set the `.frog` text label color to pure white (`#ffffff`) so its name stands out in 3D space.",
    targetDescription: "Set color to #ffffff on .frog.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Use `color: #ffffff;` or `color: white;`"
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "color\\s*:\\s*(#ffffff|white|#fff)"
      ]
    },
    targetFrogStyle: {
      color: "#ffffff"
    }
  },
  {
    id: 8,
    title: "Smooth Curved Edges",
    category: "Basics",
    prompt: "Make the frog's bounding container smooth and organic! Give `.frog` a `border-radius` of `20px` (or `50%`).",
    targetDescription: "Apply border-radius: 20px (or 50%) to .frog.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Use `border-radius: 20px;` or `border-radius: 50%;`"
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "border-radius\\s*:\\s*(20px|50%|1rem)"
      ]
    },
    targetFrogStyle: {
      borderRadius: "20px"
    }
  },
  {
    id: 9,
    title: "Mystic Purple Aura",
    category: "Basics",
    prompt: "Infuse the frog with magic! Set `background-color: #9b59b6;`, `color: #ffffff;`, and `opacity: 0.9;`.",
    targetDescription: "Set background-color: #9b59b6, color: #ffffff, and opacity: 0.9.",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Include all three CSS properties inside `.frog`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "background-color\\s*:\\s*#9b59b6",
        "color\\s*:\\s*(#ffffff|white|#fff)",
        "opacity\\s*:\\s*0?\\.9"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#9b59b6",
      color: "#ffffff",
      opacity: "0.9"
    }
  },
  {
    id: 10,
    title: "Level 10 Boss: Master of Basics",
    category: "Basics",
    prompt: "Boss Challenge! Style the `.frog` with all basic parameters: `background-color: #1abc9c;`, `color: #ffffff;`, `border: 4px solid #16a085;`, `border-radius: 16px;`, and `opacity: 0.95;`.",
    targetDescription: "Combine background-color, color, border, border-radius, and opacity.",
    starterCode: ".frog {\n  /* Apply all 5 properties here */\n}",
    hints: [
      "Check spelling for each property: background-color, color, border, border-radius, opacity."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "background-color\\s*:\\s*#1abc9c",
        "color\\s*:\\s*(#ffffff|white|#fff)",
        "border\\s*:\\s*4px\\s+solid\\s+#16a085",
        "border-radius\\s*:\\s*16px",
        "opacity\\s*:\\s*0?\\.95"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#1abc9c",
      color: "#ffffff",
      border: "4px solid #16a085",
      borderRadius: "16px",
      opacity: "0.95"
    }
  }
];

// Helper generator to dynamically populate levels 11 through 100
function generateRemainingFrogLevels(): FrogLevel[] {
  const levels: FrogLevel[] = [...FROG_LEVELS_DATA];

  for (let i = 11; i <= 100; i++) {
    let category: FrogLevel["category"] = "Sizing & Box Model";
    let prompt = "";
    let targetDescription = "";
    let starterCode = "";
    let hints: string[] = [];
    let regexes: string[] = [];
    let targetFrogStyle: Record<string, string> = {};
    let targetPondStyle: Record<string, string> = {};

    if (i >= 11 && i <= 25) {
      category = "Sizing & Box Model";
      const w = 80 + ((i * 7) % 120);
      const h = 80 + ((i * 5) % 100);
      const pad = 10 + (i % 15);
      if (i % 3 === 0) {
        prompt = `Set the \`width\` of \`.frog\` to \`${w}px\` and \`height\` to \`${h}px\`.`;
        targetDescription = `Set width: ${w}px and height: ${h}px on .frog.`;
        starterCode = `.frog {\n  \n}`;
        hints = [`Write 'width: ${w}px;' and 'height: ${h}px;'`];
        regexes = [`width\\s*:\\s*${w}px`, `height\\s*:\\s*${h}px`];
        targetFrogStyle = { width: `${w}px`, height: `${h}px` };
      } else if (i % 3 === 1) {
        prompt = `Add \`padding: ${pad}px;\` and \`box-sizing: border-box;\` to \`.frog\`.`;
        targetDescription = `Set padding: ${pad}px and box-sizing: border-box.`;
        starterCode = `.frog {\n  width: 140px;\n  height: 140px;\n  \n}`;
        hints = [`Write 'padding: ${pad}px;' and 'box-sizing: border-box;'`];
        regexes = [`padding\\s*:\\s*${pad}px`, `box-sizing\\s*:\\s*border-box`];
        targetFrogStyle = { width: "140px", height: "140px", padding: `${pad}px`, boxSizing: "border-box" };
      } else {
        prompt = `Set \`margin: 20px;\` and \`scale: 1.2;\` on \`.frog\` to enlarge it over the lily pad.`;
        targetDescription = `Apply margin: 20px and scale: 1.2.`;
        starterCode = `.frog {\n  \n}`;
        hints = [`Use 'margin: 20px;' and 'scale: 1.2;'`];
        regexes = [`margin\\s*:\\s*20px`, `scale\\s*:\\s*1\\.2`];
        targetFrogStyle = { margin: "20px", transform: "scale(1.2)" };
      }
    } else if (i >= 26 && i <= 45) {
      category = "Flexbox Fundamentals";
      const flexOptions = ["flex-end", "center", "space-between", "space-around", "space-evenly"];
      const alignOptions = ["flex-end", "center", "stretch", "baseline"];
      const flexJustify = flexOptions[(i - 26) % flexOptions.length];
      const flexAlign = alignOptions[(i - 26) % alignOptions.length];

      if (i % 2 === 0) {
        prompt = `Position the frog on the target lily pad! Set \`display: flex;\` and \`justify-content: ${flexJustify};\` on \`#pond\`.`;
        targetDescription = `Set display: flex and justify-content: ${flexJustify} on #pond.`;
        starterCode = `#pond {\n  display: flex;\n  \n}`;
        hints = [`Write 'justify-content: ${flexJustify};' inside #pond.`];
        regexes = [`#pond\\s*\\{`, `display\\s*:\\s*flex`, `justify-content\\s*:\\s*${flexJustify}`];
        targetPondStyle = { display: "flex", justifyContent: flexJustify };
      } else {
        prompt = `Align the frog vertically! Set \`display: flex;\`, \`justify-content: ${flexJustify};\`, and \`align-items: ${flexAlign};\` on \`#pond\`.`;
        targetDescription = `Set flex, justify-content: ${flexJustify}, and align-items: ${flexAlign} on #pond.`;
        starterCode = `#pond {\n  display: flex;\n  \n}`;
        hints = [`Use 'justify-content: ${flexJustify};' and 'align-items: ${flexAlign};'`];
        regexes = [`display\\s*:\\s*flex`, `justify-content\\s*:\\s*${flexJustify}`, `align-items\\s*:\\s*${flexAlign}`];
        targetPondStyle = { display: "flex", justifyContent: flexJustify, alignItems: flexAlign };
      }
    } else if (i >= 46 && i <= 65) {
      category = "CSS Grid";
      const cols = (i % 3) + 2;
      prompt = `Organize the pond grid! Set \`display: grid;\`, \`grid-template-columns: repeat(${cols}, 1fr);\`, and \`gap: 15px;\` on \`#pond\`.`;
      targetDescription = `Set display: grid with ${cols} columns and gap: 15px on #pond.`;
      starterCode = `#pond {\n  display: grid;\n  \n}`;
      hints = [`Use 'grid-template-columns: repeat(${cols}, 1fr);' and 'gap: 15px;'`];
      regexes = [`display\\s*:\\s*grid`, `grid-template-columns\\s*:\\s*.*`, `gap\\s*:\\s*15px`];
      targetPondStyle = { display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "15px" };
    } else if (i >= 66 && i <= 80) {
      category = "Positioning & Transforms";
      const deg = ((i * 45) % 360);
      const transX = ((i * 20) % 100) - 50;
      prompt = `Move and rotate the 3D frog into position! Apply \`position: relative;\` and \`transform: translate(${transX}px, -20px) rotate(${deg}deg);\`.`;
      targetDescription = `Apply translate(${transX}px, -20px) and rotate(${deg}deg) on .frog.`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Combine translate and rotate inside 'transform: ...;'`];
      regexes = [`transform\\s*:\\s*.*rotate\\(${deg}deg\\)`];
      targetFrogStyle = { transform: `translate(${transX}px, -20px) rotate(${deg}deg)` };
    } else if (i >= 81 && i <= 90) {
      category = "Animations & Transitions";
      prompt = `Make the frog animate smoothly! Give \`.frog\` a \`transition: all 0.5s ease-in-out;\` and \`transform: scale(1.15) rotate(10deg);\`.`;
      targetDescription = `Apply smooth CSS transition and transform on .frog.`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Write 'transition: all 0.5s ease-in-out;' and 'transform: scale(1.15) rotate(10deg);'`];
      regexes = [`transition\\s*:\\s*.*0\\.5s`, `transform\\s*:\\s*.*scale`];
      targetFrogStyle = { transition: "all 0.5s ease-in-out", transform: "scale(1.15) rotate(10deg)" };
    } else {
      category = "Boss Levels & Modern CSS";
      prompt = `Ultimate Boss Level ${i}! Combine Flexbox/Grid layouts, \`clip-path: circle(50%);\`, and 3D transforms on \`.frog\`.`;
      targetDescription = `Apply clip-path: circle(50%) and 3D transform on .frog.`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Use 'clip-path: circle(50%);' and 'transform: rotateY(180deg);'`];
      regexes = [`clip-path\\s*:\\s*circle`, `transform\\s*:\\s*.*`];
      targetFrogStyle = { clipPath: "circle(50%)", transform: "rotateY(180deg)" };
    }

    levels.push({
      id: i,
      title: `Level ${i}: ${category}`,
      category,
      prompt,
      targetDescription,
      starterCode,
      hints,
      validationRules: {
        regexMatches: regexes
      },
      targetPondStyle,
      targetFrogStyle
    });
  }

  return levels;
}

export const ALL_FROG_LEVELS: FrogLevel[] = generateRemainingFrogLevels();
