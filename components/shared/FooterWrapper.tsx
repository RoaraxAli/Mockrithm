"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Footer from "./Footer";

const FooterWrapper = () => {
  const pathname = usePathname();
  const [isSubdomain, setIsSubdomain] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.startsWith("docs.") || hostname.startsWith("resume.") || hostname.startsWith("games.") || hostname.startsWith("blog.")) {
        setIsSubdomain(true);
      }
    }
  }, []);

  if (isSubdomain) return null;
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
    "/maintenance",
    "/payment",
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
