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

  let text = "Upgrade to Premium or Pro";
  let icon = <Crown className="size-3.5 text-yellow-400" />;
  let color = "bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-300 hover:text-white border-b border-white/10";

  if (currentTier === "premium") {
    text = "Upgrade to Pro";
    icon = <Zap className="size-3.5 text-yellow-400" />;
  } else if (currentTier === "pro") {
    text = "You are Pro";
    icon = <Zap className="size-3.5 text-yellow-400" />;
    color = "bg-gradient-to-r from-zinc-950 via-yellow-950/30 to-zinc-950 text-yellow-400/90 hover:text-yellow-300 border-b border-yellow-500/20";
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-8 bg-zinc-950">
      <Link 
        href="/user/pricing" 
        className={`group flex h-full w-full items-center justify-center gap-2 px-4 text-xs font-bold transition-all cursor-pointer ${color}`}
      >
        <span className="flex items-center gap-1.5">
          {icon}
          {text}
        </span>
        <ArrowRight className="size-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </Link>
    </div>
  );
}
