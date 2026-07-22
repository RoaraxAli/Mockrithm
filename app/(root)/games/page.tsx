"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FileCode, Palette, Zap, Shield, Layers, Cpu, Sparkles, Compass,
  Database, Server, GitBranch, Terminal as TerminalIcon, Wind, ShieldAlert,
  Play, Lock, CheckCircle, HelpCircle, ArrowLeft, ArrowRight, Award, BookOpen,
  Code2, RotateCcw, AlertCircle, MessageSquare, Users, Trophy,
  Plus, Send, User as UserIcon, Activity, Phone, PhoneOff, Mic, MicOff,
  MapPin, ChevronDown, Music, Volume2, VolumeX, List, Star, Gamepad2, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { GAMES_LIST, generateLevel, LevelData, GameInfo } from "@/lib/gamesData";
import {
  getUserGamesProgress, updateUserGamesProgress, saveUserLocation,
  saveUserSoundPreference, claimAchievementPersistent, addFriendPersistent,
  getLeaderboardUsers, GameProgress,
  sendFriendRequest, acceptFriendRequest, declineFriendRequest
} from "@/lib/actions/games.action";
import { checkUsernameUnique, updateUsername } from "@/lib/actions/username.action";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

import GitGame from "@/components/games/GitGame";
import LivePreview from "@/components/games/LivePreview";
const FrogCssGameRunner = dynamic(() => import("@/components/games/FrogCssGameRunner").then(m => m.FrogCssGameRunner), { ssr: false });
import Footer from "@/components/shared/Footer";
import { ECertificateModal } from "@/components/games/ECertificateModal";
import { VerifyCertificateModal } from "@/components/games/VerifyCertificateModal";

// --- Country → valid cities map for location validation ---
const COUNTRY_CITIES: Record<string, string[]> = {
  "Pakistan": ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar","Quetta","Sialkot","Hyderabad","Gujranwala","Bahawalpur","Sargodha","Sukkur","Larkana","Abbottabad","Mardan","Mingora","Dera Ghazi Khan","Sahiwal"],
  "India": ["Mumbai","Delhi","Bangalore","Hyderabad","Ahmedabad","Chennai","Kolkata","Surat","Pune","Jaipur","Lucknow","Kanpur","Nagpur","Visakhapatnam","Bhopal","Patna","Vadodara","Ludhiana","Agra","Nashik"],
  "United States": ["New York","Los Angeles","Chicago","Houston","Phoenix","Philadelphia","San Antonio","San Diego","Dallas","San Jose","Austin","Jacksonville","Fort Worth","Columbus","Charlotte","Indianapolis","San Francisco","Seattle","Denver","Nashville","Oklahoma City","El Paso","Washington","Las Vegas","Louisville","Memphis","Portland","Baltimore","Milwaukee","Albuquerque"],
  "United Kingdom": ["London","Birmingham","Manchester","Leeds","Glasgow","Liverpool","Sheffield","Bristol","Edinburgh","Leicester","Bradford","Cardiff","Coventry","Nottingham","Kingston upon Hull","Newcastle upon Tyne","Stoke-on-Trent","Southampton","Brighton","Wolverhampton"],
  "Canada": ["Toronto","Montreal","Vancouver","Calgary","Edmonton","Ottawa","Quebec City","Winnipeg","Hamilton","Kitchener","London","Halifax","Victoria","Windsor","Oshawa","Saskatoon","Regina","St. Catharines","Barrie","Kelowna"],
  "Australia": ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Gold Coast","Newcastle","Canberra","Wollongong","Hobart","Geelong","Townsville","Cairns","Darwin","Toowoomba","Ballarat","Bendigo","Launceston","Mackay","Rockhampton"],
  "Germany": ["Berlin","Hamburg","Munich","Cologne","Frankfurt","Stuttgart","Düsseldorf","Dortmund","Essen","Leipzig","Bremen","Dresden","Hanover","Nuremberg","Duisburg","Bochum","Wuppertal","Bielefeld","Bonn","Münster"],
  "France": ["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille","Rennes","Reims","Saint-Étienne","Toulon","Le Havre","Grenoble","Dijon","Angers","Nîmes","Villeurbanne"],
  "Japan": ["Tokyo","Yokohama","Osaka","Nagoya","Sapporo","Fukuoka","Kobe","Kyoto","Kawasaki","Saitama","Hiroshima","Sendai","Kitakyushu","Chiba","Sakai","Niigata","Hamamatsu","Shizuoka","Sagamihara","Okayama"],
  "China": ["Shanghai","Beijing","Guangzhou","Shenzhen","Chongqing","Tianjin","Wuhan","Chengdu","Nanjing","Xi'an","Hangzhou","Shenyang","Harbin","Suzhou","Qingdao","Jinan","Zhengzhou","Changchun","Kunming","Dalian"],
  "Brazil": ["São Paulo","Rio de Janeiro","Brasília","Salvador","Fortaleza","Belo Horizonte","Manaus","Curitiba","Recife","Porto Alegre","Belém","Goiânia","Guarulhos","Campinas","São Luís","São Gonçalo","Maceió","Duque de Caxias","Natal","Teresina"],
  "South Africa": ["Johannesburg","Cape Town","Durban","Pretoria","Port Elizabeth","Bloemfontein","East London","Polokwane","Nelspruit","Kimberley","Welkom","Rustenburg","George","Pietermaritzburg","Vanderbijlpark"],
  "Mexico": ["Mexico City","Guadalajara","Monterrey","Puebla","Tijuana","León","Juárez","Torreón","Querétaro","San Luis Potosí","Mérida","Mexicali","Aguascalientes","Cali","Acapulco","Morelia","Chihuahua","Tampico","Veracruz","Culiacán"],
  "Nigeria": ["Lagos","Kano","Ibadan","Abuja","Port Harcourt","Benin City","Kaduna","Maiduguri","Zaria","Aba","Enugu","Ogbomosho","Onitsha","Sokoto","Ilorin","Warri","Abeokuta","Owerri","Jos","Calabar"],
  "Turkey": ["Istanbul","Ankara","Izmir","Bursa","Adana","Gaziantep","Konya","Antalya","Kayseri","Mersin","Eskişehir","Diyarbakır","Samsun","Denizli","Şanlıurfa","Adapazarı","Malatya","Gebze","Trabzon","Kahramanmaraş"],
  "Russia": ["Moscow","Saint Petersburg","Novosibirsk","Yekaterinburg","Kazan","Chelyabinsk","Omsk","Samara","Rostov-on-Don","Ufa","Volgograd","Krasnoyarsk","Voronezh","Perm","Saratov","Krasnodar","Tolyatti","Tyumen","Izhevsk","Barnaul"],
  "Argentina": ["Buenos Aires","Córdoba","Rosario","Mendoza","La Plata","San Miguel de Tucumán","Mar del Plata","Salta","Santa Fe","San Juan","Resistencia","Corrientes","Neuquén","Posadas","Santiago del Estero","Bahía Blanca","Paraná"],
  "Indonesia": ["Jakarta","Surabaya","Bandung","Bekasi","Medan","Tangerang","Depok","Semarang","Palembang","Makassar","South Tangerang","Batam","Bogor","Pekanbaru","Bandar Lampung","Padang","Malang","Samarinda","Tasikmalaya","Pontianak"],
  "South Korea": ["Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju","Suwon","Ulsan","Changwon","Goyang","Yongin","Seongnam","Bucheon","Cheongju","Ansan","Jeonju","Anyang","Cheonan","Pohang","Wonju"],
  "Saudi Arabia": ["Riyadh","Jeddah","Mecca","Medina","Dammam","Hufuf","Khamis Mushait","Tabuk","Buraidah","Qatif","Khobar","Abha","Najran","Al-Ahsa","Jizan","Al Jubail"],
  "UAE": ["Dubai","Abu Dhabi","Sharjah","Al Ain","Ajman","Ras Al Khaimah","Fujairah","Umm Al Quwain"],
  "Netherlands": ["Amsterdam","Rotterdam","The Hague","Utrecht","Eindhoven","Tilburg","Groningen","Almere","Breda","Nijmegen","Apeldoorn","Haarlem","Arnhem","Zaanstad","Amersfoort","Enschede","Haarlemmermeer","Zwolle","Zoetermeer"],
  "Spain": ["Madrid","Barcelona","Valencia","Seville","Zaragoza","Málaga","Murcia","Palma","Las Palmas de Gran Canaria","Bilbao","Alicante","Córdoba","Valladolid","Vigo","Gijón","Hospitalet de Llobregat","Vitoria-Gasteiz","Coruña","Granada","Oviedo"],
  "Italy": ["Rome","Milan","Naples","Turin","Palermo","Genoa","Bologna","Florence","Bari","Catania","Venice","Verona","Messina","Padua","Trieste","Taranto","Brescia","Prato","Reggio Calabria","Modena"],
  "Poland": ["Warsaw","Kraków","Łódź","Wrocław","Poznań","Gdańsk","Szczecin","Bydgoszcz","Lublin","Białystok","Katowice","Gdynia","Częstochowa","Radom","Sosnowiec","Toruń","Kielce","Gliwice","Zabrze","Bytom"],
  "Bangladesh": ["Dhaka","Chittagong","Sylhet","Rajshahi","Khulna","Comilla","Mymensingh","Narayanganj","Gazipur","Barishal"],
  "Egypt": ["Cairo","Alexandria","Giza","Shubra El-Kheima","Port Said","Suez","Luxor","Aswan","Asyut","Mansoura"],
  "Kenya": ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Malindi","Kitale","Garissa","Kakamega"],
  "Ghana": ["Accra","Kumasi","Tamale","Takoradi","Ashaiman","Sunyani","Cape Coast","Obuasi","Tema","Koforidua"],
  "Philippines": ["Manila","Quezon City","Caloocan","Davao","Cebu City","Zamboanga","Taguig","Antipolo","Pasig","Cagayan de Oro","Parañaque","Valenzuela","Las Piñas","Makati","Muntinlupa","Marikina","San Jose del Monte","Bacolod","General Santos","Calamba"],
  "Malaysia": ["Kuala Lumpur","George Town","Johor Bahru","Ipoh","Shah Alam","Petaling Jaya","Kota Kinabalu","Kuching","Seremban","Melaka"],
  "Thailand": ["Bangkok","Nonthaburi","Pak Kret","Hat Yai","Chiang Mai","Phitsanulok","Klaeng","Udon Thani","Khon Kaen","Nakhon Ratchasima"],
  "Vietnam": ["Ho Chi Minh City","Hanoi","Da Nang","Hai Phong","Bien Hoa","Hue","Nha Trang","Can Tho","Rach Gia","Long Xuyen"],
  "Sweden": ["Stockholm","Gothenburg","Malmö","Uppsala","Sollentuna","Västerås","Örebro","Linköping","Helsingborg","Jönköping"],
  "Norway": ["Oslo","Bergen","Trondheim","Stavanger","Bærum","Drammen","Fredrikstad","Kristiansand","Sandnes","Tromsø"],
  "Denmark": ["Copenhagen","Aarhus","Odense","Aalborg","Frederiksberg","Esbjerg","Randers","Kolding","Horsens","Vejle"],
  "Finland": ["Helsinki","Espoo","Tampere","Vantaa","Turku","Oulu","Jyväskylä","Lahti","Kuopio","Kouvola"],
  "Switzerland": ["Zurich","Geneva","Basel","Bern","Lausanne","Winterthur","Lucerne","St. Gallen","Lugano","Biel"],
  "Belgium": ["Brussels","Antwerp","Ghent","Charleroi","Liège","Bruges","Namur","Leuven","Mons","Aalst"],
  "Portugal": ["Lisbon","Porto","Vila Nova de Gaia","Amadora","Braga","Setúbal","Coimbra","Funchal","Almada","Aveiro"],
  "Greece": ["Athens","Thessaloniki","Patras","Piraeus","Larissa","Heraklion","Peristeri","Kallithea","Acharnes","Kalamaria"],
};

const SOUND_OPTIONS = [
  { id: "chime", label: "Chime", icon: "🔔" },
  { id: "synth", label: "Synth Wave", icon: "🎵" },
  { id: "retro", label: "Retro Beep", icon: "👾" },
  { id: "piano", label: "Piano", icon: "🎹" },
  { id: "off", label: "Silent", icon: "🔇" }
];

// --- Icon map ---
const TechIcon = ({ name, className }: { name: string; className?: string }) => {
  // Map our iconName/game properties to real Devicon CDN logo URLs
  const logoUrls: Record<string, string> = {
    "FileCode": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", // HTML5
    "Palette": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", // CSS3
    "Zap": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", // JS
    "Shield": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg", // TS
    "Layers": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg", // React
    "Cpu": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg", // Node
    "Sparkles": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg", // Next.js
    "Compass": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", // Python
    "Database": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg", // SQL
    "Server": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg", // Django/FastAPI
    "GitBranch": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", // Git
    "Container": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", // Docker
    "Wind": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg", // Tailwind
    "ShieldAlert": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg" // Security
  };

  const url = logoUrls[name];
  if (url) {
    return <img src={url} alt={name} className={`${className} select-none`} />;
  }

  return <Code2 className={className} />;
};

// --- Markdown renderer ---
function renderMarkdown(text: string) {
  if (!text) return null;
  return text.split("\n").map((line, idx) => {
    if (line.startsWith("### ")) return <h4 key={idx} className="text-xs font-black tracking-wider text-white uppercase mt-4 mb-2 font-mono">{line.replace("### ", "")}</h4>;
    if (line.startsWith("## ")) return <h3 key={idx} className="text-sm font-black tracking-wider text-white uppercase mt-4 mb-2 font-mono">{line.replace("## ", "")}</h3>;
    let content: React.ReactNode = line;
    if (line.includes("**")) {
      const parts = line.split("**");
      content = parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{p}</strong> : p);
    }
    if (line.startsWith("- ")) return <li key={idx} className="text-[11px] text-zinc-400 list-disc ml-4 mt-1 font-medium font-mono">{content}</li>;
    return <p key={idx} className="text-[11px] text-zinc-400 leading-relaxed mt-2 font-medium">{content}</p>;
  });
}

