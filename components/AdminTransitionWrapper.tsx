"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

export function AdminTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".page-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
    return () => {
      tl.kill();
    };
  }, [pathname]);

  return <>{children}</>;
}
