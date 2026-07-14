"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { 
  LayoutDashboard, Sparkles, FileText, Upload, Globe, LogOut, X
} from "lucide-react";

interface ResumeSidebarProps {
  onClose?: () => void;
}

export function ResumeSidebar({ onClose }: ResumeSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  // Helper to determine active state on the subdomain
  const isActive = (path: string) => {
    const normalized = pathname.replace("/resume", "");
    return normalized === path || (path === "/dashboard" && normalized === "/dashboard/");
  };

  const navItems = [
    { name: "Resume Builder", href: "/dashboard", icon: LayoutDashboard },
    { name: "Templates", href: "/templates", icon: Sparkles },
    { name: "ATS & Tailor", href: "/upload", icon: Upload },
  ];

  const handleLogout = async () => {
    try {
      document.cookie = "bypass_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      await signOut();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-[#030712] font-sans relative overflow-hidden shrink-0">
      
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-xl md:text-2xl tracking-tight text-white select-none cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Mockrithm<sup className="text-[9px] align-super text-white/50">®</sup>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
            Resume
          </span>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 border relative overflow-hidden",
                active
                  ? "bg-white/5 border-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white border-transparent"
              )}
            >
              {active && (
                <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-white rounded-r-md" />
              )}
              <item.icon
                className={cn(
                  "mr-3 h-4.5 w-4.5 flex-shrink-0 transition-colors duration-300",
                  active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 bg-white/[0.005] flex flex-col gap-2">
        <Link
          href="https://mockrithm.me"
          className="group flex items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-300 border border-transparent"
        >
          <Globe className="mr-3 h-4.5 w-4.5 text-zinc-500 group-hover:text-zinc-300" />
          Apex Portal
        </Link>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl text-zinc-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 border border-transparent cursor-pointer text-left"
        >
          <LogOut className="mr-3 h-4.5 w-4.5 text-zinc-500 group-hover:text-rose-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
