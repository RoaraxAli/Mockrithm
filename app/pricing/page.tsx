"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import PostLoginPricing from "@/app/user/pricing/PostLoginPricing";

export default function PricingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/#pricing");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  if (user) {
    return (
      <div className="w-full flex flex-col font-mona-sans relative z-10 min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
        <Navbar 
          userId={user.id} 
          userName={user.fullName || user.firstName || "User"} 
        />
        <PostLoginPricing />
      </div>
    );
  }

  return null;
}
