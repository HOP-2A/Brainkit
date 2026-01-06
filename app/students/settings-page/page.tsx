"use client";
import { useState } from "react";
import SideBar from "../_components/StudentSideBar";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/providers/useAuth";
export default function SettingsPage() {
  const [active, setActive] = useState("Profile");

  const { user: clerkUser } = useUser();

  const clerkId = clerkUser?.id;

  const user = useAuth(clerkId ?? "");

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <SideBar />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-gray-900">Settings</h1>
          <div className="mt-4 h-0.5 bg-gray-300 rounded -mx-8" />

          <div className="flex mt-8">
            <div className="flex w-full flex-col gap-5">
              <div
                className={`h-[180px] rounded-lg p-4 border-2
              ${active === "Profile" ? "border-[#0BC2CF]" : "border-gray-300"}`}
              >
                <div className="text-3xl font-bold">
                  Profile : <span>{user.user?.name}</span>
                </div>
                <div className="font-semibold mt-2">
                  Username: <span>{user.user?.name}</span>
                </div>
                <div className="font-semibold mt-2">
                  Email: <span>{user.user?.email}</span>
                </div>
                <div className="font-semibold mt-2">
                  Dashboard Layout: Student
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