function renderCodeExample(codeBlock: string) {
  if (!codeBlock) return null;
  const clean = codeBlock.replace(/```[a-zA-Z0-9]*\n/, "").replace(/\n```$/, "");
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 my-3 font-mono text-[10px] text-zinc-300 overflow-x-auto whitespace-pre">
      <code>{clean}</code>
    </div>
  );
}

interface Achievement {
  id: string; title: string; desc: string; target: string;
  current: number; max: number; completed: boolean; xp: number;
}

// --- View states ---
type View = "dashboard" | "game-detail" | "game-runner";

function GamesPageContent() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoSrc("/bg.mp4");
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sidebar tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "achievements" | "leaderboard" | "social" | "profile" | "friends" | "badges">(() => {
    const tab = searchParams.get("tab");
    if (tab && ["dashboard", "achievements", "leaderboard", "social", "profile", "friends", "badges"].includes(tab)) {
      return tab as any;
    }
    return "dashboard";
  });

  // Game navigation
  const [gameView, setGameView] = useState<View>(() => {
    const gView = searchParams.get("view");
    if (gView && ["dashboard", "game-detail", "game-runner"].includes(gView)) {
      return gView as View;
    }
    return "dashboard";
  });

  const [activeGame, setActiveGame] = useState<GameInfo | null>(() => {
    const gId = searchParams.get("game");
    if (gId) {
      const match = GAMES_LIST.find(g => g.id === gId);
      return match || null;
    }
    return null;
  });

  const [currentLevelNum, setCurrentLevelNum] = useState<number>(() => {
    const lvl = searchParams.get("level");
    if (lvl) {
      const parsed = parseInt(lvl, 10);
      return isNaN(parsed) ? 1 : parsed;
    }
    return 1;
  });

  const [activeLevelData, setActiveLevelData] = useState<LevelData | null>(null);

  // Sync state changes back to search query parameters dynamically
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    params.set("view", gameView);
    if (activeGame) {
      params.set("game", activeGame.id);
    }
    if (gameView === "game-runner") {
      params.set("level", currentLevelNum.toString());
    }
    router.replace(`/games?${params.toString()}`, { scroll: false });
  }, [activeTab, gameView, activeGame, currentLevelNum, router]);

  // Progress
  const [progress, setProgress] = useState<Record<string, GameProgress>>({});
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certModalData, setCertModalData] = useState<{
    userName: string;
    gameName: string;
    gameTheme?: string;
    gameId: string;
    levelReached: number;
  } | null>(null);

  const openCertificate = (game: GameInfo, level: number) => {
    playSound("success");
    setCertModalData({
      userName: clerkUser?.fullName || clerkUser?.firstName || clerkUser?.primaryEmailAddress?.emailAddress?.split("@")[0] || "Developer Candidate",
      gameName: game.name,
      gameTheme: game.theme,
      gameId: game.id,
      levelReached: Math.max(level, 10),
    });
    setIsCertModalOpen(true);
  };

  const [showVerifyCertModal, setShowVerifyCertModal] = useState(false);

  // Location onboarding modal
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationCountry, setLocationCountry] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationError, setLocationError] = useState("");
  const [locationSaving, setLocationSaving] = useState(false);

  // User location (confirmed)
  const [userLocation, setUserLocation] = useState({ country: "", city: "" });

  // Sound
  const [soundPreference, setSoundPreference] = useState("chime");
  const [showSoundDropdown, setShowSoundDropdown] = useState(false);
  const soundDropRef = useRef<HTMLDivElement>(null);

  // Social
  const [leaderboardScope, setLeaderboardScope] = useState<"world" | "country" | "city">("world");
  const [leaderboardMetric, setLeaderboardMetric] = useState<"xp" | "badges" | "achievements">("xp");
  const [dbLeaderboard, setDbLeaderboard] = useState<any[]>([]);
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [newFriendInput, setNewFriendInput] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Record<string, { id?: string; sender: "user" | "friend"; text: string; time: string; status?: string }[]>>({});

  // Real-time friend request & presence states
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [friendsPresence, setFriendsPresence] = useState<Record<string, { status: string; lastActive: any }>>({});

  // Editor
  const [editorCode, setEditorCode] = useState("");
  const [previewDoc, setPreviewDoc] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [sqlTableData, setSqlTableData] = useState<any[]>([]);
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([]);
  const [gitCommandInput, setGitCommandInput] = useState("");
  const [gitState, setGitState] = useState({ initialized: false, staged: [] as string[], committed: [] as string[], commits: [] as { id: string; message: string }[] });

  const [dbUsername, setDbUsername] = useState("");
  const [showUsernameClaimModal, setShowUsernameClaimModal] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameClaimError, setUsernameClaimError] = useState("");
  const [usernameClaiming, setUsernameClaiming] = useState(false);

  const finalUsername = dbUsername || clerkUser?.username || clerkUser?.firstName || "User";
  const userNameDisplay = finalUsername;
  const userEmailDisplay = clerkUser?.primaryEmailAddress?.emailAddress || "guest@mockrithm.com";
  const userAvatarUrl = clerkUser?.imageUrl;

  // --- Load progress from Firestore ---
  useEffect(() => {
    async function loadProgress() {
      if (!isLoaded) return;
      try {
        setLoading(true);
        if (isSignedIn && clerkUser) {
          const data = await getUserGamesProgress(
            clerkUser.id, clerkUser.fullName || clerkUser.firstName || "",
            clerkUser.primaryEmailAddress?.emailAddress || "", clerkUser.imageUrl || ""
          );
           setProgress(data.progress || {});
          setTotalXp(data.totalXp || 0);
          setClaimedAchievements(data.claimedAchievements || []);
          setFriendsList(data.gamesFriends || []);
          setSoundPreference(data.soundPreference || "chime");
          setDbUsername(data.username || "");
          
          if (data.usernameClaimed !== true) {
            setShowUsernameClaimModal(true);
          }

          if (data.locationSet && data.country) {
            setUserLocation({ country: data.country, city: data.city });
          } else {
            // Show location onboarding modal on first visit
            setShowLocationModal(true);
          }

          if (data.gamesFriends?.length > 0) setSelectedFriend(data.gamesFriends[0]);
        } else {
          const localProgress = localStorage.getItem("mockrithm_games_progress");
          const localXp = localStorage.getItem("mockrithm_games_xp");
          if (localProgress) setProgress(JSON.parse(localProgress));
          if (localXp) setTotalXp(parseInt(localXp, 10));
          const localClaimed = localStorage.getItem("mockrithm_claimed_achievements");
          if (localClaimed) setClaimedAchievements(JSON.parse(localClaimed));
          // Guest: show modal
          setShowLocationModal(true);
        }

        const leaderRes = await getLeaderboardUsers();
        if (leaderRes.success && leaderRes.leaderboard) setDbLeaderboard(leaderRes.leaderboard);
      } catch (err) {
        console.error("Failed to load game stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [isLoaded, isSignedIn, clerkUser]);

  // --- Close sound dropdown on outside click ---
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (soundDropRef.current && !soundDropRef.current.contains(e.target as Node)) {
        setShowSoundDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce check username uniqueness
  useEffect(() => {
    if (!usernameInput.trim()) {
      setUsernameAvailable(null);
      return;
    }
    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const res = await checkUsernameUnique(usernameInput);
        setUsernameAvailable(res.isUnique);
      } catch (err) {
        setUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameInput]);

  const handleClaimUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !usernameAvailable || checkingUsername || !clerkUser) return;

    setUsernameClaiming(true);
    setUsernameClaimError("");
    try {
      const res = await updateUsername(clerkUser.id, usernameInput);
      if (res.success) {
        toast.success("Unique username claimed successfully!");
        setDbUsername(usernameInput.trim().toLowerCase());
        setShowUsernameClaimModal(false);
      } else {
        setUsernameClaimError(res.error || "Failed to claim username.");
      }
    } catch (err: any) {
      setUsernameClaimError(err.message || "Failed to claim username.");
    } finally {
      setUsernameClaiming(false);
    }
  };

  // --- Real-time Friends List Sync ---
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return;

    const listenUserDoc = async () => {
      const { doc, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      return onSnapshot(doc(db, "users", clerkUser.id), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const fl = data.gamesFriends || [];
          setFriendsList(fl);
          setSelectedFriend(prev => {
            if (prev === "__global__") return prev;
            if (!prev && fl.length > 0) return fl[0];
            return prev;
          });
        }
      }, (err) => {
        console.error("Friends list listener error:", err);
      });
    };

    let unsub: any;
    listenUserDoc().then(u => unsub = u);
    return () => { if (unsub) unsub(); };
  }, [isLoaded, isSignedIn, clerkUser]);

  // --- Real-time Friends Presence Sync ---
  useEffect(() => {
    if (!isSignedIn || friendsList.length === 0) {
      setFriendsPresence({});
      return;
    }

    const listenPresence = async () => {
      const { collection, query, where, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      const q = query(collection(db, "users"), where("name", "in", friendsList.slice(0, 30)));
      return onSnapshot(q, (snapshot) => {
        const presence: Record<string, { status: string; lastActive: any }> = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          presence[data.name] = {
            status: data.status || "offline",
            lastActive: data.lastActive
          };
        });
        setFriendsPresence(presence);
      }, (err) => {
        console.error("Friends presence listener error:", err);
      });
    };

    let unsub: any;
    listenPresence().then(u => unsub = u);
    return () => { if (unsub) unsub(); };
  }, [friendsList, isSignedIn]);

  // --- Real-time Friend Requests Sync ---
  useEffect(() => {
    if (!isSignedIn || !userNameDisplay) return;

    const listenRequests = async () => {
      const { collection, query, where, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      const qRec = query(
        collection(db, "friendRequests"),
        where("receiverUsername", "==", userNameDisplay),
        where("status", "==", "pending")
      );
      const unsubRec = onSnapshot(qRec, (snapshot) => {
        setReceivedRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.error("Received requests listener error:", err);
      });

      const qSent = query(
        collection(db, "friendRequests"),
        where("senderUsername", "==", userNameDisplay),
        where("status", "==", "pending")
      );
      const unsubSent = onSnapshot(qSent, (snapshot) => {
        setSentRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => {
        console.error("Sent requests listener error:", err);
      });

      return () => {
        unsubRec();
        unsubSent();
      };
    };

    let unsub: any;
    listenRequests().then(u => unsub = u);
    return () => { if (unsub) unsub(); };
  }, [userNameDisplay, isSignedIn]);

  // --- Real-time Chat Messages Sync ---
  useEffect(() => {
    if (!isSignedIn || !selectedFriend || !userNameDisplay) return;

    const listenMessages = async () => {
      const { collection, query, where, orderBy, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      const isGlobal = selectedFriend === "__global__";
      const chatId = isGlobal ? "global" : [userNameDisplay, selectedFriend].sort().join("_");

      const q = query(
        collection(db, "messages"),
        where("chatId", "==", chatId),
        orderBy("timestamp", "asc")
      );

      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          const t = data.timestamp?.toDate?.() || new Date();
          const timeStr = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return {
            id: doc.id,
            sender: data.sender === userNameDisplay ? ("user" as const) : ("friend" as const),
            text: data.text || "",
            time: timeStr,
            status: data.status,
            timestamp: t
          };
        });

        setMessages(prev => ({
          ...prev,
          [selectedFriend]: list
        }));

        // Mark incoming messages as read/seen in Firestore
        if (!isGlobal) {
          const unreadDocs = snapshot.docs.filter(doc => {
            const data = doc.data();
            return data.sender === selectedFriend && data.receiver === userNameDisplay && data.status !== "seen";
          });

          if (unreadDocs.length > 0) {
            import("firebase/firestore").then(async ({ doc, updateDoc }) => {
              for (const uDoc of unreadDocs) {
                await updateDoc(doc(db, "messages", uDoc.id), { status: "seen" });
              }
            });
          }
        }
      }, (err) => {
        console.error("Chat messages listener error:", err);
      });
    };

    let unsub: any;
    listenMessages().then(u => unsub = u);
    return () => { if (unsub) unsub(); };
  }, [selectedFriend, userNameDisplay, isSignedIn]);

  const getStatusIndicator = (friendName: string) => {
    const presence = friendsPresence[friendName];
    if (!presence) return { color: "bg-zinc-600", label: "offline" };
    
    const lastActiveTime = presence.lastActive?.toDate?.()?.getTime() || 0;
    const isRecent = Date.now() - lastActiveTime < 15000;
    
    if (presence.status === "offline" || !isRecent) {
      return { color: "bg-zinc-600", label: "offline" };
    }
    if (presence.status === "interview") {
      return { color: "bg-amber-500 animate-pulse", label: "in interview" };
    }
    return { color: "bg-emerald-500 animate-pulse", label: "online" };
  };

  // --- Level data load ---
  useEffect(() => {
    if (activeGame && gameView === "game-runner") {
      const levelData = generateLevel(activeGame.id, currentLevelNum);
      setActiveLevelData(levelData);
      setEditorCode(levelData.starterCode);
      // Initialize preview content
      if (activeGame.id === "html5" || activeGame.id === "tailwind") {
        setPreviewDoc(levelData.starterCode);
      } else if (activeGame.id === "css3") {
        setPreviewDoc(`<style>${levelData.starterCode}</style><div style="padding: 20px; color: black; font-family: sans-serif;"><h3>CSS Sandbox Live Preview</h3><div class="visual-box" style="margin-top: 10px; width: 100px; height: 100px; background: grey; border: 1px solid black; display: flex; align-items: center; justify-content: center; font-size: 10px;">Styled Box</div></div>`);
      } else {
        setPreviewDoc(`<div style="padding: 20px; color: black; font-family: sans-serif;"><h3>Sandbox Live Preview</h3><p style="font-size: 11px;">Active language: <strong>${activeGame.name}</strong></p></div>`);
      }
      setShowHint(false);
      setEvalLogs([]);
      setEvaluationSuccess(null);
      if (activeGame.id === "git") resetGitMockRepo();
    }
  }, [activeGame, currentLevelNum, gameView]);

  const gameProgressObj = activeGame ? (progress[activeGame.id] || { completedLevel: 0, xp: 0 }) : { completedLevel: 0, xp: 0 };
  const gameMaxLvl = 100;
  const maxUnlockedLevel = gameProgressObj.completedLevel + 1 > gameMaxLvl ? gameMaxLvl : gameProgressObj.completedLevel + 1;
  const canGoNext = currentLevelNum < maxUnlockedLevel || evaluationSuccess === true;

  // --- Location validation ---
  const validateLocation = (country: string, city: string): string => {
    const trimmedCountry = country.trim();
    const trimmedCity = city.trim();
    if (!trimmedCountry) return "Please enter your country.";
    if (!trimmedCity) return "Please enter your city.";

    // Basic character validation - only letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-'.]+$/;
    if (!nameRegex.test(trimmedCountry)) return "Country name contains invalid characters.";
    if (!nameRegex.test(trimmedCity)) return "City name contains invalid characters.";

    // Find country (case-insensitive)
    const matchedCountry = Object.keys(COUNTRY_CITIES).find(
      c => c.toLowerCase() === trimmedCountry.toLowerCase()
    );

    if (!matchedCountry) {
      return `"${trimmedCountry}" is not a recognized country. Please check spelling.`;
    }

    // Find city in that country (case-insensitive)
    const validCities = COUNTRY_CITIES[matchedCountry];
    const matchedCity = validCities.find(
      c => c.toLowerCase() === trimmedCity.toLowerCase()
    );

    if (!matchedCity) {
      return `"${trimmedCity}" is not a known city in ${matchedCountry}. Please check spelling or use a major city name.`;
    }

    return ""; // valid
  };

  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateLocation(locationCountry, locationCity);
    if (error) { setLocationError(error); return; }

    const matchedCountry = Object.keys(COUNTRY_CITIES).find(c => c.toLowerCase() === locationCountry.trim().toLowerCase())!;
    const validCities = COUNTRY_CITIES[matchedCountry];
    const matchedCity = validCities.find(c => c.toLowerCase() === locationCity.trim().toLowerCase())!;

    setLocationSaving(true);
    setUserLocation({ country: matchedCountry, city: matchedCity });

    if (isSignedIn && clerkUser) {
      await saveUserLocation(clerkUser.id, matchedCountry, matchedCity);
    }

    setLocationSaving(false);
    setShowLocationModal(false);
    toast.success(`Location set to ${matchedCity}, ${matchedCountry}!`);
  };

  // --- Sound ---
  const handleSoundChange = async (soundId: string) => {
    playSound("click", soundId);
    setSoundPreference(soundId);
    setShowSoundDropdown(false);
    if (isSignedIn && clerkUser) {
      await saveUserSoundPreference(clerkUser.id, soundId);
    }
  };

  // --- Sound engine with 5 profiles ---
  const playSound = (type: "success" | "click" | "fail", overrideProfile?: string) => {
    const profile = overrideProfile || soundPreference;
    if (profile === "off") return;
    if (typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (profile === "chime") {
        if (type === "success") {
          osc.type = "sine"; osc.frequency.setValueAtTime(523.25, ctx.currentTime); osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
        } else if (type === "fail") {
          osc.type = "sine"; osc.frequency.setValueAtTime(220, ctx.currentTime); osc.frequency.setValueAtTime(180, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
        } else {
          osc.type = "sine"; osc.frequency.setValueAtTime(660, ctx.currentTime);
          gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
          osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
        }
      } else if (profile === "synth") {
        osc.type = "square";
        if (type === "success") { osc.frequency.setValueAtTime(440, ctx.currentTime); osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.2); }
        else if (type === "fail") { osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.setValueAtTime(100, ctx.currentTime + 0.2); }
        else { osc.frequency.setValueAtTime(440, ctx.currentTime); }
        gain.gain.setValueAtTime(0.07, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
      } else if (profile === "retro") {
        osc.type = "square";
        if (type === "success") { osc.frequency.setValueAtTime(300, ctx.currentTime); osc.frequency.setValueAtTime(600, ctx.currentTime + 0.05); osc.frequency.setValueAtTime(900, ctx.currentTime + 0.1); }
        else if (type === "fail") { osc.frequency.setValueAtTime(150, ctx.currentTime); osc.frequency.setValueAtTime(75, ctx.currentTime + 0.1); }
        else { osc.frequency.setValueAtTime(400, ctx.currentTime); }
        gain.gain.setValueAtTime(0.06, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
      } else if (profile === "piano") {
        osc.type = "triangle";
        if (type === "success") { osc.frequency.setValueAtTime(523.25, ctx.currentTime); osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2); osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.4); }
        else if (type === "fail") { osc.frequency.setValueAtTime(261.63, ctx.currentTime); }
        else { osc.frequency.setValueAtTime(523.25, ctx.currentTime); }
        gain.gain.setValueAtTime(0.12, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) { /* audio blocked */ }
  };

  // --- SQL mock reset ---
  const resetSqlMockTable = () => setSqlTableData([
    { id: 1, name: "Galahad", level: 12, class: "Knight", experience: 4500 },
    { id: 2, name: "Merlin", level: 25, class: "Mage", experience: 9800 },
    { id: 3, name: "Arthur", level: 50, class: "Grandmaster", experience: 25000 },
    { id: 4, name: "Percival", level: 8, class: "Apprentice", experience: 1200 },
    { id: 5, name: "Lancelot", level: 38, class: "Warlord", experience: 18000 }
  ]);

  // --- Git mock reset ---
  const resetGitMockRepo = () => {
    setGitState({ initialized: false, staged: [], committed: [], commits: [] });
    setGitTerminalLogs(["Git workspace initialized.", "Type 'help' to see available commands."]);
    setGitCommandInput("");
  };

  // --- Achievements (110 total) ---
  const getAchievements = (): Achievement[] => {
    const list: Achievement[] = [];
    const playList = Object.keys(progress);
    const anyPlayed = playList.some(k => progress[k]?.completedLevel > 0);
    const anyTen = playList.some(k => progress[k]?.completedLevel >= 10);
    const anyCent = playList.some(k => progress[k]?.completedLevel >= 100);
    const unlockedBadges = playList.filter(k => progress[k]?.completedLevel > 0).length;

    list.push({ id: "first_syntax", title: "First Syntax", desc: "Clear Level 1 on any game.", target: "Level 1", current: anyPlayed ? 1 : 0, max: 1, completed: anyPlayed, xp: 50 });
    list.push({ id: "first_rank", title: "First Rank Up", desc: "Reach Level 10 on any game.", target: "Level 10", current: anyTen ? 10 : 0, max: 10, completed: anyTen, xp: 100 });
    list.push({ id: "century_club", title: "Century Club", desc: "Reach Level 100 on any game.", target: "Level 100", current: anyCent ? 100 : 0, max: 100, completed: anyCent, xp: 250 });
    list.push({ id: "apex_dev", title: "Apex Developer", desc: "Complete all 100 levels on any game.", target: "Level 100", current: anyCent ? 100 : 0, max: 100, completed: anyCent, xp: 600 });
    list.push({ id: "poly_1", title: "Polyglot I", desc: "Unlock 3 different badges.", target: "3 badges", current: Math.min(unlockedBadges, 3), max: 3, completed: unlockedBadges >= 3, xp: 150 });
    list.push({ id: "poly_2", title: "Polyglot II", desc: "Unlock 6 different badges.", target: "6 badges", current: Math.min(unlockedBadges, 6), max: 6, completed: unlockedBadges >= 6, xp: 300 });
    list.push({ id: "poly_3", title: "Polyglot III", desc: "Unlock all 9 badges.", target: "9 badges", current: Math.min(unlockedBadges, 9), max: 9, completed: unlockedBadges >= 9, xp: 500 });
    list.push({ id: "legend", title: "Getting Started", desc: "Claim 5 achievements.", target: "5 claimed", current: Math.min(claimedAchievements.length, 5), max: 5, completed: claimedAchievements.length >= 5, xp: 200 });
    list.push({ id: "god", title: "Achievement Hunter", desc: "Claim 20 achievements.", target: "20 claimed", current: Math.min(claimedAchievements.length, 20), max: 20, completed: claimedAchievements.length >= 20, xp: 500 });
    list.push({ id: "social_1", title: "First Contact", desc: "Add 1 friend.", target: "1 friend", current: Math.min(friendsList.length, 1), max: 1, completed: friendsList.length >= 1, xp: 50 });
    list.push({ id: "social_2", title: "Squad Goals", desc: "Add 5 friends.", target: "5 friends", current: Math.min(friendsList.length, 5), max: 5, completed: friendsList.length >= 5, xp: 150 });

    GAMES_LIST.forEach(game => {
      const lvl = progress[game.id]?.completedLevel || 0;
      [
        { lvl: 5, xp: 50, key: "novice", label: "Novice" },
        { lvl: 25, xp: 100, key: "apprentice", label: "Apprentice" },
        { lvl: 50, xp: 150, key: "acolyte", label: "Acolyte" },
        { lvl: 100, xp: 200, key: "expert", label: "Expert" }
      ].forEach(t => {
        list.push({
          id: `${game.id}_${t.key}`, title: `${t.label}: ${game.name}`,
          desc: `Reach Level ${t.lvl} in ${game.name}.`, target: `Level ${t.lvl}`,
          current: Math.min(lvl, t.lvl), max: t.lvl, completed: lvl >= t.lvl, xp: t.xp
        });
      });
    });

    return list;
  };

  const getUnclaimedCount = () => getAchievements().filter(a => a.completed && !claimedAchievements.includes(a.id)).length;

  const claimAchievementReward = async (id: string, xp: number) => {
    if (claimedAchievements.includes(id)) return;
    playSound("success");
    toast.success(`Achievement unlocked! +${xp} XP`);
    const next = [...claimedAchievements, id];
    setClaimedAchievements(next);
    setTotalXp(p => p + xp);
    if (isSignedIn && clerkUser) await claimAchievementPersistent(clerkUser.id, id, xp);
  };

  // --- Friend requests & social handlers ---
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFriendInput.trim();
    if (!name) return;
    if (friendsList.includes(name)) { toast.error(`${name} is already in your friends list.`); return; }
    if (name === userNameDisplay) { toast.error("You cannot add yourself."); return; }

    playSound("click");
    if (isSignedIn && clerkUser) {
      const res = await sendFriendRequest(clerkUser.id, userNameDisplay, name);
      if (res.success) {
        toast.success(`Friend request sent to ${name}!`);
        setNewFriendInput("");
      } else {
        toast.error(res.error || "Failed to send friend request.");
      }
    } else {
      toast.error("Please sign in to add friends.");
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    playSound("click");
    if (isSignedIn && clerkUser) {
      const res = await acceptFriendRequest(clerkUser.id, userNameDisplay, requestId);
      if (res.success) {
        toast.success("Friend request accepted!");
      } else {
        toast.error(res.error || "Failed to accept friend request.");
      }
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    playSound("click");
    if (isSignedIn && clerkUser) {
      const res = await declineFriendRequest(clerkUser.id, requestId);
      if (res.success) {
        toast.info("Friend request declined.");
      } else {
        toast.error(res.error || "Failed to decline friend request.");
      }
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    playSound("click");
    if (isSignedIn && clerkUser) {
      const res = await declineFriendRequest(clerkUser.id, requestId);
      if (res.success) {
        toast.info("Friend request cancelled.");
      } else {
        toast.error(res.error || "Failed to cancel friend request.");
      }
    }
  };

  // --- Persistent Chat ---
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || !selectedFriend) return;
    
    playSound("click");
    setChatInput("");
    
    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      const isGlobal = selectedFriend === "__global__";
      const chatId = isGlobal ? "global" : [userNameDisplay, selectedFriend].sort().join("_");
      
      let initialStatus = "sent";
      if (!isGlobal) {
        const friendPres = friendsPresence[selectedFriend];
        const isOnline = friendPres && friendPres.status !== "offline" && (Date.now() - (friendPres.lastActive?.toDate?.()?.getTime() || Date.now()) < 15000);
        if (isOnline) {
          initialStatus = "delivered";
        }
      }

      await addDoc(collection(db, "messages"), {
        chatId,
        sender: userNameDisplay,
        receiver: isGlobal ? "global" : selectedFriend,
        text,
        timestamp: serverTimestamp(),
        status: initialStatus
      });

      if (!isGlobal) {
        triggerSimulatedReply(selectedFriend, text);
      }
    } catch (err: any) {
      console.error("Chat send error:", err);
      toast.error("Failed to send message.");
    }
  };

  const triggerSimulatedReply = (friendName: string, userMessageText: string) => {
    const presence = friendsPresence[friendName];
    if (!presence) return;

    const lastActiveTime = presence.lastActive?.toDate?.()?.getTime() || 0;
    const isRecent = Date.now() - lastActiveTime < 15000;
    const isOnline = presence.status === "online" && isRecent;

    if (!isOnline) {
      console.log(`Friend ${friendName} is offline or busy. No auto-reply.`);
      return;
    }

    setTimeout(async () => {
      try {
        const replies = [
          "Nice work!",
          "How's the code going?",
          "Which level are you on?",
          "Let's team up soon!",
          "Keep pushing!",
          "That's awesome! Code on!",
          "Interesting... Tell me more."
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];

        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
        const { db } = await import("@/firebase/client");

        await addDoc(collection(db, "messages"), {
          chatId: [userNameDisplay, friendName].sort().join("_"),
          sender: friendName,
          receiver: userNameDisplay,
          text: reply,
          timestamp: serverTimestamp(),
          status: "sent"
        });

        playSound("success");
      } catch (err) {
        console.error("Simulated reply error:", err);
      }
    }, 2000);
  };

  // --- Voice Call Trigger ---
  const placeCall = async (friend: string) => {
    playSound("click");
    const indicator = getStatusIndicator(friend);
    if (indicator.label === "offline") {
      toast.error(`${friend} is offline. Call cannot be placed.`);
      return;
    }
    if (indicator.label === "in interview") {
      toast.error(`${friend} is busy in a mock interview.`);
      return;
    }

    try {
      const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/firebase/client");

      await addDoc(collection(db, "calls"), {
        caller: userNameDisplay,
        receiver: friend,
        status: "ringing",
        createdAt: serverTimestamp()
      });
      toast.success(`Calling ${friend}...`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to place call.");
    }
  };

  const formatCallTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // --- Level completion ---
  const handleLevelCompletion = async () => {
    if (!activeGame) return;
    const gameId = activeGame.id;
    const xpReward = 100;
    const currentP = progress[gameId] || { completedLevel: 0, xp: 0 };
    // Only advance progress completedLevel if we completed the next unlocked level
    const isNewCompletion = currentLevelNum > currentP.completedLevel;
    const nextCompletedLevel = isNewCompletion ? currentLevelNum : currentP.completedLevel;
    let nextXp = currentP.xp;
    let nextTotalXp = totalXp;
    if (isNewCompletion) {
      nextXp += xpReward;
      nextTotalXp += xpReward;
    }
    const nextProgress = { ...progress, [gameId]: { completedLevel: nextCompletedLevel, xp: nextXp } };
    setProgress(nextProgress);
    setTotalXp(nextTotalXp);
    localStorage.setItem("mockrithm_games_progress", JSON.stringify(nextProgress));
    localStorage.setItem("mockrithm_games_xp", nextTotalXp.toString());
    if (isSignedIn && clerkUser) {
      await updateUserGamesProgress(
        clerkUser.id,
        gameId,
        isNewCompletion ? currentLevelNum : currentP.completedLevel,
        isNewCompletion ? xpReward : 0,
        clerkUser.fullName || "",
        clerkUser.primaryEmailAddress?.emailAddress || "",
        clerkUser.imageUrl || ""
      );
    }
  };

  const runCodeOnly = () => {
    if (!activeGame) return;
    playSound("click");
    setEvalLogs(["Running code...", "Code execution complete.", "Output preview refreshed."]);
    setEvaluationSuccess(null);
    if (activeGame.id === "html5" || activeGame.id === "tailwind") {
      setPreviewDoc(editorCode);
    } else if (activeGame.id === "css3") {
      setPreviewDoc(`<style>${editorCode}</style><div style="padding: 20px; color: black; font-family: sans-serif;"><h3>CSS Sandbox Live Preview</h3><div class="visual-box" style="margin-top: 10px; width: 100px; height: 100px; background: grey; border: 1px solid black; display: flex; align-items: center; justify-content: center; font-size: 10px;">Styled Box</div></div>`);
    }
  };

  // --- Code evaluation ---
  const evaluateCode = () => {
    if (!activeLevelData) return;
    playSound("click");
    setEvalLogs(["Running test cases..."]);
    const { testCases } = activeLevelData.validation;
    let allPassed = true;
    const results: string[] = [];
    try {
      testCases.forEach((tc, idx) => {
        const desc = tc.description || tc.name || `Test ${idx + 1}`;
        if (tc.testRegex) {
          const rx = new RegExp(tc.testRegex, "i");
          if (rx.test(editorCode)) results.push(`✔️ ${desc}`);
          else { results.push(`❌ ${desc}`); allPassed = false; }
        } else if (tc.customCheck) {
          try {
            const checkFn = eval(tc.customCheck);
            if (checkFn(editorCode) === tc.expected || checkFn(editorCode) === true) results.push(`✔️ ${desc}`);
            else { results.push(`❌ ${desc}`); allPassed = false; }
          } catch (e: any) { results.push(`❌ ${desc}: ${e.message}`); allPassed = false; }
        } else {
          try {
            const fn = new Function(editorCode.replace(/export\s+default\s+/g, "") + `\nreturn processData(${(tc.input || []).map((x: any) => JSON.stringify(x)).join(",")});`);
            const result = fn();
            if (result === tc.expected) results.push(`✔️ ${desc}`);
            else { results.push(`❌ ${desc}: expected ${tc.expected}, got ${result}`); allPassed = false; }
          } catch (e: any) { results.push(`❌ Exception: ${e.message}`); allPassed = false; }
        }
      });
    } catch (e: any) { results.push(`❌ Crash: ${e.message}`); allPassed = false; }

    setEvalLogs(results);
    setEvaluationSuccess(allPassed);
    if (allPassed) {
      playSound("success");
      if (activeGame && (currentLevelNum === 10 || currentLevelNum >= 10)) {
        toast.success(`🎓 Level ${currentLevelNum} Complete! E-Certificate Unlocked!`, {
          action: {
            label: "View Certificate",
            onClick: () => openCertificate(activeGame, Math.max(currentLevelNum, (progress[activeGame.id]?.completedLevel || 0) + 1))
          }
        });
      } else {
        toast.success("Level complete! Great job.");
      }
      handleLevelCompletion();
    }
    else { playSound("fail"); toast.error("Some tests failed. Check the output below."); }
  };

  // --- Next/Prev level ---
  const handleNextLevel = () => {
    if (currentLevelNum >= gameMaxLvl) {
      toast.info(`You finished all ${gameMaxLvl} levels!`);
      setGameView("dashboard");
      return;
    }
    if (!canGoNext) {
      toast.error("Pass the current level first!");
      return;
    }
    playSound("click");
    setCurrentLevelNum(p => p + 1);
  };

  const handlePrevLevel = () => { playSound("click"); if (currentLevelNum > 1) setCurrentLevelNum(p => p - 1); };

  const handleSelectLevel = (num: number) => {
    if (isNaN(num) || num < 1) return;
    if (num > maxUnlockedLevel) { toast.error(`Level ${num} is locked.`); return; }
    playSound("click");
    setCurrentLevelNum(num);
  };

  // --- Git terminal ---
  const handleGitCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const line = gitCommandInput.trim();
    if (!line) return;
    playSound("click");
    setGitTerminalLogs(prev => [...prev, `$ ${line}`]);
    setGitCommandInput("");
    const parts = line.split(/\s+/);
    const cmd = parts[0];
    if (cmd === "clear") { setGitTerminalLogs([]); return; }
    if (cmd === "help") { setGitTerminalLogs(prev => [...prev, "git init | git status | git add <file> | git commit -m 'msg' | git log"]); return; }
    if (cmd !== "git") { setGitTerminalLogs(prev => [...prev, `command not found: ${cmd}`]); return; }
    const sub = parts[1];
    if (!sub) { setGitTerminalLogs(prev => [...prev, "Usage: git <command>"]); return; }
    if (sub === "init") { setGitState(p => ({ ...p, initialized: true })); setGitTerminalLogs(prev => [...prev, "Initialized empty Git repository in ./git/"]); return; }
    if (!gitState.initialized) { setGitTerminalLogs(prev => [...prev, "fatal: not a git repository"]); return; }
    if (sub === "status") { setGitTerminalLogs(prev => [...prev, `On branch main\n${gitState.staged.length ? "Changes staged for commit:\n\tsrc/app.js" : "nothing to commit"}`]); return; }
    if (sub === "add") { setGitState(p => ({ ...p, staged: ["src/app.js"] })); setGitTerminalLogs(prev => [...prev, "staged: src/app.js"]); return; }
    if (sub === "commit") {
      const msg = parts.slice(3).join(" ").replace(/['"]/g, "");
      if (parts[2] !== "-m" || !msg) { setGitTerminalLogs(prev => [...prev, "error: requires -m 'message'"]); return; }
      if (!gitState.staged.length) { setGitTerminalLogs(prev => [...prev, "nothing to commit"]); return; }
      const id = Math.random().toString(16).substring(2, 9);
      setGitState(p => ({ ...p, staged: [], commits: [...p.commits, { id, message: msg }] }));
      setGitTerminalLogs(prev => [...prev, `[main ${id}] ${msg}`]);
      return;
    }
    if (sub === "log") {
      if (!gitState.commits.length) { setGitTerminalLogs(prev => [...prev, "No commits yet"]); return; }
      setGitTerminalLogs(prev => [...prev, ...gitState.commits.map(c => `commit ${c.id}\n    ${c.message}`)]);
      return;
    }
    setGitTerminalLogs(prev => [...prev, `git: '${sub}' is not a git command`]);
  };

  // --- Leaderboard data ---
  const getFilteredLeaderboard = () => {
    const list = [...dbLeaderboard];
    if (!list.some(r => r.name === userNameDisplay)) {
      list.push({ name: userNameDisplay, country: userLocation.country, city: userLocation.city, xp: totalXp, badges: Object.keys(progress).filter(k => (progress[k]?.completedLevel || 0) > 0).length, achievements: claimedAchievements.length, avatar: userAvatarUrl || "" });
    }
    let filtered = list;
    if (leaderboardScope === "country") filtered = list.filter(r => r.country?.toLowerCase() === userLocation.country?.toLowerCase());
    else if (leaderboardScope === "city") filtered = list.filter(r => r.city?.toLowerCase() === userLocation.city?.toLowerCase());
    return filtered.sort((a, b) => (b[leaderboardMetric] || 0) - (a[leaderboardMetric] || 0)).map((r, i) => ({ ...r, rank: i + 1 }));
  };

  const unclaimedCount = getUnclaimedCount();
  const currentSoundOption = SOUND_OPTIONS.find(s => s.id === soundPreference) || SOUND_OPTIONS[0];

  // ====================================================
  // RENDER
  // ====================================================
  return (
    <div className="flex h-screen bg-black text-white relative font-mona-sans overflow-hidden selection:bg-white selection:text-black">
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />

      {/* === UNIQUE USERNAME CLAIM MODAL === */}
      <AnimatePresence>
        {showUsernameClaimModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] bg-black/95 backdrop-blur flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <UserIcon className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase font-mono tracking-tight text-white">Claim Unique Username</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Choose your unique handle to join chats and make friends.</p>
                </div>
              </div>

              <form onSubmit={handleClaimUsername} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Username</label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={e => {
                      setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
                      setUsernameClaimError("");
                    }}
                    placeholder="e.g. tech_ninja"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700 font-mono"
                  />
                  {checkingUsername && (
                    <span className="text-[9px] text-zinc-500 font-mono mt-1 block">Checking availability...</span>
                  )}
                  {!checkingUsername && usernameAvailable === true && (
                    <span className="text-[9px] text-emerald-400 font-mono mt-1 block">✓ Username is available!</span>
                  )}
                  {!checkingUsername && usernameAvailable === false && (
                    <span className="text-[9px] text-rose-500 font-mono mt-1 block">✗ Username is taken or invalid. Use alphanumeric & underscores (3-20 chars).</span>
                  )}
                </div>

                {usernameClaimError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-400 font-mono leading-relaxed">{usernameClaimError}</p>
                  </div>
                )}

                <button type="submit" disabled={usernameClaiming || !usernameAvailable || checkingUsername}
                  className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer">
                  {usernameClaiming ? "Claiming..." : "Claim Username"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === LOCATION ONBOARDING MODAL === */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <MapPin className="size-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase font-mono tracking-tight">Set Your Location</h2>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Used for leaderboard rankings — one time setup.</p>
                </div>
              </div>

              <form onSubmit={handleLocationSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">Country</label>
                  <input
                    type="text"
                    value={locationCountry}
                    onChange={e => { setLocationCountry(e.target.value); setLocationError(""); }}
                    placeholder="e.g. Pakistan"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5">City</label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={e => { setLocationCity(e.target.value); setLocationError(""); }}
                    placeholder="e.g. Karachi"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-zinc-600 placeholder:text-zinc-700"
                  />
                </div>

                {locationError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-400 font-mono leading-relaxed">{locationError}</p>
                  </div>
                )}

                <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
                  Your location is validated against known cities. If your city is not listed, use the nearest major city in your country.
                </p>

                <button type="submit" disabled={locationSaving}
                  className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer">
                  {locationSaving ? "Saving..." : "Confirm Location"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* === LEFT SIDEBAR === */}
      {!(activeTab === "dashboard" && gameView === "game-runner") && (
        <div className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between h-full relative z-20">
          <div className="p-6 flex flex-col gap-6">
          <div>
            <Link href="/" className="flex items-center gap-1.5 text-[10px] font-mono font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-all mb-4"
              onClick={() => playSound("click")}>
              <ArrowLeft className="size-3.5" /> Back to Home
            </Link>
            <h2 className="text-sm font-black tracking-wider uppercase font-mono text-white">Mockrithm</h2>
          </div>

          <nav className="flex flex-col gap-1.5">
            {[
              { id: "dashboard", label: "Play", icon: Play },
              { id: "profile", label: "Profile", icon: UserIcon },
              { id: "badges", label: "Badges", icon: Award },
              { id: "achievements", label: "Achievements", icon: Trophy, badge: unclaimedCount },
              { id: "leaderboard", label: "Leaderboards", icon: Layers },
              { id: "friends", label: "Friends", icon: Users },
              { id: "social", label: "Chat", icon: MessageSquare },
              { id: "verify-cert", label: "Verify Cert", icon: ShieldCheck }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id}
                  onClick={() => {
                    if (!(item as any).disabled) {
                      playSound("click");
                      if (item.id === "verify-cert") {
                        setShowVerifyCertModal(true);
                        return;
                      }
                      setActiveTab(item.id as any);
                      if (item.id === "dashboard") { setGameView("dashboard"); setActiveGame(null); }
                    }
                  }}
                  disabled={(item as any).disabled}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${
                    isActive ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  } disabled:opacity-30 disabled:cursor-not-allowed`}>
                  <span className="flex items-center gap-2 relative">
                    <Icon className="size-4" /> {item.label}
                    {item.badge ? (
                      <span className="absolute -top-1 -right-3 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    ) : null}
                  </span>
                  {item.badge ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white leading-none">{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sound selector + user mini profile */}
        <div className="p-6 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-3">
          {/* Sound dropdown */}
          <div className="relative" ref={soundDropRef}>
            <button onClick={() => setShowSoundDropdown(!showSoundDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Music className="size-3.5" /> {currentSoundOption.icon} {currentSoundOption.label}
              </span>
              <ChevronDown className={`size-3.5 transition-transform ${showSoundDropdown ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showSoundDropdown && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute bottom-full mb-1 left-0 right-0 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-30">
                  {SOUND_OPTIONS.map(option => (
                    <button key={option.id} onClick={() => handleSoundChange(option.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                        soundPreference === option.id ? "bg-white text-black" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      }`}>
                      <span className="text-sm">{option.icon}</span> {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt="Avatar" className="size-8 rounded-full border border-zinc-700 object-cover" />
            ) : (
              <div className="size-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-sm font-bold">
                {userNameDisplay[0]?.toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate text-white uppercase tracking-wide">{userNameDisplay}</h4>
              <p className="text-[8px] font-mono text-zinc-500 uppercase font-black">{totalXp} XP</p>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* === RIGHT CONTENT === */}
      <div className={`flex-1 flex flex-col h-full relative z-10 p-8 ${
        activeTab === "dashboard" && gameView === "game-runner" ? "overflow-hidden" : "overflow-y-auto"
      }`}>

        {/* ─── TAB: PLAY / DASHBOARD ─── */}
        {activeTab === "dashboard" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">

            {/* ── VIEW: GAME DETAIL ── */}
            {gameView === "game-detail" && activeGame && (() => {
              let effectiveCompletedLevel = progress[activeGame.id]?.completedLevel || 0;
              if (typeof window !== "undefined") {
                try {
                  const frogProg = localStorage.getItem("mockrithm_frog_game_progress");
                  if (frogProg && activeGame.id === "css3") {
                    const arr = JSON.parse(frogProg);
                    if (Array.isArray(arr) && arr.length > 0) {
                      effectiveCompletedLevel = Math.max(effectiveCompletedLevel, Math.max(...arr));
                    }
                  }
                } catch (e) {}
              }

              const gameProg = {
                completedLevel: effectiveCompletedLevel,
                xp: (progress[activeGame.id]?.xp || 0) || (effectiveCompletedLevel * 100)
              };

              const prereqs = activeGame.prerequisites;
              const prereqGames = GAMES_LIST.filter(g => prereqs.includes(g.id));
              const missingPrereqs = prereqGames.filter(g => !(progress[g.id]?.completedLevel > 0));
              const maxLvl = 100;
              const pct = Math.min(Math.round((gameProg.completedLevel / maxLvl) * 100), 100);

              return (
                <div className="flex flex-col gap-6">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                    <button onClick={() => { playSound("click"); setGameView("dashboard"); setActiveGame(null); }}
                      className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-xl">
                      <ArrowLeft className="size-4" /> All Games
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="p-1">
                        <TechIcon name={activeGame.iconName} className="size-10 object-contain" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-black uppercase font-mono tracking-tight">{activeGame.name}</h1>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase">{activeGame.theme}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        playSound("click");
                        setCurrentLevelNum(Math.max(1, gameProg.completedLevel + 1 > maxLvl ? maxLvl : gameProg.completedLevel + 1));
                        setGameView("game-runner");
                      }}
                      className="px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2">
                      <Play className="size-4 fill-current" />
                      {gameProg.completedLevel === 0 ? "Start Playing" : "Continue"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Info */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                      {/* Stats card */}
                      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono">Your Progress</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/60 border border-zinc-900/60 rounded-xl p-3">
                            <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">Level</span>
                            <span className="text-lg font-black font-mono text-white">{gameProg.completedLevel}</span>
                          </div>
                          <div className="bg-black/60 border border-zinc-900/60 rounded-xl p-3">
                            <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">XP Earned</span>
                            <span className="text-lg font-black font-mono text-white">{gameProg.xp}</span>
                          </div>
                          <div className="bg-black/60 border border-zinc-900/60 rounded-xl p-3 col-span-2">
                            <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">Status</span>
                            <span className="text-sm font-black font-mono text-white">
                              {gameProg.completedLevel >= maxLvl ? "🌟 Finished (Badge Earned)" : "In Progress"}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[8px] font-mono text-zinc-500 font-bold">
                            <span>COMPLETION</span><span>{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${activeGame.gradient} transition-all duration-500`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        {gameProg.completedLevel >= 10 && (
                          <div className="bg-gradient-to-br from-amber-500/10 via-zinc-950 to-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-extrabold text-amber-300 uppercase flex items-center gap-1.5">
                                <Award className="size-4 text-amber-400" /> E-Certificate Unlocked
                              </span>
                              <span className="text-[8px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                                Level {gameProg.completedLevel}+
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed">
                              You unlocked the official Mockrithm Mastery Certificate for {activeGame.name}.
                            </p>
                            <button
                              onClick={() => openCertificate(activeGame, gameProg.completedLevel)}
                              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-1"
                            >
                              <Award className="size-4" />
                              <span>Generate E-Certificate</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Prerequisites */}
                      {prereqGames.length > 0 && (
                        <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-3">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono">Prerequisites</h3>
                          {prereqGames.map(pg => {
                            const pgProg = progress[pg.id] || { completedLevel: 0, xp: 0 };
                            const done = pgProg.completedLevel > 0;
                            return (
                              <div key={pg.id} className="flex items-center justify-between text-[11px]">
                                <span className="text-zinc-300 font-mono">{pg.name}</span>
                                {done ? (
                                  <span className="text-emerald-400 font-mono font-bold">Done</span>
                                ) : (
                                  <span className="text-zinc-600 font-mono">Not Started</span>
                                )}
                              </div>
                            );
                          })}
                          {missingPrereqs.length > 0 && (
                            <p className="text-[10px] text-zinc-500 font-mono mt-1 leading-relaxed">
                              We recommend completing {missingPrereqs.map(p => p.name).join(", ")} before starting {activeGame.name}.
                            </p>
                          )}
                        </div>
                      )}

                      {/* About */}
                      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono">About This Game</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{activeGame.description}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {[`${maxLvl} Levels`, "Dynamic Challenges", "XP Rewards", "Badge on completion"].map(tag => (
                            <span key={tag} className="text-[9px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full uppercase">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Level grid */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      {/* Level grid — show first 100 levels with locked/unlocked indicators */}
                      <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 font-mono">Levels</h3>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">Showing all 100 levels</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1.5">
                          {Array.from({ length: 100 }, (_, i) => {
                            const lvl = i + 1;
                            const isCompleted = gameProg.completedLevel >= lvl;
                            const isNext = gameProg.completedLevel + 1 === lvl;
                            const isLocked = lvl > gameProg.completedLevel + 1;
                            return (
                              <button key={lvl}
                                onClick={() => {
                                  if (isLocked) { toast.error(`Level ${lvl} is locked.`); return; }
                                  playSound("click");
                                  setCurrentLevelNum(lvl);
                                  setGameView("game-runner");
                                }}
                                className={`aspect-square rounded-lg text-[8px] font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${
                                  isCompleted ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" :
                                  isNext ? "bg-white text-black border border-white" :
                                  "bg-zinc-900/40 border border-zinc-800/50 text-zinc-600 cursor-not-allowed"
                                }`}
                                title={`Level ${lvl}${isCompleted ? " (Completed)" : isNext ? " (Next)" : " (Locked)"}`}
                              >
                                {isCompleted ? "✓" : lvl}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => { playSound("click"); setCurrentLevelNum(Math.max(1, Math.min(gameProg.completedLevel + 1 > maxLvl ? maxLvl : gameProg.completedLevel + 1, maxLvl))); setGameView("game-runner"); }}
                          className="w-full py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 mt-2">
                          <Play className="size-4 fill-current" />
                          {gameProg.completedLevel === 0 ? `Start at Level 1` : `Continue from Level ${gameProg.completedLevel + 1}`}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── VIEW: GAME RUNNER ── */}
            {gameView === "game-runner" && activeGame && (() => {
              if (activeGame.id === "css3") {
                const dbCompleted = progress["css3"]?.completedLevel || 0;
                return (
                  <FrogCssGameRunner
                    onBack={() => { playSound("click"); setGameView("game-detail"); }}
                    completedLevelFromDb={dbCompleted}
                    onCompleteLevel={() => {
                      handleLevelCompletion();
                    }}
                  />
                );
              }
              const maxLvl = 100;
              return (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <button onClick={() => { playSound("click"); setGameView("game-detail"); }}
                      className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-xl">
                      <ArrowLeft className="size-4" /> Back to {activeGame.name}
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="p-1">
                        <TechIcon name={activeGame.iconName} className="size-8 object-contain" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-white leading-tight">{activeGame.name}</h2>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">{activeGame.theme}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <button onClick={handlePrevLevel} disabled={currentLevelNum === 1}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs">◀</button>
                      <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                        LEVEL
                        <input type="number" min={1} max={maxLvl} value={currentLevelNum}
                          onChange={e => handleSelectLevel(parseInt(e.target.value, 10))}
                          className="w-10 bg-transparent text-center focus:outline-none border-b border-zinc-800 focus:border-white text-white font-bold" />
                        / {maxLvl}
                      </div>
                      <button onClick={handleNextLevel} disabled={currentLevelNum === maxLvl || !canGoNext}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs">▶</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 min-h-0 select-none">
                    {/* Column 1: Info and instructions */}
                    <div className="flex flex-col bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-140px)] gap-4 select-text">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-500 font-bold">+100 XP</span>
                      </div>
                      <h3 className="text-lg font-black tracking-wide text-white uppercase leading-tight font-mono">{activeLevelData?.title}</h3>
                      <div className="h-[1px] bg-zinc-900 my-1" />
                      <div className="space-y-1">{renderMarkdown(activeLevelData?.conceptText || "")}</div>
                      {activeLevelData?.codeExample && (
                        <div className="mt-2">
                          <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">Example</h4>
                          {renderCodeExample(activeLevelData.codeExample)}
                        </div>
                      )}
                      <div className="space-y-1 border-t border-zinc-900 pt-4 mt-2">{renderMarkdown(activeLevelData?.missionText || "")}</div>
                      <div className="border-t border-zinc-900 pt-4 mt-2">
                        <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">Tests</h4>
                        <ul className="space-y-1.5">
                          {activeLevelData?.validation.testCases.map((tc, idx) => (
                            <li key={idx} className="text-[10.5px] text-zinc-500 flex items-start gap-2">
                              <span className="text-zinc-600">•</span><span>{tc.description || tc.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2 border-t border-zinc-900 pt-4">
                        <button onClick={() => { playSound("click"); setShowHint(!showHint); }}
                          className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase">
                          <HelpCircle className="size-3.5" /> {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        <AnimatePresence>
                          {showHint && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 mt-3 text-[10.5px] text-zinc-400 font-mono leading-relaxed space-y-1.5">
                              {activeLevelData?.hints.map((hint, i) => (
                                <p key={i}>• {hint}</p>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Column 2: Code Editor */}
                    <div className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative max-h-[calc(100vh-140px)]">
                      <div className="flex justify-between items-center bg-zinc-950 border-b border-zinc-900 px-4 py-2 select-none">
                        <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Code2 className="size-3.5" /> Workspace Editor
                        </span>
                        <button onClick={() => { playSound("click"); setEditorCode(activeLevelData?.starterCode || ""); }}
                          className="text-[9px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase font-bold">
                          <RotateCcw className="size-3" /> Reset Code
                        </button>
                      </div>
                      <div className="flex-1 min-h-0 select-text">
                        <Editor
                          height="100%"
                          language={
                            activeGame.id === "html5" || activeGame.id === "tailwind" ? "html" :
                            activeGame.id === "css3" ? "css" :
                            activeGame.id === "javascript" || activeGame.id === "nodejs" ? "javascript" :
                            activeGame.id === "typescript" ? "typescript" :
                            activeGame.id === "python" ? "python" :
                            activeGame.id === "git" ? "shell" :
                            "html"
                          }
                          theme="vs-dark"
                          value={editorCode}
                          onChange={(val) => setEditorCode(val || "")}
                          options={{
                            fontSize: 11,
                            minimap: { enabled: false },
                            lineNumbers: "on",
                            roundedSelection: true,
                            scrollBeyondLastLine: false,
                            readOnly: activeGame.id === "git",
                            fontFamily: "var(--font-geist-mono), monospace",
                            padding: { top: 12 }
                          }}
                        />
                      </div>
                      <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex gap-3 select-none">
                        <button onClick={runCodeOnly}
                          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-zinc-800 shadow-lg shadow-black/20">
                          ⚙️ Run Code
                        </button>
                        <button onClick={evaluateCode}
                          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-600 shadow-lg shadow-emerald-950/20">
                          🚀 Verify Code
                        </button>
                      </div>
                    </div>

                    {/* Column 3: Preview Output & Results */}
                    <div className="flex flex-col gap-4 max-h-[calc(100vh-140px)] min-h-0">
                      {/* Live preview component */}
                      <LivePreview previewDoc={previewDoc} />

                      {/* Test logs & results terminal */}
                      <div className="h-[180px] shrink-0 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col gap-3 overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center border-b border-zinc-900 pb-2 select-none">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Output / Test Results</span>
                          <div className="flex gap-2">
                            {evaluationSuccess === true && <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-bold">All Tests Passed</span>}
                            {evaluationSuccess === false && <span className="text-[9px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full uppercase font-bold">Tests Failed</span>}
                          </div>
                        </div>

                        {activeGame.id === "git" ? (
                          <GitGame 
                            gitTerminalLogs={gitTerminalLogs}
                            gitCommandInput={gitCommandInput}
                            setGitCommandInput={setGitCommandInput}
                            handleGitCommandSubmit={handleGitCommandSubmit}
                          />
                        ) : (
                          <div className="flex-1 overflow-y-auto max-h-[110px] text-[10px] font-mono text-zinc-500 space-y-1 select-text">
                            {evalLogs.length === 0 ? (
                              <div className="text-zinc-700 italic">No output logged yet. Run your code to trigger unit tests.</div>
                            ) : (
                              evalLogs.map((log, i) => <div key={i} className="text-zinc-400">{log}</div>)
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── VIEW: DASHBOARD (game list) ── */}
            {gameView === "dashboard" && (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-900 pb-8 mb-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Games Dashboard</span>
                    <h1 className="text-4xl font-black tracking-tight leading-none uppercase font-mono">Pick a Game</h1>
                    <p className="text-xs text-zinc-400 max-w-xl">Choose a language to start learning. Complete levels to earn XP and unlock badges.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-900 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold tracking-widest text-violet-400 uppercase font-mono bg-zinc-900 border border-violet-500/20 px-2 py-0.5 rounded-full inline-block">
                      Need Mock Interview Practice?
                    </span>
                    <h3 className="text-sm font-black text-white uppercase font-mono">Unlock Your Career Potential</h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
                      Transition from coding puzzles to verbal technical mock interviews. Practice voice questions on system design, data structures, and resume tailoring.
                    </p>
                  </div>
                  <a href="https://mockrithm.me" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-white shrink-0 text-center">
                    Try Voice Mock Interviews
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GAMES_LIST.map(game => {
                    const gameProg = progress[game.id] || { completedLevel: 0, xp: 0 };
                    const maxLvl = 100;
                    const pct = Math.min(Math.round((gameProg.completedLevel / maxLvl) * 100), 100);
                    const prereqsMissing = game.prerequisites.length > 0 && !game.prerequisites.every(p => (progress[p]?.completedLevel || 0) > 0);

                    return (
                      <div key={game.id}
                        onClick={() => { playSound("click"); setActiveGame(game); setGameView("game-detail"); }}
                        className="relative rounded-2xl border border-zinc-900 bg-zinc-950/50 p-6 flex flex-col justify-between h-64 overflow-hidden group/card hover:border-zinc-750 transition-all duration-300 cursor-pointer">
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${game.gradient} opacity-5 group-hover/card:opacity-10 blur-xl rounded-full transition-all`} />
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-1">
                              <TechIcon name={game.iconName} className="size-8 object-contain" />
                            </div>
                            {prereqsMissing ? (
                              <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full uppercase font-bold">
                                Needs: {game.prerequisites.map(p => GAMES_LIST.find(g => g.id === p)?.name).join(", ")}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase font-bold">Ready</span>
                            )}
                          </div>
                          <h3 className="text-base font-black tracking-wide text-white uppercase">{game.name}</h3>
                          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-wider italic">{game.theme}</p>
                          <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{game.description}</p>
                        </div>
                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-[9px] font-mono font-bold text-zinc-500">
                            <span>LEVEL {gameProg.completedLevel}/{maxLvl}</span><span>{pct}%</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${game.gradient}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── TAB: PROFILE ─── */}
        {activeTab === "profile" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">My Profile</h2>
              <p className="text-xs text-zinc-500 mt-1">Your stats, progress, and badges all in one place.</p>
            </div>

            <div className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
              <div className="relative shrink-0">
                {userAvatarUrl ? (
                  <img src={userAvatarUrl} alt="Avatar" className="size-32 rounded-3xl border border-zinc-800 object-cover shadow-xl" />
                ) : (
                  <div className="size-32 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl font-mono font-bold shadow-xl">
                    {userNameDisplay[0]?.toUpperCase()}
                  </div>
                )}
                {/* Overlay completed language badges in the corner */}
                <div className="absolute -bottom-2 -right-2 flex flex-wrap gap-1 max-w-[120px] bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800 backdrop-blur-md shadow-lg">
                  {GAMES_LIST.filter(game => {
                    const gp = progress[game.id] || { completedLevel: 0 };
                    const maxLvl = 100;
                    return gp.completedLevel >= maxLvl;
                  }).map(game => (
                    <div key={game.id} className="size-6 p-1 bg-zinc-900 border border-zinc-800 rounded-lg" title={`${game.name} Completed`}>
                      <TechIcon name={game.iconName} className="size-full" />
                    </div>
                  ))}
                  {GAMES_LIST.filter(game => {
                    const gp = progress[game.id] || { completedLevel: 0 };
                    const maxLvl = 100;
                    return gp.completedLevel >= maxLvl;
                  }).length === 0 && (
                    <div className="size-6 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500 font-mono" title="No completed games yet">
                      🔒
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-white mt-1.5 uppercase font-mono tracking-wide">{userNameDisplay}</h3>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">{userEmailDisplay}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">Total XP</span>
                    <span className="text-base font-black text-white font-mono">{totalXp}</span>
                  </div>
                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl">
                    <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">Levels Done</span>
                    <span className="text-base font-black text-white font-mono">{Object.values(progress).reduce((a, p) => a + (p?.completedLevel || 0), 0)}</span>
                  </div>
                  <div className="bg-black/60 border border-zinc-900/60 p-3 rounded-2xl col-span-2 md:col-span-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-600 uppercase block">Location</span>
                    <span className="text-[11px] font-bold text-zinc-300 block mt-0.5 font-mono">
                      {userLocation.city && userLocation.country ? `${userLocation.city}, ${userLocation.country}` : "Not set"}
                    </span>
                    <button onClick={() => setShowLocationModal(true)}
                      className="text-[8px] font-mono text-zinc-600 hover:text-zinc-400 mt-0.5 cursor-pointer uppercase tracking-wider">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>



            {/* Language Progress */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
                <FileCode className="size-4" /> Language Progress
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                 {GAMES_LIST.map(game => {
                  const gp = progress[game.id] || { completedLevel: 0, xp: 0 };
                  const maxLvl = 100;
                  const pct = Math.min(Math.round((gp.completedLevel / maxLvl) * 100), 100);
                  return (
                    <div key={game.id} className={`p-5 rounded-2xl border bg-zinc-950/20 flex flex-col justify-between h-32 relative overflow-hidden transition-all ${gp.completedLevel > 0 ? "border-zinc-800" : "border-zinc-905 opacity-60"}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-1">
                          <TechIcon name={game.iconName} className="size-8 object-contain" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono">{game.name}</h4>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase">{game.theme}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5 mt-3">
                        <div className="flex justify-between text-[8px] font-mono text-zinc-500 font-bold">
                          <span>LEVEL {gp.completedLevel}/{maxLvl}</span><span>{pct}%</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${game.gradient}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      {gp.completedLevel >= 10 && (
                        <button
                          onClick={() => openCertificate(game, gp.completedLevel)}
                          className="mt-2 py-1 px-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-md text-[8px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                        >
                          <Award className="size-3 text-amber-400" />
                          <span>E-Certificate</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: BADGES ─── */}
        {activeTab === "badges" && (
          <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6 mb-4">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Badges</h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Complete levels in each language to earn badges. Your progress is saved automatically.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {GAMES_LIST.map(game => {
                const gp = progress[game.id] || { completedLevel: 0, xp: 0 };
                const maxLvl = 100;
                const isCompleted = gp.completedLevel >= maxLvl;
                const isStarted = gp.completedLevel > 0;
                const pct = Math.min(Math.round((gp.completedLevel / maxLvl) * 100), 100);
                return (
                  <div key={game.id} className={`p-6 rounded-2xl border flex flex-col justify-between h-48 relative overflow-hidden transition-all ${isCompleted ? "bg-zinc-900 border-amber-500/40 shadow-lg shadow-amber-500/5" : isStarted ? "bg-zinc-900/60 border-zinc-800" : "bg-zinc-950/20 border-zinc-905 opacity-30"}`}>
                    <div className="flex items-center gap-3">
                      <div className="p-1">
                        <TechIcon name={game.iconName} className="size-8 object-contain" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase font-mono">{game.name}</h4>
                        <span className={`text-[8px] font-mono uppercase ${isCompleted ? "text-amber-400 font-bold" : "text-zinc-500"}`}>
                          {isCompleted ? "🌟 Completed Badge" : isStarted ? "In Progress" : "Locked"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-3 leading-normal font-mono">{game.theme}</p>
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[8px] font-mono text-zinc-500 font-bold">
                        <span>Lv {gp.completedLevel}/{maxLvl}</span><span>{pct}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${isStarted ? game.gradient : "from-zinc-900 to-zinc-950"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    {gp.completedLevel >= 10 && (
                      <button
                        onClick={() => openCertificate(game, gp.completedLevel)}
                        className="mt-3 w-full py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-400/20 hover:from-amber-500/30 hover:to-amber-400/30 border border-amber-500/40 text-amber-300 rounded-lg text-[9px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Award className="size-3.5 text-amber-400" />
                        <span>Generate E-Certificate</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB: ACHIEVEMENTS ─── */}
        {activeTab === "achievements" && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6 mb-4">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Achievements</h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Complete levels to unlock achievements. Claim them to collect XP.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {getAchievements().map(ach => {
                const isClaimed = claimedAchievements.includes(ach.id);
                const pct = Math.round((ach.current / ach.max) * 100);
                return (
                  <div key={ach.id} className={`relative rounded-2xl border p-5 bg-zinc-950/40 flex flex-col justify-between h-44 transition-all ${isClaimed ? "border-emerald-500/20" : ach.completed ? "border-amber-500/30" : "border-zinc-900"}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">{ach.title}</h4>
                        {isClaimed ? (
                          <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">Claimed</span>
                        ) : ach.completed ? (
                          <button onClick={() => claimAchievementReward(ach.id, ach.xp)}
                            className="text-[8.5px] font-mono font-black text-black bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-full uppercase transition-all cursor-pointer flex items-center gap-1 shadow-lg">
                            <Award className="size-3" /> Claim
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full uppercase">Locked</span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-400 mt-2.5 leading-relaxed font-mono">{ach.desc}</p>
                      <p className="text-[9px] font-mono text-zinc-600 mt-1 uppercase font-bold">Target: {ach.target}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-500 ${ach.completed ? "bg-emerald-500" : "bg-zinc-700"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className={`text-[9px] font-mono font-black ${ach.completed ? "text-amber-400" : "text-zinc-500"}`}>+{ach.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── TAB: LEADERBOARDS ─── */}
        {activeTab === "leaderboard" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Leaderboards</h2>
              <p className="text-xs text-zinc-500 mt-1">See how you rank against other users by XP, badges, or achievements.</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-zinc-950 p-4 border border-zinc-900 rounded-2xl">
              <div className="flex gap-2">
                {[{ value: "world", label: "World" }, { value: "country", label: userLocation.country || "Country" }, { value: "city", label: userLocation.city || "City" }].map(s => (
                  <button key={s.value} onClick={() => { playSound("click"); setLeaderboardScope(s.value as any); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${leaderboardScope === s.value ? "bg-white text-black" : "text-zinc-400 hover:text-white bg-zinc-900/40"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                {[{ value: "xp", label: "XP" }, { value: "badges", label: "Badges" }, { value: "achievements", label: "Achievements" }].map(m => (
                  <button key={m.value} onClick={() => { playSound("click"); setLeaderboardMetric(m.value as any); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${leaderboardMetric === m.value ? "bg-white text-black" : "text-zinc-400 hover:text-white bg-zinc-900/40"}`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-400 font-mono text-[10px] uppercase">
                    {["Rank","User","Country","City","Badges","Achievements","XP"].map(h => (
                      <th key={h} className={`p-4 font-bold ${h === "XP" ? "text-right" : h === "Badges" || h === "Achievements" ? "text-center" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getFilteredLeaderboard().map(row => {
                    const isMe = row.name === userNameDisplay;
                    return (
                      <tr key={row.name} className={`border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors ${isMe ? "bg-white/[0.02]" : ""}`}>
                        <td className="p-4 font-mono font-bold text-zinc-400">
                          {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`}
                        </td>
                        <td className="p-4 flex items-center gap-2.5">
                          {isMe && userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="Avatar" className="size-6 rounded-full object-cover border border-zinc-800" />
                          ) : (
                            <div className="size-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] border border-zinc-700">{row.name[0]?.toUpperCase()}</div>
                          )}
                          <span className={isMe ? "text-emerald-400" : "text-white"}>{row.name}</span>
                          {isMe && <span className="text-[7.5px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">YOU</span>}
                        </td>
                        <td className="p-4 text-zinc-400 font-mono">{row.country || "—"}</td>
                        <td className="p-4 text-zinc-500 font-mono">{row.city || "—"}</td>
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

        {/* ─── TAB: FRIENDS ─── */}
        {activeTab === "friends" && (
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            <div className="border-b border-zinc-900 pb-6">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Friends</h2>
              <p className="text-xs text-zinc-500 mt-1">Manage friends, pending requests, and start voice calls.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                
                {/* Active Friends */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Your Contacts</h3>
                  {friendsList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {friendsList.map(friend => {
                        const statusInfo = getStatusIndicator(friend);
                        return (
                          <div key={friend} className="bg-zinc-950/40 border border-zinc-900 p-4 rounded-2xl flex items-center justify-between hover:border-zinc-800 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="size-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 font-mono">
                                  {(friend || "")[0]?.toUpperCase()}
                                </div>
                                <span className={`absolute bottom-0 right-0 size-2.5 rounded-full border border-black ${statusInfo.color}`} />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white uppercase font-mono">{friend}</h4>
                                <span className="text-[8px] font-mono text-zinc-500 uppercase">{statusInfo.label}</span>
                              </div>
                            </div>
                            <button onClick={() => placeCall(friend)}
                              className="p-2 rounded-xl bg-zinc-900 hover:bg-emerald-500 hover:text-black border border-zinc-800 hover:border-emerald-600 text-zinc-400 transition-all cursor-pointer">
                              <Phone className="size-3.5 fill-current" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-zinc-950/20 border border-dashed border-zinc-900 rounded-2xl p-6 text-center text-zinc-500 text-xs italic">
                      No friends yet. Send a request to connect!
                    </div>
                  )}
                </div>

                {/* Incoming Requests */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Incoming Requests</h3>
                  {receivedRequests.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {receivedRequests.map(req => (
                        <div key={req.id} className="bg-zinc-950/40 border border-zinc-900 p-3 rounded-xl flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-white">{req.senderName}</span>
                          <div className="flex gap-2">
                            <button onClick={() => handleAcceptRequest(req.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] rounded-lg font-bold uppercase transition-all cursor-pointer">
                              Accept
                            </button>
                            <button onClick={() => handleDeclineRequest(req.id)}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-[10px] rounded-lg font-bold uppercase transition-all cursor-pointer">
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-600 italic font-mono">No pending incoming requests.</p>
                  )}
                </div>

                {/* Sent Requests */}
                <div className="space-y-3">
                  <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Sent Requests</h3>
                  {sentRequests.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {sentRequests.map(req => (
                        <div key={req.id} className="bg-zinc-950/40 border border-zinc-900 p-3 rounded-xl flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-white">{req.receiverName}</span>
                          <button onClick={() => handleCancelRequest(req.id)}
                            className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 hover:bg-red-950 hover:text-red-400 text-zinc-500 text-[10px] rounded-lg font-bold uppercase transition-all cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-600 italic font-mono">No pending sent requests.</p>
                  )}
                </div>

              </div>

              {/* Add Friend Sidebar */}
              <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl flex flex-col gap-4 h-fit">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Add a Friend</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">Enter their username to send a friend request.</p>
                </div>
                <form onSubmit={handleAddFriend} className="flex flex-col gap-2">
                  <input type="text" placeholder="Username..." value={newFriendInput} onChange={e => setNewFriendInput(e.target.value)}
                    className="bg-black border border-zinc-900 rounded-xl px-3 py-2 focus:outline-none focus:border-zinc-700 text-xs text-white" />
                  <button type="submit"
                    className="py-2 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                    <Plus className="size-4" /> Send Request
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ─── TAB: CHAT ─── */}
        {activeTab === "social" && (
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 h-[80vh]">
            <div className="border-b border-zinc-900 pb-6 shrink-0">
              <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Chat</h2>
              <p className="text-xs text-zinc-500 mt-1 font-mono">Message friends directly or talk to everyone in global chat.</p>
            </div>
            
            <div className="flex-1 flex gap-6 min-h-0">
              {/* Contact sidebar */}
              <div className="w-60 border border-zinc-900 rounded-2xl bg-zinc-950/40 p-4 flex flex-col gap-3 shrink-0">
                <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Channels</h3>
                {/* Global chat channel */}
                <button onClick={() => { playSound("click"); setSelectedFriend("__global__"); }}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl transition-all text-xs font-bold ${selectedFriend === "__global__" ? "bg-white text-black" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-white"}`}>
                  <span className="text-sm">🌍</span> Global Chat
                </button>
                <div className="h-px bg-zinc-900 my-1" />
                <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Friends</h3>
                <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 flex-1">
                  {friendsList.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 italic font-mono">No friends added yet.</p>
                  ) : friendsList.map(friend => {
                    const statusInfo = getStatusIndicator(friend);
                    return (
                      <button key={friend} onClick={() => { playSound("click"); setSelectedFriend(friend); }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-xs ${selectedFriend === friend ? "bg-zinc-900 text-white font-bold" : "text-zinc-400 hover:bg-zinc-900/40 hover:text-white"}`}>
                        <div className="flex items-center gap-2 truncate">
                          <div className="size-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[8px] font-bold">{(friend || "")[0]?.toUpperCase()}</div>
                          <span className="truncate max-w-[100px]">{friend}</span>
                        </div>
                        <span className={`size-1.5 rounded-full shrink-0 ${statusInfo.color}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat panel (WhatsApp Aesthetics) */}
              <div className="flex-1 border border-zinc-900 rounded-2xl bg-zinc-950/20 flex flex-col justify-between overflow-hidden relative">
                
                {/* Chat Header */}
                <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase font-mono text-white flex items-center gap-2">
                      {selectedFriend === "__global__" ? "🌍 Global Chat" : selectedFriend ? `Chat with ${selectedFriend}` : "Select a channel"}
                    </h3>
                    {selectedFriend && selectedFriend !== "__global__" && (
                      <p className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5">
                        {getStatusIndicator(selectedFriend).label}
                      </p>
                    )}
                  </div>
                  {selectedFriend === "__global__" && <span className="text-[9px] font-mono text-zinc-500 uppercase">Everyone can see messages here</span>}
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.5 min-h-0 bg-black/10">
                  {selectedFriend ? (
                    (messages[selectedFriend] || []).length > 0 ? (
                      (messages[selectedFriend] || []).map((msg, idx) => {
                        const isUser = msg.sender === "user";
                        return (
                          <div key={msg.id || idx} className={`flex flex-col max-w-[70%] ${isUser ? "self-end items-end" : "self-start items-start"}`}>
                            <div className={`p-3 pb-5 rounded-2xl text-xs leading-relaxed font-medium relative ${
                              isUser 
                                ? "bg-emerald-950 text-emerald-100 border border-emerald-900/60 rounded-tr-none" 
                                : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-800"
                            }`}>
                              <p className="pr-12">{msg.text}</p>
                              <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                <span className="text-[7.5px] font-mono text-zinc-500 select-none">{msg.time}</span>
                                {isUser && selectedFriend !== "__global__" && (
                                  <span className="text-[10px] select-none flex items-center justify-center font-bold">
                                    {msg.status === "seen" ? (
                                      <span className="text-sky-400 font-sans leading-none">✓✓</span>
                                    ) : msg.status === "delivered" ? (
                                      <span className="text-zinc-500 font-sans leading-none">✓✓</span>
                                    ) : (
                                      <span className="text-zinc-500 font-sans leading-none">✓</span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-zinc-600 italic text-xs font-mono">
                        {selectedFriend === "__global__" ? "Be the first to say something!" : "Say hello!"}
                      </div>
                    )
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-600 italic text-xs font-mono">
                      Pick a channel or friend to start chatting.
                    </div>
                  )}
                </div>

                {/* Messages Input */}
                <form onSubmit={handleSendChatMessage} className="p-4 bg-zinc-950 border-t border-zinc-900 flex gap-2 shrink-0">
                  <input type="text" disabled={!selectedFriend} value={chatInput} onChange={e => setChatInput(e.target.value)}
                    placeholder={selectedFriend === "__global__" ? "Message everyone..." : selectedFriend ? `Message ${selectedFriend}...` : "Select a channel first..."}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-zinc-600 text-xs text-white disabled:opacity-50" />
                  <button type="submit" disabled={!selectedFriend}
                    className="px-4 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider border border-white disabled:opacity-50">
                    <Send className="size-3.5 fill-current" /> Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {certModalData && (
        <ECertificateModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          userName={certModalData.userName}
          gameName={certModalData.gameName}
          gameTheme={certModalData.gameTheme}
          gameId={certModalData.gameId}
          levelReached={certModalData.levelReached}
        />
      )}

      <VerifyCertificateModal
        isOpen={showVerifyCertModal}
        onClose={() => setShowVerifyCertModal(false)}
      />

    </div>
  );
}

export function GamesLandingPage({ initialTopic = "html" }: { initialTopic?: "html" | "css" | "js" | "sql" | "api" | "dsa" | "audio" | "star" | "logic" | "react" | "python" | "devops" | "metrics" | "system" | "security" }) {
  const [activeTopic, setActiveTopic] = useState(initialTopic);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoSrc("/bg.mp4");
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const topics = {
    html: {
      title: "HTML Structure & Semantics",
      tagline: "Build structured, highly accessible, SEO-optimized markup under compilation constraints.",
      heroTitle: <>Structure. Format. <br />Build the Web.</>,
      heroDescription: "Attract top hiring managers by showcasing your semantic document structures and WAI-ARIA accessibility compliance on our live HTML compiler sandbox.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Structure clean document trees using layout elements (<main>, <article>, <nav>).",
        "Maintain accessible elements (WAI-ARIA roles, focus management, semantic buttons).",
        "Implement SEO metadata, microdata schemas, and dynamic social graph protocols."
      ],
      code: `<!-- Semantic HTML Architecture -->
<article class="p-6 bg-zinc-950/60 border border-zinc-900 rounded-xl">
  <header class="mb-4">
    <h1 class="text-xl font-bold">Semantic Document Structure</h1>
    <p class="text-xs text-zinc-400">Optimized for SEO crawlers and screen readers.</p>
  </header>
  <main class="space-y-4">
    <section aria-labelledby="heading-details">
      <h2 id="heading-details" class="text-sm font-semibold">Lessons</h2>
      <p>Semantic tags improve accessibility ranking.</p>
    </section>
  </main>
</article>`
    },
    css: {
      title: "CSS Flexbox & Grid Master",
      tagline: "Architect scalable styling layouts and responsive design grids under execution pressure.",
      heroTitle: <>Flex. Grid. <br />Master Layouts.</>,
      heroDescription: "Troubleshoot complex fluid viewports, center grid divs, and configure GPU-accelerated keyframe layouts under strict execution deadlines.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Create fluid multi-dimensional grids using auto-fit, minmax, and clamp units.",
        "Implement GPU-accelerated transition keyframes to guarantee 60fps micro-interactions.",
        "Manage modular token scales with CSS variable definitions and responsive viewports."
      ],
      code: `/* Responsive Grid Layout & Animation */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.card {
  transform: scale(1);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card:hover {
  transform: translateY(-4px) scale(1.02);
}`
    },
    js: {
      title: "JavaScript Event Loop Challenge",
      tagline: "Trace call stacks, microtasks, macro-queues, and multi-thread async loop pools.",
      heroTitle: <>Trace. Loop. <br />Master Javascript.</>,
      heroDescription: "Solve event loop microtask order, optimize recursive closures, and trace async promise chains under compile-time constraints.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Coordinate call stacks, microtask queues (Promises), and macrotasks (setTimeout).",
        "Utilize high-order helpers, closures, lexical scopes, and function currying patterns.",
        "Mitigate client execution blocking by offloading compute routines to web workers."
      ],
      code: `// Trace Asynchronous Execution Sequence
console.log("Start");

setTimeout(() => console.log("Timeout (Macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1 (Microtask)"))
  .then(() => console.log("Promise 2 (Microtask)"));

console.log("End");`
    },
    sql: {
      title: "SQL Query Master",
      tagline: "Optimize database schemas, indexes, and aggregation trees under runtime loads.",
      heroTitle: <>Select. Query. <br />Scale Databases.</>,
      heroDescription: "Write efficient window partition queries, analyze slow search plans with EXPLAIN ANALYZE, and secure B-tree index layouts.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Author clean partition/row aggregations using SQL window statements.",
        "Optimize slow operations by tracing query parser steps with EXPLAIN ANALYZE.",
        "Construct composite B-Tree indexes, covering indexes, and partition parameters."
      ],
      code: `-- Partitioned Analytics Window Query
SELECT 
  employee_id, 
  department, 
  salary,
  RANK() OVER (
    PARTITION BY department 
    ORDER BY salary DESC
  ) as salary_rank
FROM employees
WHERE status = 'active';`
    },
    api: {
      title: "API Route Architect",
      tagline: "Design secure REST and GraphQL routes with type verification and validation protocols.",
      heroTitle: <>Design. Router. <br />Architect APIs.</>,
      heroDescription: "Build bulletproof REST routes, write strict Zod payload validation schemas, and prevent server crashes from invalid client input.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Design scalable REST endpoints utilizing JSON payload mapping.",
        "Verify requests using strict schema checkers (e.g. Zod validators).",
        "Implement rate limit checks to mitigate denial-of-service threat vectors."
      ],
      code: `// Secure API Request Router
import { z } from "zod";

const telemetrySchema = z.object({
  candidateId: z.string().uuid(),
  score: z.number().min(0).max(100),
  timestamp: z.string().datetime()
});

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = telemetrySchema.safeParse(data);
  if (!parsed.success) {
    return new Response("Invalid request payload", { status: 400 });
  }
  return new Response("Telemetry recorded", { status: 200 });
}`
    },
    dsa: {
      title: "Data Structures Blitz",
      tagline: "Troubleshoot arrays, linked lists, and tree traversals in real-time.",
      heroTitle: <>Traverse. Node. <br />Blitz Algorithms.</>,
      heroDescription: "Navigate tree traversals, resolve linked list pointers, and determine Big O space-time complexities under live compiler execution.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Master pointer manipulations in singly and doubly linked lists.",
        "Perform depth-first and breadth-first search traversals on binary search trees.",
        "Evaluate space-time complexities dynamically using Big O notation."
      ],
      code: `// Depth-First Binary Search Tree Traversal
class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.value = val; }
}

function dfsInOrder(node: TreeNode | null): number[] {
  if (!node) return [];
  return [...dfsInOrder(node.left), node.value, ...dfsInOrder(node.right)];
}`
    },
    audio: {
      title: "Behavioral Audio Analyzer",
      tagline: "Simulate live interview voice tone, pacing metrics, and filler word detection.",
      heroTitle: <>Listen. Speak. <br />Face the Machine.</>,
      heroDescription: "Calibrate your vocal frequencies, control speaking pacing, and filter speech filler words with our real-time voice analyzer sandbox.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Assess vocal pacing telemetry and isolate speech rate deviations.",
        "Detect filler words ('um', 'like', 'ah') to optimize speech structure.",
        "Calibrate tone frequencies for confident articulation vectors."
      ],
      code: `// Speech Telemetry Parsing Engine
interface SpeechMetrics {
  wordsPerMinute: number;
  fillerWordCount: number;
  confidenceScore: number;
}

function analyzeAudioStream(chunks: Float32Array[]): SpeechMetrics {
  // Isolate pacing and pitch frequency variations
  return {
    wordsPerMinute: 135, // Optimal pacing range
    fillerWordCount: 2,
    confidenceScore: 92
  };
}`
    },
    star: {
      title: "STAR Method Speed Run",
      tagline: "Synthesize Situation, Task, Action, and Result structures under time limits.",
      heroTitle: <>Succeed. STAR. <br />Claim Your Role.</>,
      heroDescription: "Synthesize high-impact Situation, Task, Action, and Result indicators quickly under strict grading rubrics to land top roles.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Structure clean context timelines using Situation & Task components.",
        "Articulate specific individual contributions inside Action variables.",
        "Quantify business outcomes and performance metrics in the Result segment."
      ],
      code: `# STAR Framework Structuring Model
## Situation:
Heavy load spike crashed user dashboard database nodes.
## Task:
Re-establish write availability under 15 minutes.
## Action:
Implemented database read replicas and hot failovers.
## Result:
Restored availability with 0 data loss and 40% query latency improvement.`
    },
    logic: {
      title: "Logic & Aptitude Sprint",
      tagline: "Isolate pattern variations and cognitive sequences under sandbox conditions.",
      heroTitle: <>Reason. Logic. <br />Pass Aptitude.</>,
      heroDescription: "Solve complex geometric progressions, identify logical sequence matrices, and trace boolean gates under testing conditions.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Solve matrix spatial arrangements and dimensional sequencing puzzles.",
        "Trace boolean logical operations, gates, and algorithmic constraints.",
        "Evaluate patterns to maximize performance on cognitive aptitude tests."
      ],
      code: `// Array Sequence Pattern Analyzer
function findMissingNumber(sequence: number[]): number {
  // Input: [2, 4, 8, 16, ?, 64] -> Geometric Progression
  for (let i = 1; i < sequence.length; i++) {
    const ratio = sequence[i] / sequence[i - 1];
    if (ratio !== 2) {
       return sequence[i - 1] * 2;
    }
  }
  return -1;
}`
    },
    react: {
      title: "React State Racer",
      tagline: "Isolate component states, custom hooks, and virtual DOM render pipelines.",
      heroTitle: <>Render. Batch. <br />Racer States.</>,
      heroDescription: "Optimize rendering hooks, prevent virtual DOM redraws, and manage custom batch transition hooks to keep UI components fast.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Prevent component redraw cycles using hooks (useMemo, useCallback).",
        "Isolate render changes inside lightweight custom state stores.",
        "Coordinate server-side state hydration without causing component mismatch errors."
      ],
      code: `// Optimized React Rerender Pipeline
import React, { useState, useCallback, useMemo } from 'react';

export const ListRenderer = React.memo(({ items }: { items: string[] }) => {
  const [filter, setFilter] = useState("");
  
  const filtered = useMemo(() => 
    items.filter(item => item.includes(filter)), [items, filter]
  );

  const onClear = useCallback(() => setFilter(""), []);

  return <input value={filter} onChange={e => setFilter(e.target.value)} />;
});`
    },
    python: {
      title: "Python Scripting Sprint",
      tagline: "Author high-speed script automations, context managers, and generator pipelines.",
      heroTitle: <>Stream. Yield. <br />Python Scripts.</>,
      heroDescription: "Build memory-efficient generators, write custom context managers, and run async ASGI uvicorn streaming routes.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Build scalable memory pipelines using yield generators and stream loaders.",
        "Safeguard resource allocations utilizing python context manager classes.",
        "Design fast data validation profiles with Pydantic class structures."
      ],
      code: `# Async Stream Generator Pipeline
import asyncio
from typing import AsyncGenerator

async def chunk_loader(file_path: str) -> AsyncGenerator[bytes, None]:
    # Stream read local log segments asynchronously
    with open(file_path, 'rb') as f:
        while chunk := f.read(1024):
            yield chunk
            await asyncio.sleep(0.01)`
    },
    devops: {
      title: "DevOps Pipeline Fixer",
      tagline: "Identify compilation and deployment bottlenecks in CI/CD pipeline configurations.",
      heroTitle: <>Build. Stage. <br />Fix the Pipeline.</>,
      heroDescription: "Identify YAML syntax bottlenecks in GitHub Actions workflows and optimize Docker sizes using multi-stage instructions.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Configure automated build steps inside GitHub Actions workflow pipelines.",
        "Optimize Docker image size footprints using multi-stage build instructions.",
        "Secure secret strings and sensitive environment configuration variables."
      ],
      code: `# Broken Workflow Pipeline Configuration
name: Release Pipeline
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build and Lint
        run: |
          npm ci
          npm run lint
          npm run build`
    },
    metrics: {
      title: "Product Metrics Tycoon",
      tagline: "Track conversion funnels, A/B telemetry, and product growth experiments.",
      heroTitle: <>Funnel. Variant. <br />Growth Metric.</>,
      heroDescription: "Calculate user acquisition costs, design statistical validation protocols for A/B testing variations, and track funnel retention scores.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Calculate user conversion steps and exit metrics inside marketing funnels.",
        "Design statistical validation protocols for A/B testing variations.",
        "Optimize acquisition costs and retention metrics using analytical triggers."
      ],
      code: `// A/B Test Variant Selector Engine
interface Experiment {
  variantId: "control" | "treatment";
  converted: boolean;
}

function calculateConversionRate(data: Experiment[]): number {
  const converted = data.filter(d => d.converted).length;
  return (converted / data.length) * 100;
}`
    },
    system: {
      title: "System Design Architect",
      tagline: "Model load balancers, database sharding, and edge caching policies.",
      heroTitle: <>Route. Shard. <br />Scale Systems.</>,
      heroDescription: "Design horizontal sharding routers, set caching rules with Redis, and configure low-latency round-robin load balancers.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Design low-latency routing structures using load balancer algorithms.",
        "Maximize cache hit metrics utilizing Redis memory store protocols.",
        "Partition database writes using dynamic horizontal routing rules."
      ],
      code: `// Database Hash Sharding Algorithm
function getDatabaseShardId(userId: string, totalShards: number): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % totalShards;
}`
    },
    security: {
      title: "Cybersecurity Threat Hunter",
      tagline: "Detect system CVE vulnerabilities, SQL injections, and injection exploits.",
      heroTitle: <>Sanitize. Patch. <br />Secure Server.</>,
      heroDescription: "Prevent database leaks by sanitizing parameters, check query inputs for injection exploits, and defend routes from cross-site scripts.",
      gradient: "from-zinc-800/30 to-zinc-900/30 text-zinc-300",
      accent: "#27272a",
      lessons: [
        "Isolate SQL injection threats by sanitizing query parameters.",
        "Sanitize inputs to safeguard client rendering against XSS scripts.",
        "Verify authentication state checking variables to block data leakage."
      ],
      code: `// SQL Query Parameter Sanitizer
function sanitizeInput(input: string): string {
  // Strip common SQL control characters and escaping patterns
  return input.replace(/['";\\-]/g, "");
}`
    }
  };

  const handleAuthRedirect = () => {
    window.location.href = "https://accounts.mockrithm.me/sign-in?redirect_url=https://games.mockrithm.me";
  };

  const selectedTopic = (topics as any)[activeTopic] || topics.html;

  return (
    <div className="min-h-screen bg-transparent text-white font-mona-sans relative overflow-x-hidden selection:bg-white selection:text-black">
      {/* Fixed Fullscreen Background Video */}
      <div className="fixed inset-0 w-full h-screen z-0 pointer-events-none bg-zinc-950">
        {videoSrc ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100"
            src={videoSrc}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-zinc-950" />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Mockrithm Logo"
            className="w-8 h-8 brightness-0 invert opacity-80"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-2xl tracking-tight text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Mockrithm<sup className="text-[10px] align-super">®</sup>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="https://mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">Home</a>
            <a href="https://resume.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">Resume</a>
            <a href="https://docs.mockrithm.me" className="text-white/60 hover:text-white transition-colors duration-200">Docs</a>
          </div>
          <button
            onClick={handleAuthRedirect}
            className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-lg active:scale-95 border-none outline-none"
          >
            Begin Journey
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-28 relative z-10 mt-16">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 font-mono mb-6">
            <Sparkles className="size-3 text-white animate-pulse" /> Awwwards Class Sandbox
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] leading-[1] tracking-[-2px] font-normal text-white animate-fade-rise" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {selectedTopic.heroTitle}
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-8 max-w-xl mx-auto leading-relaxed font-mono">
            {selectedTopic.heroDescription}
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={handleAuthRedirect}
              className="px-6 py-4 bg-white text-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2.5 cursor-pointer shadow-xl shadow-white/5 border border-white"
            >
              Enter Game Hub <ArrowRight className="size-4" />
            </button>
            <a
              href="https://mockrithm.me"
              className="px-6 py-4 bg-zinc-900/60 border border-zinc-800 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:border-zinc-700 transition-all flex items-center gap-2 font-mono"
            >
              Main Platform
            </a>
          </div>
        </div>

        {/* Lead Gen Callout Card */}
        <section className="bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-10 mb-28 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-800/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3">
              <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase bg-zinc-900/80 border border-emerald-500/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 font-mono">
                <Trophy className="size-2.5" /> Next Level Assessment
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase font-mono tracking-tight">
                Duplex Voice-Activated AI Mock Interviews
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl font-mono">
                Code sandbox is only half the battle. Practice duplex voice interviews with our AI interviewer model. Receive real-time assessment scores, detailed critiques on articulation, and tailor-made development checklists.
              </p>
            </div>
            <a
              href="https://mockrithm.me"
              className="px-6 py-4 bg-white text-black hover:bg-zinc-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-white shrink-0 flex items-center justify-center gap-2 shadow-xl shadow-white/5 font-mono"
            >
              Practice Now <Gamepad2 className="size-4" />
            </a>
          </div>
        </section>

        {/* Syllabus / 10 Topics Workspace */}
        <section className="space-y-10 relative">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase font-mono">10 Modules Course Syllabus</span>
            <h2 className="text-3xl font-black uppercase font-mono tracking-tight">Interactive Landing Sandboxes</h2>
            <p className="text-xs text-zinc-500 font-mono">Select a topic below to inspect the curriculum lessons and practice code playground templates.</p>
          </div>

          {/* 10 Sticky Topic Selector Badge Buttons */}
          <div className="flex flex-wrap gap-2 border-b border-zinc-900 pb-6 scrollbar-hide overflow-x-auto">
            {(Object.keys(topics) as Array<keyof typeof topics>).map((topicKey) => {
              const active = activeTopic === topicKey;
              return (
                <button
                  key={topicKey}
                  onClick={() => { setActiveTopic(topicKey); }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-mono transition-all border cursor-pointer ${
                    active
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-zinc-950/60 border-zinc-900 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  {topicKey}
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Grid */}
          <div className="grid md:grid-cols-2 gap-10 items-start pt-4">
            {/* Left Column: Syllabus Data */}
            <div className="space-y-8">
              <div className="space-y-3">
                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest font-mono bg-gradient-to-r ${selectedTopic.gradient}`}>
                  {activeTopic} module
                </span>
                <h3 className="text-3xl font-black text-white uppercase font-mono tracking-tighter">
                  {selectedTopic.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                  {selectedTopic.tagline}
                </p>
              </div>

              {/* Lessons details */}
              <ul className="space-y-4">
                {selectedTopic.lessons.map((lesson: string, idx: number) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="p-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 mt-0.5 shrink-0">
                      <CheckCircle className="size-3.5" />
                    </div>
                    <span className="text-zinc-300 text-xs leading-relaxed font-mono">{lesson}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleAuthRedirect}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white hover:text-zinc-300 transition-all font-mono border-b border-white pb-1"
              >
                Launch Sandbox Playground <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Right Column: Virtual Terminal Preview */}
            <div className="flex flex-col border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl bg-zinc-950/60">
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900 bg-zinc-950/90 text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                  <span className="ml-2 text-zinc-400 font-mono">
                    playgrounds/sandbox.{(activeTopic as string) === "git" ? "sh" : activeTopic === "html" ? "html" : activeTopic === "css" ? "css" : activeTopic === "python" ? "py" : "ts"}
                  </span>
                </div>
                <span className="font-mono text-zinc-600">Active Playground</span>
              </div>
              <pre className="p-6 overflow-x-auto text-[11px] text-zinc-300 font-mono leading-relaxed bg-zinc-955/20 whitespace-pre">
                <code>{selectedTopic.code}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <div className="relative z-20 w-full bg-transparent">
        <Footer />
      </div>

    </div>
  );
}

export default function GamesPage() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="dark bg-zinc-950 text-white min-h-screen w-full flex flex-col items-center justify-center font-mono relative overflow-hidden z-50 p-6 text-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
          <div className="text-zinc-400 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Game Terminal...</div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <GamesLandingPage />;
  }

  return (
    <React.Suspense fallback={
      <div className="dark bg-zinc-950 text-white min-h-screen w-full flex flex-col items-center justify-center font-mono relative overflow-hidden z-50 p-6 text-center select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
          <div className="text-zinc-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Terminal Data...</div>
        </div>
      </div>
    }>
      <GamesPageContent />
    </React.Suspense>
  );
}
