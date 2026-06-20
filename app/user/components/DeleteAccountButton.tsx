"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase/client";

export function DeleteAccountButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      // Delete interviews
      const interviewsRef = collection(db, "users", userId, "interviews");
      const interviewDocs = await getDocs(interviewsRef);
      await Promise.all(interviewDocs.docs.map((d) => deleteDoc(d.ref)));

      // Delete user doc
      await deleteDoc(doc(db, "users", userId));

      // Delete Firebase Auth user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
      }

      await Promise.all([
        signOut(auth),
        fetch("/api/auth/sign-out", { method: "POST" })
      ]);
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert(
        "Failed to delete account. You might need to re-authenticate (sign out and in) before deleting."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDeleteAccount}
      disabled={isLoading}
      className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-all font-bold text-xs shadow-lg hover:shadow-rose-600/20 active:scale-95 cursor-pointer disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {isLoading ? "Deleting..." : "Delete Account"}
    </button>
  );
}
