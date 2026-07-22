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
    targetSelector?: string;
    cssProperties?: Record<string, string | RegExp>;
    regexMatches?: string[];
  };
  targetPondStyle?: Record<string, string>;
  targetFrogStyle?: Record<string, string>;
  targetPads?: { x: number; y: number; label?: string }[];
}

export const FROG_LEVELS_DATA: FrogLevel[] = [
  // ==========================================
  // LEVELS 1 - 15: RE-THOUGHT BASICS & BOX MODEL
  // ==========================================
  {
    id: 1,
    title: "Level 1: Frog Skin Color",
    category: "Basics",
    prompt: "Welcome to 3D Frog Pond! Target the `.frog` class selector and set its `background-color` to `green` (or `#2ecc71`) to bring the frog to life.",
    targetDescription: "Set background-color: #2ecc71 on .frog",
    starterCode: ".frog {\n  \n}",
    hints: [
      "Target `.frog` selector.",
      "Add `background-color: #2ecc71;` (or `green`)."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "\\.frog\\s*\\{",
        "background-color\\s*:\\s*(green|#2ecc71|rgb\\(46,\\s*204,\\s*113\\))"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71"
    }
  },
  {
    id: 2,
    title: "Level 2: Detail Text Color",
    category: "Basics",
    prompt: "Change the text and detail highlights on `.frog`! Set its `color` property to `white` (or `#ffffff`).",
    targetDescription: "Set color: white on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Add `color: white;` or `color: #ffffff;` inside `.frog`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "color\\s*:\\s*(white|#ffffff|#fff)"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      color: "#ffffff"
    }
  },
  {
    id: 3,
    title: "Level 3: Pond Water Background",
    category: "Basics",
    prompt: "Target the `#pond` container element and set its `background-color` to deep water blue (`#1e3a8a` or `blue`).",
    targetDescription: "Set background-color: #1e3a8a on #pond",
    starterCode: "#pond {\n  \n}",
    hints: [
      "Target the `#pond` id selector.",
      "Add `background-color: #1e3a8a;` inside `#pond`."
    ],
    validationRules: {
      targetSelector: "#pond",
      regexMatches: [
        "#pond\\s*\\{",
        "background-color\\s*:\\s*(#1e3a8a|blue|navy)"
      ]
    },
    targetPondStyle: {
      backgroundColor: "#1e3a8a"
    }
  },
  {
    id: 4,
    title: "Level 4: Frog Border Outline",
    category: "Basics",
    prompt: "Give `.frog` a protective outline. Apply a `border` property set to `4px solid #27ae60`.",
    targetDescription: "Set border: 4px solid #27ae60 on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Use `border: 4px solid #27ae60;`"
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
    id: 5,
    title: "Level 5: Camouflage Opacity",
    category: "Basics",
    prompt: "Help `.frog` blend into the pond by setting its `opacity` to `0.6`.",
    targetDescription: "Set opacity: 0.6 on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Add `opacity: 0.6;` inside `.frog`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "opacity\\s*:\\s*0?\\.6"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      opacity: "0.6"
    }
  },
  {
    id: 6,
    title: "Level 6: Poison Dart Frog",
    category: "Basics",
    prompt: "Transform `.frog` into a Blue Poison Dart Frog! Set `background-color: #3498db;` and `opacity: 0.85;`.",
    targetDescription: "Set background-color: #3498db and opacity: 0.85 on .frog",
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
    id: 7,
    title: "Level 7: Curved Corners",
    category: "Basics",
    prompt: "Smooth out the frog's bounding container! Apply a `border-radius` of `20px` to `.frog`.",
    targetDescription: "Set border-radius: 20px on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Add `border-radius: 20px;`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "border-radius\\s*:\\s*(20px|50%|1rem)"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      borderRadius: "20px"
    }
  },
  {
    id: 8,
    title: "Level 8: Frog Dimensions",
    category: "Sizing & Box Model",
    prompt: "Change the size of `.frog`! Set its `width` to `140px` and `height` to `140px`.",
    targetDescription: "Set width: 140px and height: 140px on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Write `width: 140px;` and `height: 140px;`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "width\\s*:\\s*140px",
        "height\\s*:\\s*140px"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      width: "140px",
      height: "140px"
    }
  },
  {
    id: 9,
    title: "Level 9: Scaling Up",
    category: "Sizing & Box Model",
    prompt: "Enlarge the frog over the lily pad! Add `scale: 1.3;` to `.frog`.",
    targetDescription: "Set scale: 1.3 on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Use `scale: 1.3;` or `transform: scale(1.3);`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "(scale|transform)\\s*:\\s*(1\\.3|scale\\(1\\.3\\))"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      transform: "scale(1.3)"
    }
  },
  {
    id: 10,
    title: "Level 10: 2D Rotation",
    category: "Positioning & Transforms",
    prompt: "Rotate `.frog` to face the lily pad target! Apply `transform: rotate(45deg);` to `.frog`.",
    targetDescription: "Set transform: rotate(45deg) on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Write `transform: rotate(45deg);`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "transform\\s*:\\s*.*rotate\\(45deg\\)"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      transform: "rotate(45deg)"
    }
  },
  {
    id: 11,
    title: "Level 11: Outer Margin",
    category: "Sizing & Box Model",
    prompt: "Add spacing around `.frog`! Set `margin: 20px;` on `.frog`.",
    targetDescription: "Set margin: 20px on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Write `margin: 20px;`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "margin\\s*:\\s*20px"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      margin: "20px"
    }
  },
  {
    id: 12,
    title: "Level 12: Inner Padding",
    category: "Sizing & Box Model",
    prompt: "Give `.frog` internal breathing room! Set `padding: 15px;` on `.frog`.",
    targetDescription: "Set padding: 15px on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  \n}",
    hints: [
      "Write `padding: 15px;`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "padding\\s*:\\s*15px"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      padding: "15px"
    }
  },
  {
    id: 13,
    title: "Level 13: Box Sizing Control",
    category: "Sizing & Box Model",
    prompt: "Enforce standard box calculations! Apply `box-sizing: border-box;` to `.frog`.",
    targetDescription: "Set box-sizing: border-box on .frog",
    starterCode: ".frog {\n  background-color: #2ecc71;\n  width: 120px;\n  padding: 15px;\n  \n}",
    hints: [
      "Write `box-sizing: border-box;`."
    ],
    validationRules: {
      targetSelector: ".frog",
      regexMatches: [
        "box-sizing\\s*:\\s*border-box"
      ]
    },
    targetFrogStyle: {
      backgroundColor: "#2ecc71",
      width: "120px",
      padding: "15px",
      boxSizing: "border-box"
    }
  },
  {
    id: 14,
    title: "Level 14: Pond Styling",
    category: "Basics",
    prompt: "Style `#pond` with `background-color: #065f46;` and `border: 3px dashed #10b981;`.",
    targetDescription: "Set background-color: #065f46 and border: 3px dashed #10b981 on #pond",
    starterCode: "#pond {\n  \n}",
    hints: [
      "Target `#pond`.",
      "Add `background-color: #065f46;` and `border: 3px dashed #10b981;`."
    ],
    validationRules: {
      targetSelector: "#pond",
      regexMatches: [
        "#pond\\s*\\{",
        "background-color\\s*:\\s*#065f46",
        "border\\s*:\\s*3px\\s+dashed\\s+#10b981"
      ]
    },
    targetPondStyle: {
      backgroundColor: "#065f46",
      border: "3px dashed #10b981"
    }
  },
  {
    id: 15,
    title: "Level 15 Boss: Basics & Box Model Master",
    category: "Boss Levels & Modern CSS",
    prompt: "Boss Challenge! Style `.frog` with `background-color: #1abc9c;`, `color: #ffffff;`, `border: 4px solid #16a085;`, `border-radius: 16px;`, and `opacity: 0.95;`.",
    targetDescription: "Combine background-color, color, border, border-radius, and opacity on .frog",
    starterCode: ".frog {\n  /* Style all 5 properties here */\n}",
    hints: [
      "Include background-color, color, border, border-radius, and opacity."
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

// Generator for remaining levels 16 to 100
function generateRemainingFrogLevels(): FrogLevel[] {
  const levels: FrogLevel[] = [...FROG_LEVELS_DATA];

  for (let i = 16; i <= 100; i++) {
    let category: FrogLevel["category"] = "Flexbox Fundamentals";
    let prompt = "";
    let targetDescription = "";
    let starterCode = "";
    let hints: string[] = [];
    let regexes: string[] = [];
    let targetFrogStyle: Record<string, string> = {};
    let targetPondStyle: Record<string, string> = {};

    if (i >= 16 && i <= 25) {
      category = "Sizing & Box Model";
      const w = 80 + ((i * 7) % 120);
      const h = 80 + ((i * 5) % 100);
      prompt = `Set the \`width\` of \`.frog\` to \`${w}px\` and \`height\` to \`${h}px\`.`;
      targetDescription = `Set width: ${w}px and height: ${h}px on .frog`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Write 'width: ${w}px;' and 'height: ${h}px;'`];
      regexes = [`width\\s*:\\s*${w}px`, `height\\s*:\\s*${h}px`];
      targetFrogStyle = { width: `${w}px`, height: `${h}px` };
    } else if (i >= 26 && i <= 45) {
      category = "Flexbox Fundamentals";
      const flexOptions = ["flex-end", "center", "space-between", "space-around", "space-evenly"];
      const flexJustify = flexOptions[(i - 26) % flexOptions.length];

      prompt = `Position the frog! Set \`display: flex;\` and \`justify-content: ${flexJustify};\` on \`#pond\`.`;
      targetDescription = `Set display: flex and justify-content: ${flexJustify} on #pond`;
      starterCode = `#pond {\n  display: flex;\n  \n}`;
      hints = [`Write 'justify-content: ${flexJustify};' inside #pond.`];
      regexes = [`#pond\\s*\\{`, `display\\s*:\\s*flex`, `justify-content\\s*:\\s*${flexJustify}`];
      targetPondStyle = { display: "flex", justifyContent: flexJustify };
    } else if (i >= 46 && i <= 65) {
      category = "CSS Grid";
      const cols = (i % 3) + 2;
      prompt = `Organize the pond grid! Set \`display: grid;\` and \`grid-template-columns: repeat(${cols}, 1fr);\` on \`#pond\`.`;
      targetDescription = `Set display: grid with ${cols} columns on #pond`;
      starterCode = `#pond {\n  display: grid;\n  \n}`;
      hints = [`Use 'grid-template-columns: repeat(${cols}, 1fr);'`];
      regexes = [`display\\s*:\\s*grid`, `grid-template-columns\\s*:\\s*.*`];
      targetPondStyle = { display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` };
    } else if (i >= 66 && i <= 80) {
      category = "Positioning & Transforms";
      const deg = ((i * 45) % 360);
      prompt = `Rotate the 3D frog! Apply \`transform: rotate(${deg}deg);\` to \`.frog\`.`;
      targetDescription = `Apply rotate(${deg}deg) on .frog`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Write 'transform: rotate(${deg}deg);'`];
      regexes = [`transform\\s*:\\s*.*rotate\\(${deg}deg\\)`];
      targetFrogStyle = { transform: `rotate(${deg}deg)` };
    } else if (i >= 81 && i <= 90) {
      category = "Animations & Transitions";
      prompt = `Make the frog animate smoothly! Give \`.frog\` a \`transition: all 0.5s ease;\`.`;
      targetDescription = `Apply smooth CSS transition on .frog`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Write 'transition: all 0.5s ease;'`];
      regexes = [`transition\\s*:\\s*.*`];
      targetFrogStyle = { transition: "all 0.5s ease" };
    } else {
      category = "Boss Levels & Modern CSS";
      prompt = `Boss Level ${i}! Apply \`clip-path: circle(50%);\` to \`.frog\`.`;
      targetDescription = `Apply clip-path: circle(50%) on .frog`;
      starterCode = `.frog {\n  \n}`;
      hints = [`Use 'clip-path: circle(50%);'`];
      regexes = [`clip-path\\s*:\\s*circle`];
      targetFrogStyle = { clipPath: "circle(50%)" };
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
