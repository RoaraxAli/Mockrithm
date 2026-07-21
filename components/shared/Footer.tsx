import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Terminal, Cloud, Shield } from "lucide-react"

interface FooterProps {
  className?: string
  isSignedIn?: boolean
}

const Footer: React.FC<FooterProps> = ({ className = "", isSignedIn = false }) => {
  return (
    <footer className={`w-full bg-transparent text-white px-4 pb-8 pt-4 z-30 relative font-mona-sans ${className}`}>
      <div className="max-w-7xl mx-auto border border-white/10 bg-zinc-950/40 rounded-2xl p-8 sm:p-10 relative overflow-hidden backdrop-blur-md">
        
        {/* Ambient top glowing line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Main Grid structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <Image
                src="/logo.svg"
                alt="Mockrithm Logo"
                width={22}
                height={22}
                className="w-5.5 h-5.5 brightness-0 invert opacity-80 shrink-0"
              />
              <span className="text-[14px] font-black tracking-wider text-white uppercase">
                Mockrithm
              </span>
            </Link>

            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
                The future of career intelligence.
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold mt-1">
                <span>System Status:</span>
                <span className="text-white bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide uppercase">
                  Operational
                </span>
              </div>
            </div>

            <span className="text-[10px] text-zinc-600 font-bold tracking-widest mt-auto">
              V2.4.0
            </span>
          </div>

          {!isSignedIn ? (
            <>
              {/* Pre-login Column 2: Platform */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Platform
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Home
                  </Link>
                  <Link href="/about" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    About Us
                  </Link>
                  <Link href="/contact" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Contact & Support
                  </Link>
                  <Link href="https://blog.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Blogs
                  </Link>
                </div>
              </div>

              {/* Pre-login Column 3: Product */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Product
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="https://resume.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Resume Builder
                  </Link>
                  <Link href="https://resume.mockrithm.me/upload" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Resume Analyzer
                  </Link>
                  <Link href="https://games.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Coding Games
                  </Link>
                  <Link href="https://docs.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Documentation
                  </Link>
                </div>
              </div>

              {/* Pre-login Column 4: Legal */}
              <div className="flex flex-col gap-3 md:col-span-2 lg:col-span-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Legal
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Link href="/privacy-policy" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link href="/refund-policy" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Refund Policy
                  </Link>
                  <Link href="/ownership-statement" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Ownership Statement
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Post-login Column 2: Platform */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Platform
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Home
                  </Link>
                  <Link href="/about" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    About Us
                  </Link>
                  <Link href="/contact" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Contact & Support
                  </Link>
                  <Link href="https://blog.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Blogs
                  </Link>
                </div>
              </div>

              {/* Post-login Column 3: Features */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Features
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/user/take-interview" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Mock Interviews
                  </Link>
                  <Link href="https://resume.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Resume Builder
                  </Link>
                  <Link href="https://resume.mockrithm.me/upload" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Resume Analyzer
                  </Link>
                  <Link href="https://games.mockrithm.me" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Coding Games
                  </Link>
                </div>
              </div>

              {/* Post-login Column 5: Legal */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/5 pb-1">
                  Legal
                </h4>
                <div className="flex flex-col gap-2">
                  <Link href="/privacy-policy" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link href="/refund-policy" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Refund Policy
                  </Link>
                  <Link href="/ownership-statement" className="text-[10.5px] text-zinc-400 hover:text-white font-medium transition-colors">
                    Ownership Statement
                  </Link>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 mt-6">
          <p className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
            © 2026 Mockrithm Inc. Built for the ambitious.
          </p>

          <div className="flex items-center gap-4 text-zinc-400">
            <Terminal className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Cloud className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
            <Shield className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer