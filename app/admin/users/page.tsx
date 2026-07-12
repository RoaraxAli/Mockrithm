"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { Search, Trash2, MoreHorizontal, UserPlus, Pencil, Shield, ChevronLeft, ChevronRight } from "lucide-react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PAGE_SIZE = 20;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchPage = useCallback(async (cursorId?: string) => {
    setLoading(true);
    try {
      const { getAdminUsersPaginated } = await import("@/lib/actions/admin.action");
      const res = await getAdminUsersPaginated(PAGE_SIZE, cursorId);
      if (res.success && res.data) {
        const fetchedUsers = res.data.map((user: any) => ({
          ...user,
          createdAt: user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : "—",
        }));
        setUsers(fetchedUsers);
        setHasMore(res.hasMore ?? false);

        // Store the next cursor for forward pagination
        if (res.nextCursorId) {
          setCursorHistory((prev) => {
            const next = [...prev];
            if (next.length <= currentPage + 1) {
              next.push(res.nextCursorId as string);
            } else {
              next[currentPage + 1] = res.nextCursorId as string;
            }
            return next;
          });
        }
      } else {
        console.error("Failed to fetch users:", res.error);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPage(cursorHistory[currentPage]);
  }, [currentPage]);

  useEffect(() => {
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

    gsap.fromTo(
      ".users-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".users-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const { deleteAdminUser } = await import("@/lib/actions/admin.action");
      const res = await deleteAdminUser(userId);
      if (res.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully.");
      } else {
        toast.error(res.error || "Failed to delete user.");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete user.");
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { updateUserRole } = await import("@/lib/actions/admin.action");
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        toast.success(`Role updated to ${newRole}`);
      } else {
        toast.error(res.error || "Failed to update role.");
      }
    } catch (err) {
      console.error("Failed to update role:", err);
      toast.error("Failed to update role.");
    }
  };

  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-400 mt-2">Manage your application users</p>
        </div>
        <Button
          className="bg-white text-black hover:bg-gray-200 cursor-pointer"
          onClick={() => router.push("/admin/users/new")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <Card className="users-card bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 focus:border-white/20"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/10">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-black/95 backdrop-blur-sm border-white/10">
                <SelectItem value="all">Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
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
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Created At</TableHead>
                  <TableHead className="text-gray-300 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="table-row border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          user.role.toLowerCase() === "admin"
                            ? "bg-red-500/20 text-red-400"
                            : user.role.toLowerCase() === "moderator"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-black/95 backdrop-blur-sm border-white/10"
                        >
                          <DropdownMenuItem
                            className="hover:bg-white/5"
                            onClick={() =>
                              router.push(`/admin/users/${user.id}/edit`)
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="hover:bg-white/5">
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-black/95 backdrop-blur-sm border-white/10">
                              {["User", "Admin", "Moderator"].map((role) => (
                                <DropdownMenuItem
                                  key={role}
                                  className={`hover:bg-white/5 ${user.role === role ? "text-white font-bold" : "text-gray-400"}`}
                                  onClick={() => handleRoleChange(user.id, role)}
                                  disabled={user.role === role}
                                >
                                  {role} {user.role === role && "✓"}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem
                            className="hover:bg-white/5 text-red-400"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No users found matching your criteria.
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4">
            <p className="text-xs text-gray-400">
              Page {currentPage + 1} · Showing {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                disabled={!hasMore}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
