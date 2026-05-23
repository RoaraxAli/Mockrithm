"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/firebase/client"
import type { User } from "@/app/user/types"
import { getUserData } from "../lib/firestore"
import { ProfileForm } from "../components/ProfileForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfileSkeleton } from "../components/Skeletons"
import { Trash2, UserIcon, Mail, ExternalLink } from "lucide-react"
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/firebase/client"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;
      
    try {
      setLoading(true);
      // Delete interviews
      const interviewsRef = collection(db, "users", user.uid, "interviews");
      const interviewDocs = await getDocs(interviewsRef);
      await Promise.all(interviewDocs.docs.map((d) => deleteDoc(d.ref)));
      
      // Delete user doc
      await deleteDoc(doc(db, "users", user.uid));
      
      // Delete Firebase Auth user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
      }
      
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Account deletion failed:", error);
      alert("Failed to delete account. You might need to re-authenticate (sign out and in) before deleting.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      if (!user) return

      try {
        setLoading(true)
        const result = await getUserData(user.uid)
        setUserData(result)
      } catch (err) {
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-200">Manage your account information</p>
        </div>
        <ProfileSkeleton />
      </div>
    )
  }

  if (error || !userData) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-700">{error || "Profile not found"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Profile Settings</h1>
          <p className="text-sm text-gray-400 font-medium">Manage and configure your personal account details.</p>
        </div>
        <ProfileForm user={userData} onUpdate={handleUserUpdate} />
      </div>

      <Card className="max-w-2xl glass-card rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20" />
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-200 flex items-center">
            <UserIcon className="mr-2.5 h-5 w-5 text-violet-400" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm font-medium">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Full Name:</span>
            <span className="text-white font-semibold">{userData.name}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">Email Address:</span>
            <span className="text-white font-semibold flex items-center">
              <Mail className="mr-2 h-4 w-4 text-violet-400" />
              {userData.email}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-gray-400">System Role:</span>
            <span className="text-white font-semibold capitalize">{userData?.role || "User"}</span>
          </div>

          {userData.resumeLink && (
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-gray-400">Optimized Resume:</span>
              <a
                href={userData.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 flex items-center transition-colors"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Document
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-6 border-t border-white/5">
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-500 opacity-20" />
          <h3 className="text-base font-bold text-white mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-xs mb-4 font-medium leading-relaxed">
            Deleting your profile deletes all previous mock interview sessions, saved resumes, and audio analytics. This is irreversible.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-all font-bold text-xs shadow-lg hover:shadow-rose-600/20 active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
