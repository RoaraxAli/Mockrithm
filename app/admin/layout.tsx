"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.push("/sign-in");
      return;
    }

    const checkAdmin = async () => {
      try {
        const { getUserProfile } = await import("@/lib/actions/auth.action");
        const result = await getUserProfile(user.id);
        if (result && result.success && result.role.toLowerCase() === "admin") {
          setLoading(false);
        } else {
          console.warn("User is not an Admin. Redirecting to home.", user.primaryEmailAddress?.emailAddress);
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to verify admin status:", error);
        router.push("/");
      }
    };

    checkAdmin();
  }, [isLoaded, isSignedIn, user, router]);

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
