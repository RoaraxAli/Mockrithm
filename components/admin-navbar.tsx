"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Users, ClipboardList, BookOpen, Key, Shield, MessageSquare, LayoutDashboard } from "lucide-react";

export function AdminNavbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Blur whatever background element currently has focus
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch admin name from Firestore
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const setupListener = async () => {
        try {
          const { getUserProfile } = await import("@/lib/actions/auth.action");
          const result = await getUserProfile(user.id);
          if (result && result.success) {
            setAdminName(result.name || "Admin");
          } else {
            setAdminName(user.fullName || user.firstName || "Admin");
          }
        } catch (error) {
          console.error("Failed to fetch admin name:", error);
          setAdminName(user.fullName || user.firstName || "Admin");
        }
      };
      setupListener();
    }
  }, [isLoaded, isSignedIn, user]);

  // GSAP animation
  useEffect(() => {
    gsap.fromTo(
      ".navbar-item",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await clerkSignOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Search Input Triggering Command Palette */}
        <div className="navbar-item flex items-center space-x-4 lg:ml-0 ml-12">
          <button
            onClick={() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              setOpen(true);
            }}
            className="flex items-center justify-between w-64 bg-zinc-900/50 border border-white/5 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer hover:border-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-zinc-500" />
              <span>Search...</span>
            </div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-zinc-950 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Command Palette Dialog */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." autoFocus />
          <CommandList className="bg-zinc-950 border border-white/5">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => { router.push("/admin"); setOpen(false); }}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/users"); setOpen(false); }}>
                <Users className="mr-2 h-4 w-4" />
                <span>Users</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/interviewfeedback"); setOpen(false); }}>
                <ClipboardList className="mr-2 h-4 w-4" />
                <span>Interview Feedback</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/feedback"); setOpen(false); }}>
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Feedback</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/blogs"); setOpen(false); }}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Blogs</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/keys"); setOpen(false); }}>
                <Key className="mr-2 h-4 w-4" />
                <span>API Telemetry</span>
              </CommandItem>
              <CommandItem onSelect={() => { router.push("/admin/audit"); setOpen(false); }}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Audit Logs</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>

        {/* Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Theme Switcher Segmented Control */}
          {mounted ? (
            <div className="flex items-center gap-0.5 bg-zinc-900/50 border border-white/5 p-0.5 rounded-md">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md hover:bg-zinc-800 transition-all duration-200 cursor-pointer ${
                  theme === "light" ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="Light Mode"
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md hover:bg-zinc-800 transition-all duration-200 cursor-pointer ${
                  theme === "dark" ? "bg-zinc-950 text-white shadow-sm border border-white/5" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="Dark Mode"
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md hover:bg-zinc-800 transition-all duration-200 cursor-pointer ${
                  theme === "system" ? "bg-zinc-950 text-white shadow-sm border border-white/5" : "text-zinc-500 hover:text-zinc-300"
                }`}
                title="System Preference"
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-8 w-24 bg-zinc-900/50 rounded-md animate-pulse border border-white/5" />
          )}

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="navbar-item relative bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-md cursor-pointer"
          >
            <Bell className="h-4 w-4 text-zinc-400 hover:text-zinc-200" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500" />
          </Button>

          <div
            className="cursor-pointer px-4 py-2 rounded-md border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 transition duration-200 text-zinc-200 font-medium text-sm text-center select-none flex items-center justify-center"
            onClick={() => console.log("Clicked")}
          >
            {adminName || "Admin"}
          </div>
        </div>
      </div>
    </header>
  );
}
