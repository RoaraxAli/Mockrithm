"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/app/user/components/Sidebar"
import { Menu } from "lucide-react"

import { UpgradeBanner } from "@/app/user/components/UpgradeBanner"

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-transparent relative overflow-hidden">
      {/* Desktop Sidebar (visible only on md and larger screens) */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Drawer Overlay, visible only on mobile when opened) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar Drawer Container */}
          <div className="relative flex flex-col h-full w-64 bg-zinc-950/95 border-r border-white/5 shadow-2xl animate-slideRight">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <UpgradeBanner />
        {/* Mobile Header Top Navigation */}
        <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-white/5 bg-zinc-950/60 backdrop-blur-md z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-[12px] font-black tracking-wider text-white">MOCKRITHM</span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto bg-transparent">
          <div className="p-4 sm:p-8 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
