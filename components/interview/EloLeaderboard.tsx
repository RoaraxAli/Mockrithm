"use client";

import { useEffect, useState, useTransition } from "react";
import { getLeaderboardData, getUserEloProfile, LeaderboardUser } from "@/lib/actions/elo.action";
import { Search, Trophy, TrendingUp, Sparkles, Filter, User as UserIcon, RefreshCw, Zap } from "lucide-react";

interface EloLeaderboardProps {
  currentUserId?: string;
}

export function EloLeaderboard({ currentUserId }: EloLeaderboardProps) {
  const [candidates, setCandidates] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await getLeaderboardData({
        searchQuery,
        modeFilter,
        roleFilter,
        limit: 50,
      });

      if (res.success && res.data) {
        setCandidates(res.data);
      }
    } catch (err) {
      console.error("Failed to load leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [modeFilter, roleFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLeaderboard();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (currentUserId) {
      getUserEloProfile(currentUserId).then((data) => {
        if (data) setUserProfile(data);
      });
    }
  }, [currentUserId]);

  // Find user's rank in candidates list
  const userRankIndex = currentUserId ? candidates.findIndex((c) => c.id === currentUserId) : -1;
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : null;

  return (
    <div className="w-full space-y-5 text-zinc-100 font-sans">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Trophy className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Leaderboards & Ratings
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
                  Elo Ranking
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Track candidate skill ratings per role, topic, and interview mode.
              </p>
            </div>
          </div>

          <button
            onClick={loadLeaderboard}
            disabled={loading}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all text-xs flex items-center gap-1.5"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* User Rating Spotlight */}
        {userProfile && (
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/90 to-zinc-950 border border-indigo-500/20 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{userProfile.name}</span>
                    {userRank && (
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Rank #{userRank}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Total Sessions: {userProfile.totalInterviews}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                    Overall Rating
                  </span>
                  <span className="text-xl font-mono font-black text-indigo-400 tracking-tight">
                    {userProfile.overallElo} <span className="text-xs font-semibold text-zinc-500">ELO</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name or role/topic (e.g. Frontend, Backend, Math, Pakistan)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
            />
          </div>

          <div className="md:col-span-5 flex gap-2">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 font-mono focus:outline-none focus:border-indigo-500/50"
            >
              <option value="all">All Modes</option>
              <option value="Technical">Technical</option>
              <option value="Live Coding Sandbox">Sandbox</option>
              <option value="Behavioral">Behavioral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-xl">
        {loading ? (
          <div className="py-12 text-center text-xs text-zinc-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="size-5 animate-spin text-indigo-400" />
            <span>Loading leaderboard rankings...</span>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500">
            No candidate rankings found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-900/40 text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider">
                  <th className="py-3 px-4 w-14">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role / Topic</th>
                  <th className="py-3 px-4 text-right">Numeric Rating</th>
                  <th className="py-3 px-4 text-right max-sm:hidden">Sessions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/80 font-mono">
                {candidates.map((candidate, idx) => {
                  const rank = idx + 1;
                  const isCurrentUser = currentUserId === candidate.id;
                  const displayElo =
                    roleFilter !== "all"
                      ? candidate.roleElo
                      : modeFilter !== "all"
                      ? candidate.modeElo
                      : candidate.overallElo;

                  return (
                    <tr
                      key={candidate.id}
                      className={`transition-colors hover:bg-zinc-900/40 ${
                        isCurrentUser ? "bg-indigo-950/20 font-bold border-l-2 border-indigo-500" : ""
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4 font-bold text-xs">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-zinc-400/20 text-zinc-300 border border-zinc-400/30">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/30">
                            3
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono pl-1">#{rank}</span>
                        )}
                      </td>

                      {/* Candidate Name */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300">
                            {candidate.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
                              {candidate.name}
                              {isCurrentUser && (
                                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
                                  YOU
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role / Topic */}
                      <td className="py-3.5 px-4 text-zinc-400 text-[11px] font-mono">
                        {candidate.targetRole}
                      </td>

                      {/* Numeric Elo Rating */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-sm font-mono font-black text-indigo-400 tracking-tight">
                          {displayElo}{" "}
                          <span className="text-[10px] font-normal text-zinc-500">ELO</span>
                        </span>
                      </td>

                      {/* Total Sessions */}
                      <td className="py-3.5 px-4 text-right text-zinc-400 text-xs font-mono max-sm:hidden">
                        {candidate.totalInterviews}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
