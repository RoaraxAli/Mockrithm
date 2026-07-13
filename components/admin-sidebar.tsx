"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useClerk, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  ListChecks,
  ClipboardList,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Globe,
  User,
  BookOpen,
  Key,
  Shield,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock Firebase functions for demo
const mockAuth: { currentUser: null | { uid: string } } = {
  currentUser: { uid: "demo-uid" },
};
const mockGetDoc = async () => ({
  exists: () => true,
  data: () => ({
    name: "Admin",
    profileImage: "public/admin.png",
    maintenance: false,
  }),
});
const mockUpdateDoc = async () => {};

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Interviews", href: "/admin/interviews", icon: ListChecks }, // single link
  {
    name: "Interview Feedback",
    href: "/admin/interviewfeedback",
    icon: ClipboardList,
  },
  { name: "Feedback", href: "/admin/feedback", icon: MessageSquare },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "API Telemetry", href: "/admin/keys", icon: Key },
  { name: "Audit Logs", href: "/admin/audit", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const [adminName, setAdminName] = useState("");
  const [adminImage, setAdminImage] = useState("");
  const [maintenance, setMaintenance] = useState(false);
  const [loadingMaintenance, setLoadingMaintenance] = useState(true);
  const [adminSectionOpen, setAdminSectionOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".sidebar-item",
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );

    const fetchAdminData = async () => {
      const user = mockAuth.currentUser;
      if (!user) return;

      try {
        const snap = await mockGetDoc();
        if (snap.exists()) {
          const data = snap.data();
          setAdminName(data?.name || "Admin");
          setAdminImage(data?.profileImage || "");
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchAdminData();

    const fetchMaintenanceStatus = async () => {
      try {
        const snap = await mockGetDoc();
        if (snap.exists()) setMaintenance(snap.data()?.maintenance || false);
      } catch (err) {
        console.error("Failed to fetch maintenance status:", err);
      } finally {
        setLoadingMaintenance(false);
      }
    };

    fetchMaintenanceStatus();
  }, []);

  const toggleMaintenance = async () => {
    try {
      setLoadingMaintenance(true);
      await mockUpdateDoc();
      setMaintenance(!maintenance);
    } catch (err) {
      console.error("Failed to toggle maintenance:", err);
    } finally {
      setLoadingMaintenance(false);
    }
  };


const handleLogout = async () => {
  try {
    await Promise.all([
      signOut(),
      fetch("/api/auth/sign-out", { method: "POST" })
    ]);
    router.push("/sign-in");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  const SidebarContent = () => (
    <Card
      className={cn(
        "h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 rounded-none shadow-none transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <CardContent className="flex flex-col h-full p-0">
        <div className="flex h-16 items-center px-4 border-b border-zinc-200 dark:border-white/5">
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full rounded-md border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900/30 px-3 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  M
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-none">Mockrithm</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 leading-none">Production</span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            </div>
          )}
          {isCollapsed && (
            <div className="mx-auto h-8 w-8 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              M
            </div>
          )}
        </div>

        <div className="flex justify-end p-2 pb-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-400 hover:bg-zinc-900 h-6 w-6"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "sidebar-item flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer group",
                      isActive
                        ? "bg-accent-alpha-custom text-accent-custom border-l-2 border-accent-custom pl-[10px]"
                        : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
                      isCollapsed && "justify-center border-l-0 pl-3"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          !isCollapsed && "mr-3",
                          isActive ? "text-accent-custom" : "text-zinc-500 group-hover:text-zinc-300"
                        )}
                      />
                    )}
                    {!isCollapsed && item.name}
                  </Link>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="border-t border-zinc-200 dark:border-white/5 p-4">
          <div
            className={cn(
              "sidebar-item flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900",
              adminSectionOpen
                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
              isCollapsed && "justify-center"
            )}
            onClick={() =>
              !isCollapsed && setAdminSectionOpen(!adminSectionOpen)
            }
            title={isCollapsed ? adminName || "Admin" : undefined}
          >
            <div
              className={cn(
                "flex items-center space-x-3",
                isCollapsed && "space-x-0 justify-center"
              )}
            >
              <UserButton />
              {!isCollapsed && (
                <span className="truncate text-zinc-800 dark:text-zinc-200 font-medium">{adminName || "Admin"}</span>
              )}
            </div>
          </div>

          {adminSectionOpen && !isCollapsed && (
            <div className="mt-2 space-y-1 ml-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                onClick={() => router.push("/")}
              >
                <Globe className="mr-2 h-4 w-4" />
                Visit Website
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                onClick={toggleMaintenance}
                disabled={loadingMaintenance}
              >
                {loadingMaintenance ? (
                  <span className="text-gray-400">Loading...</span>
                ) : maintenance ? (
                  <span className="text-red-400 font-medium">
                    Disable Maintenance
                  </span>
                ) : (
                  <span className="text-green-400 font-medium">
                    Enable Maintenance
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
          isCollapsed ? "lg:w-16" : "lg:w-64"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-zinc-950/50 backdrop-blur-sm border border-white/5"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-zinc-950 border-white/5">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
