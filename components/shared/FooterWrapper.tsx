"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();
  const [isDocsSubdomain, setIsDocsSubdomain] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.startsWith("docs.")) {
        setIsDocsSubdomain(true);
      }
    }
  }, []);

  if (isDocsSubdomain) return null;
  if (!pathname) return null;

  // Hide on auth, admin, and active interview pages
  const hideOnPaths = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/verify-code",
    "/blogs",
    "/blog",
  ];
  
  if (hideOnPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }
  
  if (pathname.startsWith("/interview") || pathname.startsWith("/admin") || pathname.startsWith("/onboarding") || pathname.startsWith("/documentation") || pathname.startsWith("/resume") || pathname.startsWith("/user/resume") || pathname.startsWith("/user/dashboard/resume/workspace")) {
    return null;
  }

  return <Footer isSignedIn={!!isSignedIn} />;
};

export default FooterWrapper;
