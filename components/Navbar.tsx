"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { Show, useClerk, UserButton } from "@clerk/nextjs";
import { getAuthRedirectUrl } from "@/lib/utils/auth";
import { BillingOptions } from "@/app/user/components/BillingOptions";
import { UserResumePanel } from "@/app/user/components/UserResumePanel";
import InterviewsPage from "@/app/user/(sidebar-layout)/interviews/page";
import FeedbackPage from "@/app/user/(sidebar-layout)/feedback/page";
import MicCheckPage from "@/app/user/(sidebar-layout)/mic-check/page";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  Trash2,
  User,
  Home,
  Info,
  Mail,
  LayoutDashboard,
  PlayCircle,
  Sparkles,
  FileText,
  MessageSquare,
  CreditCard,
  Mic,
} from "lucide-react";

interface NavbarProps {
  userId: string;
  userName: string;
  userRole?: string;
}

const Navbar = ({ userId, userName, userRole }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut: clerkSignOut } = useClerk();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userRole?.toLowerCase() === "admin");

  useEffect(() => {
    setIsAdmin(userRole?.toLowerCase() === "admin");
  }, [userRole]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await clerkSignOut();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
    try {
      const interviewsRef = collection(db, "users", userId, "interviews");
      const interviewDocs = await getDocs(interviewsRef);
      await Promise.all(interviewDocs.docs.map((doc) => deleteDoc(doc.ref)));
      await deleteDoc(doc(db, "users", userId));
      await clerkSignOut();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  const navLinks = userId
    ? [
        { href: "/", label: "Home", icon: Home },
        { href: "/about", label: "About", icon: Info },
        { href: "/contact", label: "Contact", icon: Mail },
      ]
    : [
        { href: "/#intro", label: "Intro", icon: Home },
        { href: "/#features", label: "Features", icon: Info },
        { href: "/#pricing", label: "Pricing", icon: CreditCard },
        { href: "/documentation", label: "Documentation", icon: Info },
      ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`fixed z-50 transition-all duration-300 font-mona-sans ${
          isScrolled
            ? "top-4 left-[5%] right-[5%] rounded-full bg-zinc-950/85 backdrop-blur-xl shadow-2xl border border-white/10 px-4 py-0"
            : "top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-white/5 py-1"
        }`}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className={`relative flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-12" : "h-16"}`}>
            {/* Logo */}
            <Link
              href="/"
              className={`group flex items-center transition-all duration-300 hover:scale-105 ${isScrolled ? "space-x-2" : "space-x-3"}`}
              aria-label="Mockrithm Home"
            >
              <Image
                src="/logo.svg"
                alt="Mockrithm Logo"
                width={32}
                height={32}
                priority
                className={`transition-all duration-300 brightness-0 invert opacity-80 group-hover:opacity-100 ${isScrolled ? "w-7 h-7" : "w-8 h-8"}`}
              />
              <div className="flex flex-col leading-tight">
                <span className={`font-black tracking-wider text-white group-hover:text-gray-200 transition-all duration-300 ${isScrolled ? "text-[13px]" : "text-[16px]"}`}>
                  MOCKRITHM
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (pathname === "/" && link.href === "/#intro");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-white bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    } ${isScrolled ? "px-3 py-1.5" : "px-4 py-2"}`}
                  >
                    <span className={`transition-all duration-300 font-semibold tracking-wide ${isScrolled ? "text-xs" : "text-sm"}`}>{link.label}</span>
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] w-1/2 bg-white transition-transform duration-300 origin-center ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Dropdown / Login */}
            <div className="hidden md:flex items-center ml-auto">
              <Show when="signed-out">
                <div className="flex items-center space-x-2">
                  <Link
                    href={getAuthRedirectUrl("sign-in")}
                    className={`transition-all duration-300 text-zinc-300 hover:text-white font-semibold ${isScrolled ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2"}`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={getAuthRedirectUrl("sign-up")}
                    className={`bg-white text-black font-bold hover:bg-zinc-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 border border-white rounded-xl ${isScrolled ? "text-xs px-4 py-1.5" : "text-sm px-5 py-2"}`}
                  >
                    Start Prep
                  </Link>
                </div>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mr-2"
                    >
                      Admin
                    </Link>
                  )}

                  <UserButton
                    appearance={{
                      variables: {
                        colorPrimary: "#ffffff",
                        colorBackground: "#09090b", // zinc-950
                        colorText: "#ffffff",
                        colorTextSecondary: "#a1a1aa", // zinc-400
                        colorBorder: "#27272a", // zinc-800
                        colorInputBackground: "#09090b",
                        colorInputText: "#ffffff",
                        fontFamily: "var(--font-mona-sans), sans-serif",
                      } as any,
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-lg border border-white/10 hover:border-white/30 transition-colors",
                        card: "border border-white/10 shadow-2xl rounded-2xl bg-zinc-950/20 backdrop-blur-3xl",
                        navbar: "border-r border-white/5 bg-transparent",
                        navbarButton: "text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                        navbarButtonActive: "text-white bg-white/5 font-black border-l-2 border-white",
                        pageScrollable: "bg-transparent p-6 sm:p-8",
                        headerTitle: "text-xl font-black text-white",
                        headerSubtitle: "text-xs text-zinc-450",
                        profileSectionTitleText: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                        formButtonPrimary: "bg-white hover:bg-zinc-200 text-black text-xs font-bold py-2 rounded-lg transition-all border border-white cursor-pointer",
                        formButtonReset: "border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer",
                        scrollBox: "bg-transparent",
                        userBox: "bg-zinc-950 text-white",
                        userBoxTitle: "text-white font-bold",
                        userBoxSubtitle: "text-zinc-400 font-medium",
                        userBoxText: "text-white",
                        userBoxTextContainer: "text-white",
                        userBoxLabel: "text-white",
                        userButtonPopoverCard: "bg-zinc-950 border border-white/10 text-white",
                        userButtonPopoverActions: "bg-transparent",
                        userButtonPopoverActionButton: "text-zinc-200! hover:text-white! hover:bg-white/5",
                        userButtonPopoverActionButtonText: "text-zinc-200! !text-zinc-200 hover:text-white! !hover:text-white font-medium",
                        userButtonPopoverActionButtonIcon: "text-zinc-400",
                        userButtonPopoverCustomMenuItemButton: "text-zinc-200! hover:text-white! hover:bg-white/5",
                        userButtonPopoverCustomMenuItemText: "text-zinc-200! !text-zinc-200 hover:text-white! !hover:text-white font-medium",
                        userButtonPopoverFooter: "border-t border-white/5 bg-zinc-950",
                        userButtonPopoverFooterText: "text-zinc-500",
                      }
                    }}
                  >

                    <UserButton.UserProfilePage
                      label="Resume Builder"
                      url="resume"
                      labelIcon={<Sparkles className="size-4" />}
                    >
                      <UserResumePanel />
                    </UserButton.UserProfilePage>
                    <UserButton.UserProfilePage
                      label="Your Interviews"
                      url="interviews"
                      labelIcon={<FileText className="size-4" />}
                    >
                      <InterviewsPage />
                    </UserButton.UserProfilePage>
                    <UserButton.UserProfilePage
                      label="Feedback"
                      url="feedback"
                      labelIcon={<MessageSquare className="size-4" />}
                    >
                      <FeedbackPage />
                    </UserButton.UserProfilePage>
                    <UserButton.UserProfilePage
                      label="Mic Check"
                      url="mic-check"
                      labelIcon={<Mic className="size-4" />}
                    >
                      <MicCheckPage />
                    </UserButton.UserProfilePage>
                    <UserButton.UserProfilePage
                      label="Billing & Subscription"
                      url="billing"
                      labelIcon={<CreditCard className="size-4" />}
                    >
                      <BillingOptions />
                    </UserButton.UserProfilePage>
                  </UserButton>
                </div>
              </Show>
            </div>

            {/* Mobile User Button */}
            <Show when="signed-in">
              <div className="md:hidden flex items-center mr-2">
                <UserButton
                  appearance={{
                    variables: {
                      colorPrimary: "#ffffff",
                      colorBackground: "#09090b", // zinc-950
                      colorText: "#ffffff",
                      colorTextSecondary: "#a1a1aa", // zinc-400
                      colorBorder: "#27272a", // zinc-800
                      colorInputBackground: "#09090b",
                      colorInputText: "#ffffff",
                      fontFamily: "var(--font-mona-sans), sans-serif",
                    } as any,
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-lg border border-white/10",
                      card: "border border-white/10 shadow-2xl rounded-2xl bg-zinc-950/20 backdrop-blur-3xl",
                      navbar: "border-r border-white/5 bg-transparent",
                      navbarButton: "text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all",
                      navbarButtonActive: "text-white bg-white/5 font-black border-l-2 border-white",
                      pageScrollable: "bg-transparent p-6 sm:p-8",
                      headerTitle: "text-xl font-black text-white",
                      headerSubtitle: "text-xs text-zinc-450",
                      profileSectionTitleText: "text-xs font-bold text-zinc-500 uppercase tracking-wider",
                      formButtonPrimary: "bg-white hover:bg-zinc-200 text-black text-xs font-bold py-2 rounded-lg transition-all border border-white cursor-pointer",
                      formButtonReset: "border border-zinc-800 hover:bg-zinc-900 text-zinc-300 text-xs font-bold py-2 rounded-lg transition-all cursor-pointer",
                      scrollBox: "bg-transparent",
                      userBox: "bg-zinc-950 text-white",
                      userBoxTitle: "text-white font-bold",
                      userBoxSubtitle: "text-zinc-400 font-medium",
                      userBoxText: "text-white",
                      userBoxTextContainer: "text-white",
                      userBoxLabel: "text-white",
                      userButtonPopoverCard: "bg-zinc-950 border border-white/10 text-white",
                      userButtonPopoverActions: "bg-transparent",
                      userButtonPopoverActionButton: "text-zinc-200! hover:text-white! hover:bg-white/5",
                      userButtonPopoverActionButtonText: "text-zinc-200! !text-zinc-200 hover:text-white! !hover:text-white font-medium",
                      userButtonPopoverActionButtonIcon: "text-zinc-400",
                      userButtonPopoverCustomMenuItemButton: "text-zinc-200! hover:text-white! hover:bg-white/5",
                      userButtonPopoverCustomMenuItemText: "text-zinc-200! !text-zinc-200 hover:text-white! !hover:text-white font-medium",
                      userButtonPopoverFooter: "border-t border-white/5 bg-zinc-950",
                      userButtonPopoverFooterText: "text-zinc-500",
                    }
                  }}
                >

                  <UserButton.UserProfilePage
                    label="Resume Builder"
                    url="resume"
                    labelIcon={<Sparkles className="size-4" />}
                  >
                    <UserResumePanel />
                  </UserButton.UserProfilePage>
                  <UserButton.UserProfilePage
                    label="Your Interviews"
                    url="interviews"
                    labelIcon={<FileText className="size-4" />}
                  >
                    <InterviewsPage />
                  </UserButton.UserProfilePage>
                  <UserButton.UserProfilePage
                    label="Feedback"
                    url="feedback"
                    labelIcon={<MessageSquare className="size-4" />}
                  >
                    <FeedbackPage />
                  </UserButton.UserProfilePage>
                  <UserButton.UserProfilePage
                    label="Mic Check"
                    url="mic-check"
                    labelIcon={<Mic className="size-4" />}
                  >
                    <MicCheckPage />
                  </UserButton.UserProfilePage>
                  <UserButton.UserProfilePage
                    label="Billing & Subscription"
                    url="billing"
                    labelIcon={<CreditCard className="size-4" />}
                  >
                    <BillingOptions />
                  </UserButton.UserProfilePage>
                </UserButton>
              </div>
            </Show>

            {/* Mobile Actions Container */}
            <div className="flex items-center space-x-2 md:hidden">
              <Show when="signed-out">
                <Link
                  href={getAuthRedirectUrl("sign-up")}
                  className="bg-white text-black font-extrabold hover:bg-zinc-200 transition-all border border-white rounded-xl text-[9px] uppercase tracking-wider px-3.5 py-1.5"
                >
                  Start Prep
                </Link>
              </Show>


              {/* Mobile Menu Toggle */}
              <button
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/20 z-40 animate-in slide-in-from-top-2 duration-300"
            style={{
              backgroundImage: "url('/pattern.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "200px 200px",
            }}
          >
            <div className="absolute inset-0 bg-black/90" />
            <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-2 z-10">
              {/* Main nav links */}
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                <Show when="signed-out">
                  <div className="flex flex-col gap-2">
                    <Link
                      href={getAuthRedirectUrl("sign-in")}
                      className="group flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Access Portal</span>
                    </Link>
                    <Link
                      href={getAuthRedirectUrl("sign-up")}
                      className="group flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Start Prep</span>
                    </Link>
                  </div>
                </Show>
                <Show when="signed-in">
                  {isAdmin ? (
                    // Admin only → Admin Panel
                    <Link
                      href="/admin"
                      className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">Admin Panel</span>
                    </Link>
                  ) : (
                    <>
                      {/* User Panel Pages */}

                      <Link
                        href="/user/take-interview"
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <PlayCircle className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="font-medium">Take Interview</span>
                      </Link>
                      <Link
                        href="/user/resume"
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Sparkles className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="font-medium">Resume Builder</span>
                      </Link>
                      <Link
                        href="/user/interviews"
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FileText className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="font-medium">Your Interviews</span>
                      </Link>
                      <Link
                        href="/user/feedback"
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageSquare className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                        <span className="font-medium">Feedback</span>
                      </Link>


                      {/* Sign Out */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                      >
                        <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-rose-450 transition-colors" />
                        <span className="font-medium">Sign Out</span>
                      </button>

                      {/* Delete Account */}
                      <button
                        onClick={() => {
                          handleDeleteAccount();
                          setIsMobileMenuOpen(false);
                        }}
                        className="group flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 text-white group-hover:text-red-300" />
                        <span className="font-medium">Delete Account</span>
                      </button>
                    </>
                  )}
                </Show>
              </div>

            </div>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
};

export default Navbar;
