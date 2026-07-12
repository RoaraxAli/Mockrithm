"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function AdminNavbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const [adminName, setAdminName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
        {/* Search */}
        <div className="navbar-item flex items-center space-x-4 lg:ml-0 ml-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-64 bg-zinc-900/50 border-white/5 pl-10 focus:border-white/20 text-zinc-200 placeholder:text-zinc-500 rounded-md"
            />
          </div>
        </div>

        {/* Icons & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="navbar-item relative bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 rounded-md"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
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
