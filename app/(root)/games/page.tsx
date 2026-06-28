"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import Editor from "@monaco-editor/react";
import Link from "next/link";
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
  AlertCircle,
  MessageSquare,
  Users,
  Trophy,
  Plus,
  Send
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

interface Achievement {
  id: string;
  title: string;
  desc: string;
  target: string;
  current: number;
  max: number;
  completed: boolean;
  xp: number;
}

// Mock Leaderboard Data with filtering attributes
const MOCK_LEADERBOARD = [
  { rank: 1, name: "CyberKing", country: "United States", city: "San Francisco", xp: 12500, badges: 15, achievements: 12, avatar: "👑" },
  { rank: 2, name: "CodeWitch", country: "Canada", city: "Toronto", xp: 11200, badges: 14, achievements: 10, avatar: "🧙‍♀️" },
  { rank: 3, name: "NodeNinja", country: "Japan", city: "Tokyo", xp: 9800, badges: 11, achievements: 9, avatar: "🥷" },
  { rank: 4, name: "AlchemistJS", country: "Germany", city: "Berlin", xp: 8500, badges: 9, achievements: 8, avatar: "🧪" },
  { rank: 5, name: "RustGuardian", country: "United States", city: "San Francisco", xp: 7200, badges: 8, achievements: 7, avatar: "🛡️" },
  { rank: 6, name: "Pythonista", country: "Canada", city: "Toronto", xp: 6400, badges: 7, achievements: 6, avatar: "🐍" },
  { rank: 7, name: "DockerMaster", country: "United Kingdom", city: "London", xp: 5900, badges: 6, achievements: 5, avatar: "🐳" },
  { rank: 8, name: "GitWeaver", country: "Germany", city: "Berlin", xp: 5100, badges: 5, achievements: 4, avatar: "🕸️" },
  { rank: 9, name: "TailwindGenius", country: "United States", city: "New York", xp: 4200, badges: 4, achievements: 3, avatar: "🎨" }
];

