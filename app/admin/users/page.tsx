"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Trash2,
  MoreHorizontal,
  UserPlus,
  Pencil,
  Shield,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Plus
} from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const PAGE_SIZE = 15;

export default function UsersPage() {
  const router = useRouter();
  
  // Filtering & Data states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([undefined]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
        toast.error(res.error || "Failed to fetch users.");
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
  }, [loading, currentPage]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      const { deleteAdminUser } = await import("@/lib/actions/admin.action");
      const res = await deleteAdminUser(userId);
      if (res.success) {
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedIds(prev => prev.filter(id => id !== userId));
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

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;
    try {
      const { deleteAdminUser } = await import("@/lib/actions/admin.action");
      await Promise.all(selectedIds.map(id => deleteAdminUser(id)));
      setUsers(prev => prev.filter(u => !selectedIds.includes(u.id)));
      setSelectedIds([]);
      toast.success("Users deleted successfully.");
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete users.");
    }
  };

  const handleBulkRoleChange = async (newRole: string) => {
    try {
      const { updateUserRole } = await import("@/lib/actions/admin.action");
      await Promise.all(selectedIds.map(id => updateUserRole(id, newRole)));
      setUsers(prev => prev.map(u => selectedIds.includes(u.id) ? { ...u, role: newRole } : u));
      setSelectedIds([]);
      toast.success(`Roles updated to ${newRole}`);
    } catch (error) {
      console.error("Bulk role update failed:", error);
      toast.error("Failed to update roles.");
    }
  };

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        user.role.toLowerCase() === roleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentIds = filteredUsers.map(u => u.id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    } else {
      const currentIds = filteredUsers.map(u => u.id);
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(item => selectedIds.includes(item.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100 font-sans">Users Management</h1>
          <p className="text-zinc-400 mt-1 text-sm">View, update roles, and manage users in the system.</p>
        </div>
        <Button
          onClick={() => router.push("/admin/users/new")}
          className="bg-indigo-600 text-white hover:bg-indigo-700 font-medium px-4 py-2 rounded-md border-none flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Bulk Action Context Banner */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-zinc-900 border border-indigo-500/20 px-4 py-3 rounded-lg shadow-lg">
          <span className="text-sm font-medium text-zinc-200">
            {selectedIds.length} user{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkRoleChange("Admin")}
              className="text-zinc-300 hover:text-white border-white/5 bg-zinc-950"
            >
              Make Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkRoleChange("User")}
              className="text-zinc-300 hover:text-white border-white/5 bg-zinc-950"
            >
              Make User
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

      {/* Main Card */}
      <Card className="bg-zinc-950 border border-white/5 shadow-none overflow-hidden animate-fade-rise">
        <CardHeader className="border-b border-white/5 space-y-4">
          <CardTitle className="text-base font-semibold text-zinc-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-zinc-500" />
            Users list
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-zinc-900/30 border-white/5 text-zinc-100 placeholder:text-zinc-500 focus:border-white/20 rounded-md"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-zinc-900/30 border-white/5 text-zinc-200">
                <SelectValue placeholder="Roles" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/5 text-zinc-200">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
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
                  <TableHead className="text-zinc-400 font-medium">Role</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Status</TableHead>
                  <TableHead className="text-zinc-400 font-medium">Created At</TableHead>
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
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 bg-zinc-900" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-zinc-900" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-8 w-12 ml-auto bg-zinc-900" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                      <TableRow
                        key={user.id}
                        className={`table-row border-b border-white/5 hover:bg-zinc-900/30 transition-colors ${
                          isSelected ? "bg-indigo-500/5 hover:bg-indigo-500/10" : ""
                        }`}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIds(prev => [...prev, user.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                            className="border-white/20 data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-zinc-100 flex items-center gap-2">
                          <span className="truncate">{user.name}</span>
                          {user.tier === "Pro" ? (
                            <Badge className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/30 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm flex-shrink-0">
                              PRO
                            </Badge>
                          ) : user.tier === "Premium" ? (
                            <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm flex-shrink-0">
                              PREMIUM
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-zinc-900/50 text-zinc-400 border-zinc-800 text-[10px] px-1.5 py-0 flex-shrink-0">
                              FREE
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-zinc-400">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize border ${
                              user.role.toLowerCase() === "admin"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/10 shadow-none"
                                : user.role.toLowerCase() === "moderator"
                                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/10 shadow-none"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700 shadow-none"
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {user.status === "Active" ? (
                              <>
                                <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-400 text-xs font-semibold">Active</span>
                              </>
                            ) : (
                              <>
                                <UserX className="h-3.5 w-3.5 text-zinc-500" />
                                <span className="text-zinc-500 text-xs font-semibold">Inactive</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-400 text-xs">{user.createdAt}</TableCell>
                        <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
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
                            <DropdownMenuContent
                              align="end"
                              className="bg-zinc-950 border border-white/5 text-zinc-200"
                            >
                              <DropdownMenuItem
                                className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer"
                                onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer">
                                  <Shield className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="bg-zinc-950 border border-white/5 text-zinc-200">
                                  {["User", "Admin", "Moderator"].map((role) => (
                                    <DropdownMenuItem
                                      key={role}
                                      className={`hover:bg-zinc-900 focus:bg-zinc-900 cursor-pointer ${user.role === role ? "text-indigo-400 font-bold" : "text-zinc-400"}`}
                                      onClick={() => handleRoleChange(user.id, role)}
                                      disabled={user.role === role}
                                    >
                                      {role} {user.role === role && "✓"}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator className="bg-white/5" />
                              <DropdownMenuItem
                                className="hover:bg-zinc-900 focus:bg-zinc-900 text-rose-400 hover:text-rose-400 cursor-pointer"
                                onClick={() => handleDeleteUser(user.id)}
                              >
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
                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500 text-sm">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-zinc-900/10">
            <p className="text-xs text-zinc-500">
              Page {currentPage + 1} · Showing {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/5 bg-zinc-950 text-zinc-400 hover:text-white"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/5 bg-zinc-950 text-zinc-400 hover:text-white"
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
