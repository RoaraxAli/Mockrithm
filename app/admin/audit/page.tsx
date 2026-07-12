"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import {
  Shield,
  Loader2,
  Trash2,
  UserCog,
  Download,
  RotateCcw,
  FileText,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAuditLogs } from "@/lib/actions/admin.action";

type AuditLog = {
  id: string;
  adminId: string;
  action: string;
  details: Record<string, any>;
  timestamp: string | null;
};

const ACTION_META: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  DELETE_USER: { label: "Deleted User", icon: Trash2, color: "text-red-400 bg-red-500/10" },
  UPDATE_USER_ROLE: { label: "Changed Role", icon: UserCog, color: "text-blue-400 bg-blue-500/10" },
  RESET_SESSIONS: { label: "Reset Sessions", icon: RotateCcw, color: "text-yellow-400 bg-yellow-500/10" },
  EXPORT_JSON: { label: "Exported Data", icon: Download, color: "text-green-400 bg-green-500/10" },
  DELETE_BLOG: { label: "Deleted Blog", icon: FileText, color: "text-orange-400 bg-orange-500/10" },
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

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
        { opacity: 0, y: 15, filter: "blur(3px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
        }
      );
    }
  }, [loading, logs]);

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Shield className="h-7 w-7 text-gray-400" />
          Audit Logs
        </h1>
        <p className="text-gray-400 mt-2">
          Trail of admin actions — deletions, role changes, exports, and session resets.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400" />
            Recent Admin Actions
            {!loading && (
              <Badge variant="secondary" className="ml-2 bg-white/10 text-gray-300 text-xs">
                {logs.length} entries
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <Separator className="bg-white/10" />
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="size-8 animate-spin text-gray-500" />
              <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                Loading Audit Logs...
              </span>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Shield className="size-10 text-gray-600" />
              <h3 className="text-sm font-bold text-gray-300">No audit logs yet</h3>
              <p className="text-xs text-gray-500">Admin actions will appear here once they occur.</p>
            </div>
          ) : (
            <ScrollArea className="h-[520px] pr-4">
              <div className="space-y-0">
                {logs.map((log, index) => {
                  const meta = ACTION_META[log.action] || {
                    label: log.action,
                    icon: Shield,
                    color: "text-gray-400 bg-white/5",
                  };
                  const ActionIcon = meta.icon;

                  return (
                    <div key={log.id}>
                      <div className="audit-row flex items-center gap-4 p-4 rounded-lg hover:bg-white/[0.02] transition-colors">
                        <div className={`p-2 rounded-lg ${meta.color}`}>
                          <ActionIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-sm">
                              {meta.label}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-[10px] bg-white/5 text-gray-400 border-white/10 font-mono"
                            >
                              {log.adminId.slice(0, 12)}…
                            </Badge>
                          </div>
                          {Object.keys(log.details).length > 0 && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {formatDetails(log.details)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 tabular-nums whitespace-nowrap">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                      {index < logs.length - 1 && (
                        <Separator className="bg-white/5" />
                      )}
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
