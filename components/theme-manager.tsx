"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ThemeManager() {
  const pathname = usePathname();

  useEffect(() => {
    const isDocs = pathname?.startsWith("/documentation");
    if (!isDocs) {
      // Ensure all main platform pages are strictly dark
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.colorScheme = "dark";
    }
  }, [pathname]);

  return null;
}
