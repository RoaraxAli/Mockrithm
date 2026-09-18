"use client";

import React, { useState } from "react";

interface FeedbackTabsProps {
  candidateCode: string;
}

export const FeedbackTabs = ({ candidateCode }: FeedbackTabsProps) => {
  let files: Record<string, string> = {};
  try {
    if (candidateCode.trim().startsWith("{")) {
      files = JSON.parse(candidateCode);
    } else {
      files = { "solution_code.txt": candidateCode };
    }
  } catch (e) {
    files = { "solution_code.txt": candidateCode };
  }

  const fileKeys = Object.keys(files);
  const [activeFile, setActiveFile] = useState(fileKeys[0] || "");

  if (fileKeys.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-800 pb-10">
      <div className="flex items-center justify-between text-[10px] text-zinc-550 uppercase tracking-widest font-bold font-mono">
        <span>02 / submitted_workspace_code</span>
        <span>saved_draft</span>
      </div>
      
      <div className="rounded border border-zinc-800 overflow-hidden bg-zinc-950/50">
        {/* VS Code-like File Tab Selection Deck */}
        <div className="flex border-b border-zinc-900 bg-zinc-900 overflow-x-auto custom-scrollbar">
          {fileKeys.map((key) => {
            const isActive = activeFile === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFile(key)}
                className={`px-5 py-2.5 text-[9px] font-bold tracking-wider uppercase border-r border-zinc-900 transition-all font-mono cursor-pointer ${
                  isActive
                    ? "bg-zinc-950 text-white border-t border-t-white"
                    : "text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30"
                }`}
              >
                {key.toLowerCase().endsWith(".txt") || key.toLowerCase().endsWith(".js") || key.toLowerCase().endsWith(".ts")
                  ? key
                  : `${key.replace(/\s+/g, "_").toLowerCase()}.js`}
              </button>
            );
          })}
        </div>

        {/* Selected File Content Viewer */}
        <pre className="text-xs text-zinc-350 p-5 overflow-x-auto max-h-[320px] custom-scrollbar leading-relaxed font-mono select-text bg-black/10">
          <code>{files[activeFile]}</code>
        </pre>
      </div>
    </div>
  );
};
