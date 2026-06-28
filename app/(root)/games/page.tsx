"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
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
  Send,
  User as UserIcon,
  Activity,
  Phone,
  PhoneOff,
  Mic,
  MicOff
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
  saveUserLocation,
  claimAchievementPersistent,
  addFriendPersistent,
  getLeaderboardUsers,
  GameProgress
} from "@/lib/actions/games.action";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
        <li key={idx} className="text-[11px] text-zinc-400 list-disc ml-4 mt-1 font-medium font-mono">
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

export default function GamesPage() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Sidebar Tab States: 'dashboard' | 'achievements' | 'leaderboard' | 'social' | 'profile' | 'friends' | 'badges'
  const [activeTab, setActiveTab] = useState<"dashboard" | "achievements" | "leaderboard" | "social" | "profile" | "friends" | "badges">("dashboard");

  // Progress State
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  // User location states (determined dynamically from IP and Geolocation prompts)
  const [userLocation, setUserLocation] = useState({
    country: "United States",
    city: "San Francisco"
  });

  // Database-driven leaderboard cache
  const [dbLeaderboard, setDbLeaderboard] = useState<any[]>([]);

  // Gamification Claimed Achievements (local + DB sync)
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
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [newFriendInput, setNewFriendInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Record<string, { sender: "user" | "friend"; text: string; time: string }[]>>({});

  // Calling features simulator state
  const [activeCallFriend, setActiveCallFriend] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<"calling" | "connected" | "ended">("ended");
  const [callTimer, setCallTimer] = useState(0);
  const [callAudioMuted, setCallAudioMuted] = useState(false);
  const callIntervalRef = useRef<any>(null);

  // Dynamic user details
  const userNameDisplay = clerkUser?.username || clerkUser?.firstName || "Hacker";
  const userEmailDisplay = clerkUser?.primaryEmailAddress?.emailAddress || "guest@mockrithm.com";
  const userAvatarUrl = clerkUser?.imageUrl;

  // Ask for precise location via HTML5 Geolocation API and sync progress
  useEffect(() => {
    async function loadProgress() {
      if (!isLoaded) return;
      
      try {
        setLoading(true);
        let fetchedCountry = "United States";
        let fetchedCity = "San Francisco";

        if (isSignedIn && clerkUser) {
          const data = await getUserGamesProgress(
            clerkUser.id,
            clerkUser.fullName || clerkUser.firstName || "",
            clerkUser.primaryEmailAddress?.emailAddress || "",
            clerkUser.imageUrl || ""
          );
          setProgress(data.progress || {});
          setTotalXp(data.totalXp || 0);
          setClaimedAchievements(data.claimedAchievements || []);
          setFriendsList(data.gamesFriends || []);
          fetchedCountry = data.country || "United States";
          fetchedCity = data.city || "San Francisco";
          setUserLocation({ country: fetchedCountry, city: fetchedCity });
          
          if (data.gamesFriends && data.gamesFriends.length > 0) {
            setSelectedFriend(data.gamesFriends[0]);
          }
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
          const localClaimed = localStorage.getItem("mockrithm_claimed_achievements");
          if (localClaimed) {
            setClaimedAchievements(JSON.parse(localClaimed));
          }
        }

        // Ask for precise HTML5 browser geolocation
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              try {
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
                if (res.ok) {
                  const geoData = await res.json();
                  const countryName = geoData.countryName || "Pakistan";
                  const cityName = geoData.city || geoData.locality || "Lahore";
                  
                  setUserLocation({ country: countryName, city: cityName });
                  
                  if (isSignedIn && clerkUser) {
                    await saveUserLocation(clerkUser.id, countryName, cityName);
                  }
                }
              } catch (e) {
                console.error("Reverse geocoding lookup failed:", e);
              }
            },
            (err) => {
              console.warn("User declined geolocation permissions:", err.message);
            }
          );
        }

        // Load leaderboard database records
        const leaderRes = await getLeaderboardUsers();
        if (leaderRes.success && leaderRes.leaderboard) {
          setDbLeaderboard(leaderRes.leaderboard);
        }
      } catch (err) {
        console.error("Failed to load game stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Handle calling simulator tick timer
  useEffect(() => {
    if (callStatus === "connected") {
      callIntervalRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
      setCallTimer(0);
    }

    return () => {
      if (callIntervalRef.current) {
        clearInterval(callIntervalRef.current);
      }
    };
  }, [callStatus]);

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
  }, [activeGame, currentLevelNum]);

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

  // Calculate dynamic achievements shelf (110 achievements total)
  const getAchievements = (): Achievement[] => {
    const list: Achievement[] = [];
    
    // General achievements (12)
    const playList = Object.keys(progress);
    const anyPlayed = playList.some(k => progress[k].completedLevel > 0);
    const anyTen = playList.some(k => progress[k].completedLevel >= 10);
    const anyCent = playList.some(k => progress[k].completedLevel >= 100);
    const anyHalf = playList.some(k => progress[k].completedLevel >= 250);
    const anyApex = playList.some(k => progress[k].completedLevel >= 500);
    const unlockedBadges = playList.filter(k => progress[k].completedLevel > 0).length;
    
    list.push({ id: "first_syntax", title: "First Syntax", desc: "Clear Level 1 on any game stack.", target: "Level 1", current: anyPlayed ? 1 : 0, max: 1, completed: anyPlayed, xp: 50 });
    list.push({ id: "first_rank", title: "First Rank Up", desc: "Reach Level 10 on any game stack.", target: "Level 10", current: anyTen ? 10 : 0, max: 10, completed: anyTen, xp: 100 });
    list.push({ id: "century_club", title: "Century Club", desc: "Reach Level 100 on any game stack.", target: "Level 100", current: anyCent ? 100 : 0, max: 100, completed: anyCent, xp: 250 });
    list.push({ id: "halfway_there", title: "Halfway There", desc: "Reach Level 250 on any game stack.", target: "Level 250", current: anyHalf ? 250 : 0, max: 250, completed: anyHalf, xp: 400 });
    list.push({ id: "apex_dev", title: "Apex Developer", desc: "Reach Level 500 on any game stack.", target: "Level 500", current: anyApex ? 500 : 0, max: 500, completed: anyApex, xp: 600 });
    list.push({ id: "poly_1", title: "Polyglot I", desc: "Unlock 3 different badges.", target: "3 badges", current: Math.min(unlockedBadges, 3), max: 3, completed: unlockedBadges >= 3, xp: 150 });
    list.push({ id: "poly_2", title: "Polyglot II", desc: "Unlock 6 different badges.", target: "6 badges", current: Math.min(unlockedBadges, 6), max: 6, completed: unlockedBadges >= 6, xp: 300 });
    list.push({ id: "poly_3", title: "Polyglot III", desc: "Unlock 10 different badges.", target: "10 badges", current: Math.min(unlockedBadges, 10), max: 10, completed: unlockedBadges >= 10, xp: 500 });
    list.push({ id: "legend", title: "Citadel Legend", desc: "Claim 5 achievements.", target: "5 claimed", current: Math.min(claimedAchievements.length, 5), max: 5, completed: claimedAchievements.length >= 5, xp: 200 });
    list.push({ id: "god", title: "Citadel God", desc: "Claim 20 achievements.", target: "20 claimed", current: Math.min(claimedAchievements.length, 20), max: 20, completed: claimedAchievements.length >= 20, xp: 500 });
    list.push({ id: "social_1", title: "Socialite", desc: "Add 1 friend to your roster.", target: "1 friend", current: Math.min(friendsList.length, 1), max: 1, completed: friendsList.length >= 1, xp: 50 });
    list.push({ id: "social_2", title: "Squad Commander", desc: "Add 5 friends to your roster.", target: "5 friends", current: Math.min(friendsList.length, 5), max: 5, completed: friendsList.length >= 5, xp: 150 });

    // Language achievements (14 games * 7 = 98)
    GAMES_LIST.forEach(game => {
      const lvl = progress[game.id]?.completedLevel || 0;
      const tiers = [
        { lvl: 5, xp: 50, key: "novice", label: "Novice" },
        { lvl: 25, xp: 100, key: "apprentice", label: "Apprentice" },
        { lvl: 50, xp: 150, key: "acolyte", label: "Acolyte" },
        { lvl: 100, xp: 200, key: "expert", label: "Expert" },
        { lvl: 200, xp: 300, key: "master", label: "Master" },
        { lvl: 350, xp: 400, key: "grandmaster", label: "Grandmaster" },
        { lvl: 500, xp: 500, key: "conqueror", label: "Conqueror" }
      ];

      tiers.forEach(t => {
        list.push({
          id: `${game.id}_${t.key}`,
          title: `${t.label} ${game.name}`,
          desc: `Reach Level ${t.lvl} in ${game.name}.`,
          target: `Level ${t.lvl}`,
          current: Math.min(lvl, t.lvl),
          max: t.lvl,
          completed: lvl >= t.lvl,
          xp: t.xp
        });
      });
    });

    return list;
  };

  // Get completed but unclaimed achievements
  const getUnclaimedAchievementsCount = (): number => {
    const list = getAchievements();
    const unclaimed = list.filter(a => a.completed && !claimedAchievements.includes(a.id));
    return unclaimed.length;
  };

  // Claim achievement reward persistently
  const claimAchievementReward = async (achievementId: string, xpReward: number) => {
    if (claimedAchievements.includes(achievementId)) return;
    
    playSound("success");
    toast.success(`🏆 Achievement Unlocked! Claimed +${xpReward} XP!`);

    const nextClaimed = [...claimedAchievements, achievementId];
    setClaimedAchievements(nextClaimed);
    localStorage.setItem("mockrithm_claimed_achievements", JSON.stringify(nextClaimed));

    const nextTotalXp = totalXp + xpReward;
    setTotalXp(nextTotalXp);
    localStorage.setItem("mockrithm_games_xp", nextTotalXp.toString());

    if (isSignedIn && clerkUser) {
      try {
        await claimAchievementPersistent(clerkUser.id, achievementId, xpReward);
      } catch (err) {
        console.error("Failed to save achievement claim to DB:", err);
      }
    }
  };

  // Add friend to Social List persistently
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFriendInput.trim();
    if (!name) return;

    if (friendsList.includes(name)) {
      toast.error(`${name} is already in your friends list!`);
      return;
    }

    playSound("click");
    
    if (isSignedIn && clerkUser) {
      const res = await addFriendPersistent(clerkUser.id, name);
      if (res.success) {
        setFriendsList(res.friends || []);
        if (!selectedFriend) {
          setSelectedFriend(name);
        }
        toast.success(`Hacker ${name} added persistently to your list!`);
      } else {
        toast.error(res.error || "Failed to add friend");
      }
    } else {
      // Guest fallback
      setFriendsList(prev => [...prev, name]);
      if (!selectedFriend) {
        setSelectedFriend(name);
      }
      toast.success(`Hacker ${name} added to session list.`);
    }

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

    // Simulate automated replies from friends
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

  // Trigger calling simulator modal loop
  const triggerVoiceCall = (friendName: string) => {
    playSound("click");
    setActiveCallFriend(friendName);
    setCallStatus("calling");

    // After 2.5 seconds simulate friend picking up the call
    setTimeout(() => {
      setCallStatus("connected");
      playSound("success");
    }, 2500);
  };

  // Terminate voice call
  const terminateVoiceCall = () => {
    playSound("click");
    setCallStatus("ended");
    setActiveCallFriend(null);
  };

  // Format call timer display
  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Sound effects controller
  const playSound = (type: "success" | "click" | "fail") => {
    if (!soundEnabled) return;
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
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

  // Filtered Leaderboard computation using DB records (excludes fallbacks completely)
  const getFilteredLeaderboard = () => {
    const list = [...dbLeaderboard];
    
    // Ensure the current user's profile is in the list
    if (!list.some(r => r.name === userNameDisplay)) {
      list.push({ 
        name: userNameDisplay, 
        country: userLocation.country, 
        city: userLocation.city, 
        xp: totalXp, 
        badges: Object.keys(progress).length, 
        achievements: claimedAchievements.length, 
        avatar: userAvatarUrl || ""
      });
    }

    let filtered = list;
    if (leaderboardScope === "country") {
      filtered = list.filter(r => r.country.toLowerCase() === userLocation.country.toLowerCase());
    } else if (leaderboardScope === "city") {
      filtered = list.filter(r => r.city.toLowerCase() === userLocation.city.toLowerCase());
    }

    // Sort by selected metric
    filtered.sort((a, b) => (b[leaderboardMetric] || 0) - (a[leaderboardMetric] || 0));
    
    return filtered.map((row, idx) => ({ ...row, rank: idx + 1 }));
  };

  // Calculate highest unlocked level for current game
  const gameProgressObj = activeGame ? (progress[activeGame.id] || { completedLevel: 0, xp: 0 }) : { completedLevel: 0, xp: 0 };
  const maxUnlockedLevel = bypassLocks ? 500 : (gameProgressObj.completedLevel + 1 > 500 ? 500 : gameProgressObj.completedLevel + 1);

  // Clamp direct level selection to block skipping
  useEffect(() => {
    if (activeGame) {
      if (currentLevelNum > maxUnlockedLevel) {
        setCurrentLevelNum(maxUnlockedLevel);
      }
    }
  }, [activeGame, currentLevelNum]);

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

  const handleLevelCompletion = async () => {
    if (!activeGame || !activeLevelData) return;

    const gameId = activeGame.id;
    const completedLvl = currentLevelNum;
    const xpReward = 100;

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

    localStorage.setItem("mockrithm_games_progress", JSON.stringify(nextProgress));
    localStorage.setItem("mockrithm_games_xp", nextTotalXp.toString());

    if (isSignedIn && clerkUser) {
      try {
        await updateUserGamesProgress(
          clerkUser.id,
          gameId,
          completedLvl,
          xpReward,
          clerkUser.fullName || clerkUser.firstName || "",
          clerkUser.primaryEmailAddress?.emailAddress || "",
          clerkUser.imageUrl || ""
        );
      } catch (err) {
        console.error("Failed syncing progress to cloud database:", err);
      }
    }
  };

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
        } else if (tc.customCheck) {
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
        } else {
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

  const unclaimedCount = getUnclaimedAchievementsCount();

  return (
    <div className="flex h-screen bg-black text-white relative font-mona-sans overflow-hidden selection:bg-white selection:text-black">
      {/* Background Dots Grid */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />

      {/* Simulated Call Overlay Modal */}
      <AnimatePresence>
        {activeCallFriend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 z-50 flex flex-col justify-center items-center gap-8 backdrop-blur"
          >
            {/* Pulsing Visual waves */}
            <div className="relative flex justify-center items-center size-40">
              <span className={`absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/25 ${callStatus === "calling" || callStatus === "connected" ? "animate-ping" : ""}`} />
              <span className="absolute inset-4 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl shadow-xl">
                🎙️
              </span>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black uppercase font-mono tracking-wider">{activeCallFriend}</h3>
              <p className="text-xs font-mono tracking-widest text-zinc-550 uppercase">
                {callStatus === "calling" ? "Establishing connection..." : `Connected • ${formatCallTime(callTimer)}`}
              </p>
            </div>

            {/* Equalizer animation when connected */}
            {callStatus === "connected" && (
              <div className="flex gap-1.5 h-8 items-end">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <span key={i} className="w-1 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${20 + Math.random() * 60}%`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}

            {/* Controller tools */}
            <div className="flex gap-4">
              <button
                onClick={() => { playSound("click"); setCallAudioMuted(!callAudioMuted); }}
                className={`p-4 rounded-full border transition-all cursor-pointer ${
                  callAudioMuted ? "bg-zinc-800 border-zinc-700 text-red-400" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {callAudioMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>
              
              <button
                onClick={terminateVoiceCall}
                className="p-4 rounded-full bg-red-650 hover:bg-red-500 border border-red-700 text-white transition-all cursor-pointer flex items-center justify-center"
              >
                <PhoneOff className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Custom Sidebar Menu */}
      <div className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between h-full relative z-20">
        <div className="p-6 flex flex-col gap-6">
          {/* Logo & Back button */}
          <div>
            <Link 
              href="/" 
              className="flex items-center gap-1.5 text-[10px] font-mono font-black text-zinc-550 hover:text-white uppercase tracking-widest transition-all mb-4"
              onClick={() => playSound("click")}
            >
              <ArrowLeft className="size-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wider uppercase font-mono text-white">mockrithm</h2>
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
                <Play className="size-4" /> Play
              </span>
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("profile"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "profile" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <UserIcon className="size-4" /> Profile
              </span>
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("badges"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "badges" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Award className="size-4" /> Badges
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
              onClick={() => { playSound("click"); setActiveTab("friends"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "friends" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="size-4" /> Friends
              </span>
            </button>

            <button
              onClick={() => { playSound("click"); setActiveTab("social"); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                activeTab === "social" ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
              disabled={friendsList.length === 0}
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="size-4" /> Chat
              </span>
            </button>
          </nav>
        </div>

        {/* User Mini Profile Block */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt="Avatar" className="size-8 rounded-full border border-zinc-700 object-cover" />
            ) : (
              <div className="size-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-sm">
                {userNameDisplay[0]?.toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate text-white uppercase tracking-wide">
                {userNameDisplay}
              </h4>
              <p className="text-[8px] font-mono text-zinc-555 uppercase font-black">{totalXp} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 p-8">
        
        {/* Tab 1: Play Dashboard */}
        {activeTab === "dashboard" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            {!activeGame ? (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-8 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Games Dashboard</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight leading-none uppercase font-mono">
                      Mastery Arena
                    </h1>
                    <p className="text-xs text-zinc-400 max-w-xl">
                      Embark on syntax quests. Earn XP, claim badges, challenge friends, and climb the leaderboard.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-955 border border-zinc-900 p-3 rounded-2xl">
                    <button 
                      onClick={() => { playSound("click"); setSoundEnabled(!soundEnabled); }}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-850 text-zinc-450 hover:text-white transition-all cursor-pointer"
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
                <div className="bg-zinc-955/40 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden mb-6">
                  <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="size-4 text-zinc-400" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono">Dependency Tree</h3>
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
                              className="p-3 rounded-xl border border-zinc-855 bg-zinc-900/60 hover:border-zinc-500 hover:scale-105 flex flex-col items-center gap-2 text-center w-28 cursor-pointer transition-all"
                            >
                              <TechIcon name={game.iconName} className="size-5 text-white" />
                              <span className="text-[10px] font-bold truncate w-full">{game.name}</span>
                              <span className="text-[8px] font-mono text-zinc-550">{prog.completedLevel}/500</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Divider Line */}
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

                {/* Grid list cards */}
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
              /* Workspace UI */
              <div className="flex flex-col gap-6">
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
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-955 border border-zinc-900 hover:border-zinc-700 text-zinc-455 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
                    >
                      ◀
                    </button>
                    <div className="flex items-center gap-1 bg-zinc-955 border border-zinc-900 px-3 py-1.5 rounded-lg text-xs font-mono font-bold font-mono">
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
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-955 border border-zinc-900 hover:border-zinc-700 text-zinc-455 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <div className="lg:col-span-4 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1">
                    
                    {/* Prerequisite Recommended */}
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
                    <div className="bg-zinc-950/40 border border-zinc-905 rounded-2xl p-6 flex flex-col gap-4">
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
                        <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono font-mono">Validation Criteria</h4>
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
                          className="text-[10px] font-mono font-bold text-zinc-550 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase"
                        >
                          <HelpCircle className="size-4 text-zinc-500" /> {showHint ? "Hide Hint" : "Reveal Hint"}
                        </button>
                        <AnimatePresence>
                          {showHint && activeLevelData?.hints && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 bg-zinc-955 border border-zinc-900 rounded-xl p-3 text-[10.5px] text-zinc-455 leading-relaxed font-medium"
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

                    {/* Arena Ranks progress */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-mono font-bold text-zinc-455 uppercase tracking-widest font-mono">
                          Arena Ranks & Badges
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-550 uppercase font-black font-mono">PROGRESSIVE TITLES</span>
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
                                  : "bg-zinc-950/20 border-zinc-955 opacity-30"
                              }`}
                            >
                              {isActive && (
                                <span className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${badge.color}`} />
                              )}
                              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${isUnlocked ? badge.color : "from-zinc-900 to-zinc-955"} border border-white/5`}>
                                {isUnlocked ? (
                                  <Award className="size-3.5 text-white" />
                                ) : (
                                  <Lock className="size-3.5 text-zinc-655" />
                                )}
                              </div>
                              <span className="text-[7.5px] font-bold uppercase tracking-wider text-zinc-300 truncate w-full mt-2 leading-none">{badge.tier}</span>
                              <span className="text-[7px] font-mono text-zinc-550 leading-none mt-1">{badge.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Previews Output */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-mono font-bold text-zinc-455 uppercase tracking-widest">
                          Live Sandbox Output
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-655 uppercase font-black font-mono">COMPILING ON-THE-FLY</span>
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
                                  <th className="p-2 text-zinc-550 font-bold font-mono">id</th>
                                  <th className="p-2 text-zinc-550 font-bold font-mono">name</th>
                                  <th className="p-2 text-zinc-555 font-bold font-mono">level</th>
                                  <th className="p-2 text-zinc-555 font-bold font-mono">class</th>
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
                            <div className="flex-1 overflow-y-auto space-y-1 bg-black p-3 border border-zinc-900 rounded-lg max-h-40 font-mono">
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
                            <Code2 className="size-8 text-zinc-655 animate-pulse" />
                            <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest font-bold">Standard Console</span>
                            <p className="text-[10px] text-zinc-555 max-w-[200px] leading-relaxed">
                              Your script evaluations will execute inside sandboxed unit test assertions. Output will print below.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Monaco Editor Pane */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col">
                      <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/80 border-b border-zinc-900">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest font-mono">
                          SOURCE CODE WORKSPACE
                        </span>
                        <button
                          onClick={() => { playSound("click"); setEditorCode(activeLevelData?.starterCode || ""); }}
                          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-455 hover:text-white transition-all cursor-pointer"
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

                    {/* Console test logger */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest font-mono font-mono">
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

        {/* Tab 2: Profile Stats Board */}
        {activeTab === "profile" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">My Profile</h2>
              <p className="text-xs text-zinc-550 mt-1">Review live metadata parameters, language clearance profiles, and milestone claims.</p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
              
              {/* User Avatar */}
              <div className="relative shrink-0">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt="User Avatar" className="size-32 rounded-3xl border border-zinc-800 object-cover shadow-xl" />
                ) : (
                  <div className="size-32 rounded-3xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl font-mono font-bold shadow-xl">
                    {userNameDisplay[0]?.toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-black border border-black flex items-center justify-center">
                  <Activity className="size-4" />
                </span>
              </div>

              {/* Dossier Specifications */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <span className="text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full bg-zinc-900 border border-white/5 text-zinc-400 uppercase tracking-widest">
                    ACTIVE PARAMETER
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1.5 uppercase font-mono tracking-wide">{userNameDisplay}</h3>
                  <p className="text-xs text-zinc-505 mt-1 font-mono font-semibold">{userEmailDisplay}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono font-bold text-zinc-650 uppercase tracking-wider block font-mono">Global Score</span>
                    <span className="text-base font-black text-white font-mono">{totalXp} XP</span>
                  </div>

                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono font-bold text-zinc-650 uppercase tracking-wider block font-mono">Completed Levels</span>
                    <span className="text-base font-black text-white font-mono">
                      {Object.keys(progress).reduce((acc, k) => acc + (progress[k]?.completedLevel || 0), 0)} / 7000
                    </span>
                  </div>

                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl col-span-2 md:col-span-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-655 uppercase tracking-wider block font-mono">Location</span>
                    <span className="text-[11px] font-bold text-zinc-300 truncate block mt-0.5 font-mono">{userLocation.city}, {userLocation.country}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges showcase section inside Profile */}
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest font-mono">My Badges</h3>
              <div className="flex flex-wrap gap-3">
                {GAMES_LIST.map((game) => {
                  const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                  const isUnlocked = gameProg.completedLevel > 0;
                  const tier = getTierName(gameProg.completedLevel);
                  return (
                    <div 
                      key={game.id} 
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs transition-all ${
                        isUnlocked 
                          ? "bg-zinc-900/60 border-zinc-800 text-white" 
                          : "bg-zinc-950/20 border-zinc-955 text-zinc-650 opacity-40"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg bg-gradient-to-br ${isUnlocked ? game.gradient : "from-zinc-900 to-zinc-950"} border border-white/5`}>
                        <TechIcon name={game.iconName} className="size-3.5" />
                      </div>
                      <div>
                        <div className="font-bold font-mono text-[10px]">{game.name}</div>
                        <div className="text-[8px] text-zinc-500 uppercase font-mono">{isUnlocked ? `${tier} (Lvl ${gameProg.completedLevel})` : "Locked"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language Progress matrix */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-450 font-mono flex items-center gap-2 font-mono">
                <FileCode className="size-4" /> Language Progression
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GAMES_LIST.map((game) => {
                  const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                  const pct = Math.round((gameProg.completedLevel / 500) * 100);
                  const isStarted = gameProg.completedLevel > 0;

                  return (
                    <div 
                      key={game.id}
                      className={`p-5 rounded-2xl border bg-zinc-950/20 flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-300 ${
                        isStarted ? "border-zinc-800" : "border-zinc-905 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${game.gradient} border border-white/5`}>
                          <TechIcon name={game.iconName} className="size-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono">{game.name}</h4>
                          <span className="text-[8px] font-mono text-zinc-550 uppercase font-black">{game.theme}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 mt-4">
                        <div className="flex justify-between text-[8px] font-mono text-zinc-555 font-bold font-mono">
                          <span>LEVEL {gameProg.completedLevel}/500</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${game.gradient}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Badges Matrix catalog */}
        {activeTab === "badges" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6 mb-4">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Unlocked Badges</h2>
              <p className="text-xs text-zinc-550 mt-1 font-semibold font-mono">Earn badges by completing lessons inside target language stacks.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {GAMES_LIST.map((game) => {
                const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                const isUnlocked = gameProg.completedLevel > 0;
                const tier = getTierName(gameProg.completedLevel);
                const pct = Math.round((gameProg.completedLevel / 500) * 100);

                return (
                  <div 
                    key={game.id}
                    className={`p-6 rounded-2xl border flex flex-col justify-between h-48 relative overflow-hidden transition-all duration-300 ${
                      isUnlocked 
                        ? "bg-zinc-900/60 border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.02)]" 
                        : "bg-zinc-950/20 border-zinc-905 opacity-30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${isUnlocked ? game.gradient : "from-zinc-900 to-zinc-950"} border border-white/5`}>
                        <TechIcon name={game.iconName} className="size-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase font-mono">{game.name}</h4>
                        <span className="text-[8px] font-mono text-zinc-550 uppercase font-black">{isUnlocked ? tier : "Locked"}</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-450 mt-3 leading-normal font-mono">{game.theme}</p>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[8px] font-mono text-zinc-550 font-bold font-mono">
                        <span>Lvl {gameProg.completedLevel}/500</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${isUnlocked ? game.gradient : "from-zinc-900 to-zinc-950"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Achievements shelf */}
        {activeTab === "achievements" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6 mb-4">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Achievements</h2>
              <p className="text-xs text-zinc-550 mt-1 font-mono">Clear levels on programming sandboxes to unlock credentials. Claim unlocked achievements to collect XP.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAchievements().map((ach) => {
                const isClaimed = claimedAchievements.includes(ach.id);
                const pct = Math.round((ach.current / ach.max) * 100);

                return (
                  <div 
                    key={ach.id}
                    className={`relative rounded-2xl border p-5 bg-zinc-955/40 flex flex-col justify-between h-44 transition-all duration-300 ${
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
                          <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase leading-none font-mono">CLAIMED</span>
                        ) : ach.completed ? (
                          <button
                            onClick={() => claimAchievementReward(ach.id, ach.xp)}
                            className="text-[8.5px] font-mono font-black text-black bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-full uppercase transition-all cursor-pointer flex items-center gap-1 shadow-lg"
                          >
                            <Award className="size-3" /> CLAIM
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase leading-none font-mono">LOCKED</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-450 mt-2.5 leading-relaxed font-mono">{ach.desc}</p>
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

        {/* Tab 5: Leaderboards */}
        {activeTab === "leaderboard" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-905 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Leaderboards</h2>
              <p className="text-xs text-zinc-550 mt-1 font-semibold">Compare achievements, XP parameters, and badge completions against regional, country, or global hackers.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-zinc-955 p-4 border border-zinc-900 rounded-2xl">
              <div className="flex gap-2">
                {[
                  { value: "world", label: "World" },
                  { value: "country", label: userLocation.country },
                  { value: "city", label: userLocation.city }
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
                  <tr className="border-b border-zinc-900 bg-zinc-955 text-zinc-400 font-mono text-[10px] uppercase">
                    <th className="p-4 font-bold">Rank</th>
                    <th className="p-4 font-bold">Hacker</th>
                    <th className="p-4 font-bold font-mono">Country</th>
                    <th className="p-4 font-bold font-mono">City</th>
                    <th className="p-4 font-bold text-center">Badges</th>
                    <th className="p-4 font-bold text-center">Achievements</th>
                    <th className="p-4 font-bold text-right font-mono">XP Score</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLeaderboard().map((row) => {
                    const isCurrentUser = row.name === userNameDisplay;
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
                          {isCurrentUser && userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="Avatar" className="size-6 rounded-full object-cover border border-zinc-800" />
                          ) : row.avatar ? (
                            <img src={row.avatar} alt="Avatar" className="size-6 rounded-full object-cover border border-zinc-800" />
                          ) : (
                            <div className="size-6 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center text-[10px] border border-zinc-700">
                              {row.name[0]?.toUpperCase()}
                            </div>
                          )}
                          <span className={isCurrentUser ? "text-emerald-400" : "text-white"}>{row.name}</span>
                          {isCurrentUser && (
                            <span className="text-[7.5px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">YOU</span>
                          )}
                        </td>
                        <td className="p-4 text-zinc-400 font-mono">{row.country}</td>
                        <td className="p-4 text-zinc-505 font-mono">{row.city}</td>
                        <td className="p-4 text-center font-mono text-zinc-350">{row.badges}</td>
                        <td className="p-4 text-center font-mono text-zinc-350">{row.achievements}</td>
                        <td className="p-4 text-right font-mono font-black text-white">{row.xp}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Friends List */}
        {activeTab === "friends" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-905 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Friends</h2>
              <p className="text-xs text-zinc-500 mt-1">Connect with other developers and start voice calls.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Friends lists */}
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xs font-mono font-bold text-zinc-450 uppercase tracking-widest">Contact List</h3>
                
                {friendsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {friendsList.map(friend => (
                      <div key={friend} className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between transition-all hover:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xs font-bold text-zinc-300 font-mono">
                            {friend[0]?.toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase font-mono">{friend}</h4>
                            <span className="text-[7.5px] font-mono text-zinc-550 uppercase font-black">Online</span>
                          </div>
                        </div>

                        <button
                          onClick={() => triggerVoiceCall(friend)}
                          className="p-2 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-black border border-zinc-800 hover:border-emerald-600 text-zinc-400 transition-all cursor-pointer flex items-center justify-center"
                        >
                          <Phone className="size-3.5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-950/20 border border-dashed border-zinc-900 rounded-2xl p-8 text-center text-zinc-550 text-xs italic">
                    Your friends list is currently empty. Add users using the sidebar form to persist contacts.
                  </div>
                )}
              </div>

              {/* Add friend card */}
              <div className="bg-zinc-955/40 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-4 h-fit">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Add Contact</h4>
                  <p className="text-[10px] text-zinc-550 leading-relaxed mt-1">Type the username of a registered user to add them persistently.</p>
                </div>

                <form onSubmit={handleAddFriend} className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Username..."
                    value={newFriendInput}
                    onChange={(e) => setNewFriendInput(e.target.value)}
                    className="bg-black border border-zinc-900 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-700 text-xs text-white"
                  />
                  <button 
                    type="submit"
                    className="py-2 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                  >
                    <Plus className="size-4" /> Add Friend
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Chat channel */}
        {activeTab === "social" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 h-[80vh]">
            <div className="border-b border-zinc-900 pb-6 shrink-0">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Chat</h2>
              <p className="text-xs text-zinc-500 mt-1 font-semibold font-mono">Send secure direct messages to your added contacts.</p>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
              
              {/* Friends Left Selector */}
              <div className="w-64 border border-zinc-900 rounded-2xl bg-zinc-955/40 p-4 flex flex-col gap-4 shrink-0">
                <h3 className="text-[10px] font-mono font-bold text-zinc-450 uppercase tracking-widest">Select Contact</h3>
                
                <div className="flex flex-col gap-1.5 overflow-y-auto pr-1">
                  {friendsList.map(friend => {
                    const isActive = selectedFriend === friend;
                    return (
                      <button
                        key={friend}
                        onClick={() => { playSound("click"); setSelectedFriend(friend); }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                          isActive ? "bg-zinc-900 text-white font-bold" : "text-zinc-455 hover:bg-zinc-900/40 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-xs">
                          {friend}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Panel */}
              <div className="flex-1 border border-zinc-905 rounded-2xl bg-zinc-955/40 flex flex-col justify-between overflow-hidden">
                {/* Chat Header */}
                <div className="px-5 py-4 bg-zinc-955 border-b border-zinc-900 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase font-mono text-white">Direct Message: {selectedFriend || "No Contact Selected"}</h3>
                  <span className="text-[9px] font-mono text-zinc-555 uppercase font-black">Connected</span>
                </div>

                {/* Message Log */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 min-h-0">
                  {selectedFriend && (messages[selectedFriend] || []).length > 0 ? (
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
                          <span className="text-[7.5px] font-mono text-zinc-650 mt-1 select-none font-mono">{msg.time}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-655 italic text-[10px] font-mono">
                      {selectedFriend ? "Send a message to open the secure timeline connection." : "Select a contact from the left panel to begin chatting."}
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendChatMessage} className="p-4 bg-zinc-955 border-t border-zinc-900 flex gap-2 shrink-0">
                  <input
                    type="text"
                    disabled={!selectedFriend}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={selectedFriend ? `Type message to ${selectedFriend}...` : "Select a contact first..."}
                    className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2.5 focus:outline-none focus:border-zinc-650 text-xs text-white disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!selectedFriend}
                    className="px-4 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-white disabled:opacity-50"
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
