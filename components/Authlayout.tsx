"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

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
      }
    }
  }, [isLoaded, isSignedIn, user, initialUserId]);

  return (
    <>
      {shouldShowNavbar && (
        <Navbar userId={userId!} userName={userName || "User"} userRole={userRole} />
      )}
      {children}
    </>
  );
}
