"use client";

import React, { useState, useEffect } from "react";
import { ALL_FROG_LEVELS, FrogLevel } from "@/lib/frogLevelsData";
import { ThreeFrogViewport } from "./ThreeFrogViewport";
import { CheckCircle2, ChevronLeft, ChevronRight, Map, Lightbulb, Play, RotateCcw, Sparkles, Award } from "lucide-react";
import { toast } from "sonner";

export const FrogCssGameRunner: React.FC = () => {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [editorCode, setEditorCode] = useState("");
  const [userCss, setUserCss] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  const level: FrogLevel = ALL_FROG_LEVELS.find((l) => l.id === currentLevelId) || ALL_FROG_LEVELS[0];

  // Load progress from localStorage
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem("mockrithm_frog_game_progress");
      if (savedProgress) {
        setCompletedLevels(JSON.parse(savedProgress));
      }
      const savedLevel = localStorage.getItem("mockrithm_frog_game_level");
      if (savedLevel) {
        const lvlNum = parseInt(savedLevel, 10);
        if (lvlNum >= 1 && lvlNum <= 100) {
          setCurrentLevelId(lvlNum);
        }
      }
    } catch (e) {
      console.warn("Failed to read progress from localStorage:", e);
    }
  }, []);

  // Update editor code when level changes
  useEffect(() => {
    setEditorCode(level.starterCode);
    setUserCss(level.starterCode);
    setIsVictory(false);
    setShowHint(false);
  }, [currentLevelId, level]);

  // Code validation logic
  const handleCheckAnswer = () => {
    setUserCss(editorCode);

    const { regexMatches } = level.validationRules;
    let isPassed = true;

    if (regexMatches && regexMatches.length > 0) {
      for (const pattern of regexMatches) {
        const rx = new RegExp(pattern, "i");
        if (!rx.test(editorCode)) {
          isPassed = false;
          break;
        }
      }
    }

    if (isPassed) {
      setIsVictory(true);
      toast.success(`🎉 Level ${level.id} Cleared! Excellent CSS skills!`);

      // Update completed levels in state & localStorage
      if (!completedLevels.includes(level.id)) {
        const updated = [...completedLevels, level.id];
        setCompletedLevels(updated);
        localStorage.setItem("mockrithm_frog_game_progress", JSON.stringify(updated));
      }
    } else {
      setIsVictory(false);
      toast.error("Not quite right yet! Check your syntax and hints.");
    }
  };

  const handleLevelSelect = (id: number) => {
    setCurrentLevelId(id);
    localStorage.setItem("mockrithm_frog_game_level", id.toString());
    setIsDrawerOpen(false);
  };

  const handleNextLevel = () => {
    if (currentLevelId < 100) {
      handleLevelSelect(currentLevelId + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelId > 1) {
      handleLevelSelect(currentLevelId - 1);
    }
  };

  const handleResetCode = () => {
    setEditorCode(level.starterCode);
    setUserCss(level.starterCode);
    setIsVictory(false);
    toast.info("Reset level starter code.");
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="w-full h-16 border-b border-emerald-500/20 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">
            🐸
          </div>
          <div>
            <h1 className="font-bold text-lg text-white flex items-center gap-2">
              3D Froggy CSS <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">100 Levels</span>
            </h1>
            <p className="text-xs text-slate-400">Master modern CSS with interactive 3D frog models</p>
          </div>
        </div>

        {/* Level Navigation & Drawer toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevLevel}
            disabled={currentLevelId === 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            title="Previous Level"
          >
            <ChevronLeft className="w-5 h-5 text-slate-200" />
          </button>

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-sm flex items-center gap-2 transition"
          >
            <Map className="w-4 h-4" />
            Level {currentLevelId} of 100
          </button>

          <button
            onClick={handleNextLevel}
            disabled={currentLevelId === 100}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            title="Next Level"
          >
            <ChevronRight className="w-5 h-5 text-slate-200" />
          </button>
        </div>
      </header>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Code Editor & Instructions (5 Cols) */}
        <div className="lg:col-span-5 border-r border-emerald-500/20 bg-slate-900/40 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          {/* Level Prompt & Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {level.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" /> Level {level.id}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white">{level.title}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{level.prompt}</p>

            {/* Hint Drawer */}
            <div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition font-semibold"
              >
                <Lightbulb className="w-4 h-4" /> {showHint ? "Hide Hints" : "Need a Hint?"}
              </button>
              {showHint && (
                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                  {level.hints.map((h, idx) => (
                    <p key={idx}>• {h}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
            <div className="h-10 bg-slate-900 px-4 flex items-center justify-between border-b border-slate-800 text-xs text-slate-400">
              <span className="font-mono text-emerald-400">styles.css</span>
              <button
                onClick={handleResetCode}
                className="hover:text-white flex items-center gap-1 transition"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="flex-1 relative p-4 font-mono text-sm">
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-full min-h-[220px] bg-transparent text-emerald-300 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckAnswer}
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
            >
              <Play className="w-4 h-4 fill-white" /> Check Answer & Run Code
            </button>

            {isVictory && (
              <button
                onClick={handleNextLevel}
                className="py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold flex items-center gap-2 border border-emerald-500/30 transition animate-pulse"
              >
                Next Level <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: 3D Viewport & Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-slate-950 relative">
          <ThreeFrogViewport level={level} userCss={userCss} isVictory={isVictory} />
        </div>
      </div>

      {/* Level Selection Drawer / Map Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Select Level (1–100)
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close Map
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-10 gap-2.5 p-2">
              {ALL_FROG_LEVELS.map((lvl) => {
                const isCompleted = completedLevels.includes(lvl.id);
                const isCurrent = lvl.id === currentLevelId;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleLevelSelect(lvl.id)}
                    className={`h-12 rounded-xl border font-mono text-sm font-bold flex items-center justify-center relative transition ${
                      isCurrent
                        ? "bg-emerald-500 text-slate-950 border-emerald-300 shadow-lg shadow-emerald-500/40"
                        : isCompleted
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/40 hover:bg-emerald-900/60"
                        : "bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {lvl.id}
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute top-1 right-1" />
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
