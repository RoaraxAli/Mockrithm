"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Zap, Crown, ArrowRight } from "lucide-react";
import type { User } from "../types";

export function UpgradeBanner() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      import("@/app/user/lib/firestore").then(({ getUserData }) => {
        getUserData(clerkUser.id).then((res) => {
          if (res) setCurrentUser(res as any);
        });
      });
    }
  }, [clerkLoaded, clerkUser]);

  if (!clerkLoaded || !currentUser) {
    return null;
  }

  const currentTier = currentUser.tier || "freemium";

  if (currentTier === "freemium") {
    return (
      <Link 
        href="/user/pricing" 
        className="group flex w-full items-center justify-center gap-2 bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Crown className="size-3.5 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
          Upgrade to Premium or Pro
        </span>
        <ArrowRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  if (currentTier === "premium") {
    return (
      <Link 
        href="/user/pricing" 
        className="group flex w-full items-center justify-center gap-2 bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Zap className="size-3.5 text-zinc-400 group-hover:text-yellow-400 transition-colors" />
          Upgrade to Pro
        </span>
        <ArrowRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  }

  // currentTier === "pro"
  return (
    <Link 
      href="/user/pricing" 
      className="group flex w-full items-center justify-center gap-2 bg-zinc-950 border-b border-zinc-900 px-4 py-2 text-xs font-bold text-yellow-500/80 hover:text-yellow-400 transition-colors cursor-pointer"
    >
      <span className="flex items-center gap-1.5">
        <Zap className="size-3.5" />
        You are Pro
      </span>
      <ArrowRight className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
