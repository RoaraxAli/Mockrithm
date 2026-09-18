"use client";

import { useEffect, useState, useMemo } from "react";
import { gsap } from "gsap";
import {
  Shield,
  Trash2,
  UserCog,
  Download,
  RotateCcw,
  FileText,
  Clock,
  Search,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuditLogs } from "@/lib/actions/admin.action";

type AuditLog = {
  id: string;
  adminId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string | null;
};

const ACTION_META: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  DELETE_USER: { label: "Deleted User", icon: Trash2, color: "text-rose-400 bg-rose-500/10" },
  UPDATE_USER_ROLE: { label: "Changed Role", icon: UserCog, color: "text-indigo-400 bg-indigo-500/10" },
  RESET_SESSIONS: { label: "Reset Sessions", icon: RotateCcw, color: "text-amber-400 bg-amber-500/10" },
  EXPORT_JSON: { label: "Exported Data", icon: Download, color: "text-emerald-400 bg-emerald-500/10" },
  DELETE_BLOG: { label: "Deleted Blog", icon: FileText, color: "text-orange-400 bg-orange-500/10" },
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getAuditLogs(100);
        if (res.success && res.data) {
          setLogs(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!loading && logs.length > 0) {
      gsap.fromTo(
        ".audit-row",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.03,
          ease: "power2.out",
        }
      );
    }
  }, [loading, searchTerm, actionFilter]);

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return "Unknown";
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDetails = (details: Record<string, any>) => {
    return Object.entries(details)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const label = ACTION_META[log.action]?.label || log.action;
      const detailsStr = formatDetails(log.details);
      
      const matchesSearch = 
        label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detailsStr.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesAction = 
        actionFilter === "all" || 
        log.action.toLowerCase() === actionFilter.toLowerCase();
        
      return matchesSearch && matchesAction;
    });
  }, [logs, searchTerm, actionFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          <Shield className="h-7 w-7 text-zinc-400" />
          Audit Logs
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Trail of administrative actions—deletions, role changes, exports, and resets.
        </p>
      </div>

      <Card className="bg-zinc-950 border border-white/5 shadow-none overflow-hidden animate-fade-rise">
        <CardHeader className="border-b border-white/5 space-y-4">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-500" />
            <span>Recent Admin Actions</span>
            {!loading && (
              <Badge variant="secondary" className="ml-2 bg-zinc-900 border-white/5 text-zinc-300 text-xs">
                {filteredLogs.length} entries
              </Badge>
            )}
          </CardTitle>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search logs by action, admin, or detail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-zinc-900/30 border-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 rounded-md"
              />
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900/30 border-white/5 text-zinc-200">
                <Filter className="h-4 w-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="delete_user">Deleted User</SelectItem>
                <SelectItem value="update_user_role">Changed Role</SelectItem>
                <SelectItem value="reset_sessions">Reset Sessions</SelectItem>
                <SelectItem value="export_json">Exported Data</SelectItem>
                <SelectItem value="delete_blog">Deleted Blog</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-white/5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4">
                  <Skeleton className="h-8 w-8 rounded-lg bg-zinc-900" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 bg-zinc-900" />
                    <Skeleton className="h-3 w-48 bg-zinc-900" />
                  </div>
                  <Skeleton className="h-4 w-24 bg-zinc-900" />
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
              <Shield className="h-10 w-10 text-zinc-700" />
              <h3 className="text-sm font-semibold text-zinc-400">No actions found</h3>
              <p className="text-xs text-zinc-500">Either no logs have occurred or your filter yields nothing.</p>
            </div>
          ) : (
            <ScrollArea className="h-[520px]">
              <div className="divide-y divide-white/5">
                {filteredLogs.map((log) => {
                  const meta = ACTION_META[log.action] || {
                    label: log.action,
                    icon: Shield,
                    color: "text-zinc-400 bg-zinc-900",
                  };
                  const ActionIcon = meta.icon;

                  return (
                    <div
                      key={log.id}
                      className="audit-row flex items-center gap-4 p-4 hover:bg-zinc-900/10 transition-colors"
                    >
                      <div className={`p-2 rounded-md ${meta.color}`}>
                        <ActionIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-zinc-200 text-sm">
                            {meta.label}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-[10px] bg-zinc-900 text-zinc-500 border border-white/5 font-mono shadow-none"
                          >
                            {log.adminId.slice(0, 12)}…
                          </Badge>
                        </div>
                        {Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-zinc-500 mt-1 truncate max-w-2xl font-mono">
                            {formatDetails(log.details)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 tabular-nums whitespace-nowrap pr-4">
                        {formatTimestamp(log.timestamp)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
