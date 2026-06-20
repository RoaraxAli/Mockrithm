"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  Search,
  Trash2,
  MoreHorizontal,
  MessageSquare,
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
import {
  getSupportFeedback,
  deleteSupportFeedback,
  updateSupportFeedbackStatus,
} from "@/lib/actions/admin.action";

gsap.registerPlugin(ScrollTrigger);

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
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getSupportFeedback();
        if (res.success && res.data) {
          setFeedback(res.data);
        } else {
          throw new Error(res.error || "Failed to load feedback");
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();

    gsap.fromTo(
      ".feedback-row",
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

    gsap.fromTo(
      ".feedback-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".feedback-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleDeleteFeedback = async (id: string) => {
    try {
      const res = await deleteSupportFeedback(id);
      if (!res.success) throw new Error(res.error);
      setFeedback((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete feedback:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await updateSupportFeedbackStatus(id, newStatus);
      if (!res.success) throw new Error(res.error);
      setFeedback((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filteredFeedback = [...feedback]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        typeFilter === "all" ||
        item.type.toLowerCase().replace(/\s+/g, "") === typeFilter;
      return matchesSearch && matchesType;
    });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-gray-400 mt-2">
            Manage user feedback and support requests
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            {feedback.filter((f) => f.status === "Open").length} Open
          </Badge>
          <Badge
            variant="secondary"
            className="bg-yellow-500/20 text-yellow-400"
          >
            {feedback.filter((f) => f.status === "In Progress").length} In
            Progress
          </Badge>
          <Badge
            variant="secondary"
            className="bg-green-500/20 text-green-400"
          >
            {feedback.filter((f) => f.status === "Resolved").length} Resolved
          </Badge>
        </div>
      </div>

      <Card className="feedback-card bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback Management
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-white/20"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-sm border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bugreport">Bug Report</SelectItem>
                <SelectItem value="featurerequest">Feature Request</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Message</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
             <TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8">
        Loading feedback...
      </TableCell>
    </TableRow>
  ) : filteredFeedback.length > 0 ? (
    filteredFeedback.map((item) => (
      <TableRow
        key={item.id}
        className="feedback-row border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
        onClick={() => router.push(`/admin/feedback/${item.id}`)} // <-- Navigate to details page
      >
        {/* Feedback Name - clickable */}
        <TableCell className="font-medium text-blue-400 hover:underline">
          {item.name}
        </TableCell>

        <TableCell className="text-gray-400">{item.email}</TableCell>

        <TableCell>
          <Badge
            variant="secondary"
            className={`${
              item.type === "Bug Report"
                ? "bg-red-500/20 text-red-400"
                : item.type === "Feature Request"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {item.type}
          </Badge>
        </TableCell>

        <TableCell className="max-w-xs truncate text-gray-400">
          {item.message}
        </TableCell>

        <TableCell>
          <Badge
            variant="secondary"
            className={`${
              item.status === "Open"
                ? "bg-blue-500/20 text-blue-400"
                : item.status === "In Progress"
                ? "bg-yellow-500/20 text-yellow-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {item.status}
          </Badge>
        </TableCell>

        <TableCell className="text-gray-400">{item.date}</TableCell>

        {/* Actions column - stop row click propagation */}
        <TableCell
          className="text-right"
          onClick={(e) => e.stopPropagation()} // Prevent triggering row navigation when clicking menu
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-black/95 backdrop-blur-sm border-white/10"
            >
              <DropdownMenuItem
                className="hover:bg-white/5"
                onClick={() => handleStatusChange(item.id, "Open")}
              >
                Set as Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/5"
                onClick={() => handleStatusChange(item.id, "In Progress")}
              >
                Set as In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/5"
                onClick={() => handleStatusChange(item.id, "Resolved")}
              >
                Set as Resolved
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-white/5 text-red-400"
                onClick={() => handleDeleteFeedback(item.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 text-gray-400">
        No feedback found matching your criteria.
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
