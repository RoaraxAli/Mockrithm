"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

import { auth, db } from "@/firebase/client";
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

// If we have an initialUserId (from server) or a userId (from client), use it.
// Even if we are guests, we might want to show the Navbar on some pages.
const shouldShowNavbar = !hideNavbar;


  useEffect(() => {
    console.log("AuthLayout mounted. Initial Props:", { initialUserId, initialUserName, initialUserRole });
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Firebase client auth detected user:", user.uid);
        setUserId(user.uid);

        if (user.uid === initialUserId && initialUserName) {
          setUserName(initialUserName);
          setUserRole(initialUserRole || "User");
          return;
        }

        try {
          const { getUserProfile } = await import("@/lib/actions/auth.action");
          const result = await getUserProfile(user.uid);

          if (result && result.success) {
            setUserName(result.name || "User");
            setUserRole(result.role || "User");
          } else {
            setUserName("User");
            setUserRole("User");
          }
        } catch (error) {
          console.error("Failed to fetch user name:", error);
          setUserName("User");
          setUserRole("User");
        }
      } else {
        console.log("Firebase client auth detected: No User");
        // Only clear if we don't have an initial server user.
        // This prevents the flickering Navbar issue on refresh.
        if (!initialUserId) {
          setUserId(null);
          setUserName("");
          setUserRole("User");
        } else {
          console.log("Retaining server-side user session:", initialUserId);
        }
      }
    });

    return () => unsubscribe();
  }, [initialUserId, initialUserName, initialUserRole]);


  return (
    <>
      {shouldShowNavbar && (
        <Navbar userId={userId!} userName={userName || "User"} userRole={userRole} />
      )}
      {children}
    </>
  );
}

