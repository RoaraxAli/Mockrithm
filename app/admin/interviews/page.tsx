"use client";

import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, Plus, Pencil, MoreHorizontal } from "lucide-react";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase/client";
import { getAllInterviews } from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Interview = {
  id: string;
  role: string;
  level: string;
  type: "Technical" | "Behavioural" | "Mixed" | string;
  techstack: string[];
  questions: string[];
  coverImage?: string;
  createdAt: any;
  finalized: boolean;
  createdBy?: "admin" | string;
  userId?: string;
};

// --- Reusable Question Builder ---
function QuestionBuilder({
  questions,
  onChange,
  label = "Interview Questions",
}: {
  questions: string[];
  onChange: (next: string[]) => void;
  label?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const q = draft.trim();
    if (!q) return;
    onChange([...questions, q]);
    setDraft("");
  };

  const remove = (idx: number) => {
    onChange(questions.filter((_, i) => i !== idx));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= questions.length) return;
    const clone = [...questions];
    const [it] = clone.splice(from, 1);
    clone.splice(to, 0, it);
    onChange(clone);
  };

  return (
    <div className="space-y-3">
      <label className="text-foreground text-sm font-medium">{label}</label>

      <div className="space-y-2 max-h-40 overflow-y-auto rounded-lg">
        {questions.length === 0 && (
          <div className="text-zinc-500 dark:text-white/60 text-sm border border-dashed border-zinc-200 dark:border-white/15 rounded p-3">
            No questions yet. Add your first one below.
          </div>
        )}
        {questions.map((q, idx) => (
          <div
            key={`${q}-${idx}`}
            className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/10 p-2 rounded"
          >
            <div className="text-foreground text-sm flex-1">{q}</div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-500 dark:text-white/70 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-white/10"
                onClick={() => move(idx, idx - 1)}
                title="Move up"
              >
                ↑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-500 dark:text-white/70 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-white/10"
                onClick={() => move(idx, idx + 1)}
                title="Move down"
              >
                ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-600"
                onClick={() => remove(idx)}
                title="Remove"
              >
                ✕
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a question and press Enter"
          className="flex-1 bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button className="bg-zinc-950 text-white dark:bg-white dark:text-black" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default function InterviewsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Finalized" | "Draft">("All");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    role: "",
    level: "",
    type: "" as Interview["type"],
    techstack: [] as string[],
    questions: [] as string[],
    coverImage: "",
    finalized: true,
  });

  useEffect(() => {
    let active = true;
    const fetchAll = async () => {
      try {
        const data = await getAllInterviews();
        if (active) {
          setInterviews(data);
        }
      } catch (err) {
        console.error("Failed to load interviews:", err);
      }
    };
    fetchAll();

    // Animations
    if (typeof window !== "undefined") {
      gsap.fromTo(
        ".interviews-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".interviews-card",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".table-row",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }

    return () => {
      active = false;
      if (typeof window !== "undefined") {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      }
    };
  }, []);

  const handleCreateInterview = async () => {
    try {
      const newInterview = {
        role: form.role.trim(),
        level: form.level.trim(),
        type: form.type || "Mixed",
        techstack: form.techstack.map((t) => t.trim()).filter(Boolean),
        questions: form.questions.map((q) => q.trim()).filter(Boolean),
        coverImage: form.coverImage || "/covers/default.png",
        finalized: form.finalized,
        createdAt: Timestamp.now(),
        createdBy: "admin",
        userId: "all-users",
      };

      await addDoc(collection(db, "interviews"), newInterview);

      setForm({
        role: "",
        level: "",
        type: "" as Interview["type"],
        techstack: [],
        questions: [],
        coverImage: "",
        finalized: true,
      });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create interview:", err);
    }
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter((i) => {
      const search = searchTerm.trim().toLowerCase();
      const searchMatch =
        !search ||
        i.role.toLowerCase().includes(search) ||
        i.techstack.join(", ").toLowerCase().includes(search);
      const statusMatch =
        statusFilter === "All" ||
        (statusFilter === "Finalized" ? i.finalized : !i.finalized);
      return searchMatch && statusMatch;
    });
  }, [interviews, searchTerm, statusFilter]);

  const formatDate = (date: any) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-xl space-y-5 text-card-foreground">
            <h2 className="text-xl font-bold text-foreground">Create Interview</h2>

            <Input
              placeholder="Role For The Interview (e.g., Frontend Engineer)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
            />

            <Input
              placeholder="The Job Level (e.g., Junior, Mid, Senior)"
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
            />

            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value as Interview["type"] })}
            >
              <SelectTrigger className="w-full bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10">
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Behavioural">Behavioural</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Cover Image URL (optional)"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              className="bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
            />

            <Input
              placeholder="Tech Stack (comma separated, e.g., React, TypeScript, Firebase)"
              value={form.techstack.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  techstack: e.target.value.split(",").map((t) => t.trim()),
                })
              }
              className="bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
            />

            {/* New, immersive questions UI */}
            <QuestionBuilder
              questions={form.questions}
              onChange={(next) => setForm({ ...form, questions: next })}
            />

            <label className="flex items-center gap-2 text-foreground">
              <input
                type="checkbox"
                checked={form.finalized}
                onChange={(e) =>
                  setForm({ ...form, finalized: e.target.checked })
                }
              />
              Finalized
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="text-foreground"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateInterview} className="bg-foreground text-background">
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Interviews</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage generated interviews</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-zinc-950 text-white hover:bg-zinc-900 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Interview
        </Button>
      </div>

      {/* Table */}
      <Card className="interviews-card bg-card border-border shadow-xs rounded-2xl">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400" />
              <Input
                placeholder="Search by role or tech..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-100 dark:bg-zinc-900/30 text-foreground border-zinc-200 dark:border-white/10">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Finalized">Finalized</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredInterviews.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Role</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Level</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Type</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Tech Stack</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Finalized</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400">Created At</TableHead>
                    <TableHead className="text-zinc-500 dark:text-zinc-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInterviews.map((i) => (
                    <TableRow
                      key={i.id}
                      className="table-row border-border hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="text-foreground font-medium">{i.role}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">{i.level}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">{i.type}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">{i.techstack.join(", ")}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">{i.finalized ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">{formatDate(i.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:bg-zinc-200 dark:hover:bg-white/10"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                            <DropdownMenuItem
                              className="hover:bg-zinc-100 dark:hover:bg-white/10 cursor-pointer"
                              onClick={() => router.push(`/admin/interviews/${i.id}/edit`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">No interviews found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
