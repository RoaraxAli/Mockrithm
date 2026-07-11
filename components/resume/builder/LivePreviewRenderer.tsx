"use client";

import { useEffect, useState, useRef } from "react";
import { useResumeStore } from "@/lib/store/resumeStore";
import { useUser } from "@clerk/nextjs";
import { Loader2, RefreshCw } from "lucide-react";

export default function LivePreviewRenderer() {
  const { parsedData, resumeId } = useResumeStore();
  const { user } = useUser();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!resumeId || !user?.id) return;

    setLoading(true);
    setError(null);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch("/api/resume/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            resumeId: resumeId,
            parsedData: parsedData,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to compile live PDF preview");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        if (prevUrlRef.current) {
          URL.revokeObjectURL(prevUrlRef.current);
        }
        prevUrlRef.current = url;
        setPdfUrl(url);
      } catch (err: any) {
        console.error(err);
        setError("Unable to render PDF preview");
      } finally {
        setLoading(false);
      }
    }, 1500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [parsedData, resumeId, user?.id]);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-[85vh] relative gap-4 py-4 pr-4">
      {/* Rendering Controls or Status */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-white/50">
        <span className="flex items-center gap-1.5">
          {loading ? (
            <>
              <Loader2 className="size-3 animate-spin text-cyan-400" />
              Compiling real PDF...
            </>
          ) : (
            <>
              <RefreshCw className="size-3 text-emerald-400" />
              Real PDF synced
            </>
          )}
        </span>
        <span>A4 Layout View</span>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full bg-zinc-950 border border-white/5 rounded-xl overflow-hidden relative shadow-2xl">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-red-400/80">
            {error}
          </div>
        )}

        {!pdfUrl && loading && (
          <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center text-xs font-mono text-zinc-500">
            <Loader2 className="size-6 animate-spin text-white/40" />
            Initializing preview canvas...
          </div>
        )}

        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none bg-white rounded-xl"
            title="Resume Live PDF Preview"
          />
        )}
      </div>
    </div>
  );
}