export default function GamesPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Sidebar Tab States: 'dashboard' | 'achievements' | 'leaderboard' | 'social'
  const [activeTab, setActiveTab] = useState<"dashboard" | "achievements" | "leaderboard" | "social">("dashboard");

  // Progress State
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Gamification Claimed Achievements (local persistence)
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);

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

  // Leaderboard Filtering Options
  const [leaderboardScope, setLeaderboardScope] = useState<"world" | "country" | "city">("world");
  const [leaderboardMetric, setLeaderboardMetric] = useState<"xp" | "badges" | "achievements">("xp");

  // Social / Friends & Chat States
  const [friendsList, setFriendsList] = useState<string[]>(["ZeroCool", "NeoCoder", "AlgorithmKnight"]);
  const [newFriendInput, setNewFriendInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("ZeroCool");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Record<string, { sender: "user" | "friend"; text: string; time: string }[]>>({
    "ZeroCool": [
      { sender: "friend", text: "Hey! Did you clear the HTML5 skeleton levels yet?", time: "2:15 PM" },
      { sender: "user", text: "Working on it now. The tags are pretty cool.", time: "2:17 PM" },
      { sender: "friend", text: "Awesome, let me know if you get stuck on the list alignments!", time: "2:18 PM" }
    ],
    "NeoCoder": [
      { sender: "friend", text: "TypeScript generics are saving my life today.", time: "Yesterday" }
    ],
    "AlgorithmKnight": [
      { sender: "friend", text: "Leaderboards are getting competitive. Good luck!", time: "3:04 PM" }
    ]
  });

  // Calculate highest unlocked level for current game
  const gameProgressObj = activeGame ? (progress[activeGame.id] || { completedLevel: 0, xp: 0 }) : { completedLevel: 0, xp: 0 };
  const maxUnlockedLevel = bypassLocks ? 500 : (gameProgressObj.completedLevel + 1 > 500 ? 500 : gameProgressObj.completedLevel + 1);

  // Load User Progress and Achievements
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

        // Load claimed achievements from local storage
        const claimed = localStorage.getItem("mockrithm_claimed_achievements");
        if (claimed) {
          setClaimedAchievements(JSON.parse(claimed));
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

  // Prerequisite Verification Logic
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

  // Calculate dynamic achievements shelf
  const getAchievements = (): Achievement[] => {
    const playList = Object.keys(progress);
    const anyPlayed = playList.some(k => progress[k].completedLevel > 0);
    const polyglotCount = playList.filter(k => progress[k].completedLevel >= 5).length;
    
    const htmlLvl = progress["html5"]?.completedLevel || 0;
    const cssLvl = progress["css3"]?.completedLevel || 0;
    const jsLvl = progress["javascript"]?.completedLevel || 0;
    const tsLvl = progress["typescript"]?.completedLevel || 0;
    const nodeLvl = progress["nodejs"]?.completedLevel || 0;
    const cyberLvl = progress["cybersecurity"]?.completedLevel || 0;
    const gitLvl = progress["git"]?.completedLevel || 0;
    const anyGrand = playList.some(k => progress[k].completedLevel >= 100);

    return [
      { id: "genesis", title: "First Syntax", desc: "Clear Level 1 on any game stack.", target: "Any game Level 1", current: anyPlayed ? 1 : 0, max: 1, completed: anyPlayed, xp: 50 },
      { id: "explorer", title: "Tech Explorer", desc: "Reach Level 5 on 3 different languages.", target: "3 games", current: Math.min(polyglotCount, 3), max: 3, completed: polyglotCount >= 3, xp: 150 },
      { id: "html_app", title: "Apprentice Weaver", desc: "Reach Level 10 in HTML5.", target: "HTML5 Level 10", current: Math.min(htmlLvl, 10), max: 10, completed: htmlLvl >= 10, xp: 100 },
      { id: "css_alc", title: "Style Alchemist", desc: "Reach Level 10 in CSS3.", target: "CSS3 Level 10", current: Math.min(cssLvl, 10), max: 10, completed: cssLvl >= 10, xp: 100 },
      { id: "js_hack", title: "Logic Hacker", desc: "Reach Level 10 in JavaScript.", target: "JavaScript Level 10", current: Math.min(jsLvl, 10), max: 10, completed: jsLvl >= 10, xp: 100 },
      { id: "ts_guard", title: "Type Guardian", desc: "Reach Level 5 in TypeScript.", target: "TypeScript Level 5", current: Math.min(tsLvl, 5), max: 5, completed: tsLvl >= 5, xp: 100 },
      { id: "node_core", title: "Server Core", desc: "Reach Level 5 in NodeJS.", target: "NodeJS Level 5", current: Math.min(nodeLvl, 5), max: 5, completed: nodeLvl >= 5, xp: 100 },
      { id: "cyber_sentinel", title: "Citadel Sentinel", desc: "Reach Level 5 in Cyber Security.", target: "Security Level 5", current: Math.min(cyberLvl, 5), max: 5, completed: cyberLvl >= 5, xp: 150 },
      { id: "git_weaver", title: "Timeline Weaver", desc: "Reach Level 5 in Git.", target: "Git Level 5", current: Math.min(gitLvl, 5), max: 5, completed: gitLvl >= 5, xp: 100 },
      { id: "grandmaster_badge", title: "Grandmaster Title", desc: "Reach Level 100 in any game stack.", target: "Level 100", current: anyGrand ? 100 : 0, max: 100, completed: anyGrand, xp: 500 }
    ];
  };

  // Get completed but unclaimed achievements (to show red dot indicator)
  const getUnclaimedAchievementsCount = (): number => {
    const list = getAchievements();
    const unclaimed = list.filter(a => a.completed && !claimedAchievements.includes(a.id));
    return unclaimed.length;
  };

  // Claim achievement reward action
  const claimAchievementReward = (achievementId: string, xpReward: number) => {
    if (claimedAchievements.includes(achievementId)) return;
    
    playSound("success");
    toast.success(`🏆 Achievement Unlocked! Claimed +${xpReward} XP!`);

    const nextClaimed = [...claimedAchievements, achievementId];
    setClaimedAchievements(nextClaimed);
    localStorage.setItem("mockrithm_claimed_achievements", JSON.stringify(nextClaimed));

    const nextTotalXp = totalXp + xpReward;
    setTotalXp(nextTotalXp);
    localStorage.setItem("mockrithm_games_xp", nextTotalXp.toString());
  };

  // Add friend to Social List
  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFriendInput.trim();
    if (!name) return;

    if (friendsList.includes(name)) {
      toast.error(`${name} is already in your friends list!`);
      return;
    }

    playSound("click");
    toast.success(`Sent friend invitation to ${name}!`);
    const nextFriends = [...friendsList, name];
    setFriendsList(nextFriends);
    setNewFriendInput("");
  };

  // Chat message submit handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    playSound("click");
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: "user" as const, text, time: timestamp };

    setMessages(prev => {
      const activeLogs = prev[selectedFriend] || [];
      return {
        ...prev,
        [selectedFriend]: [...activeLogs, userMsg]
      };
    });
    setChatInput("");

    // Simulate automated replies from friends (interactive chat loop)
    setTimeout(() => {
      const replies = [
        "That implementation looks super clean! Let me know when you clear the next level.",
        "Generics are rough, but we'll conquer TypeScript Warlord ranks soon!",
        "Stuck on Docker WORKDIR commands... any hints?",
        "Awesome! Let's duel in the coding arena soon.",
        "Try using standard regex validation searches if the code editor keeps throwing errors."
      ];
      const friendReply = {
        sender: "friend" as const,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => {
        const activeLogs = prev[selectedFriend] || [];
        return {
          ...prev,
          [selectedFriend]: [...activeLogs, friendReply]
        };
      });
      playSound("success");
    }, 1200);
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

  // Filtered Leaderboard computation
  const getFilteredLeaderboard = () => {
    const list = [...MOCK_LEADERBOARD];
    // append user to leaderboard dynamically if logged in
    const userNameDisplay = clerkUser?.username || clerkUser?.firstName || "Hacker";
    const userRow = { rank: 10, name: userNameDisplay, country: "United States", city: "San Francisco", xp: totalXp, badges: Object.keys(progress).length, achievements: claimedAchievements.length, avatar: "🛸" };
    
    // Add user if not already there
    if (!list.some(r => r.name === userNameDisplay)) {
      list.push(userRow);
    }

    let filtered = list;
    if (leaderboardScope === "country") {
      filtered = list.filter(r => r.country === "United States");
    } else if (leaderboardScope === "city") {
      filtered = list.filter(r => r.city === "San Francisco");
    }

    // Sort by selected metric
    filtered.sort((a, b) => b[leaderboardMetric] - a[leaderboardMetric]);
    
    // Recalculate rank values based on sorting
    return filtered.map((row, idx) => ({ ...row, rank: idx + 1 }));
  };

  // Red Notification dot counter
  const unclaimedCount = getUnclaimedAchievementsCount();

  return (
    <div className="flex h-screen bg-black text-white relative font-mona-sans overflow-hidden selection:bg-white selection:text-black">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />

      {/* Left Custom Gaming Sidebar Menu */}
      <div className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between h-full relative z-20">
        <div className="p-6 flex flex-col gap-6">
          {/* Logo & Back button */}
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-[10px] font-mono font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-all mb-4"
              onClick={() => playSound("click")}
            >
              <ArrowLeft className="size-3.5" /> Back to Site
            </Link>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-sm font-black tracking-wider uppercase font-mono text-white">Citadel Games</h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => { playSound("click"); setActiveTab("dashboard"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "dashboard" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Play className="size-4" /> Arena Workspace
              </span>
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("achievements"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "achievements" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2 relative">
                <Trophy className="size-4" /> Achievements
                {/* Red Notification Dot indicator */}
                {unclaimedCount > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </span>
              {unclaimedCount > 0 && (
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded-full bg-red-500 text-white leading-none">
                  {unclaimedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("leaderboard"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "leaderboard" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="size-4" /> Leaderboards
              </span>
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("social"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "social" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="size-4" /> Friends & Chat
              </span>
            </button>
          </nav>
        </div>

        {/* User Mini Profile Block */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-sm">
              {clerkUser?.username?.[0]?.toUpperCase() || clerkUser?.firstName?.[0]?.toUpperCase() || "H"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate text-white uppercase tracking-wide">
                {clerkUser?.username || clerkUser?.firstName || "Developer"}
              </h4>
              <p className="text-[8px] font-mono text-zinc-550 uppercase font-black">{totalXp} Global XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 p-8">
        
        {/* Tab 1: Arena Dashboard (prerequisite network tree & game grid) */}
        {activeTab === "dashboard" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            {!activeGame ? (
              <>
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-8 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">GAMIFIED SYSTEM CITADEL</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight leading-none uppercase font-mono">
                      Mastery Arena
                    </h1>
                    <p className="text-xs text-zinc-400 max-w-xl">
                      Embark on syntax quests. Earn XP, claim badges, challenge friends, and climb the leaderboard.
                    </p>
                  </div>

                  {/* Sound controls and Developer bypass */}
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 p-3 rounded-2xl">
                    <button 
                      onClick={() => { playSound("click"); setSoundEnabled(!soundEnabled); }}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                    </button>
                    <button 
                      onClick={() => { playSound("click"); setBypassLocks(!bypassLocks); }}
                      className={`px-3 py-2 text-[10px] font-bold tracking-wider uppercase border rounded-xl transition-all cursor-pointer ${
                        bypassLocks 
                          ? "bg-white text-black border-white shadow-lg" 
                          : "bg-zinc-900 text-zinc-450 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      Bypass Locks
                    </button>
                  </div>
                </div>

                {/* Tree Network */}
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="size-4 text-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-350">Interactive Dependency Tree</h3>
                  </div>
                  <div className="relative w-full overflow-x-auto py-4">
                    <div className="min-w-[900px] flex flex-col gap-8">
                      {/* Tier 1 */}
                      <div className="flex justify-around items-center">
                        {GAMES_LIST.filter(g => g.prerequisites.length === 0).map(game => {
                          const prog = progress[game.id] || { completedLevel: 0, xp: 0 };
                          return (
                            <div 
                              key={game.id}
                              onClick={() => {
                                playSound("click");
                                setActiveGame(game);
                                setCurrentLevelNum(prog.completedLevel + 1 > 500 ? 500 : prog.completedLevel + 1);
                              }}
                              className="p-3 rounded-xl border border-zinc-850 bg-zinc-900/60 hover:border-zinc-500 hover:scale-105 flex flex-col items-center gap-2 text-center w-28 cursor-pointer transition-all"
                            >
                              <TechIcon name={game.iconName} className="size-5 text-white" />
                              <span className="text-[10px] font-bold truncate w-full">{game.name}</span>
                              <span className="text-[8px] font-mono text-zinc-500">{prog.completedLevel}/500</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Line */}
                      <div className="h-[2px] bg-zinc-900 relative my-1 mx-12">
                        <div className="absolute left-[20%] -top-1 size-2 rounded-full bg-zinc-800" />
                        <div className="absolute left-[50%] -top-1 size-2 rounded-full bg-zinc-800" />
                        <div className="absolute left-[80%] -top-1 size-2 rounded-full bg-zinc-800" />
                      </div>

                      {/* Tier 2 */}
                      <div className="flex justify-around w-full flex-wrap gap-4">
                        {GAMES_LIST.filter(g => g.prerequisites.length > 0).map(game => {
                          const hasWarn = hasMissingPrerequisites(game.id);
                          const prog = progress[game.id] || { completedLevel: 0, xp: 0 };
                          return (
                            <div 
                              key={game.id}
                              onClick={() => {
                                playSound("click");
                                setActiveGame(game);
                                setCurrentLevelNum(prog.completedLevel + 1 > 500 ? 500 : prog.completedLevel + 1);
                              }}
                              className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center w-28 cursor-pointer transition-all ${
                                hasWarn 
                                  ? "bg-zinc-900/40 border-dashed border-zinc-800 hover:border-amber-500" 
                                  : "bg-zinc-900/60 border-zinc-850 hover:border-zinc-500"
                              }`}
                            >
                              <TechIcon name={game.iconName} className="size-5 text-white" />
                              <span className="text-[10px] font-bold truncate w-full">{game.name}</span>
                              {hasWarn && (
                                <span className="text-[7.5px] font-mono text-amber-500 font-bold uppercase leading-none">Warning</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* List of Game Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GAMES_LIST.map((game) => {
                    const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                    const pct = Math.round((gameProg.completedLevel / 500) * 100);

                    return (
                      <div
                        key={game.id}
                        className="relative rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 flex flex-col justify-between h-64 overflow-hidden group/card hover:border-zinc-750 transition-all duration-300"
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${game.gradient} opacity-5 group-hover/card:opacity-10 blur-xl rounded-full transition-all`} />
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${game.gradient} border border-white/5`}>
                              <TechIcon name={game.iconName} className="size-5 text-white" />
                            </div>
                            <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase font-bold">READY</span>
                          </div>
                          <h3 className="text-base font-black tracking-wide text-white uppercase">{game.name}</h3>
                          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider italic">{game.theme}</p>
                          <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{game.description}</p>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-zinc-550">
                            <span>LEVEL {gameProg.completedLevel}/500</span>
                            <span>{pct}% COMPLETE</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${game.gradient}`} style={{ width: `${pct}%` }} />
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
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              /* Inside active Game Runner */
              <div className="flex flex-col gap-6">
                {/* Top Nav inside Arena */}
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

                  {/* Level Controls */}
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
                        className="w-10 bg-transparent text-center focus:outline-none border-b border-zinc-800 focus:border-white text-white font-bold"
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

                {/* Workspace Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  {/* Left Sidebar */}
                  <div className="lg:col-span-4 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1">
                    
                    {/* Prerequisite Alert */}
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

                    {/* Lesson Parameters Panel */}
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

                      <div className="space-y-1">
                        {renderMarkdown(activeLevelData?.conceptText || "")}
                      </div>

                      {activeLevelData?.codeExample && (
                        <div className="mt-2">
                          <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">Code Example</h4>
                          {renderCodeExample(activeLevelData.codeExample)}
                        </div>
                      )}

                      <div className="space-y-1 border-t border-zinc-900 pt-4 mt-2">
                        {renderMarkdown(activeLevelData?.missionText || "")}
                      </div>

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

                    {/* Arena ranks indicator */}
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
                              {isActive && (
                                <span className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${badge.color}`} />
                              )}
                              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${isUnlocked ? badge.color : "from-zinc-900 to-zinc-955"} border border-white/5`}>
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

                    {/* Previews sandboxes */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-mono font-bold text-zinc-450 uppercase tracking-widest">
                          Live Sandbox Output
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-650 uppercase font-black">COMPILING ON-THE-FLY</span>
                      </div>

                      <div className="min-h-52 bg-black border border-zinc-900 rounded-xl overflow-hidden relative flex flex-col justify-center items-center p-3 text-center">
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

                        {activeLevelData?.validation.checkType === "sql" && (
                          <div className="w-full h-52 overflow-auto text-left font-mono text-[9.5px]">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b border-zinc-800 bg-zinc-955">
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

                  {/* Right Column: Monaco Editor & Logger */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 border-b border-zinc-900">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                          SOURCE CODE WORKSPACE
                        </span>
                        <button
                          onClick={() => { playSound("click"); setEditorCode(activeLevelData?.starterCode || ""); }}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-white transition-all cursor-pointer"
                        >
                          <RotateCcw className="size-4" />
                        </button>
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

                    {/* Console Test Logger */}
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

                      <div className="h-28 overflow-y-auto bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[10.5px] leading-relaxed flex flex-col gap-1.5">
                        {evalLogs.length > 0 ? (
                          evalLogs.map((log, idx) => (
                            <div key={idx} className={log.startsWith("✔️") ? "text-emerald-400 font-bold" : log.startsWith("❌") ? "text-red-400 font-bold" : "text-zinc-400"}>
                              {log}
                            </div>
                          ))
                        ) : (
                          <div className="text-zinc-650 italic">Execute code validations to populate test run logs.</div>
                        )}
                      </div>

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
        )}

        {/* Tab 2: Achievements Claim Board */}
        {activeTab === "achievements" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6 mb-4">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Campaign Achievements Shelf</h2>
              <p className="text-xs text-zinc-500 mt-1">Complete structural tasks in coding sandboxes to unlock rewards. Unlocked rewards must be claimed below to add to your global XP.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAchievements().map((ach) => {
                const isClaimed = claimedAchievements.includes(ach.id);
                const pct = Math.round((ach.current / ach.max) * 100);

                return (
                  <div 
                    key={ach.id}
                    className={`relative rounded-2xl border p-5 bg-zinc-950/40 flex flex-col justify-between h-44 transition-all duration-300 ${
                      isClaimed 
                        ? "border-emerald-500/20 bg-emerald-500/[0.01]" 
                        : ach.completed 
                        ? "border-amber-500/30 bg-amber-500/[0.02]" 
                        : "border-zinc-900"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">{ach.title}</h4>
                        {isClaimed ? (
                          <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">CLAIMED</span>
                        ) : ach.completed ? (
                          <button
                            onClick={() => claimAchievementReward(ach.id, ach.xp)}
                            className="text-[8.5px] font-mono font-black text-black bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-full uppercase transition-all cursor-pointer flex items-center gap-1 shadow-lg"
                          >
                            <Award className="size-3" /> CLAIM REWARD
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase">LOCKED</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-450 mt-2.5 leading-relaxed">{ach.desc}</p>
                      <p className="text-[9px] font-mono text-zinc-600 mt-1 uppercase font-bold">Target: {ach.target}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${ach.completed ? "bg-emerald-500" : "bg-zinc-700"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black ${ach.completed ? "text-amber-400" : "text-zinc-500"}`}>
                        +{ach.xp} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Competitive Leaderboards */}
        {activeTab === "leaderboard" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Citadel Leaderboards</h2>
              <p className="text-xs text-zinc-500 mt-1">Compare achievements, XP parameters, and badge completions against regional, country, or global hackers.</p>
            </div>

            {/* Filtering Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
              <div className="flex gap-2">
                {[
                  { value: "world", label: "World" },
                  { value: "country", label: "United States" },
                  { value: "city", label: "San Francisco" }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => { playSound("click"); setLeaderboardScope(s.value as any); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leaderboardScope === s.value ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:text-white bg-zinc-900/40"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {[
                  { value: "xp", label: "Global XP" },
                  { value: "badges", label: "Badges" },
                  { value: "achievements", label: "Achievements" }
                ].map((m) => (
                  <button
                    key={m.value}
                    onClick={() => { playSound("click"); setLeaderboardMetric(m.value as any); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leaderboardMetric === m.value ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:text-white bg-zinc-900/40"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Leaderboard Table Grid */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="p-4 font-bold">Rank</th>
                    <th className="p-4 font-bold">Hacker</th>
                    <th className="p-4 font-bold">Country</th>
                    <th className="p-4 font-bold">City</th>
                    <th className="p-4 font-bold text-center">Badges</th>
                    <th className="p-4 font-bold text-center">Achievements</th>
                    <th className="p-4 font-bold text-right">XP Score</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLeaderboard().map((row) => {
                    const isCurrentUser = row.name === (clerkUser?.username || clerkUser?.firstName || "Hacker");
                    return (
                      <tr 
                        key={row.name} 
                        className={`border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors ${
                          isCurrentUser ? "bg-white/[0.02] font-semibold" : ""
                        }`}
                      >
                        <td className="p-4 font-mono font-bold text-zinc-450">
                          {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                        </td>
                        <td className="p-4 flex items-center gap-2.5">
                          <span className="text-base select-none">{row.avatar}</span>
                          <span className={isCurrentUser ? "text-emerald-400" : "text-white"}>{row.name}</span>
                          {isCurrentUser && (
                            <span className="text-[7.5px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">YOU</span>
                          )}
                        </td>
                        <td className="p-4 text-zinc-400">{row.country}</td>
                        <td className="p-4 text-zinc-500 font-mono">{row.city}</td>
                        <td className="p-4 text-center font-mono text-zinc-300">{row.badges}</td>
                        <td className="p-4 text-center font-mono text-zinc-300">{row.achievements}</td>
                        <td className="p-4 text-right font-mono font-black text-white">{row.xp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Social Friends List & Interactive Messaging chat */}
        {activeTab === "social" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 h-[80vh]">
            <div className="border-b border-zinc-900 pb-6 shrink-0">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Social Network</h2>
              <p className="text-xs text-zinc-500 mt-1">Connect with peer developers, exchange suggestions, and coordinate milestones.</p>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
              
              {/* Friends Left Panel */}
              <div className="w-64 border border-zinc-900 rounded-2xl bg-zinc-950/40 p-4 flex flex-col gap-4 justify-between shrink-0">
                <div className="flex flex-col gap-4">
                  <h3 className="text-[10px] font-mono font-bold text-zinc-450 uppercase tracking-widest">Active Friends</h3>
                  
                  <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
                    {friendsList.map(friend => {
                      const isActive = selectedFriend === friend;
                      return (
                        <button
                          key={friend}
                          onClick={() => { playSound("click"); setSelectedFriend(friend); }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            isActive ? "bg-zinc-900 text-white" : "text-zinc-450 hover:bg-zinc-900/40 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2 text-xs font-bold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {friend}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add Friend form */}
                <form onSubmit={handleAddFriend} className="border-t border-zinc-900 pt-4 flex flex-col gap-2">
                  <span className="text-[8px] font-mono font-bold text-zinc-550 uppercase tracking-widest">Add Hacker</span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Username..."
                      value={newFriendInput}
                      onChange={(e) => setNewFriendInput(e.target.value)}
                      className="flex-1 bg-zinc-950 border border-zinc-900 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-zinc-700 text-[10px] text-white"
                    />
                    <button 
                      type="submit"
                      className="p-2 bg-white text-black hover:bg-zinc-250 rounded-lg transition-all cursor-pointer flex items-center justify-center shadow"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Chat Right Panel */}
              <div className="flex-1 border border-zinc-900 rounded-2xl bg-zinc-950/40 flex flex-col justify-between overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <h3 className="text-xs font-black uppercase font-mono text-white">Direct Channel: {selectedFriend}</h3>
                  </div>
                  <span className="text-[9px] font-mono text-zinc-550 uppercase font-black">Encrypted Sandbox Session</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 min-h-0">
                  {(messages[selectedFriend] || []).length > 0 ? (
                    (messages[selectedFriend] || []).map((msg, idx) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div 
                          key={idx} 
                          className={`flex flex-col max-w-[70%] ${
                            isUser ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div className={`p-3 rounded-2xl text-[11.5px] leading-relaxed font-medium ${
                            isUser 
                              ? "bg-white text-black rounded-tr-none" 
                              : "bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-850"
                          }`}>
                            {msg.text}
                          </div>
                          <span className="text-[7.5px] font-mono text-zinc-600 mt-1 select-none">{msg.time}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-650 italic text-[10px]">
                      Send a message to open the secure timeline connection.
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="p-4 bg-zinc-950 border-t border-zinc-900 flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Type message to ${selectedFriend}...`}
                    className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 focus:outline-none focus:border-zinc-600 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-white"
                  >
                    <Send className="size-3.5 fill-current" /> Send
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
