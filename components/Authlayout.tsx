"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
  const hideNavbar =
    (pathname.startsWith("/interview/") && pathname !== "/interview") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/admin") ||
    [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/verify-code",
      "/reset-password",
    ].includes(pathname);

  const shouldShowNavbar = !hideNavbar;

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
            setUserTier(result.tier as any);
            
            // Check if user has been prompted in the current session
            const sessionPrompt = sessionStorage.getItem(`plan_prompt_completed_${user.id}`);
            const isPaymentPage = 
              pathname.startsWith("/payment/success") || 
              pathname.startsWith("/payment/cancel") || 
              pathname.startsWith("/api/payment");

            if (sessionPrompt !== "true" && !isPaymentPage) {
              setShowPrompt(true);
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
            sessionStorage.setItem(`plan_prompt_completed_${userId}`, "true");
            setShowPrompt(false);
          }}
        />
      )}
    </>
  );
}
