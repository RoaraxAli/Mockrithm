"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ALL_FROG_LEVELS, FrogLevel } from "@/lib/frogLevelsData";
import { ThreeFrogViewport } from "./ThreeFrogViewport";
import {
  Code2, RotateCcw, HelpCircle, CheckCircle, ArrowLeft, Sparkles, Map, Play, CheckCircle2, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface FrogCssGameRunnerProps {
  onBack?: () => void;
}

export const FrogCssGameRunner: React.FC<FrogCssGameRunnerProps> = ({ onBack }) => {
  const [currentLevelNum, setCurrentLevelNum] = useState(1);
  const [editorCode, setEditorCode] = useState("");
  const [userCss, setUserCss] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

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

  // Set editor code on level change
  useEffect(() => {
    setEditorCode(activeLevelData.starterCode);
    setUserCss(activeLevelData.starterCode);
    setEvaluationSuccess(null);
    setEvalLogs([]);
    setShowHint(false);
  }, [currentLevelNum, activeLevelData]);

  const runCodeOnly = () => {
    setUserCss(editorCode);
    setEvalLogs(["Running CSS styling on 3D Frog...", "3D Mesh properties updated."]);
    setEvaluationSuccess(null);
  };

  const evaluateCode = () => {
    setUserCss(editorCode);
    setEvalLogs(["Running validation test cases on 3D Frog..."]);

    const { regexMatches } = activeLevelData.validationRules;
    let allPassed = true;
    const results: string[] = [];

    if (regexMatches && regexMatches.length > 0) {
      regexMatches.forEach((pattern, idx) => {
        const rx = new RegExp(pattern, "i");
        if (rx.test(editorCode)) {
          results.push(`✔️ Test ${idx + 1}: CSS rule match passed`);
        } else {
          results.push(`❌ Test ${idx + 1}: CSS property missing or incorrect syntax`);
          allPassed = false;
        }
      });
    }

    setEvalLogs(results);
    setEvaluationSuccess(allPassed);

    if (allPassed) {
      toast.success(`🎓 Level ${currentLevelNum} Complete! Excellent work.`);
      if (!completedLevels.includes(currentLevelNum)) {
        const nextCompleted = [...completedLevels, currentLevelNum];
        setCompletedLevels(nextCompleted);
        localStorage.setItem("mockrithm_frog_game_progress", JSON.stringify(nextCompleted));
      }
    } else {
      toast.error("Some test cases failed. Check hints and test logs.");
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

  return (
    <div className="flex flex-col gap-6 w-full text-zinc-100 font-sans">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
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

        {/* Level Navigation input */}
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

      {/* Main 3-Column Grid matching Website Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1 min-h-0 select-none">
        {/* Column 1: Info and Instructions */}
        <div className="flex flex-col bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 overflow-y-auto max-h-[calc(100vh-140px)] gap-4 select-text">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {activeLevelData.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 font-bold">+100 XP</span>
          </div>

          <h3 className="text-lg font-black tracking-wide text-white uppercase leading-tight font-mono">
            {activeLevelData.title}
          </h3>

          <div className="h-[1px] bg-zinc-900 my-1" />

          <p className="text-xs text-zinc-300 leading-relaxed font-mono">
            {activeLevelData.prompt}
          </p>

          <div className="border-t border-zinc-900 pt-4 mt-2">
            <h4 className="text-xs font-black tracking-wider text-white uppercase mb-2 font-mono">
              Target CSS Rule
            </h4>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-emerald-300">
              {activeLevelData.targetDescription}
            </div>
          </div>

          {/* Hint Toggle */}
          <div className="mt-2 border-t border-zinc-900 pt-4">
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
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 mt-3 text-[10.5px] text-zinc-400 font-mono leading-relaxed space-y-1.5"
                >
                  {activeLevelData.hints.map((hint, i) => (
                    <p key={i}>• {hint}</p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 2: Monaco Code Editor */}
        <div className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl relative max-h-[calc(100vh-140px)] min-h-[380px]">
          <div className="flex justify-between items-center bg-zinc-950 border-b border-zinc-900 px-4 py-2 select-none">
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
              onChange={(val) => setEditorCode(val || "")}
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

          <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex gap-3 select-none">
            <button
              onClick={runCodeOnly}
              className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-zinc-800 shadow-lg shadow-black/20"
            >
              ⚙️ Run Code
            </button>
            <button
              onClick={evaluateCode}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-600 shadow-lg shadow-emerald-950/20"
            >
              🚀 Verify Code
            </button>
          </div>
        </div>

        {/* Column 3: 3D Frog Viewport & Test Logs */}
        <div className="flex flex-col gap-4 max-h-[calc(100vh-140px)] min-h-0">
          {/* 3D Viewport canvas */}
          <ThreeFrogViewport
            level={activeLevelData}
            userCss={userCss}
            isVictory={evaluationSuccess === true}
          />

          {/* Test Execution Output Terminal */}
          <div className="flex-1 min-h-[160px] bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col gap-2 overflow-y-auto shadow-2xl font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2 select-none">
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

            <div className="space-y-1 mt-1 text-[11px]">
              {evalLogs.length === 0 ? (
                <p className="text-zinc-600 italic">Click "Verify Code" to run test cases against the 3D Frog.</p>
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

      {/* Level Selection Drawer Grid Modal */}
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
