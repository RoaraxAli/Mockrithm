"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  Palette,
  Zap,
  Shield,
  Layers,
  Cpu,
  Sparkles,
  Compass,
  Database,
  Server,
  GitBranch,
  Terminal as TerminalIcon,
  Wind,
  ShieldAlert,
  Play,
  Lock,
  CheckCircle,
  HelpCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Volume2,
  VolumeX,
  Code2,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  GAMES_LIST,
  generateLevel,
  getTierName,
  LevelData,
  GameInfo
} from "@/lib/gamesData";
import {
  getUserGamesProgress,
  updateUserGamesProgress,
  GameProgress
} from "@/lib/actions/games.action";

// Dynamic Icon Selector Component
const TechIcon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, React.ComponentType<any>> = {
    FileCode,
    Palette,
    Zap,
    Shield,
    Layers,
    Cpu,
    Sparkles,
    Compass,
    Database,
    Server,
    GitBranch,
    Container: TerminalIcon,
    Wind,
    ShieldAlert
  };

  const IconComponent = icons[name] || Code2;
  return <IconComponent className={className} />;
};

// Codédex-style simple markdown text renderer
function renderMarkdown(text: string) {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h4 key={idx} className="text-xs font-black tracking-wider text-white uppercase mt-4 mb-2 font-mono">
          {line.replace("### ", "")}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={idx} className="text-sm font-black tracking-wider text-white uppercase mt-4 mb-2 font-mono">
          {line.replace("## ", "")}
        </h3>
      );
    }
    
    // Process bold segments inside the line
    let formattedLine: React.ReactNode = line;
    if (line.includes("**")) {
      const parts = line.split("**");
      formattedLine = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
      );
    }

    if (line.startsWith("- ")) {
      return (
        <li key={idx} className="text-[11px] text-zinc-400 list-disc ml-4 mt-1 font-medium">
          {formattedLine}
        </li>
      );
    }
    
    return (
      <p key={idx} className="text-[11px] text-zinc-400 leading-relaxed mt-2 font-medium">
        {formattedLine}
      </p>
    );
  });
}

// Codédex-style formatted copyable code snippets
function renderCodeExample(codeBlock: string) {
  if (!codeBlock) return null;
  const cleanCode = codeBlock.replace(/```[a-zA-Z0-9]*\n/, "").replace(/\n```$/, "");
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 my-3 font-mono text-[10px] text-zinc-300 overflow-x-auto whitespace-pre">
      <code>{cleanCode}</code>
    </div>
  );
}

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progressText: string;
  pct: number;
  completed: boolean;
}

