"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PlanSelectionModal from "@/components/PlanSelectionModal";

export default function AuthLayout({ 
  children,
  initialUserId,
  initialUserName,
  initialUserRole
}: { 
  children: React.ReactNode;
  initialUserId?: string | null;
  initialUserName?: string;
  initialUserRole?: string;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userId, setUserId] = useState<string | null>(initialUserId || null);
  const [userName, setUserName] = useState<string>(initialUserName || "");
  const [userRole, setUserRole] = useState<string>(initialUserRole || "User");
  const [userTier, setUserTier] = useState<"freemium" | "premium" | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  const [isDocsSubdomain, setIsDocsSubdomain] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const hideNavbar =
    (pathname.startsWith("/interview/") && pathname !== "/interview") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/blogs") ||
    pathname.startsWith("/documentation") ||
    [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/verify-code",
      "/reset-password",
    ].includes(pathname);

  const shouldShowNavbar = !hideNavbar && !isDocsSubdomain;

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hostname.startsWith("docs.")) {
        setIsDocsSubdomain(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      setUserId(user.id);
      
      const fetchProfile = async () => {
        try {
          const { getUserProfile } = await import("@/lib/actions/auth.action");
          const result = await getUserProfile(user.id);

          if (result && result.success) {
            setUserName(result.name || user.fullName || user.firstName || "User");
            setUserRole(result.role || "User");
            const tier = result.tier;
            setUserTier(tier as any);
            
            const isPaymentPage = 
              pathname.startsWith("/payment/success") || 
              pathname.startsWith("/payment/cancel") || 
              pathname.startsWith("/api/payment");

            if (!isPaymentPage) {
              const isPremiumUser = tier === "premium" || tier === "pro";
              if (isPremiumUser) {
                // "Already Premium" modal should only appear once total
                const hasSeenPremiumModal = localStorage.getItem(`seen_premium_modal_${user.id}`) === "true";
                if (!hasSeenPremiumModal) {
                  setShowPrompt(true);
                }
              } else {
                // Choose plan prompt should appear once per month (30 days)
                const lastPromptTimeStr = localStorage.getItem(`plan_prompt_time_${user.id}`);
                if (!lastPromptTimeStr) {
                  setShowPrompt(true);
                } else {
                  const lastPromptTime = parseInt(lastPromptTimeStr, 10);
                  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                  if (Date.now() - lastPromptTime > thirtyDaysInMs) {
                    setShowPrompt(true);
                  }
                }
              }
            }
          } else {
            setUserName(user.fullName || user.firstName || "User");
            setUserRole("User");
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setUserName(user.fullName || user.firstName || "User");
          setUserRole("User");
        }
      };

      fetchProfile();
    } else {
      if (!initialUserId) {
        setUserId(null);
        setUserName("");
        setUserRole("User");
        setUserTier(null);
        setShowPrompt(false);
      }
    }
  }, [isLoaded, isSignedIn, user, initialUserId, pathname]);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar userId={userId!} userName={userName || "User"} userRole={userRole} />
      )}
      {children}
      {showPrompt && userId && (
        <PlanSelectionModal
          userId={userId}
          userTier={userTier}
          onCompleted={() => {
            localStorage.setItem(`plan_prompt_time_${userId}`, Date.now().toString());
            if (userTier === "premium" || userTier === "pro") {
              localStorage.setItem(`seen_premium_modal_${userId}`, "true");
            }
            setShowPrompt(false);
          }}
        />
      )}
    </>
  );
}
