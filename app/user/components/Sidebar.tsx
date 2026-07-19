"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { 
  LayoutDashboard, PlayCircle, FileText, MessageSquare, User, Sparkles, 
  Home, LogOut, X, Mic 
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Take Interview", href: "/interview", icon: PlayCircle },
  { name: "Resume Builder", href: "/resume", icon: Sparkles },
  { name: "Your Interviews", href: "/dashboard", icon: FileText },
  { name: "Mic Check", href: "/interview", icon: Mic },
]

export function Sidebar({ 
  onClose 
}: { 
  onClose?: () => void 
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut: clerkSignOut } = useClerk()

  const handleLogout = async () => {
    try {
      document.cookie = "bypass_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      await clerkSignOut()
      window.location.href = "/sign-in"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-zinc-950/20 backdrop-blur-3xl font-mona-sans relative overflow-hidden shrink-0">
      
      {/* Brand Logo Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-white/5 bg-white/[0.005]">
        <Link
          href="/"
          className="group flex items-center space-x-3 transition-all duration-300 hover:scale-102"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-lg blur opacity-15 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/5 p-1.5 rounded-lg border border-white/10 group-hover:border-white/30 transition-colors duration-300">
              <Image
                src="/logo.svg"
                alt="Mockrithm Logo"
                width={22}
                height={22}
                className="w-5.5 h-5.5"
              />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-black tracking-wider text-white group-hover:text-gray-200 transition-colors duration-300">
              MOCKRITHM
            </span>
          </div>
        </Link>
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors focus:outline-none"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1.5 px-3 py-6 relative">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-md transition-all duration-300 border relative overflow-hidden",
                isActive
                  ? "bg-white/5 border-white/10 text-white font-black"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border-transparent"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-white rounded-r-md" />
              )}
              <item.icon
                className={cn(
                  "mr-3 h-4.5 w-4.5 flex-shrink-0 transition-colors duration-300",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions Row */}
      <div className="p-4 border-t border-white/5 bg-white/[0.005] flex flex-col gap-2">
        <Link
          href="/"
          className="group flex items-center px-3.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 border border-transparent"
        >
          <Home className="mr-3 h-4.5 w-4.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          Home Base
        </Link>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3.5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 border border-transparent cursor-pointer"
        >
          <LogOut className="mr-3 h-4.5 w-4.5 text-gray-500 group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  )
}