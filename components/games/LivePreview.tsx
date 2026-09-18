import React from "react";

interface LivePreviewProps {
  previewDoc: string;
}

export default function LivePreview({ previewDoc }: LivePreviewProps) {
  return (
    <div className="flex-1 min-h-[220px] bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
      <div className="bg-zinc-900/60 border-b border-zinc-900 px-5 py-3 select-none flex items-center justify-between">
        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
          Live Render Sandbox
        </span>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-zinc-800" />
          <span className="w-2 h-2 rounded-full bg-zinc-800" />
          <span className="w-2 h-2 rounded-full bg-zinc-800" />
        </div>
      </div>
      <iframe
        title="live-render-preview"
        srcDoc={previewDoc}
        className="w-full flex-1 bg-white border-none"
        sandbox="allow-scripts"
      />
    </div>
  );
}