export default function GamesPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Progress State
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active Game/Level Runner States
  const [activeGame, setActiveGame] = useState<GameInfo | null>(null);
  const [currentLevelNum, setCurrentLevelNum] = useState(1);
  const [activeLevelData, setActiveLevelData] = useState<LevelData | null>(null);
  
  // Game Runner Editor and Logs
  const [editorCode, setEditorCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  
  // Developer Override and Audio
  const [bypassLocks, setBypassLocks] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interactive Live Sandboxes States
  const [htmlPreviewCode, setHtmlPreviewCode] = useState("");
  const [sqlTableData, setSqlTableData] = useState<any[]>([]);
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([]);
  const [gitCommandInput, setGitCommandInput] = useState("");
  const [gitState, setGitState] = useState({
    initialized: false,
    staged: [] as string[],
    committed: [] as string[],
    commits: [] as { id: string; message: string }[]
  });

  // Calculate highest unlocked level for current game
  const gameProgressObj = activeGame ? (progress[activeGame.id] || { completedLevel: 0, xp: 0 }) : { completedLevel: 0, xp: 0 };
  const maxUnlockedLevel = bypassLocks ? 500 : (gameProgressObj.completedLevel + 1 > 500 ? 500 : gameProgressObj.completedLevel + 1);

  // Load User Progress
  useEffect(() => {
    async function loadProgress() {
      if (!isLoaded) return;
      
      try {
        setLoading(true);
        if (isSignedIn && clerkUser) {
          const data = await getUserGamesProgress(clerkUser.id);
          setProgress(data.progress || {});
          setTotalXp(data.totalXp || 0);
        } else {
          // Fallback to LocalStorage for guest users
          const localProgress = localStorage.getItem("mockrithm_games_progress");
          const localXp = localStorage.getItem("mockrithm_games_xp");
          if (localProgress) {
            setProgress(JSON.parse(localProgress));
          }
          if (localXp) {
            setTotalXp(parseInt(localXp, 10));
          }
        }
      } catch (err) {
        console.error("Failed to load game progress:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Generate or update level data when level changes
  useEffect(() => {
    if (activeGame) {
      const levelData = generateLevel(activeGame.id, currentLevelNum);
      setActiveLevelData(levelData);
      setEditorCode(levelData.starterCode);
      setHtmlPreviewCode(levelData.starterCode);
      setShowHint(false);
      setEvalLogs([]);
      setEvaluationSuccess(null);

      // Initialize special sandbox environments
      if (activeGame.id === "sql") {
        resetSqlMockTable();
      } else if (activeGame.id === "git") {
        resetGitMockRepo();
      }
    }
  }, [activeGame, currentLevelNum]);

  // Clamp direct level selection to block skipping
  useEffect(() => {
    if (activeGame) {
      if (currentLevelNum > maxUnlockedLevel) {
        setCurrentLevelNum(maxUnlockedLevel);
      }
    }
  }, [activeGame, maxUnlockedLevel, currentLevelNum]);

  // Prerequisite Verification Logic - Always return true so languages are not locked
  const isGameUnlocked = (gameId: string): boolean => {
    return true;
  };

  // Check if a game has missing prerequisites for warning notice at launch
  const hasMissingPrerequisites = (gameId: string): boolean => {
    if (bypassLocks) return false;
    const game = GAMES_LIST.find(g => g.id === gameId);
    if (!game || game.prerequisites.length === 0) return false;
    return !game.prerequisites.every(prereqId => {
      const prereqProg = progress[prereqId];
      return prereqProg && prereqProg.completedLevel > 0;
    });
  };

  // Calculate Quest Achievements
  const getGlobalQuests = (): Quest[] => {
    const playList = Object.keys(progress);
    
    const anyPlayed = playList.some(k => progress[k].completedLevel > 0);
    const polyglotCount = playList.filter(k => progress[k].completedLevel >= 5).length;
    
    const htmlLvl = progress["html5"]?.completedLevel || 0;
    const cssLvl = progress["css3"]?.completedLevel || 0;
    const tailwindLvl = progress["tailwind"]?.completedLevel || 0;
    const frontendCount = [htmlLvl, cssLvl, tailwindLvl].filter(l => l >= 10).length;

    const jsLvl = progress["javascript"]?.completedLevel || 0;
    const reactLvl = progress["reactjs"]?.completedLevel || 0;
    const fsCount = [jsLvl, reactLvl].filter(l => l >= 10).length;

    const gitLvl = progress["git"]?.completedLevel || 0;
    const dockerLvl = progress["docker"]?.completedLevel || 0;
    const devopsCount = [gitLvl, dockerLvl].filter(l => l >= 5).length;

    const cyberLvl = progress["cybersecurity"]?.completedLevel || 0;

    return [
      {
        id: "genesis",
        title: "Genesis Sandbox",
        description: "Embark on your journey. Clear Level 1 on any game.",
        xpReward: 50,
        progressText: anyPlayed ? "1/1" : "0/1",
        pct: anyPlayed ? 100 : 0,
        completed: anyPlayed
      },
      {
        id: "polyglot",
        title: "Polyglot Apprentice",
        description: "Harness multiple energies. Reach Level 5 on 3 different stacks.",
        xpReward: 150,
        progressText: `${Math.min(polyglotCount, 3)}/3 stacks`,
        pct: Math.round((Math.min(polyglotCount, 3) / 3) * 100),
        completed: polyglotCount >= 3
      },
      {
        id: "frontend",
        title: "Frontend Sorcerer",
        description: "Weave style matrices. Reach Level 10 on HTML5, CSS3, and Tailwind CSS.",
        xpReward: 250,
        progressText: `${frontendCount}/3 completed`,
        pct: Math.round((frontendCount / 3) * 100),
        completed: frontendCount >= 3
      },
      {
        id: "fullstack",
        title: "Fullstack Alchemist",
        description: "Master DOM state portals. Reach Level 10 on JavaScript and ReactJS.",
        xpReward: 200,
        progressText: `${fsCount}/2 completed`,
        pct: Math.round((fsCount / 2) * 100),
        completed: fsCount >= 2
      },
      {
        id: "devops",
        title: "DevOps Helmsman",
        description: "Deploy ships to registries. Reach Level 5 on Git and Docker.",
        xpReward: 150,
        progressText: `${devopsCount}/2 completed`,
        pct: Math.round((devopsCount / 2) * 100),
        completed: devopsCount >= 2
      },
      {
        id: "cyber",
        title: "Security Sentinel",
        description: "Fortify node perimeters. Reach Level 5 on Cyber Security.",
        xpReward: 150,
        progressText: cyberLvl >= 5 ? "1/1" : "0/1",
        pct: cyberLvl >= 5 ? 100 : Math.round((cyberLvl / 5) * 100),
        completed: cyberLvl >= 5
      }
    ];
  };

  // Sound effects controller
  const playSound = (type: "success" | "click" | "fail") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.5);
      } else if (type === "fail") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220.0, audioCtx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, audioCtx.currentTime + 0.2); // D3
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Audio Context blocked or unsupported:", e);
    }
  };

  // Mock Database state initializer
  const resetSqlMockTable = () => {
    setSqlTableData([
      { id: 1, name: "Galahad", level: 12, class: "Knight", experience: 4500 },
      { id: 2, name: "Merlin", level: 25, class: "Mage", experience: 9800 },
      { id: 3, name: "Arthur", level: 50, class: "Grandmaster", experience: 25000 },
      { id: 4, name: "Percival", level: 8, class: "Apprentice", experience: 1200 },
      { id: 5, name: "Lancelot", level: 38, class: "Warlord", experience: 18000 }
    ]);
  };

  // Mock Git repo state initializer
  const resetGitMockRepo = () => {
    setGitState({
      initialized: false,
      staged: [],
      committed: [],
      commits: []
    });
    setGitTerminalLogs([
      "Welcome to Timeline Weaver Git console.",
      "Initialize repository to begin tracking variables.",
      "Type 'help' for support."
    ]);
    setGitCommandInput("");
  };

  // Git Command parser
  const handleGitCommandLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const line = gitCommandInput.trim();
    if (!line) return;

    playSound("click");
    setGitTerminalLogs(prev => [...prev, `$ ${line}`]);
    setGitCommandInput("");

    const parts = line.split(/\s+/);
    const command = parts[0];

    if (command !== "git" && command !== "help" && command !== "clear") {
      setGitTerminalLogs(prev => [...prev, `command not found: ${command}`]);
      return;
    }

    if (command === "clear") {
      setGitTerminalLogs([]);
      return;
    }

    if (command === "help") {
      setGitTerminalLogs(prev => [
        ...prev,
        "Available commands:",
        "  git init             - Initialize repository",
        "  git status           - Check branch status",
        "  git add <file>       - Stage files (use 'git add .' to stage all)",
        "  git commit -m 'msg'  - Record timeline updates",
        "  git log              - View commit timeline records"
      ]);
      return;
    }

    // Git commands parser
    const subCommand = parts[1];
    if (!subCommand) {
      setGitTerminalLogs(prev => [...prev, "Usage: git <command> [options]"]);
      return;
    }

    if (subCommand === "init") {
      setGitState(prev => ({ ...prev, initialized: true }));
      setGitTerminalLogs(prev => [
        ...prev,
        "Initialized empty Git repository in /dungeon/project/.git/",
        "Created staging zone. Ready to record files."
      ]);
    } else if (!gitState.initialized) {
      setGitTerminalLogs(prev => [...prev, "fatal: not a git repository (or any of the parent directories): .git"]);
    } else if (subCommand === "status") {
      const trackingStatus = gitState.staged.length > 0 
        ? `Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\tmodified:   src/app.js`
        : `nothing to commit, working tree clean`;
      setGitTerminalLogs(prev => [
        ...prev,
        `On branch main`,
        `Your branch is up to date with 'origin/main'.`,
        trackingStatus
      ]);
    } else if (subCommand === "add") {
      const target = parts[2];
      if (!target) {
        setGitTerminalLogs(prev => [...prev, "Nothing specified, nothing added."]);
      } else {
        setGitState(prev => ({ ...prev, staged: ["src/app.js"] }));
        setGitTerminalLogs(prev => [...prev, "staged file: src/app.js"]);
      }
    } else if (subCommand === "commit") {
      const flag = parts[2];
      let msg = parts.slice(3).join(" ").replace(/['"]/g, "");
      if (flag !== "-m" || !msg) {
        setGitTerminalLogs(prev => [...prev, "error: switch `m' requires a value"]);
      } else if (gitState.staged.length === 0) {
        setGitTerminalLogs(prev => [...prev, "On branch main\nnothing to commit, working tree clean"]);
      } else {
        const commitId = Math.random().toString(16).substring(2, 9);
        const newCommit = { id: commitId, message: msg };
        setGitState(prev => ({
          ...prev,
          committed: [...prev.committed, ...prev.staged],
          staged: [],
          commits: [...prev.commits, newCommit]
        }));
        setGitTerminalLogs(prev => [
          ...prev,
          `[main ${commitId}] ${msg}`,
          " 1 file changed, 25 insertions(+)"
        ]);
      }
    } else if (subCommand === "log") {
      if (gitState.commits.length === 0) {
        setGitTerminalLogs(prev => [...prev, "fatal: your current branch 'main' does not have any commits yet"]);
      } else {
        const logLines = gitState.commits.map(c => `commit ${c.id}\nAuthor: Hacker <hack@mockrithm.com>\nDate:   Sun Jun 28\n\n    ${c.message}`).reverse();
        setGitTerminalLogs(prev => [...prev, ...logLines]);
      }
    } else {
      setGitTerminalLogs(prev => [...prev, `git sub-command not supported: ${subCommand}`]);
    }
  };

  // Compile & run code tests
  const evaluateCode = () => {
    if (!activeLevelData) return;

    playSound("click");
    setEvalLogs(["Spinning up sandbox engine...", "Executing validation assertions..."]);
    
    const { checkType, testCases } = activeLevelData.validation;
    let allPassed = true;
    const testResults: string[] = [];

    try {
      testCases.forEach((tc, idx) => {
        const descriptionText = tc.description || tc.name || `Test Case ${idx + 1}`;
        
        // 1. Regex Match Validation
        if (tc.testRegex) {
          try {
            const rx = new RegExp(tc.testRegex, "i");
            const result = rx.test(editorCode);
            if (result) {
              testResults.push(`✔️ Passed: ${descriptionText}`);
            } else {
              testResults.push(`❌ Failed: ${descriptionText}`);
              allPassed = false;
            }
          } catch (e: any) {
            testResults.push(`❌ Regex Error: ${descriptionText} (${e.message})`);
            allPassed = false;
          }
        } 
        // 2. Custom code execution fallback
        else if (tc.customCheck) {
          try {
            const checkFn = eval(tc.customCheck);
            const result = checkFn(editorCode);
            if (result === tc.expected) {
              testResults.push(`✔️ Passed: ${descriptionText}`);
            } else {
              testResults.push(`❌ Failed: ${descriptionText}`);
              allPassed = false;
            }
          } catch (e: any) {
            testResults.push(`❌ Custom check error: ${descriptionText} (${e.message})`);
            allPassed = false;
          }
        } 
        // 3. JS execution test mapping
        else {
          try {
            const cleanCode = editorCode.replace(/export\s+default\s+/g, "");
            const inputArgs = tc.input ? tc.input.map(x => JSON.stringify(x)).join(", ") : "";
            const runStr = `${cleanCode}\nreturn processData(${inputArgs});`;
            const runner = new Function(runStr);
            const result = runner();
            if (result === tc.expected) {
              testResults.push(`✔️ Passed: Input: [${inputArgs}] -> Output: ${result}`);
            } else {
              testResults.push(`❌ Failed: Input: [${inputArgs}] -> Expected ${tc.expected}, got ${result}`);
              allPassed = false;
            }
          } catch (e: any) {
            testResults.push(`❌ Exception: ${e.message}`);
            allPassed = false;
          }
        }
      });

      // Special visual simulator updates
      if (allPassed) {
        if (checkType === "sql" && editorCode.toLowerCase().includes("where")) {
          const whereMatch = editorCode.match(/level\s*(>|<|=)\s*(\d+)/i);
          if (whereMatch) {
            const op = whereMatch[1];
            const val = parseInt(whereMatch[2], 10);
            setSqlTableData(prev => prev.filter(row => {
              if (op === ">") return row.level > val;
              if (op === "<") return row.level < val;
              return row.level === val;
            }));
          }
        }
      }
    } catch (err: any) {
      testResults.push(`❌ Core Evaluation Crash: ${err.message}`);
      allPassed = false;
    }

    setEvalLogs(prev => [...prev, ...testResults]);
    setEvaluationSuccess(allPassed);

    if (allPassed) {
      playSound("success");
      toast.success("Level Complete! Great job.");
      handleLevelCompletion();
    } else {
      playSound("fail");
      toast.error("Evaluation Failed. Please check the console output and try again.");
    }
  };

  // Update game progress locally and on Firestore
  const handleLevelCompletion = async () => {
    if (!activeGame || !activeLevelData) return;

    const gameId = activeGame.id;
    const completedLvl = currentLevelNum;
    const xpReward = 100;

    // Calculate next overall progress state
    const currentProgress = progress[gameId] || { completedLevel: 0, xp: 0 };
    const nextCompletedLevel = Math.max(currentProgress.completedLevel, completedLvl);
    let nextXp = currentProgress.xp;
    let nextTotalXp = totalXp;

    if (completedLvl > currentProgress.completedLevel) {
      nextXp += xpReward;
      nextTotalXp += xpReward;
    }

    const nextProgress = {
      ...progress,
      [gameId]: {
        completedLevel: nextCompletedLevel,
        xp: nextXp
      }
    };

    setProgress(nextProgress);
    setTotalXp(nextTotalXp);

    // Save locally
    localStorage.setItem("mockrithm_games_progress", JSON.stringify(nextProgress));
    localStorage.setItem("mockrithm_games_xp", nextTotalXp.toString());

    // Sync to Firestore
    if (isSignedIn && clerkUser) {
      try {
        await updateUserGamesProgress(clerkUser.id, gameId, completedLvl, xpReward);
      } catch (err) {
        console.error("Failed syncing progress to cloud database:", err);
      }
    }
  };

  // Block top-level selector skipping unless verified
  const canGoNext = currentLevelNum < maxUnlockedLevel || evaluationSuccess === true;

  const handleNextLevel = () => {
    if (!canGoNext) {
      toast.error("You must compile and pass the current level's tests before progressing!");
      return;
    }
    playSound("click");
    if (currentLevelNum < 500) {
      setCurrentLevelNum(prev => prev + 1);
    } else {
      toast.info("Congratulations! You completed all 500 levels of this game!");
      setActiveGame(null);
    }
  };

  const handlePrevLevel = () => {
    playSound("click");
    if (currentLevelNum > 1) {
      setCurrentLevelNum(prev => prev - 1);
    }
  };

  const handleSelectLevel = (num: number) => {
    if (isNaN(num) || num < 1) return;
    if (num > maxUnlockedLevel) {
      toast.error(`Level ${num} is locked! Clear preceding levels first.`);
      return;
    }
    playSound("click");
    setCurrentLevelNum(num);
  };

  return (
    <div className="min-h-screen bg-black text-white relative font-mona-sans overflow-x-hidden selection:bg-white selection:text-black">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
      <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none z-0" />

      {/* Header Dashboard section */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {!activeGame ? (
          <>
            {/* Top Dashboard Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-8 mb-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">GAMIFIED SYLLABUS ENGINE</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight leading-none">
                  Lvl 500. <span className="text-zinc-400">Mastery Citadel</span>
                </h1>
                <p className="text-xs text-zinc-400 max-w-xl">
                  Elevate your software development parameters. Progress through 14 progressive tech stack universes spanning absolute apprentice syntax up to grandmaster optimizations.
                </p>
              </div>

              {/* XP and Badges Board */}
              <div className="flex items-center gap-4 flex-wrap bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4">
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest flex items-center gap-1">
                    <Award className="size-3.5 text-zinc-400" /> TOTAL EXPERIENCE (XP)
                  </span>
                  <span className="text-2xl font-black text-white font-mono">{totalXp} XP</span>
                </div>

                <div className="h-8 w-[1px] bg-zinc-900" />

                <div className="flex items-center gap-3">
                  {/* Sound control */}
                  <button 
                    onClick={() => { playSound("click"); setSoundEnabled(!soundEnabled); }}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    title="Toggle Audio Feedback"
                  >
                    {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                  </button>

                  {/* Dev mode switch */}
                  <button 
                    onClick={() => { playSound("click"); setBypassLocks(!bypassLocks); }}
                    className={`px-3 py-2 text-[10px] font-bold tracking-wider uppercase border rounded-xl transition-all cursor-pointer ${
                      bypassLocks 
                        ? "bg-white text-black border-white shadow-lg" 
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    Bypass Locks
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Prerequisite Tree Network */}
            <div className="mb-12 bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="size-4 text-zinc-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-350">Interactive Dependency Tree</h3>
              </div>
              <p className="text-[11px] text-zinc-500 mb-6">
                Complete predecessor games to unlock next modules. Drag or hover to explore learning pathways. Toggle "Bypass Locks" above to override.
              </p>

              {/* Dynamic SVG Connectors and Flex Containers mapping tree layout */}
              <div className="relative w-full overflow-x-auto py-8">
                <div className="min-w-[900px] flex flex-col gap-10">
                  {/* Tier 1: Fundamentals */}
                  <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">T1 Foundations</span>
                      <div className="flex gap-4">
                        {GAMES_LIST.filter(g => g.prerequisites.length === 0).map(game => {
                          const unlocked = isGameUnlocked(game.id);
                          const prog = progress[game.id] || { completedLevel: 0, xp: 0 };
                          return (
                            <div 
                              key={game.id}
                              onClick={() => {
                                if (unlocked) {
                                  playSound("click");
                                  setActiveGame(game);
                                  setCurrentLevelNum(prog.completedLevel + 1 > 500 ? 500 : prog.completedLevel + 1);
                                } else {
                                  playSound("fail");
                                  toast.error(`Game Locked! Clear prerequisite challenges first.`);
                                }
                              }}
                              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center w-28 cursor-pointer transition-all ${
                                unlocked 
                                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-500 hover:scale-105" 
                                  : "bg-zinc-950/20 border-zinc-950 opacity-40"
                              }`}
                            >
                              <TechIcon name={game.iconName} className="size-5 text-white" />
                              <span className="text-[10px] font-bold truncate w-full">{game.name}</span>
                              <span className="text-[8px] font-mono text-zinc-500">{prog.completedLevel}/500</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Connectors divider representation */}
                  <div className="h-[2px] bg-zinc-900 relative my-2 mx-12">
                    <div className="absolute left-[20%] -top-1 size-2 rounded-full bg-zinc-800" />
                    <div className="absolute left-[50%] -top-1 size-2 rounded-full bg-zinc-800" />
                    <div className="absolute left-[80%] -top-1 size-2 rounded-full bg-zinc-800" />
                  </div>

                  {/* Tier 2: Specialized & Frameworks */}
                  <div className="flex justify-around items-center">
                    <div className="flex flex-col items-center gap-1 w-full">
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">T2 Frameworks & Scripting</span>
                      <div className="flex justify-around w-full flex-wrap gap-4">
                        {GAMES_LIST.filter(g => g.prerequisites.length > 0).map(game => {
                          const unlocked = isGameUnlocked(game.id);
                          const prog = progress[game.id] || { completedLevel: 0, xp: 0 };
                          return (
                            <div 
                              key={game.id}
                              onClick={() => {
                                if (unlocked) {
                                  playSound("click");
                                  setActiveGame(game);
                                  setCurrentLevelNum(prog.completedLevel + 1 > 500 ? 500 : prog.completedLevel + 1);
                                } else {
                                  playSound("fail");
                                  toast.error(`Locked! Clear prerequisites: ${game.prerequisites.join(", ").toUpperCase()}`);
                                }
                              }}
                              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center w-28 cursor-pointer transition-all ${
                                unlocked 
                                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-500 hover:scale-105" 
                                  : "bg-zinc-950/20 border-zinc-950 opacity-40"
                              }`}
                            >
                              {!unlocked ? (
                                <Lock className="size-5 text-zinc-600" />
                              ) : (
                                <TechIcon name={game.iconName} className="size-5 text-white" />
                              )}
                              <span className="text-[10px] font-bold truncate w-full">{game.name}</span>
                              <span className="text-[8px] font-mono text-zinc-500">{prog.completedLevel}/500</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Achievements & Quests Board */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Award className="size-5 text-zinc-400" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300 font-mono">Campaign Quests & Achievements</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getGlobalQuests().map((quest) => (
                  <div 
                    key={quest.id}
                    className={`relative rounded-2xl border p-5 bg-zinc-955/40 flex flex-col justify-between h-36 transition-all duration-300 ${
                      quest.completed 
                        ? "border-emerald-500/20 bg-emerald-500/[0.01] shadow-[0_0_15px_rgba(16,185,129,0.02)]" 
                        : "border-zinc-900 hover:border-zinc-800"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">{quest.title}</h4>
                        {quest.completed ? (
                          <span className="flex items-center gap-1 text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase leading-none">
                            <CheckCircle className="size-3" /> CLAIMED
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase leading-none">
                            {quest.progressText}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-450 mt-2 leading-relaxed">{quest.description}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${quest.completed ? "bg-emerald-500" : "bg-zinc-700"}`}
                            style={{ width: `${quest.pct}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black ${quest.completed ? "text-emerald-400" : "text-zinc-500"}`}>
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of Game Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAMES_LIST.map((game) => {
                const unlocked = isGameUnlocked(game.id);
                const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                const pct = Math.round((gameProg.completedLevel / 500) * 100);

                return (
                  <motion.div
                    key={game.id}
                    whileHover={unlocked ? { y: -5 } : {}}
                    className={`relative rounded-2xl border bg-zinc-950/50 p-6 flex flex-col justify-between h-64 overflow-hidden group/card transition-all duration-300 ${
                      unlocked 
                        ? "border-zinc-900 hover:border-zinc-755 hover:shadow-2xl" 
                        : "border-zinc-950 opacity-50 select-none"
                    }`}
                  >
                    {/* Background glows */}
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${game.gradient} opacity-5 group-hover/card:opacity-10 blur-xl rounded-full transition-all`} />

                    <div>
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${unlocked ? game.gradient : "from-zinc-900 to-zinc-955"} border border-white/5 shadow-md`}>
                          {unlocked ? (
                            <TechIcon name={game.iconName} className="size-5 text-white" />
                          ) : (
                            <Lock className="size-5 text-zinc-500" />
                          )}
                        </div>

                        {unlocked ? (
                          gameProg.completedLevel === 500 ? (
                            <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold">COMPLETED</span>
                          ) : (
                            <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase font-bold">ACTIVE</span>
                          )
                        ) : (
                          <span className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 text-zinc-650 px-2 py-0.5 rounded-full uppercase font-bold">LOCKED</span>
                        )}
                      </div>

                      {/* Content */}
                      <h3 className="text-base font-black tracking-wide text-white uppercase">{game.name}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider italic">{game.theme}</p>
                      <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{game.description}</p>
                    </div>

                    {/* Progress details */}
                    <div className="mt-4">
                      {unlocked ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-zinc-550">
                            <span>LEVEL {gameProg.completedLevel}/500</span>
                            <span>{pct}% COMPLETE</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${game.gradient}`} 
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <button
                            onClick={() => {
                              playSound("click");
                              setActiveGame(game);
                              setCurrentLevelNum(gameProg.completedLevel + 1 > 500 ? 500 : gameProg.completedLevel + 1);
                            }}
                            className="w-full mt-2 py-2 bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black border border-zinc-800 hover:border-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Play className="size-3 fill-current" /> Enter Arena
                          </button>
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono font-bold text-zinc-655 flex items-center gap-1 uppercase">
                          <AlertCircle className="size-3.5 text-zinc-655" /> Prerequisites: {game.prerequisites.join(", ").toUpperCase()}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Game Runner Interface (Arena Mode) */
          <div className="flex flex-col gap-6">
            {/* Top Bar Navigation */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <button
                onClick={() => { playSound("click"); setActiveGame(null); }}
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-xl"
              >
                <ArrowLeft className="size-4" /> Exit Arena
              </button>

              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${activeGame.gradient} border border-white/5`}>
                  <TechIcon name={activeGame.iconName} className="size-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white leading-tight">{activeGame.name}</h2>
                  <p className="text-[9px] text-zinc-505 uppercase tracking-widest font-semibold">{activeGame.theme}</p>
                </div>
              </div>

              {/* Levels controls switcher */}
              <div className="flex items-center gap-2 font-mono">
                <button
                  onClick={handlePrevLevel}
                  disabled={currentLevelNum === 1}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-955 border border-zinc-900 hover:border-zinc-700 text-zinc-450 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
                >
                  ◀
                </button>
                <div className="flex items-center gap-1 bg-zinc-955 border border-zinc-900 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                  LEVEL 
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={currentLevelNum}
                    onChange={(e) => {
                      const num = parseInt(e.target.value, 10);
                      if (!isNaN(num)) {
                        handleSelectLevel(num);
                      }
                    }}
                    className="w-10 bg-transparent text-center focus:outline-none border-b border-zinc-800 focus:border-white text-white"
                  />
                  / 500
                </div>
                <button
                  onClick={handleNextLevel}
                  disabled={currentLevelNum === 500 || !canGoNext}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-955 border border-zinc-900 hover:border-zinc-700 text-zinc-450 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Split Screen Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Codédex-style Sidebar Lesson Parameters Panel */}
              <div className="lg:col-span-4 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1">
                
                {/* Prerequisite Alert Banner */}
                {hasMissingPrerequisites(activeGame.id) && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
                    <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="size-4 shrink-0" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider">Prerequisite Recommended</span>
                    </div>
                    <p className="text-[10.5px] text-zinc-450 leading-relaxed font-medium">
                      Wait! You haven't completed the prerequisites for this stack. We recommend completing <strong>{activeGame.prerequisites.map(p => p.toUpperCase()).join(", ")}</strong> first for the best learning experience.
                    </p>
                  </div>
                )}

                {/* Level parameters block */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/5 bg-zinc-900 text-zinc-350`}>
                      {activeLevelData?.tier}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-550 font-bold">100 XP REWARD</span>
                  </div>

                  <h3 className="text-lg font-black tracking-wide text-white uppercase leading-tight font-mono">
                    {activeLevelData?.title}
                  </h3>

                  <div className="h-[1px] bg-zinc-900 my-1" />

                  {/* 1. Concept (The "Why") */}
                  <div className="space-y-1">
                    {renderMarkdown(activeLevelData?.conceptText || "")}
                  </div>

                  {/* 2. Code Example */}
                  {activeLevelData?.codeExample && (
                    <div className="mt-2">
                      <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">Code Example</h4>
                      {renderCodeExample(activeLevelData.codeExample)}
                    </div>
                  )}

                  {/* 3. The Mission (The Task) */}
                  <div className="space-y-1 border-t border-zinc-900 pt-4 mt-2">
                    {renderMarkdown(activeLevelData?.missionText || "")}
                  </div>

                  {/* 4. Validation Criteria */}
                  <div className="border-t border-zinc-900 pt-4 mt-2">
                    <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">Validation Criteria</h4>
                    <ul className="space-y-1.5 list-none pl-0">
                      {activeLevelData?.validation.testCases.map((tc, idx) => (
                        <li key={idx} className="text-[10.5px] text-zinc-500 font-medium flex items-start gap-2">
                          <span className="text-zinc-650">•</span>
                          <span>{tc.description || tc.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hints container */}
                  <div className="mt-2 border-t border-zinc-900 pt-4">
                    <button
                      onClick={() => { playSound("click"); setShowHint(!showHint); }}
                      className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase"
                    >
                      <HelpCircle className="size-4 text-zinc-500" /> {showHint ? "Hide Hint" : "Reveal Hint"}
                    </button>
                    <AnimatePresence>
                      {showHint && activeLevelData?.hints && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-[10.5px] text-zinc-450 leading-relaxed font-medium"
                        >
                          <ul className="list-disc pl-4 space-y-1.5">
                            {activeLevelData.hints.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Local Badges & Ranks Progress Card */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono font-bold text-zinc-450 uppercase tracking-widest">
                      Arena Ranks & Badges
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-550 uppercase font-black">PROGRESSIVE TITLES</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { tier: "Apprentice", minLvl: 1, color: "from-amber-700 to-orange-500", desc: "Lv. 1-100" },
                      { tier: "Mage", minLvl: 101, color: "from-cyan-600 to-teal-500", desc: "Lv. 101-200" },
                      { tier: "Knight", minLvl: 201, color: "from-yellow-500 to-amber-600", desc: "Lv. 201-300" },
                      { tier: "Warlord", minLvl: 301, color: "from-purple-600 to-fuchsia-500", desc: "Lv. 301-400" },
                      { tier: "Grandmaster", minLvl: 401, color: "from-red-600 to-rose-700", desc: "Lv. 401-500" }
                    ].map((badge) => {
                      const isUnlocked = currentLevelNum >= badge.minLvl;
                      const isActive = getTierName(currentLevelNum) === badge.tier;
                      return (
                        <div 
                          key={badge.tier}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center relative overflow-hidden transition-all duration-300 h-24 ${
                            isActive 
                              ? "bg-zinc-900 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] scale-105" 
                              : isUnlocked
                              ? "bg-zinc-900/60 border-zinc-800"
                              : "bg-zinc-950/20 border-zinc-950 opacity-30"
                          }`}
                        >
                          {/* Top Glow on Active Badge */}
                          {isActive && (
                            <span className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${badge.color}`} />
                          )}
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${isUnlocked ? badge.color : "from-zinc-900 to-zinc-950"} border border-white/5`}>
                            {isUnlocked ? (
                              <Award className="size-3.5 text-white" />
                            ) : (
                              <Lock className="size-3.5 text-zinc-650" />
                            )}
                          </div>
                          <span className="text-[7.5px] font-bold uppercase tracking-wider text-zinc-300 truncate w-full mt-2 leading-none">{badge.tier}</span>
                          <span className="text-[7px] font-mono text-zinc-550 leading-none mt-1">{badge.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Sandbox Interactive Previews */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono font-bold text-zinc-450 uppercase tracking-widest">
                      Live Sandbox Output
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-650 uppercase font-black">COMPILING ON-THE-FLY</span>
                  </div>

                  <div className="min-h-52 bg-black border border-zinc-900 rounded-xl overflow-hidden relative flex flex-col justify-center items-center p-3 text-center">
                    
                    {/* HTML/CSS Iframe Output Renderer */}
                    {(activeLevelData?.validation.checkType === "html" || activeLevelData?.validation.checkType === "css") && (
                      <div className="w-full h-52 bg-white rounded-lg overflow-hidden">
                        <iframe
                          title="HTML Live Preview"
                          srcDoc={`
                            <html>
                              <head>
                                <style>
                                  body { font-family: sans-serif; margin: 15px; color: #333; }
                                  ${activeLevelData.validation.checkType === 'css' ? editorCode : ''}
                                </style>
                              </head>
                              <body>
                                ${activeLevelData.validation.checkType === 'html' ? editorCode : '<div class="visual-box">Visual Target</div>'}
                              </body>
                            </html>
                          `}
                          className="w-full h-full border-none bg-white"
                        />
                      </div>
                    )}

                    {/* SQL Relational Database Inspector */}
                    {activeLevelData?.validation.checkType === "sql" && (
                      <div className="w-full h-52 overflow-auto text-left font-mono text-[9.5px]">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950">
                              <th className="p-2 text-zinc-500 font-bold">id</th>
                              <th className="p-2 text-zinc-500 font-bold">name</th>
                              <th className="p-2 text-zinc-500 font-bold">level</th>
                              <th className="p-2 text-zinc-500 font-bold">class</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sqlTableData.map(row => (
                              <tr key={row.id} className="border-b border-zinc-900 hover:bg-zinc-900/40">
                                <td className="p-2 text-white font-bold">{row.id}</td>
                                <td className="p-2 text-zinc-300">{row.name}</td>
                                <td className="p-2 text-emerald-400">{row.level}</td>
                                <td className="p-2 text-zinc-450">{row.class}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Git Timeline Interactive Terminal */}
                    {activeLevelData?.validation.checkType === "git" && (
                      <div className="w-full h-52 flex flex-col font-mono text-[9px] text-left">
                        <div className="flex-1 overflow-y-auto space-y-1 bg-black p-3 border border-zinc-900 rounded-lg max-h-40">
                          {gitTerminalLogs.map((log, idx) => (
                            <div key={idx} className="whitespace-pre-wrap">{log}</div>
                          ))}
                        </div>
                        <form onSubmit={handleGitCommandLineSubmit} className="mt-2 flex gap-2">
                          <span className="text-zinc-550 font-bold select-none pt-1.5">$</span>
                          <input
                            type="text"
                            value={gitCommandInput}
                            onChange={(e) => setGitCommandInput(e.target.value)}
                            placeholder="Type git command here..."
                            className="flex-1 bg-zinc-955 border border-zinc-900 rounded-lg px-3 py-1.5 focus:outline-none focus:border-zinc-650 text-white text-[10px]"
                          />
                        </form>
                      </div>
                    )}

                    {/* Default Console Visualizer */}
                    {activeLevelData?.validation.checkType !== "html" && 
                     activeLevelData?.validation.checkType !== "css" && 
                     activeLevelData?.validation.checkType !== "sql" && 
                     activeLevelData?.validation.checkType !== "git" && (
                      <div className="flex flex-col items-center gap-2">
                        <Code2 className="size-8 text-zinc-650 animate-pulse" />
                        <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest font-bold">Standard Console</span>
                        <p className="text-[10px] text-zinc-550 max-w-[200px] leading-relaxed">
                          Your script evaluations will execute inside sandboxed unit test assertions. Output will print below.
                        </p>
                      </div>
                    )}

                  </div>
                </div>

              </div>

              {/* Right Column: Code Editor & Runner Console */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* Monaco Editor Pane */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 border-b border-zinc-900">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      SOURCE CODE WORKSPACE
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { playSound("click"); setEditorCode(activeLevelData?.starterCode || ""); }}
                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-white transition-all cursor-pointer"
                        title="Reset code template"
                      >
                        <RotateCcw className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="h-96 w-full">
                    <Editor
                      height="100%"
                      defaultLanguage={
                        activeGame.id === "html5" || activeGame.id === "tailwind" ? "html" :
                        activeGame.id === "css3" ? "css" :
                        activeGame.id === "typescript" ? "typescript" :
                        activeGame.id === "python" || activeGame.id === "django" ? "python" :
                        activeGame.id === "sql" ? "sql" : "javascript"
                      }
                      theme="vs-dark"
                      value={editorCode}
                      onChange={(val) => setEditorCode(val || "")}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 12.5,
                        fontFamily: "var(--font-mono), monospace",
                        scrollbar: { vertical: "visible" },
                        padding: { top: 15, bottom: 15 },
                        lineNumbers: "on",
                        tabSize: 2
                      }}
                    />
                  </div>
                </div>

                {/* Console Log Runner */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      UNIT TEST OUTPUT LOGGER
                    </h4>
                    
                    {evaluationSuccess === true && (
                      <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold">ALL TESTS PASSED</span>
                    )}
                    {evaluationSuccess === false && (
                      <span className="text-[9px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase font-bold">VALIDATION FAILURE</span>
                    )}
                  </div>

                  {/* Output logger lines */}
                  <div className="h-28 overflow-y-auto bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5">
                    {evalLogs.length > 0 ? (
                      evalLogs.map((log, i) => (
                        <div 
                          key={i} 
                          className={
                            log.startsWith("✔️") ? "text-emerald-400 font-bold" :
                            log.startsWith("❌") ? "text-red-400 font-bold" : "text-zinc-400"
                          }
                        >
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-zinc-650 italic">Execute code validations to populate test run logs.</div>
                    )}
                  </div>

                  {/* Runner controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={evaluateCode}
                      className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white"
                    >
                      <Zap className="size-4 fill-current" /> Compile & Run Code
                    </button>

                    {evaluationSuccess === true && (
                      <button
                        onClick={handleNextLevel}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-600"
                      >
                        <CheckCircle className="size-4" /> Next Level →
                      </button>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
