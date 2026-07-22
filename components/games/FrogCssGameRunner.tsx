"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ALL_FROG_LEVELS, FrogLevel } from "@/lib/frogLevelsData";
const ThreeFrogViewport = dynamic(
  () => import("./ThreeFrogViewport").then((mod) => mod.ThreeFrogViewport),
  { ssr: false }
);
import {
  Code2, RotateCcw, HelpCircle, ArrowLeft, Sparkles, Map, Play, CheckCircle2, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface FrogCssGameRunnerProps {
  onBack?: () => void;
}

export const FrogCssGameRunner: React.FC<FrogCssGameRunnerProps> = ({ onBack }) => {
  const [mounted, setMounted] = useState(false);
  const [currentLevelNum, setCurrentLevelNum] = useState(1);
  const [editorCode, setEditorCode] = useState("");
  const [userCss, setUserCss] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLevelData: FrogLevel =
    ALL_FROG_LEVELS.find((l) => l.id === currentLevelNum) || ALL_FROG_LEVELS[0];

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mockrithm_frog_game_progress");
      if (saved) setCompletedLevels(JSON.parse(saved));
      const savedLevel = localStorage.getItem("mockrithm_frog_game_level");
      if (savedLevel) {
        const lvl = parseInt(savedLevel, 10);
        if (lvl >= 1 && lvl <= 100) setCurrentLevelNum(lvl);
      }
    } catch (e) {
      console.warn("Failed to load progress:", e);
    }
  }, []);

  // Update editor code and initial CSS state on level change
  useEffect(() => {
    setEditorCode(activeLevelData.starterCode);
    setUserCss(activeLevelData.starterCode);
    setEvaluationSuccess(null);
    setEvalLogs([]);
    setShowHint(false);
  }, [currentLevelNum, activeLevelData]);

  // Live real-time update when typing in Monaco Editor!
  const handleCodeChange = (val: string | undefined) => {
    const code = val || "";
    setEditorCode(code);
    setUserCss(code); // Immediately triggers real-time 3D viewport update on keystroke!
  };

  const evaluateCode = () => {
    setUserCss(editorCode);
    setEvalLogs(["Evaluating 3D Frog test rules..."]);

    const { regexMatches } = activeLevelData.validationRules;
    let allPassed = true;
    const results: string[] = [];

    if (regexMatches && regexMatches.length > 0) {
      regexMatches.forEach((pattern, idx) => {
        const rx = new RegExp(pattern, "i");
        if (rx.test(editorCode)) {
          results.push(`✔️ Test ${idx + 1}: CSS rule match passed`);
        } else {
          results.push(`❌ Test ${idx + 1}: CSS property missing or incorrect value syntax`);
          allPassed = false;
        }
      });
    }

    setEvalLogs(results);
    setEvaluationSuccess(allPassed);

    if (allPassed) {
      toast.success(`🎉 Level ${currentLevelNum} Complete! Excellent work.`);
      if (!completedLevels.includes(currentLevelNum)) {
        const nextCompleted = [...completedLevels, currentLevelNum];
        setCompletedLevels(nextCompleted);
        localStorage.setItem("mockrithm_frog_game_progress", JSON.stringify(nextCompleted));
      }
    } else {
      toast.error("Test validation failed. Check hint details.");
    }
  };

  const handleSelectLevel = (lvl: number) => {
    if (lvl >= 1 && lvl <= 100) {
      setCurrentLevelNum(lvl);
      localStorage.setItem("mockrithm_frog_game_level", lvl.toString());
      setIsDrawerOpen(false);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelNum < 100) handleSelectLevel(currentLevelNum + 1);
  };

  const handlePrevLevel = () => {
    if (currentLevelNum > 1) handleSelectLevel(currentLevelNum - 1);
  };

  if (!mounted) {
    return (
      <div className="w-full h-[calc(100vh-100px)] bg-zinc-950 flex items-center justify-center font-mono text-xs text-zinc-500">
        Loading 3D Engine...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full h-[calc(100vh-100px)] text-zinc-100 font-sans overflow-hidden">
      {/* Game Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 shrink-0">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-xl"
          >
            <ArrowLeft className="size-4" /> Back to CSS3
          </button>
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400">
            🐸 3D FROG CSS ENGINE
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Map className="size-3.5" /> Level Map ({completedLevels.length}/100)
          </button>
        </div>

        {/* Level Navigation */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={handlePrevLevel}
            disabled={currentLevelNum === 1}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
          >
            ◀
          </button>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
            LEVEL
            <input
              type="number"
              min={1}
              max={100}
              value={currentLevelNum}
              onChange={(e) => handleSelectLevel(parseInt(e.target.value, 10))}
              className="w-10 bg-transparent text-center focus:outline-none border-b border-zinc-800 focus:border-white text-white font-bold"
            />
            / 100
          </div>

          <button
            onClick={handleNextLevel}
            disabled={currentLevelNum === 100}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none text-xs"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Main 3-Column Workspace Grid filling full container height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 items-stretch select-none overflow-hidden">
        {/* Column 1: Info and Instructions (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-950/60 border border-zinc-900 rounded-2xl p-5 overflow-y-auto gap-4 select-text">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {activeLevelData.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 font-bold">+100 XP</span>
          </div>

          <h3 className="text-base font-black tracking-wide text-white uppercase leading-tight font-mono">
            {activeLevelData.title}
          </h3>

          <div className="h-[1px] bg-zinc-900 my-0.5" />

          <p className="text-xs text-zinc-300 leading-relaxed font-mono">
            {activeLevelData.prompt}
          </p>

          <div className="border-t border-zinc-900 pt-3">
            <h4 className="text-[11px] font-black tracking-wider text-white uppercase mb-1.5 font-mono">
              Target Goal
            </h4>
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-emerald-300">
              {activeLevelData.targetDescription}
            </div>
          </div>

          {/* Hint Toggle */}
          <div className="mt-auto border-t border-zinc-900 pt-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-[10px] font-mono font-bold text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase"
            >
              <HelpCircle className="size-3.5" /> {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 mt-2 text-[10.5px] text-zinc-400 font-mono leading-relaxed space-y-1"
                >
                  {activeLevelData.hints.map((hint, i) => (
                    <p key={i}>• {hint}</p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 2: Monaco Code Editor (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="flex justify-between items-center bg-zinc-950 border-b border-zinc-900 px-4 py-2 select-none shrink-0">
            <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Code2 className="size-3.5" /> Workspace Editor (CSS)
            </span>
            <button
              onClick={() => {
                setEditorCode(activeLevelData.starterCode);
                setUserCss(activeLevelData.starterCode);
              }}
              className="text-[9px] font-mono text-zinc-500 hover:text-white flex items-center gap-1 transition-colors cursor-pointer uppercase font-bold"
            >
              <RotateCcw className="size-3" /> Reset Code
            </button>
          </div>

          <div className="flex-1 min-h-0 select-text">
            <Editor
              height="100%"
              language="css"
              theme="vs-dark"
              value={editorCode}
              onChange={handleCodeChange}
              options={{
                fontSize: 12,
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                fontFamily: "var(--font-geist-mono), monospace",
                padding: { top: 12 },
              }}
            />
          </div>

          <div className="p-3 border-t border-zinc-900 bg-zinc-950 flex gap-2 select-none shrink-0">
            {evaluationSuccess === true ? (
              <button
                onClick={handleNextLevel}
                disabled={currentLevelNum === 100}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 animate-bounce"
              >
                🎉 Level Passed! Next Level ➔
              </button>
            ) : (
              <button
                onClick={evaluateCode}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-600 shadow-lg shadow-emerald-950/20"
              >
                🚀 Verify & Run Code
              </button>
            )}
          </div>
        </div>

        {/* Column 3: 3D Viewport & Test Execution Terminal (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 min-h-0 overflow-hidden">
          {/* 3D Viewport */}
          <div className="flex-1 min-h-[220px]">
            <ThreeFrogViewport
              level={activeLevelData}
              userCss={userCss}
              isVictory={evaluationSuccess === true}
            />
          </div>

          {/* Test Execution Output Terminal */}
          <div className="h-[140px] shrink-0 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto shadow-2xl font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 select-none shrink-0">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">
                Test Output Terminal
              </span>
              {evaluationSuccess === true && (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  PASSED
                </span>
              )}
              {evaluationSuccess === false && (
                <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  FAILED
                </span>
              )}
            </div>

            <div className="space-y-1 mt-0.5 text-[11px]">
              {evalLogs.length === 0 ? (
                <p className="text-zinc-600 italic">Type CSS in editor to see live 3D updates. Click "Verify" to validate tests.</p>
              ) : (
                evalLogs.map((log, idx) => (
                  <p
                    key={idx}
                    className={
                      log.startsWith("✔️")
                        ? "text-emerald-400 font-semibold"
                        : log.startsWith("❌")
                        ? "text-rose-400 font-semibold"
                        : "text-zinc-400"
                    }
                  >
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Level Selection Map Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden font-mono">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="size-4 text-emerald-400" /> Select Level (1–100)
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-zinc-800 cursor-pointer"
              >
                Close Map
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-10 gap-2 p-1">
              {ALL_FROG_LEVELS.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.id);
                const isCurrent = lvl.id === currentLevelNum;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleSelectLevel(lvl.id)}
                    className={`aspect-square rounded-lg text-xs font-mono font-bold flex items-center justify-center relative transition cursor-pointer ${
                      isCurrent
                        ? "bg-white text-black border border-white shadow-lg"
                        : isCompleted
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
                        : "bg-zinc-900/60 border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {lvl.id}
                    {isCompleted && (
                      <CheckCircle2 className="size-3 text-emerald-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
