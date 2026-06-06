"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/firebase/client"; // your firebase client auth instance
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminNavbar } from "@/components/admin-navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const setupListener = async () => {
      unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          router.push("/sign-in");
          return;
        }

        try {
          const { getUserProfile } = await import("@/lib/actions/auth.action");
          const result = await getUserProfile(user.uid);
          if (result && result.success && result.role.toLowerCase() === "admin") {
            setLoading(false);
          } else {
            console.warn("User is not an Admin. Redirecting to home.", user.email);
            router.push("/");
          }
        } catch (error) {
          console.error("Failed to verify admin status:", error);
          router.push("/");
        }
      });
    };

    setupListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline();

      tl.fromTo(
        ".page-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );

      return () => {
        tl.kill();
      };
    }
  }, [pathname, loading]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNavbar />
        <main className="page-content px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
