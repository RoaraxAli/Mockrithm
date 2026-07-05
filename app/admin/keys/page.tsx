"use client";

import { useEffect, useState } from "react";
import { Key, RefreshCw, AlertTriangle, CheckCircle, Clock, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KeyStatus {
  name: string;
  maskedKey: string;
  remainingTokens: number;
  remainingRequests: number;
  limitTokens: number;
  limitRequests: number;
  resetTokensAt: number;
  resetRequestsAt: number;
  blockedUntil: number;
  remainingAudios: number;
  limitAudios: number;
  resetAudiosAt: number;
}

export default function ApiKeysTelemetryPage() {
  const [keys, setKeys] = useState<KeyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKeyStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/keys");
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Access Denied: Admin role required.");
        }
        throw new Error("Failed to load keys telemetry.");
      }
      const data = await res.json();
      setKeys(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyStats();
  }, []);

  const getStatusBadge = (key: KeyStatus) => {
    const now = Date.now();
    if (key.blockedUntil > now) {
      const remainingSecs = Math.round((key.blockedUntil - now) / 1000);
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-950/20 border border-rose-500/20 text-rose-400 flex items-center gap-1.5 shadow-sm shrink-0">
          <AlertTriangle className="size-3.5" />
          Rate Limited ({remainingSecs}s)
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-sm shrink-0">
        <CheckCircle className="size-3.5" />
        Healthy
      </span>
    );
  };

  const getRelativeTime = (timestamp: number) => {
    if (!timestamp) return "0s";
    const diff = timestamp - Date.now();
    if (diff <= 0) return "0s";
    return `${Math.round(diff / 1000)}s`;
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans min-h-[80vh]">
      {/* Header Deck */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
            <Key className="size-6 text-violet-400" />
            API Key Telemetry
          </h1>
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1.5">
            Real-time tracking of in-memory load balancing and rate limits
          </p>
        </div>
        <Button
          onClick={fetchKeyStats}
          disabled={loading}
          className="text-xs font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-xl h-10 px-4 flex items-center gap-2 transition-all duration-300"
        >
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh Stats"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/15 border border-rose-900/50 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-3">
          <AlertTriangle className="size-4" />
          {error}
        </div>
      )}

      {loading && keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 gap-4">
          <RefreshCw className="size-8 text-zinc-500 animate-spin" />
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
            Loading Api Telemetry...
          </p>
        </div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-20 gap-3 border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
          <AlertTriangle className="size-8 text-zinc-600" />
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
            No API Keys Configured in Environment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {keys.map((key, index) => {
            const tokenPercent = Math.max(0, Math.min(100, (key.remainingTokens / (key.limitTokens || 1)) * 100));
            const reqPercent = Math.max(0, Math.min(100, (key.remainingRequests / (key.limitRequests || 1)) * 100));
            const audioPercent = Math.max(0, Math.min(100, (key.remainingAudios / (key.limitAudios || 1)) * 100));

            return (
              <div
                key={index}
                className="p-6 backdrop-blur-xl bg-zinc-950/30 border border-zinc-900 rounded-2xl flex flex-col gap-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/20 shadow-2xl group"
              >
                {/* Top header row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {key.name}
                    </span>
                    <code className="text-[10px] text-zinc-500 font-mono tracking-wider">
                      {key.maskedKey}
                    </code>
                  </div>
                  {getStatusBadge(key)}
                </div>

                {/* Progress token bars */}
                <div className="flex flex-col gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-900/60">
                  {/* Tokens Gauge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      <span>Tokens remaining</span>
                      <span className="font-mono text-zinc-200">
                        {key.remainingTokens.toLocaleString()} / {(key.limitTokens || 100000).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          tokenPercent > 50
                            ? "bg-violet-500"
                            : tokenPercent > 20
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${tokenPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Requests Gauge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                      <span>Requests Remaining</span>
                      <span className="font-mono text-zinc-200">
                        {key.remainingRequests.toLocaleString()} / {(key.limitRequests || 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          reqPercent > 50
                            ? "bg-violet-400"
                            : reqPercent > 20
                            ? "bg-amber-400"
                            : "bg-rose-400"
                        }`}
                        style={{ width: `${reqPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Whisper Audio Gauge */}
                  <div className="flex flex-col gap-1.5 border-t border-zinc-900 pt-3 mt-1">
                    <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400 items-center">
                      <span className="flex items-center gap-1">
                        <Mic className="size-3 text-violet-400" />
                        Whisper Audio Transcriptions (RPM)
                      </span>
                      <span className="font-mono text-zinc-200">
                        {key.remainingAudios} / {key.limitAudios} RPM
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          audioPercent > 50
                            ? "bg-cyan-500"
                            : audioPercent > 20
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${audioPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Time reset counters */}
                <div className="grid grid-cols-3 gap-3 text-zinc-400 text-[9px] font-bold uppercase">
                  <div className="flex items-center gap-1.5 bg-zinc-950/20 border border-zinc-900 p-2.5 rounded-xl">
                    <Clock className="size-3.5 text-zinc-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-500">Tokens Reset</span>
                      <span className="font-mono text-zinc-300 mt-0.5">
                        {getRelativeTime(key.resetTokensAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-950/20 border border-zinc-900 p-2.5 rounded-xl">
                    <Clock className="size-3.5 text-zinc-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-500">Requests Reset</span>
                      <span className="font-mono text-zinc-300 mt-0.5">
                        {getRelativeTime(key.resetRequestsAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 bg-zinc-950/20 border border-zinc-900 p-2.5 rounded-xl">
                    <Clock className="size-3.5 text-zinc-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[7px] text-zinc-500">Whisper Reset</span>
                      <span className="font-mono text-zinc-300 mt-0.5">
                        {getRelativeTime(key.resetAudiosAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
