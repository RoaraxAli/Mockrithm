"use client"

import { useEffect, useState, useMemo } from "react"
import { getInterviewFeedbacks, deleteInterviewFeedback } from "@/lib/actions/admin.action";
import { useRouter } from "next/navigation"
import {
  Search,
  Trash2,
  MoreHorizontal,
  Eye,
  Star,
  User,
  Calendar,
  Award,
  TrendingUp,
  AlertCircle,
  FileText,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock
} from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Feedback {
  id: string
  candidateName: string
  email: string
  interviewer: string
  score: number | string
  createdAt: string
  finalAssessment: string
  areasForImprovement: string[]
  categoryScores: Array<{
    name: string
    score: number
    comment: string
  }>
}

export default function InterviewFeedbackPage() {
  const router = useRouter()

  // State variables
  const [searchTerm, setSearchTerm] = useState("")
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)

  // Selection & Pagination States
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getInterviewFeedbacks();
        if (res.success && res.data) {
          const feedbackData = res.data.map((data: any) => ({
            id: data.id,
            candidateName: data.candidateName || "Unknown Candidate",
            email: data.email || "No Email Provided",
            interviewer: data.interviewer || "MOCKRITHM",
            score: data.score || 0,
            createdAt: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown Date",
            finalAssessment: data.finalAssessment || "",
            areasForImprovement: data.areasForImprovement || [],
            categoryScores: data.categoryScores || [],
          }));
          setFeedbacks(feedbackData);
        }
      } catch (err) {
        console.error("Error fetching interview feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // GSAP animation when load completes
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".table-row",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    }
  }, [loading, currentPage, searchTerm, sortBy]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      try {
        const res = await deleteInterviewFeedback(id);
        if (res.success) {
          setFeedbacks((prev) => prev.filter((f) => f.id !== id));
          setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
          if (selectedFeedback?.id === id) {
            setSelectedFeedback(null);
          }
        }
      } catch (err) {
        console.error("Error deleting feedback:", err);
      }
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} feedback submissions?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteInterviewFeedback(id)));
        setFeedbacks(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  // Processing Data: Filtering, Sorting, Pagination
  const processedFeedbacks = useMemo(() => {
    let result = [...feedbacks];

    // Filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        f =>
          f.candidateName.toLowerCase().includes(lower) ||
          f.email.toLowerCase().includes(lower) ||
          f.interviewer.toLowerCase().includes(lower)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === "highest") return Number(b.score) - Number(a.score)
      if (sortBy === "lowest") return Number(a.score) - Number(b.score)
      return 0
    });

    return result;
  }, [feedbacks, searchTerm, sortBy]);

  // Paginated Data
  const paginatedFeedbacks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedFeedbacks.slice(startIndex, startIndex + pageSize);
  }, [processedFeedbacks, currentPage, pageSize]);

  const totalPages = Math.ceil(processedFeedbacks.length / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentIds = paginatedFeedbacks.map(f => f.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = paginatedFeedbacks.map(f => f.id);
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  const isAllSelected = paginatedFeedbacks.length > 0 && paginatedFeedbacks.every(item => selectedIds.includes(item.id));

  const getScoreColor = (score: number | string) => {
    const numScore = Number(score)
    if (numScore >= 80) return "text-emerald-400"
    if (numScore >= 60) return "text-amber-400"
    return "text-rose-400"
  }

  const getScoreBadgeVariant = (score: number | string) => {
    const numScore = Number(score)
    if (numScore >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
    if (numScore >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/10"
    return "bg-rose-500/10 text-rose-400 border-rose-500/10"
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans">Interview Feedback</h1>
          <p className="text-zinc-400 mt-1 text-sm">Manage and review submitted AI interview feedback records.</p>
        </div>
        <div>
          <Badge variant="outline" className="bg-zinc-900 border-white/5 text-zinc-300">
            {feedbacks.length} Total Submissions
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-950 border-white/5 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold text-zinc-100 mt-1">
                {feedbacks.length > 0
                  ? Math.round(feedbacks.reduce((acc, f) => acc + Number(f.score || 0), 0) / feedbacks.length)
                  : 0}%
              </p>
            </div>
            <Award className="h-8 w-8 text-zinc-600" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">High Performers</p>
              <p className="text-3xl font-bold text-zinc-100 mt-1">
                {feedbacks.filter((f) => Number(f.score) >= 80).length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-zinc-600" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-white/5 shadow-none">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-zinc-100 mt-1">
                {
                  feedbacks.filter((f) => {
                    const feedbackDate = new Date(f.createdAt)
                    const currentMonth = new Date().getMonth()
                    return feedbackDate.getMonth() === currentMonth
                  }).length
                }
              </p>
            </div>
            <Calendar className="h-8 w-8 text-zinc-600" />
          </CardContent>
        </Card>
      </div>

      {/* Bulk Action Context Banner */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-zinc-900 border border-indigo-500/20 px-4 py-3 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-zinc-200">
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="bg-rose-500 hover:bg-rose-600 text-white border-none"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="bg-zinc-950 border border-white/5 shadow-none overflow-hidden">
        <CardHeader className="border-b border-white/5 space-y-4">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-zinc-500" />
            Feedback Submissions
          </CardTitle>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by candidate, email, or interviewer..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 bg-zinc-900/30 border-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 rounded-md"
              />
            </div>

            <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900/30 border-white/5 text-zinc-200">
                <Filter className="h-4 w-4 mr-2 text-zinc-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Score</SelectItem>
                <SelectItem value="lowest">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                    />
                  </TableHead>
                  <TableHead className="text-zinc-400 font-medium">Name</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Email</TableHead>                   
                  <TableHead className="text-zinc-400 font-medium">Interviewer</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Score</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Date</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                  <TableHead className="w-[100px] text-zinc-400 font-medium text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx} className="border-b border-white/5">
                      <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-36 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-12 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-900" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-8 w-16 ml-auto bg-zinc-900" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedFeedbacks.length > 0 ? (
                  paginatedFeedbacks.map((f) => {
                    const isSelected = selectedIds.includes(f.id);
                    return (
                      <TableRow
                        key={f.id}
                        className={`table-row border-b border-white/5 hover:bg-zinc-900/30 transition-colors ${
                          isSelected ? "bg-indigo-500/5 hover:bg-indigo-500/10" : ""
                        }`}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(prev => [...prev, f.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== f.id));
                              }
                            }}
                            className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          />
                        </TableCell>
                        <TableCell className="text-zinc-100 font-medium">{f.candidateName}</TableCell>
                        <TableCell className="text-zinc-400">{f.email}</TableCell>
                        <TableCell className="text-zinc-300">{f.interviewer}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getScoreBadgeVariant(f.score)} font-medium border`}>
                            {f.score}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-400 text-xs">{f.createdAt}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`border ${Number(f.score) >= 70
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/10"
                              }`}
                          >
                            {Number(f.score) >= 70 ? "Passed" : "Review"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                                  onClick={() => setSelectedFeedback(f)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-zinc-950 border border-white/5 max-w-4xl max-h-[85vh] text-zinc-100">
                                <DialogHeader>
                                  <DialogTitle className="text-zinc-100 flex items-center gap-2 font-sans font-semibold">
                                    <User className="h-5 w-5 text-zinc-400" />
                                    Interview Feedback - {selectedFeedback?.candidateName}
                                  </DialogTitle>
                                </DialogHeader>

                                <ScrollArea className="max-h-[65vh] pr-4">
                                  <div className="space-y-6 mt-4">
                                    {/* Candidate Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Card className="bg-zinc-900/30 border-white/5 shadow-none">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-500 font-medium">Candidate</span>
                                          </div>
                                          <p className="text-zinc-100 font-medium text-base">{selectedFeedback?.candidateName}</p>
                                          <p className="text-zinc-400 text-sm mt-1">{selectedFeedback?.email}</p>
                                        </CardContent>
                                      </Card>

                                      <Card className="bg-zinc-900/30 border-white/5 shadow-none">
                                        <CardContent className="p-4">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Award className="h-4 w-4 text-zinc-400" />
                                            <span className="text-xs text-zinc-500 font-medium">Overall Score</span>
                                          </div>
                                          <div className="flex items-center gap-4">
                                            <span
                                              className={`text-2xl font-bold ${getScoreColor(selectedFeedback?.score || 0)}`}
                                            >
                                              {selectedFeedback?.score}%
                                            </span>
                                            <Progress
                                              value={Number(selectedFeedback?.score || 0)}
                                              className="flex-1 h-1.5 bg-zinc-800"
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {/* Category Scores */}
                                    {selectedFeedback?.categoryScores && selectedFeedback.categoryScores.length > 0 && (
                                      <Card className="bg-zinc-900/30 border-white/5 shadow-none">
                                        <CardHeader>
                                          <CardTitle className="text-zinc-200 text-sm font-semibold flex items-center gap-2">
                                            <Star className="h-4 w-4 text-zinc-400" />
                                            Category Breakdown
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                          {selectedFeedback.categoryScores.map((category, index) => (
                                            <div key={index} className="space-y-2">
                                              <div className="flex justify-between items-center text-sm">
                                                <span className="text-zinc-200 font-medium">{category.name}</span>
                                                <Badge variant="outline" className={getScoreBadgeVariant(category.score)}>
                                                  {category.score}%
                                                </Badge>
                                              </div>
                                              <Progress value={category.score} className="h-1.5 bg-zinc-800" />
                                              {category.comment && (
                                                <p className="text-zinc-400 text-xs leading-relaxed">{category.comment}</p>
                                              )}
                                            </div>
                                          ))}
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Final Assessment */}
                                    {selectedFeedback?.finalAssessment && (
                                      <Card className="bg-zinc-900/30 border-white/5 shadow-none">
                                        <CardHeader>
                                          <CardTitle className="text-zinc-200 text-sm font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-zinc-400" />
                                            Final Assessment
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-zinc-300 text-sm leading-relaxed">
                                            {selectedFeedback.finalAssessment}
                                          </p>
                                        </CardContent>
                                      </Card>
                                    )}

                                    {/* Areas for Improvement */}
                                    {selectedFeedback?.areasForImprovement &&
                                      selectedFeedback.areasForImprovement.length > 0 && (
                                        <Card className="bg-zinc-900/30 border-white/5 shadow-none">
                                          <CardHeader>
                                            <CardTitle className="text-zinc-200 text-sm font-semibold flex items-center gap-2">
                                              <AlertCircle className="h-4 w-4 text-zinc-400" />
                                              Areas for Improvement
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <ul className="space-y-2">
                                              {selectedFeedback.areasForImprovement.map((area, index) => (
                                                <li key={index} className="flex items-start gap-2 text-zinc-300 text-sm">
                                                  <span className="text-indigo-400 mt-1.5">•</span>
                                                  <span>{area}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </CardContent>
                                        </Card>
                                      )}
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-zinc-950 border border-white/5 text-zinc-200">
                                <DropdownMenuItem
                                  className="text-rose-400 hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer"
                                  onClick={() => handleDelete(f.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Feedback
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500 text-sm">
                      <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                      No feedback found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-zinc-900/10">
              <span className="text-xs text-zinc-500">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedFeedbacks.length)} of {processedFeedbacks.length} entries
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/5 bg-zinc-950 text-zinc-400 hover:text-white"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs font-semibold text-zinc-300">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-white/5 bg-zinc-950 text-zinc-400 hover:text-white"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
