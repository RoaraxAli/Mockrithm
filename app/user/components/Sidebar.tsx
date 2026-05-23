"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { auth } from "@/firebase/client"
import { signOut } from "firebase/auth"
import { 
  LayoutDashboard, PlayCircle, FileText, MessageSquare, User, Sparkles, 
  Home, LogOut 
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "Take Interview", href: "/user/take-interview", icon: PlayCircle },
  { name: "Resume Builder", href: "/user/resume", icon: Sparkles },
  { name: "Your Interviews", href: "/user/interviews", icon: FileText },
  { name: "Feedback", href: "/user/feedback", icon: MessageSquare },
  { name: "Profile", href: "/user/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/sign-in")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-zinc-950/40 backdrop-blur-2xl">
      {/* Brand Logo Header */}
      <div className="flex h-20 items-center px-6 border-b border-white/5 bg-white/[0.01]">
        <Link
          href="/"
          className="group flex items-center space-x-3 transition-all duration-300 hover:scale-102"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500 rounded-lg blur opacity-15 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-white/5 p-1.5 rounded-lg border border-white/10 group-hover:border-violet-500/30 transition-colors duration-300">
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
            <span className="text-[8px] font-bold tracking-widest text-violet-400 group-hover:text-violet-300 transition-colors duration-300 uppercase">
              Face the Machine
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 border",
                isActive
                  ? "bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border-violet-500/20 text-white shadow-[0_0_15px_rgba(124,58,237,0.05)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border-transparent"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-4.5 w-4.5 flex-shrink-0 transition-colors duration-300",
                  isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300",
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
          className="group flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 border border-transparent"
        >
          <Home className="mr-3 h-4.5 w-4.5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          Return to Home
        </Link>

        <button
          onClick={handleLogout}
          className="group flex w-full items-center px-3.5 py-2.5 text-sm font-semibold rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 border border-transparent cursor-pointer"
        >
          <LogOut className="mr-3 h-4.5 w-4.5 text-gray-500 group-hover:text-rose-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  )
}