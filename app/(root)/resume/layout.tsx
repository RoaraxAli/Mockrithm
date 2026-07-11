"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ResumeSidebar } from "@/components/resume/ResumeSidebar";
import { Menu } from "lucide-react";

export default function ResumeSubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen bg-[#030712]" />;
  }

  // Determine if we should show the custom sidebar
  // (Only if signed in, and not on the guest landing hub or dynamic landing topic pages)
  const isLanding = pathname === "/resume" || pathname === "/resume/" || pathname.split("/").length <= 3;
  const isDashboardOrTool = pathname.includes("/dashboard") || pathname.includes("/templates") || pathname.includes("/ats-checker") || pathname.includes("/upload") || pathname.includes("/workspace") || pathname.includes("/analysis");
  const showSidebar = isSignedIn && isDashboardOrTool;

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-[#030712] text-white relative overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <ResumeSidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex flex-col h-full w-64 bg-[#030712] border-r border-white/5 shadow-2xl">
            <ResumeSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-white/5 bg-[#030712]/60 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-[12px] font-black tracking-wider text-white">MOCKRITHM RESUME</span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-transparent">
          <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
