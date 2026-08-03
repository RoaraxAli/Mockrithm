"use client";

import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import PostLoginPricing from "./PostLoginPricing";

export default function PricingPage() {
  const { user, isLoaded } = useUser();

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar 
        userId={user?.id || ""} 
        userName={user?.fullName || user?.firstName || "User"} 
      />
      <PostLoginPricing />
    </div>
  );
}
