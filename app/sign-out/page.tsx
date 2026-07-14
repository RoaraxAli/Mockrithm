"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    document.cookie = "bypass_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    signOut(() => router.push("/"));
  }, [signOut, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="space-y-4 flex flex-col items-center">
        <h1 className="text-xl font-mono font-bold">Signing out...</h1>
        <div className="h-1 w-48 bg-zinc-800 animate-pulse rounded-full" />
      </div>
    </div>
  );
}
