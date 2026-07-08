import React from "react";

interface GitGameProps {
  gitTerminalLogs: string[];
  gitCommandInput: string;
  setGitCommandInput: (val: string) => void;
  handleGitCommandSubmit: (e: React.FormEvent) => void;
}

export default function GitGame({
  gitTerminalLogs,
  gitCommandInput,
  setGitCommandInput,
  handleGitCommandSubmit,
}: GitGameProps) {
  return (
    <div className="flex-1 flex flex-col gap-2 bg-black/60 border border-zinc-900 rounded-xl p-3 font-mono text-[10px]">
      <div className="flex-1 overflow-y-auto max-h-[80px] text-zinc-400 space-y-1 select-text">
        {gitTerminalLogs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <form onSubmit={handleGitCommandSubmit} className="flex gap-2 border-t border-zinc-900 pt-2 select-none">
        <span className="text-zinc-500 font-bold select-none pt-1.5">$</span>
        <input
          type="text"
          value={gitCommandInput}
          onChange={(e) => setGitCommandInput(e.target.value)}
          placeholder="Type git command..."
          className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder-zinc-700 font-mono"
        />
      </form>
    </div>
  );
}
