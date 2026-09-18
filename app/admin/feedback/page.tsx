"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Search,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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
import { getFeedbacks, deleteFeedback, updateFeedbackStatus } from "@/lib/actions/admin.action";

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  date: string;
  status: string;
};

export default function FeedbackPage() {
  const router = useRouter();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sorting & Pagination States
  const [sortField, setSortField] = useState<keyof FeedbackItem>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getFeedbacks();
        if (res.success && res.data) {
          const feedbackData = res.data.map((data: any) => ({
            id: data.id,
            name: data.name || "",
            email: data.email || "",
            type: data.type || "General",
            message: data.message || "",
            date: data.createdAt
              ? new Date(data.createdAt).toLocaleDateString()
              : "N/A",
            status: data.status || "Open",
          }));
          setFeedback(feedbackData);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  // Animation triggers when load finishes
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".feedback-row",
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
  }, [loading, currentPage, typeFilter, statusFilter, searchTerm]);

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      try {
        await Promise.all(selectedIds.map(id => deleteFeedback(id)));
        setFeedback(prev => prev.filter(item => !selectedIds.includes(item.id)));
        setSelectedIds([]);
      } catch (error) {
        console.error("Bulk delete failed:", error);
      }
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    try {
      await Promise.all(selectedIds.map(id => updateFeedbackStatus(id, newStatus)));
      setFeedback(prev =>
        prev.map(item =>
          selectedIds.includes(item.id) ? { ...item, status: newStatus } : item
        )
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk status change failed:", error);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      const res = await deleteFeedback(id);
      if (res.success) {
        setFeedback((prev) => prev.filter((item) => item.id !== id));
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      }
    } catch (error) {
      console.error("Failed to delete feedback:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateFeedbackStatus(id, newStatus);
      if (res.success) {
        setFeedback((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSort = (field: keyof FeedbackItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Processing Data: Filtering, Sorting, Pagination
  const processedData = useMemo(() => {
    let result = [...feedback];

    // 1. Search Filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(lower) ||
          item.email.toLowerCase().includes(lower) ||
          item.message.toLowerCase().includes(lower)
      );
    }

    // 2. Type Filter
    if (typeFilter !== "all") {
      result = result.filter(
        item => item.type.toLowerCase().replace(/\s+/g, "") === typeFilter
      );
    }

    // 3. Status Filter
    if (statusFilter !== "all") {
      result = result.filter(
        item => item.status.toLowerCase() === statusFilter
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "date") {
        aVal = new Date(a.date).getTime().toString();
        bVal = new Date(b.date).getTime().toString();
      }

      if (sortOrder === "asc") {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });

    return result;
  }, [feedback, searchTerm, typeFilter, statusFilter, sortField, sortOrder]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentIds = paginatedData.map(item => item.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = paginatedData.map(item => item.id);
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Feedback Management</h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Review user suggestions, issue reports, and questions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            {feedback.filter((f) => f.status === "Resolved").length} Resolved
          </Badge>
          <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border border-amber-500/10">
            {feedback.filter((f) => f.status === "In Progress").length} Processing
          </Badge>
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
            {feedback.filter((f) => f.status === "Open").length} New
          </Badge>
        </div>
      </div>

      {/* Bulk Action Context Banner */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-zinc-900 border border-indigo-500/20 px-4 py-3 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-zinc-200">
            {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("Resolved")}
              className="text-zinc-300 hover:text-white border-white/5 bg-zinc-950"
            >
              Mark Resolved
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusChange("In Progress")}
              className="text-zinc-300 hover:text-white border-white/5 bg-zinc-950"
            >
              Mark In Progress
            </Button>
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
        </div>
      )}

      {/* Main Table Card */}
      <Card className="bg-zinc-950 border border-white/5 shadow-none overflow-hidden">
        <CardHeader className="border-b border-white/5 space-y-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-zinc-500" />
            <span>Feedbacks List</span>
          </CardTitle>
          
          {/* Controls: Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search by name, email, or content..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 bg-zinc-900/30 border-white/5 focus:border-white/20 text-zinc-100 rounded-md placeholder:text-zinc-500"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Select value={typeFilter} onValueChange={(val) => { setTypeFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px] bg-zinc-900/30 border-white/5 text-zinc-200">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="bugreport">Bug Report</SelectItem>
                  <SelectItem value="featurerequest">Feature Request</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                <SelectTrigger className="w-[160px] bg-zinc-900/30 border-white/5 text-zinc-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <TableHead className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1.5">
                      Name
                      <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                    </div>
                  </TableHead>
                  <TableHead className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200" onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-1.5">
                      Email
                      <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                    </div>
                  </TableHead>
                  <TableHead className="text-zinc-400 font-medium">Type</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Message</TableHead>
                  <TableHead className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1.5">
                      Status
                      <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                    </div>
                  </TableHead>
                  <TableHead className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200" onClick={() => handleSort("date")}>
                    <div className="flex items-center gap-1.5">
                      Date
                      <ArrowUpDown className="h-3 w-3 text-zinc-500" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px] text-zinc-400 font-medium text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx} className="border-b border-white/5">
                      <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 bg-zinc-900" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 ml-auto bg-zinc-900" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <TableRow
                        key={item.id}
                        onClick={() => router.push(`/admin/feedback/${item.id}`)}
                        className={`feedback-row border-b border-white/5 hover:bg-zinc-900/30 transition-colors cursor-pointer ${
                          isSelected ? "bg-indigo-500/5 hover:bg-indigo-500/10" : ""
                        }`}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(prev => [...prev, item.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== item.id));
                              }
                            }}
                            className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          />
                        </TableCell>
                        
                        <TableCell className="font-medium text-zinc-100">{item.name}</TableCell>
                        <TableCell className="text-zinc-400">{item.email}</TableCell>
                        
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`border ${
                              item.type === "Bug Report"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/10"
                                : item.type === "Feature Request"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/10"
                                : "bg-zinc-800 text-zinc-400 border-zinc-800"
                            }`}
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="max-w-[200px] truncate text-zinc-400">{item.message}</TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {item.status === "Resolved" && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                            {item.status === "In Progress" && <Clock className="h-3.5 w-3.5 text-amber-500" />}
                            {item.status === "Open" && <AlertCircle className="h-3.5 w-3.5 text-indigo-500" />}
                            <span className={`text-xs font-semibold ${
                              item.status === "Resolved"
                                ? "text-emerald-400"
                                : item.status === "In Progress"
                                ? "text-amber-400"
                                : "text-indigo-400"
                            }`}>{item.status}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-zinc-400 text-xs">{item.date}</TableCell>
                        
                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-950 border border-white/5 text-zinc-200">
                              <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Open")} className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                                Mark as Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(item.id, "In Progress")} className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                                Mark as In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(item.id, "Resolved")} className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteFeedback(item.id)} className="hover:bg-zinc-900 focus:bg-zinc-900 text-rose-400 hover:text-rose-400 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500 text-sm">
                      No feedbacks matching your query.
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} entries
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
  );
}
