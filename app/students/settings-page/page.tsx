"use client";
import { useState } from "react";
import StudentSideBar from "../_components/StudentSideBar";

export default function SettingsPage() {
  const [active, setActive] = useState("Profile");

  return (
    <div className="min-h-screen flex bg-[#f4f6ff]">
      <StudentSideBar />

      <div className="flex-1 p-8">
        <h1 className="text-5xl font-bold text-gray-900">Settings</h1>
        <div className="mt-4 h-[2px] bg-gray-300 rounded -mx-8" />

        <div className="flex mt-8">
          <div className="flex flex-col w-[240px] gap-3">
            {["Profile", "Edit Info"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`text-left px-3 py-3 text-xl font-bold rounded-lg transition
                ${
                  active === item
                    ? "border-2 border-[#0BC2CF] bg-cyan-50 text-gray-800"
                    : "border-2 border-gray-300 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="w-[2px] bg-gray-300 mx-5 self-stretch" />

          <div className="flex w-full flex-col gap-5">
            <div
              className={`h-[180px] rounded-lg p-4 border-2
              ${active === "Profile" ? "border-[#0BC2CF]" : "border-gray-300"}`}
            >
              <div className="text-3xl font-bold">Profile</div>
              <div className="font-semibold mt-2">Username:</div>
              <div className="font-semibold mt-2">Email:</div>
              <div className="font-semibold mt-2">
                Dashboard Layout: Student
              </div>
            </div>

            <div
              className={`h-[230px] rounded-lg p-4 border-2
              ${
                active === "Edit Info" ? "border-[#0BC2CF]" : "border-gray-300"
              }`}
            >
              <div className="text-3xl font-bold">Edit Profile</div>
              <div className="flex flex-col gap-2 mt-4">
                <button className="underline text-cyan-400 text-[20px]">
                  Change Name
                </button>
                <button className="underline text-cyan-400 text-[20px]">
                  Change Email
                </button>
                <button className="underline text-cyan-400 text-[20px]">
                  Permanently Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
