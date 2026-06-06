"use client";

import { useState } from "react";
import type { User } from "@/app/user/types";
import { ProfileForm } from "@/app/user/components/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, Mail, ExternalLink } from "lucide-react";
import { DeleteAccountButton } from "@/app/user/components/DeleteAccountButton";

interface ProfileClientViewProps {
  initialUserData: User;
}

export function ProfileClientView({ initialUserData }: ProfileClientViewProps) {
  const [userData, setUserData] = useState<User>(initialUserData);

  const handleUserUpdate = (updatedUser: User) => {
    setUserData(updatedUser);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Profile Settings</h1>
          <p className="text-sm text-gray-400 font-medium">Manage and configure your personal account details.</p>
        </div>
        <ProfileForm user={userData} onUpdate={handleUserUpdate} />
      </div>

      <Card className="max-w-2xl glass-card rounded-md border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500 opacity-20" />
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-200 flex items-center">
            <UserIcon className="mr-2.5 h-5 w-5 text-cyan-400" />
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
          <DeleteAccountButton userId={userData.id} />
        </div>
      </div>
    </div>
  );
}
