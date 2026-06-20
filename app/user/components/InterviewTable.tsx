"use client";

import type { Interview } from "@/app/user/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface InterviewTableProps {
  interviews: Interview[];
}

export function InterviewTable({ interviews }: InterviewTableProps) {
  const router = useRouter();

  const formatDate = (dateVal: Date | string) => {
    const date = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="border border-white/5 rounded-2xl bg-zinc-950/20 backdrop-blur-md overflow-hidden shadow-xl animate-fadeIn">
      <Table>
        <TableHeader className="bg-white/[0.02]">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-gray-300 font-bold text-xs uppercase tracking-wider">Role</TableHead>
            <TableHead className="text-gray-300 font-bold text-xs uppercase tracking-wider">Level</TableHead>
            <TableHead className="text-gray-300 font-bold text-xs uppercase tracking-wider">Type</TableHead>
            <TableHead className="text-gray-300 font-bold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-gray-300 font-bold text-xs uppercase tracking-wider">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow
              key={interview.id}
              className="cursor-pointer hover:bg-white/[0.03] border-white/5 transition-colors duration-300"
              onClick={() => router.push(`/user/interviews/${interview.id}`)}
            >
              <TableCell className="font-semibold text-white capitalize">
                {interview.role}
              </TableCell>
              <TableCell className="text-gray-300 font-medium">{interview.level}</TableCell>
              <TableCell className="text-gray-300 font-medium">{interview.type}</TableCell>
              <TableCell>
                <Badge
                  variant={interview.finalized ? "default" : "secondary"}
                  className={
                    interview.finalized
                      ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-bold"
                      : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-bold"
                  }
                >
                  {interview.finalized ? "Completed" : "In Progress"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-400 font-medium">
                {formatDate(interview.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
